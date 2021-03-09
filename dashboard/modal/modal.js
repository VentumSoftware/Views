import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';
import dashboard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js';
import dialogBox from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dialogBox/dialogBox.js';
import buttons from 'https://ventumdashboard.s3.amazonaws.com/dashboard/buttons/buttons.js';

const dfltState = {
    type: "modal",
    width: "auto",
    title: "NO TITLE",
    text: "",
    width: "50%",
    footerBtns: {},
    childs: {}
};

var states = [];


//Hace algo parecido a los "backslashs": hace un eval de los que esta andentro de ${}
var getStringVars = (str) => {
    console.log("getStringVars: " + str);
    var result = "";
    var re = new RegExp('(?<=\${)[^}]*', 'gm');
    //var matches = str.matchAll('/(?<=\${)[^}]*/gm');
    var matches = str.matchAll(re);
    console.log(matches);
    for (var match of matches) {
        console.log(match);
        var expression = eval(match.value[2]);
        if (typeof expression === 'object') expression = JSON.stringify(expression);
        console.log(expression);
    }
    return str;
}

let evalString = (str) => str.replace(/\${(.*?)}/g, (x,g)=> eval(g));

//-----------------------------------------------------------------------------------------------

const cmd = (state, cmds, res, pos) => {

    const fetchCmd = (state, payload, res) => {
        console.log("fetch: " + JSON.stringify(payload))
        var options = {
            method: payload.method || 'GET',
            mode: payload.mode || 'cors',
            cache: payload.cache || 'no-cache',
            credentials: payload.credentials || 'same-origin',
            headers: payload.headers || { 'Content-Type': 'application/json' },
            redirect: payload.redirect || 'follow',
            referrerPolicy: payload.referrerPolicy || 'no-referrer',
        };
        if (options.method === "POST") {
            options.body = payload.body || {};

            if (typeof options.body === 'object')
                options.body = JSON.stringify(options.body);
            
            options.body = getStringVars(options.body);
        };

        return fetch(payload.url, options);
    };

    const childCmd = (state, payload, res) => {
        try {
            var child = state.childs[payload.child];
            payload.cmds = payload.cmds || res;
            switch (child.type) {
                case "form":
                    return form.cmd(child, payload.cmds, res, 0);
                case "table":
                    return table.cmd(child, payload.cmds, res, 0);
                case "modal":
                    return modal.cmd(child, payload.cmds, res, 0);
                default:
                    return new Promise((resolve, reject) => {
                        reject("Error with type: " + key);
                    })
            }
        } catch (error) {
            console.log(error)
            reject("Child cmd failed!");
        }
    };

    const parentCmd = (state, payload, res) => {
        switch (state.parentState.type) {
            case "modal":
                payload.cmds = payload.cmds || res;
                return modal.cmd(state.parentState, payload.cmds, res, 0);
            default:
                return new Promise((resolve, reject) => {
                    reject("Error with type: " + key);
                })
        }
    };

    const ifStatement = (state, payload, res) => {

        return new Promise((resolve, reject) => {
            if (eval(payload.condition)) {
                console.log("condicion cumplida!");
            } else {
                console.log("condicion NO cumplida!");
            }
            resolve("ok");
        });
    };

    const getSubStates = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            resolve(subStates);
        });
    };

    const showSpinner = (state, payload, res) => {
        //<div class="d-flex justify-content-center"></div>

        var justifyDiv = document.createElement("div");
        justifyDiv.className = "d-flex justify-content-center";
        parent.appendChild(justifyDiv);

        var spinnerBorder = document.createElement("div");
        spinnerBorder.className = "spinner-border text-light";
        spinnerBorder.role = "status";
        justifyDiv.appendChild(spinnerBorder);

        var span = document.createElement("div");
        span.className = "sr-only";
        span.innerHTML = "Loading...";
        spinnerBorder.appendChild(span);
    };

    const hideSpinner = (state, payload, res) => {
        var justifyDiv = document.createElement("div");
        justifyDiv.className = "d-flex justify-content-center";
        parent.appendChild(justifyDiv);

        var spinnerBorder = document.createElement("div");
        spinnerBorder.className = "spinner-border text-light";
        spinnerBorder.role = "status";
        justifyDiv.appendChild(spinnerBorder);

        var span = document.createElement("div");
        span.className = "sr-only";
        span.innerHTML = "Loading...";
        spinnerBorder.appendChild(span);
    };

    const closeModal = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            $('#modal-root').modal('hide');
            resolve(payload.res);
        })
    };

    return new Promise((resolve, reject) => {
        //A: Si ya ejecute todos los comandos termino
        if (Object.keys(cmds).length <= pos) {
            resolve(res);
        } else {
            console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);
            if(typeof res === 'object') console.log(`res (${JSON.stringify(res)})`);  
            else console.log(`res (${res})`);

            var c = null;
            var command = cmds[pos];
            switch (command.type) {
                case "fetch":
                    c = () => fetchCmd(state, command.payload, res);
                    break;
                case "child-cmd":
                    c = () => childCmd(state, command.payload, res);
                    break;
                case "parent-cmd":
                    c = () => parentCmd(state, command.payload, res);
                    break;
                case "if":
                    c = () => ifStatement(state, command.payload, res);
                    break;
                case "getSubStates":
                    c = () => getSubStates(state, command.payload, res);
                    break;
                case "showSpinner":
                    c = () => showSpinner(state, command.payload, res);
                    break;
                case "hideSpinner":
                    c = () => hideSpinner(state, command.payload, res);
                    break;
                case "close":
                    c = () => closeModal(state, command.payload, res);
                    break;
                default:
                    console.log(`Cmd not found: ${command.type}`);
                    c = () => new Promise((res, rej) => { rej(`Cmd not found: ${command.type}`) });
                    break;
            }

            c()
                .then((res) => {
                    cmd(state, cmds, res, pos + 1);
                })
                .then((res) => resolve(res))
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        }
    })
};

const create = (newState, path) => {

    try {
        if (newState.type == "modal") {
            newState = utils.fillObjWithDflt(newState, dfltState);
            newState.path = path;

            Object.entries(newState.childs).forEach(child => {
                switch (child[1].type) {
                    case "wizard":
                        newState.childs[child[0]] = wizard.create(child[1], path + "/" + child[0]);
                        break;
                    case "table":
                        newState.childs[child[0]] = table.create(child[1], path + "/" + child[0]);
                        break;
                    case "form":
                        newState.childs[child[0]] = form.create(child[1], path + "/" + child[0]);
                        break;
                    case "dialog-box":
                        newState.childs[child[0]] = dialogBox.create(child[1], path + "/" + child[0]);
                        break;
                    default:
                        console.log("Error creating modal child, incorrect type: " + child[1].type);
                        break;
                }
            });
            //console.log("Table new Modal: " + JSON.stringify(newState));
            states.push(newState);
            return newState;
        } else {
            console.log("Error modal, incorrect type: " + newState.type);
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }


    // returnError("new modal created!"); // Si ya había un modal abierto le devuelvo un error al que lo creó, ya que lo pisé!

    // return new Promise((resolve, reject) => {
    //     //TODO: Ver si esto no genera un memory leak...
    //     subStates = null;
    //     state = utils.fillObjWithDflt(data, dfltState);
    //     createModal();
    //     drawContent();

    //     root = $('#modal');
    //     // Para q no se cierre cuando hago click afuera del contenido
    //     root.modal({ backdrop: 'static', keyboard: true });

    //     //Expongo en el global scope del script los llamados para resolver la promesa del q invokó el modal
    //     returnCorrect = (res) => {
    //         close();
    //         resolve(res);
    //     };
    //     returnError = (err) => {
    //         close();
    //         reject(err);
    //     };
    // });

};

const show = (state, parent) => {

    // const spinner = (payload, parent) => {
    //     //<div class="d-flex justify-content-center"></div>

    //     var justifyDiv = document.createElement("div");
    //     justifyDiv.className = "d-flex justify-content-center";
    //     parent.appendChild(justifyDiv);

    //     var spinnerBorder = document.createElement("div");
    //     spinnerBorder.className = "spinner-border text-light";
    //     spinnerBorder.role = "status";
    //     justifyDiv.appendChild(spinnerBorder);

    //     var span = document.createElement("div");
    //     span.className = "sr-only";
    //     span.innerHTML = "Loading...";
    //     spinnerBorder.appendChild(span);
    // }

    const showModal = () => {

        const createRow = (parent) => {
            const margins = 20;
            var row = document.createElement("div");
            row.style.position = 'relative';
            // row.style.left = margins + 'px';
            // row.style.right = margins + 'px';
            // row.style.top = margins + 'px';
            // row.style.bottom = margins + 'px';
            row.style.marginBottom = "20px";
            row.style.width = (parent.offsetWidth - margins) * 100 / parent.offsetWidth + '%';
            row.style.height = 'auto';
            row.className += " row";
            // tableRoot.style.height = (parent.offsetHeight - margins * 2) * 100 / parent.offsetHeight + '%';
            parent.appendChild(row);
            return row;
        };

        const createCol = (parent) => {
            const margins = 0;
            var col = document.createElement("div");
            col.style.position = 'relative';
            col.style.left = margins + 'px';
            col.style.right = margins + 'px';
            col.style.top = margins + 'px';
            col.style.bottom = margins + 'px';
            col.style.width = (parent.offsetWidth - margins * 2) * 100 / parent.offsetWidth + '%';
            col.style.height = 'auto';
            col.className += " col";
            // tableRoot.style.height = (parent.offsetHeight - margins * 2) * 100 / parent.offsetHeight + '%';
            parent.appendChild(col);
            return col;
        };

        const createFooterBtns = (parent) => {
            const footer = document.getElementById('modal-footer');
            footer.innerHTML = null;
            var btns = Object.entries(state.footerBtns);
            var btnsCount = 0;
            btns.forEach(([key, value]) => {
                if (value)
                    btnsCount++;
            });

            var btnsRow = document.createElement("div");
            btnsRow.className = "row";
            btnsRow.style["justify-content"] = "flex-end";
            btnsRow.style.width = "100%";
            footer.appendChild(btnsRow);

            console.log("btncount: " + btnsCount.toString());
            btns.forEach(([key, value]) => {
                // if (btnsCount < 3)
                //     value.showLabel = true;
                // else
                //     value.showLabel = false;
                var btnDiv = document.createElement("div");
                btnDiv.className += "col-3";
                // switch (btnsCount) {
                //     case 1:
                //         btnDiv.className += "col-12";
                //         break;
                //     case 2:
                //         btnDiv.className += "col-6";
                //         break;
                //     case 3:
                //         btnDiv.className += "col-4";
                //         break;
                //     case 4:
                //         btnDiv.className += "col-3";
                //         break;
                //     case 5:
                //         btnDiv.className += "col-2";
                //         break;
                //     case 6:
                //         btnDiv.className += "col-2";
                //         break;
                //     default:
                //         btnDiv.className += "col-12";
                //         break;
                // }
                btnsRow.appendChild(btnDiv);
                var btn = buttons.createBtn(value, state);
                btnDiv.appendChild(btn);
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    cmd(state, value.onClick.cmds, null, 0);
                });
            });
        };

        //Limpio el modal anterior
        document.getElementById("modal-body").innerHTML = null;
        document.getElementById("modal-header").childNodes[1].innerHTML = state.title;
        document.getElementById("modal-footer").innerHTML = null;
        
        var modalDialog = document.getElementById("modal-dialog")
        modalDialog.style["max-width"] = "9999px"; // Esto es para sacar el maxwidth de la clase "modal-dialog"
        modalDialog.style.width = state.width;

        if (state.content != null) {
            const showContent = () => {
                try {
                    const body = document.getElementById('modal-body');
                    Object.values(state.content.rows).forEach(row => {
                        var rowDiv = createRow(body);
                        Object.values(row.cols).forEach(col => {
                            var colDiv = createCol(rowDiv);
                            Object.values(col).forEach(element => {
                                console.log("show child: " + element);
                                var content = state.childs[element];
                                console.log("content: " + JSON.stringify(content))
                                switch (content.type) {
                                    case "wizard":
                                        wizard.show(content, colDiv);
                                        break;
                                    case "table":
                                        table.show(content, colDiv);
                                        break;
                                    case "form":
                                        form.show(content, colDiv);
                                        break;
                                    case "map":
                                        maps.show(content, colDiv);
                                        break;
                                    default:
                                        console.log("no se reconoce el tipo " + content.type)
                                        break;
                                }
                            });
                        });
                    });
                } catch (error) {
                    console.log("Error showing modal! " + error);
                }
            };

            showContent();
        } else {
            document.getElementById("modal-body").innerHTML = state.text;
        }

        createFooterBtns(parent);

        $('#modal-root').modal('show');
    };

    console.log("Modal show: " + JSON.stringify(state));

    showModal();
};

export default { create, show, cmd };