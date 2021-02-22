import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import buttons from 'https://ventumdashboard.s3.amazonaws.com/dashboard/buttons/buttons.js';
import modal from 'https://ventumdashboard.s3.amazonaws.com/dashboard/modal/modal.js';
import dashboard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js';

const dfltState = {
    id: "noID",
    title: "Form",
    fetchPath: "/api/aggregate",
    inputs: {},
    footerBtns: {},
    parent: null
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

    const pushForm = (state, payload, res) => {
        return new Promise((success, failed) => {
            try {
                console.log("cmd: pushForm. Payload: " + JSON.stringify(payload));
                modal.show(state, { spinner: {} });
                var options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(state)
                };
                fetch(payload.fetchPath, options)
                    .then(() => {
                        dashboard.reloadCat();
                        dismissModal();
                        success("ok");
                    })
                    .catch((err) => {
                        console.log(err);
                        failed(err);
                    });


            } catch (error) {
                console.log(error);
                failed(error);
            }
        });
    };

    // const dismissModal = (state, payload, res) => {
    //     return new Promise((success, failed) => {
    //         try {
    //             console.log("cmd: dismissModal. Payload: " + JSON.stringify(payload));
    //             const modalData = modal.getData();
    //             console.log("cmodalData: " + JSON.stringify(modalData));
    //             modal.close();
    //             success(modalData);
    //         } catch (error) {
    //             console.log(error);
    //             failed(error);
    //         }
    //     });
    // };

    const getData = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            resolve(state.inputs);
        });
    };

    const getState = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            resolve(state);
        });
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
                case "push-form":
                    c = () => pushForm(state, command.payload, res);
                    break;
                case "dissmis-modal":
                    c = () => dismissModal(state, command.payload, res);
                    break;
                case "get-state":
                    c = () => getState(state, command.payload, res);
                    break;
                case "get-data":
                    c = () => getData(state, command.payload, res);
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
        if (newState.type == "form") {
            newState = utils.fillObjWithDflt(newState, dfltState);
            newState.path = path;

            Object.entries(newState.childs).forEach(child => {
                switch (child[1].type) {
                    case "modal":
                        newState.childs[child[0]] = modal.create(child[1], path + "/" + child[0]);
                        break;
                    default:
                        console.log("Error creating form child, incorrect type: " + child[1].type);
                        break;
                }
            });
            //console.log("Modal new State: " + JSON.stringify(newState));
            states.push(newState);
            return newState;
        } else {
            console.log("Error creating modal, incorrect type: " + newState.type);
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const show = (state, parent) => {
    const drawForm = () => {
        try {
            var form = document.createElement("form");
            form.id = state.id + "-form";
            form.style.margin = "20px";
            cardParent.body.appendChild(form);

            var row = document.createElement("div");
            row.id = state.id + "-row";
            row.className = "row";
            form.appendChild(row);

            Object.values(state.cols).forEach(col => {
                var inputCol = document.createElement("div");
                inputCol.className = "col";
                row.appendChild(inputCol);
                state.inputs = {};
                Object.values(col).forEach(input => {
                    var inputRow = document.createElement("div");
                    inputRow.className = "row";
                    inputRow.style.marginTop = "8px";
                    inputRow.style.marginBottom = "8px";
                    inputCol.appendChild(inputRow);
                    var label = document.createElement("label");
                    label.className = "col-md-4 col-form-label";
                    label.innerHTML = input.label;
                    inputRow.appendChild(label);
                    var inputDiv = document.createElement("div");
                    inputDiv.className = "col-md-8";
                    inputRow.appendChild(inputDiv);
                    // var inputSubDiv = document.createElement("div");
                    // inputSubDiv.className = "form-group";
                    // inputDiv.appendChild(inputSubDiv);
                    var inputIn = document.createElement("input");
                    state.inputs[input.label] = input.value;

                    //readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"
                    switch (input.type) {
                        case "text":
                            inputIn.className = "form-control";
                            inputIn.placeholder = input.placeholder;
                            break;
                        case "date":
                            inputIn.className = "form-control";
                            inputIn.placeholder = input.placeholder;
                            inputIn.type = "date"
                            break;
                        case "fixed":
                            inputIn.readOnly = true;
                            inputIn.className = "form-control-plaintext";
                            inputIn.value = input.value;
                            break;
                        case "fixed-hour":
                            inputIn.readOnly = true;
                            inputIn.className = "form-control-plaintext";
                            //TODO: VER SI HAY UN MEMORY LEAK ACÁ, O SI TENGO Q GUARDAR LA REF PARA MATARLO
                            var d = new Date();
                            var n = `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`;
                            inputIn.value = n;
                            state.inputs[input.label] = inputIn.value;
                            setInterval(() => {
                                var d = new Date();
                                var n = `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`;
                                inputIn.value = n;
                                state.inputs[input.label] = inputIn.value;
                            }, 1000);
                            break;
                        case "fixed-date":
                            inputIn.readOnly = true;
                            inputIn.className = "form-control-plaintext";
                            var d = new Date();
                            var n = `${(d.getUTCFullYear())}/${("0" + (d.getUTCMonth() + 1)).slice(-2)}/${("0" + d.getUTCDate()).slice(-2)}`;
                            inputIn.value = n;
                            state.inputs[input.label] = inputIn.value;
                            setInterval(() => {
                                var d = new Date();
                                var n = `${(d.getUTCFullYear())}/${("0" + (d.getUTCMonth() + 1)).slice(-2)}/${("0" + d.getUTCDate()).slice(-2)}`;
                                inputIn.value = n;
                                state.inputs[input.label] = inputIn.value;
                            }, 1000);
                            break;
                        default:
                            inputIn.className = "form-control";
                            inputIn.placeholder = input.placeholder;
                            break;
                    }

                    inputIn.addEventListener('change', (event) => {
                        state.inputs[input.label] = event.target.value;
                    });

                    inputDiv.appendChild(inputIn);


                });
            });

            var btns = Object.entries(state.footerBtns);
            var btnsCount = 0;
            btns.forEach(([key, value]) => {
                if (value)
                    btnsCount++;
            });

            var btnsRow = document.createElement("div");
            btnsRow.className = "row";
            cardParent.footer.appendChild(btnsRow);

            console.log("btncount: " + btnsCount.toString());
            btns.forEach(([key, value]) => {
                if (btnsCount < 3)
                    value.showLabel = true;
                else
                    value.showLabel = false;
                var btnDiv = document.createElement("div");
                switch (btnsCount) {
                    case 1:
                        btnDiv.className += "col-12";
                        break;
                    case 2:
                        btnDiv.className += "col-6";
                        break;
                    case 3:
                        btnDiv.className += "col-4";
                        break;
                    case 4:
                        btnDiv.className += "col-3";
                        break;
                    case 5:
                        btnDiv.className += "col-2";
                        break;
                    case 6:
                        btnDiv.className += "col-2";
                        break;
                    default:
                        btnDiv.className += "col-12";
                        break;
                }
                btnsRow.appendChild(btnDiv);
                var btn = buttons.createBtn(value, state);
                btnDiv.appendChild(btn);
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    cmd(state, value.onClick.cmds, null, 0);
                });
            });
            return form;

        } catch (error) {
            console.log(error);
        }
    };
    console.log("Form show: " + JSON.stringify(state));
    const cardParent = card.create({ title: state.title }, parent);
    drawForm();
};

export default { create, show, cmd };