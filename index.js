const { JSDOM } = require('jsdom');

const views = {
    dashboard: (req, res, data) => {
        console.log("Dashboard!");
        const originPath = "https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.html";
        try {
            JSDOM.fromURL(originPath)
                .then(dom => {
                    var script = dom.window.document.createElement("script");
                    script.type = "module";
                    var innerHTML = `import dashboard from "https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js";
                    `;
                    innerHTML += `var dashboardState = dashboard.create(${JSON.stringify(data)}, "dashboard");
                    `;
                    innerHTML += `dashboard.show(dashboardState);
                    `;
                    script.innerHTML = innerHTML;
                    dom.window.document.body.appendChild(script);
                    res.send((dom.serialize()));
                })
                .catch(err => reject(err));
        } catch (error) {
            res.status(500).send(error);
        }
    },
    login: (req, res, data) => {
        console.log("Login!");
        const originPath = "https://ventumdashboard.s3.amazonaws.com/login/login.html";
        try {
            JSDOM.fromURL(originPath)
                .then(dom => {
                    res.send((dom.serialize()));
                })
                .catch(err => reject(err));
        } catch (error) {
            res.status(500).send(error);
        }
    },
    signup:(req, res, data) => {
        console.log("signup!");
        const originPath = "https://ventumdashboard.s3.amazonaws.com/signup/signup.html";
        try {
            JSDOM.fromURL(originPath)
                .then(dom => {
                    res.send((dom.serialize()));
                })
                .catch(err => reject(err));
        } catch (error) {
            res.status(500).send(error);
        }
    },
};

module.exports = views;
