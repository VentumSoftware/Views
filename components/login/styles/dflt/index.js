const dfltState = {
    background: {
        image: '',
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
                        r.json().then(r => {
                            console.log(r);
                            document.cookie = `access-token=${r.token}`;
                            window.location.href = "/pages/dashboard";
                            res("Login ok!");
                        })
                    else {
                        console.error("Failed to sign in!");
                        window.cmps.modal.show(state.childs.failedSignInModal);
                        res("Failed login!")
                    }
                })
                .catch(err => console.log(err));
        });
    },
    rememberMeText: "Recordarme",
    signUpText: "", // "No tienes una cuenta?"
    signUpLinkText: "", // "Registrate"
    onSignUp: (state) => {
        views.show(state.childs.notImplementedModal)
    },
    forgotPassText: "",
    forgotPassLinkText: "", // "Olvidé mi contraseña"
    onForgotPass: (state) => {
        views.show(state.childs.notImplementedModal)
    },
    childs: {
        failedSignInModal: {
            type: "modal",
            id: "failedSignInModal",
            title: "Usuario o contraseña incorrecta",
            description: "Revise los datos ingresados por favor",
            childs: {
                footer: {
                    type: "button",
                    label: "Aceptar",
                    btnType: "primary",
                    onClick: (state) => {
                        var modal = views.getParent(state, globalState);
                        cmps.modal.hide(modal);
                    }
                }
            }
        },
        notImplementedModal: {
            type: "modal",
            title: "No implementado",
        }
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
                            <input type="checkbox"> ${state.rememberMeText}
                        </div>
                        <div style="height: 10px;"></div>
                        <button type="submit" class="btn btn-primary" id="${state.id + "_signInBtn"}">
                            <span class="spinner-border spinner-border-sm" id="spinner" role="status" aria-hidden="true" style="
                        display: none;"></span>
                            Ingresar
                        </button>
                        <div style="height: 10px;"></div>
                        <div class="d-flex justify-content-left links" id="${state.id + "_signUpLink"}" style="white-space: nowrap">
                            ${state.signUpText}<a href="#" >&nbsp;${state.signUpLinkText}</a>
                        </div>
                        <div class="d-flex justify-content-left links" id="${state.id + "_forgotPassLink"}" style="white-space: nowrap">
                            ${state.forgotPassText}<a href="#">${state.forgotPassLinkText}</a>
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

    state = fillObjWithDflt(state, dfltState);

    return new Promise((res, rej) => {
        var html = stringToHTML(getHTML(state));
        html = parent.appendChild(html);
        state = getReferences(state, html.getRootNode());
        state.html.signUpLink.addEventListener('click',
            (e) => {
                e.preventDefault();
                eval(state.onSignUp)(state);
                return false;
            });
        state.html.forgotPassLink.addEventListener('click',
            (e) => {
                e.preventDefault();
                eval(state.onForgotPass)(state);
                return false;
            });
        state.html.signInBtn.addEventListener('click', (e) => eval(state.onSignIn)(state));
        views.renderChilds(state).then(res);
    });
};

export default { dfltState, render };