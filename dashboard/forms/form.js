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
    footerButtons: {
        empty0: {
            display: "none",
            disabled: "true",
            type: "none",
            label: "",
            onClick: {}
        },
        empty1: {
            display: "none",
            disabled: "true",
            type: "none",
            label: "",
            onClick: {}
        }
    }
};

var states = [];


//-----------------------------------------------------------------------------------------------

// dismissModal
const cmd = (state, cmds, res, pos) => {


    const pushForm = (state, payload) => {
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

    const dismissModal = (state, payload) => {
        return new Promise((success, failed) => {
            try {
                console.log("cmd: dismissModal. Payload: " + JSON.stringify(payload));
                const modalData = modal.getData();
                console.log("cmodalData: " + JSON.stringify(modalData));
                modal.close();
                success(modalData);
            } catch (error) {
                console.log(error);
                failed(error);
            }
        });
    };

    console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);

    try {
        //A: Si ya ejecute todos los comandos termino
        if (Object.keys(cmds).length <= pos) {
            return;
        } else {
            var c = null;
            var command = cmds[pos];
            switch (command.type) {
                case "push-form":
                    c = () => pushForm(state, command.payload);
                    break;
                case "dissmis-modal":
                    c = () => dismissModal(state, command.payload);
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
                .catch(err => console.log(err));
        }
    } catch (error) {
        console.log(error);
    }
};

const removeState = (state) => {}

const resetStates = () => {
    if (states.length > 0) {
        states.forEach((el) => {
            el = null;
        })
    }
    states = [];
}

const create = (data, parent) => {

    const createContent = () => {
        try {
            var form = document.createElement("form");
            form.id = newState.id + "-form";
            form.style.margin = "20px";
            cardParent.body.appendChild(form);

            var row = document.createElement("div");
            row.id = newState.id + "-row";
            row.className = "row";
            form.appendChild(row);

            Object.values(data.cols).forEach(col => {
                var inputCol = document.createElement("div");
                inputCol.className = "col";
                row.appendChild(inputCol);
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
                    inputIn.className = "form-control";
                    inputIn.placeholder = input.placeholder;
                    inputDiv.appendChild(inputIn);
                    newState.inputs[input.label] = null;
                    inputIn.addEventListener('change', (event) => {
                        newState.inputs[input.label] = event.target.value;
                    });
                });
            });

            var btns = Object.entries(newState.footerButtons);
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
                var btn = buttons.createBtn(value, newState);
                btnDiv.appendChild(btn);
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    cmd(newState, value.onClick.cmds, null, 0);
                });
            });
            return form;

        } catch (error) {
            console.log(error);
        }
    };

    var newState = utils.fillObjWithDflt(data, dfltState);
    const cardParent = card.create({ title: newState.title }, parent);

    createContent();

    console.log("states: " + states.push(newState).toString());

    return newState;
};

export default { create, resetStates, removeState, states };