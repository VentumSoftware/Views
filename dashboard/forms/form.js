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
};

var states = [];


//-----------------------------------------------------------------------------------------------

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

        return form;
    };

    var newState = utils.fillObjWithDflt(data, dfltState);
    const cardParent = card.create({ title: newState.title }, parent);

    createContent();

    console.log("states: " + states.push(newState).toString());

    return newState;
};

export default { create, resetStates };