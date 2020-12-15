import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import buttons from 'https://ventumdashboard.s3.amazonaws.com/dashboard/buttons/buttons.js';
import modal from 'https://ventumdashboard.s3.amazonaws.com/dashboard/modal/modal.js';
import dashboard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js';
import table from 'https://ventumdashboard.s3.amazonaws.com/dashboard/table/table.js';

const dfltState = {
    id: "noID",
    title: "Form",
    text: "Texto de confirmación!",
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
        },
        cancel: {
            enabled: "true",
            type: "cancel",
            label: "Cancelar",
            onClick: "cancel"
        },
        accept: {
            enabled: "true",
            type: "accept",
            label: "Aceptar",
            onClick: "accept"
        }
    },

    //References
    parentState: {},
};

var states = [];

//-----------------------------------------------------------------------------------------------

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

    return new Promise((resolve, reject) => {
        try {
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
                            resolve(value.onClick);
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

        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
};

export default { create, resetStates, removeState, states };