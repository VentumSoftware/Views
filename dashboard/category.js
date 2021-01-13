import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';
import modal from 'https://ventumdashboard.s3.amazonaws.com/dashboard/modal/modal.js';
import table from 'https://ventumdashboard.s3.amazonaws.com/dashboard/table/table.js';
import wizard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/wizard/wizard.js';

//--------------------------------- Category --------------------------------------------

var dfltState = {
    id: "noId",
    name: "No Name",
    access: {},
    postUrl: null,
    content: {
        rows: {
            //Rows
            0: {
                cols: {
                    0: {}
                }
            }
        }
    }
};

var states = [];

//--------------------------------- Public Interface ------------------------------------

const cmd = (state, cmds, res, pos) => {

    const removeState = (state, payload, res) => {};

    const resetStates = (state, payload, res) => {
        if (states.length > 0) {
            states.forEach((el) => {
                el = null;
            })
        }
        states = [];
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

    //Vuelve a cargar la vista seleccionada
    const reloadCat = (state, payload, res) => {
        selectCategory(state.selectedCat);
    };

    //Hace un post al endpoint indicado en el payload con el estado de la categoria como body
    const post = (invokerState, payload, res) => {
        var body = {
            tablesState: table.states,
            formsStates: form.states,
        }
    };

    console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);

    try {
        //A: Si ya ejecute todos los comandos termino
        if (Object.keys(cmds).length <= pos) {
            resolve(res);
        } else {
            var c = null;
            var command = cmds[pos];
            switch (command.type) {
                case "reload":
                    c = () => reloadCat(state, command.payload);
                    break;
                case "post":
                    c = () => post(state, command.payload);
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
    } catch (error) {
        console.log(error);
    }
};

const create = (newState, path) => {
    try{
        if (newState.type == "category") {
            newState = utils.fillObjWithDflt(newState, dfltState);
            newState.path = path;

            if (newState.subCategories != null) {
            
            } else {
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
                        default:
                            console.log("Error creating category child, incorrect type: " + child[1].type);
                            break;
                    }
                });
            }
            //console.log("Category new State: " + JSON.stringify(newState));
            states.push(newState);
            return newState;
        } else {
        console.log("Error creating category, incorrect type: " + newState.type);
        return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const show = (state, parent) => {

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


    console.log("Category show: " + JSON.stringify(state));
    try {
        Object.values(state.content.rows).forEach(row => {
            var rowDiv = createRow(parent);
            Object.values(row.cols).forEach(col => {
                var colDiv = createCol(rowDiv);
                Object.values(col).forEach(element => {
                    switch (element.type) {
                        case "wizard":
                            wizard.show(element.payload, colDiv);
                            break;
                        case "table":
                            table.show(element.payload, colDiv);
                            break;
                        case "form":
                            form.show(element.payload, colDiv);
                            break;
                        default:
                            break;
                    }
                });
            });
        });
    } catch (error) {
        console.log("Error showing category! " + error);
    }
};

export default { create, show, cmd };