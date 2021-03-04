import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';
import dashboard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js';
import dialogBox from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dialogBox/dialogBox.js';

const dfltState = {
    type: "modal",
    width: "auto",
    title: "NO TITLE",
    text: "",
    footerBtns: {
        0: {
            type: "secondary",
            label: "Cancelar",
            onClick: {
                cmds: {
                    0: {
                        type: "close-modal",
                        payload: {}
                    }
                }
            }
        },
        1: {
            type: "primary",
            label: "Aceptar",
            onClick: {
                cmds: {}
            }
        }
    },
    childs: {}
};

var states = [];

//-----------------------------------------------------------------------------------------------

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

    return new Promise((resolve, reject) => {
        //A: Si ya ejecute todos los comandos termino
        if (Object.keys(cmds).length <= pos) {
            resolve(res);
        } else {
            console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);
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
                case "showSpinner":
                    c = () => showSpinner(state, command.payload, res);
                    break;
                case "hideSpinner":
                    c = () => hideSpinner(state, command.payload, res);
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

const create = (newState, path) => {

    try{
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

        document.getElementById("modal-header").childNodes[1].innerHTML = state.title;
        

        if (state.width == "auto") {
            
        } else {
            document.getElementById("modal-dialog").width = state.width;
        }

        if (state.content != null) {
            const showContent = () => {

                const createRow = (parent) => {
                    const margins = 20;
                    var row = document.createElement("div");
                    row.style.position = 'relative';
                    row.style.left = margins + 'px';
                    row.style.right = margins + 'px';
                    row.style.top = margins + 'px';
                    row.style.bottom = margins + 'px';
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


        $('#modal-root').modal('show');
    };  

    console.log("Modal show: " + JSON.stringify(state));
    
    showModal();
};



export default { create, show, cmd };