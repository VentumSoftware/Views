const dfltState = {
    background: {
        image: '../public/assets/Images/detector0.jpeg',
        gradientDirection: "to right",
        gradientStart: "rgba(255, 255, 255, 0.7)",
        gradientEnd: "rgba(255,255,255,0)"
    },
    mainTitle: "EMPRESA",
    secondTitle: "Portal de la empresa",
    onSignIn: (state) => {
        return new Promise((res, rej) => {
            fetch("/users/signin", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: state.html.loginUser.value,
                    password: state.html.loginPass.value
                })
            })
                .then(r => {
                    if (r.status === 200)
                        r.json().then(r => {console.log(r);
                            document.cookie = `access-token=${r.token}`;
                            window.location.href = "/pages/dashboard";
                            res("Login ok!");
                        })
                    else {
                        console.error("Failed to sign in!");
                        cmps.modal.show(this.childs.failedSignInModal);
                        res("Failed login!")
                    }
                })
                .catch(err => console.log(err));
        });
    },
    onSignUp: () => {
        console.log("OnSignUp no implementado!")
    },
    childs: {
        failedSignInModal: {
            type: "modal",
            title: "Usuario o contraseña incorrecta",
            description: "Revise los datos ingresados por favor",
            childs: {
                footer: {
                    type: "button",
                    label: "Aceptar",
                    btnType: "primary",
                    onClick: (btnState) => {
                        var modal = getParent(btnState, globalState);
                        console.log(modal)
                        cmps.modal.hide(modal);
                    }
                }
            }
        },
    }
};

const render = (state, parent) => {
    const getHTML = (state) => {
        return `
        <div id="${state.id + "_root"}">
            <style>
                body {
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                    background-image: url("${state.background.image}");
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-repeat: no-repeat;
                }
            </style>
            <div style="background-image: linear-gradient(${state.background.gradientDirection}, ${state.background.gradientStart}, ${state.background.gradientEnd}); height: 100vh;" class="full-height">
                <h1 style="padding: 1%; padding-top: 2%; margin-bottom: 0; padding-left: 2%;">
                    ${state.mainTitle}:
                    <small class="text-muted">${state.secondTitle}</small>
                </h1>
                <div class="row" style="padding: 1%; padding-left: 2%; padding-top: 0;">
                    <div class="col-3">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Usuario</label>
                            <input type="email" class="form-control" id="${state.id + "_user"}" aria-describedby="emailHelp" placeholder="Usuario">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Contraseña</label>
                            <input type="password" class="form-control " id="${state.id + "_pass"}" placeholder="Contraseña">
                        </div>
                        <div>
                            <input type="checkbox"> Recordarme
                        </div>
                        <div style="height: 10px;"></div>
                        <button type="submit" class="btn btn-primary" id="${state.id + "_signInBtn"}">
                            <span class="spinner-border spinner-border-sm" id="spinner" role="status" aria-hidden="true" style="
                        display: none;"></span>
                            Ingresar
                        </button>
                        <div style="height: 10px;"></div>
                        <div class="d-flex justify-content-left links" id="${state.id + "_signUpLink"}" style="white-space: nowrap">
                            No tienes una cuenta?<a href="../pages/signup">&nbsp;Registrate</a>
                        </div>
                        <div class="d-flex justify-content-left links" id="${state.id + "_forgotPassLink"}" style="white-space: nowrap">
                            <a href="../pages/recoverpassword">Olvidaste la contraseña?</a>
                        </div>
                    </div>
                </div>
            </div>
        <div>
`
    };

    const getReferences = (state, root) => {
        state.html = {
            root: root.getElementById(state.id + "_root"),
            loginUser: root.getElementById(state.id + "_user"),
            loginPass: root.getElementById(state.id + "_pass"),
            signInBtn: root.getElementById(state.id + "_signInBtn"),
            signUpLink: root.getElementById(state.id + "_signUpLink"),
            forgotPassLink: root.getElementById(state.id + "_forgotPassLink")
        };
        return state;
    };

    const renderChilds = (state) => {
        return new Promise((res, rej) => {
            utils.forEachPromise(Object.values(state.childs), (child) => views.render(child, state.html.root))
                .then(() => res(state));
        });
    }

    state = utils.fillObjWithDflt(state, dfltState);

    return new Promise((res, rej) => {
        var html = utils.stringToHTML(getHTML(state));
        html = parent.appendChild(html);
        state = getReferences(state, html.getRootNode());
        console.log(state.onSignIn);
        state.html.signInBtn.addEventListener('click', (e) => eval(state.onSignIn)(state));
        res(state);
        // renderChilds(state)
        //     .then(state => {
        //         if (state.show == true) state.html.root.style.display = "none";
        //         else state.html.root.style.display = "block";
        //         res(state);
        //     });
    });
};

export default { dfltState, render };