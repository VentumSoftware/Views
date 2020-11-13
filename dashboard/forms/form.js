import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';

const dfltState = {
    id: "noID",
    title: "Table",
    fetchPath: "/api/aggregate",
    headers: {},
    filters: {},
    initialStages: {},
    finalStages: {},
    rows: [],
    emptyCellChar: "-",
    selectedPage: 0,
    paginationIndex: 0,
    footerBtns: {
        empty0: {
            enabled: "true",
            type: "none",
            label: "",
            onClick: {}
        },
        empty1: {
            enabled: "true",
            type: "none",
            label: "",
            onClick: {}
        }
    }
};

var states = [];


//-----------------------------------------------------------------------------------------------

const removeState = () => {

}

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
                });
            });

            var btns = Object.entries(newState.footerBtns);
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
                if (value.enabled) {
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

                    var btn = document.createElement("button");
                    btn.type = "submit";
                    btn.style.position = "relative";
                    btn.style.width = '100%';
                    btn.style.overflowWrap = "normal";


                    //<i class="fa fa-home"></i>
                    btnDiv.appendChild(btn);

                    switch (value.type) {
                        case "filter":
                            btn.className = "btn btn-secondary";
                            if (btnsCount < 3)
                                btn.innerHTML = "Filtrar";
                            btn.value = "submit";
                            var icon = document.createElement("i");
                            icon.className = "fa fa-search";
                            btn.appendChild(icon);

                            btn.addEventListener('click', (e) => {
                                e.preventDefault();
                                newState.selectedPage = 0;
                                newState.paginationIndex = 0;
                                update(newState)
                                    .then(() => console.log("updated"))
                                    .catch(err => console.log("failed update: " + err));
                            });
                            newState.filterBtn = btn;
                            break;
                        case "erase":
                            btn.className = "btn btn-danger";
                            if (btnsCount < 3)
                                btn.innerHTML = "Borrar";
                            btn.value = "submit";
                            btn.disabled = true;
                            var icon = document.createElement("i");
                            icon.className = "fa fa-trash";
                            btn.appendChild(icon);
                            btn.addEventListener('click', (e) => {
                                e.preventDefault();
                                eraseSelectedRows(newState);
                            });
                            newState.eraseBtn = btn;
                            break;
                        case "edit":
                            btn.className = "btn btn-primary";
                            if (btnsCount < 3)
                                btn.innerHTML = "Editar";
                            btn.value = "submit";
                            btn.disabled = true;
                            var icon = document.createElement("i");
                            icon.className = "fa fa-pencil";
                            btn.appendChild(icon);
                            btn.addEventListener('click', (e) => {
                                e.preventDefault();
                                editSelectedRows(newState);
                            });
                            newState.editBtn = btn;
                            break;
                        case "add":
                            btn.className = "btn btn-success";
                            if (btnsCount < 3)
                                btn.innerHTML = "Agregar";
                            btn.value = "submit";
                            var icon = document.createElement("i");
                            icon.className = "fa fa-plus";
                            btn.appendChild(icon);
                            btn.addEventListener('click', (e) => {
                                e.preventDefault();
                                addNewElement(newState);
                            });
                            newState.addBtn = btn;
                            break;
                        case "none":
                            btn.className = "btn btn-success";
                            if (btnsCount < 3)
                                btn.innerHTML = "Agregar";
                            btn.value = "submit";
                            var icon = document.createElement("i");
                            icon.className = "fa fa-plus";
                            btn.style.display = "none";
                            btn.appendChild(icon);
                            btn.addEventListener('click', (e) => {
                                e.preventDefault();
                                addNewElement(newState);
                            });
                            newState.addBtn = btn;
                            break;
                        default:
                            break;
                    }

                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        cmd(newState, value.cmd, payload);
                    });
                }
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

export default { create, resetStates, states };