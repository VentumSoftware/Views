import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';
import dashboard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js';

const dfltState = {
    type: "modal"
};

//Estados de los elementos del modal: forms, tables, etc...
var subStates = [];

//Modals prearmados como el "confirmationBox"
var templates = {
    confirmationBox: {}
};

var state = null;
var root = null;
var modalDialog = null;
var modalContent = null;

//-----------------------------------------------------------------------------------------------

var returnCorrect = (state, res) => {};
var returnError = (state, err) => {};

const cmd = (state, cmds, res, pos) => {

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

    const returnCorrectCmd = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            returnCorrect(state, payload.res);
            resolve(payload.res);
        })
    };

    const returnErrorCmd = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            returnCorrect(state, payload.res);
            resolve(payload.res);
        })
    };

    console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);

    return new Promise((resolve, reject) => {
        //A: Si ya ejecute todos los comandos termino
        if (Object.keys(cmds).length <= pos) {
            resolve(res);
        } else {
            var c = null;
            var command = cmds[pos];
            switch (command.type) {
                case "parent-cmd":
                    c = () => parentCmd(state, command.payload, res);
                    break;
                case "if":
                    c = () => ifStatement(state, command.payload, res);
                    break;
                case "getSubStates":
                    c = () => getSubStates(state, command.payload, res);
                    break;
                case "return-correct":
                    c = () => returnCorrectCmd(state, command.payload, res);
                    break;
                case "return-error":
                    c = () => returnErrorCmd(state, command.payload, res);
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

const spinner = (payload, parent) => {
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
}

const show = (invokerState, data) => {

    const spinner = (payload, parent) => {
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
    }

    return new Promise((resolve, reject) => {
        const drawContent = () => {
            modalContent.innerHTML = null;
            subStates = [];
            if (data.form) {
                var formState = form.create(data.form, modalContent);
                subStates.push(formState);
            }

            if (data.spinner) {
                spinner(data.spinner, modalContent);
            }
        };

        if (state == null) {
            create();
        }

        drawContent();
        root.modal('show');
        root.on('hidden.bs.modal', function(e) {
            e.preventDefault();
            console.log("modalCerrado");
            $(e.currentTarget).unbind(); // or $(this)  
            //sacar state del form 
            resolve();
        });
    });
};

const close = () => {
    //TODO: remover subStates acá;
    console.log("Modal Close!");
    root.modal('hide');
}

const create = (data) => {

    const createModal = () => {
        var modalRoot = document.createElement("div");
        modalRoot.id = "modal";
        modalRoot.className = "modal fade bd-example-modal-lg";
        modalRoot.tabIndex = "-1";
        modalRoot.role = "dialog";
        modalRoot["aria-labelledby"] = "myLargeModalLabel";
        modalRoot["aria-hidden"] = "true";
        document.body.appendChild(modalRoot);

        modalDialog = document.createElement("div");
        modalDialog.className = "modal-dialog modal-lg";
        modalRoot.appendChild(modalDialog);

        modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.style.display = "contents";
        modalDialog.appendChild(modalContent);

        return modalRoot;
    };

    const drawContent = () => {
        modalContent.innerHTML = null;
        subStates = [];
        //TODO: Hacer esto bien (esta harcodeado ahora el contenido porque no tengo columnas y filas todavia)
        var tmp = data.content.rows[0].cols[0][0];
        if (tmp) {
            var formState = form.create(tmp.payload, modalContent, state);
            subStates.push(formState);
        }

        if (data.spinner) {
            spinner(data.spinner, modalContent);
        }



    };

    returnError("new modal created!"); // Si ya había un modal abierto le devuelvo un error al que lo creó, ya que lo pisé!

    return new Promise((resolve, reject) => {
        //TODO: Ver si esto no genera un memory leak...
        subStates = null;
        state = utils.fillObjWithDflt(data, dfltState);
        createModal();
        drawContent();

        root = $('#modal');
        // Para q no se cierre cuando hago click afuera del contenido
        root.modal({ backdrop: 'static', keyboard: true });

        //Expongo en el global scope del script los llamados para resolver la promesa del q invokó el modal
        returnCorrect = (res) => {
            close();
            resolve(res);
        };
        returnError = (err) => {
            close();
            reject(err);
        };
    });

};

export default { create, show, close, cmd };