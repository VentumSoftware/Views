import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import modal from 'https://ventumdashboard.s3.amazonaws.com/dashboard/modal/modal.js';
import buttons from 'https://ventumdashboard.s3.amazonaws.com/dashboard/buttons/buttons.js';

const dfltState = {
    id: "noID",
    title: "Table",
    fetchPath: "/api/aggregate",
    headers: {},
    filters: {},
    headerBtns: {},
    initialStages: {},
    finalStages: {},
    footerBtns: {},
    rowsData: [],
    rowsCheckboxs: [],
    targetedBtns: [],
    emptyCellChar: "-",
    selectedPage: 0,
    paginationIndex: 0,

};

var states = [];

//---------------------------------------- Otros ----------------------------------------------------

//TODO: Mover a un librería
const formatDateToQuery = (date) => {
    var dateToFormat = date.split("-");
    dateToFormat = dateToFormat[0] + dateToFormat[1] + dateToFormat[2];
    return (dateToFormat[0] + dateToFormat[1] + dateToFormat[2]);
};


function formatToDate(value) {
    let year =[], month=[], day=[], hours=[], minutes=[], seconds=[];
    let formattedDate;
    try {
        for(let i = 0; i<value.length; i++){
            switch (true) {
                case (i<4):
                    year.push(value[i]);
                    break;
                case (i<6):
                    month.push(value[i]);
                    break;
                case (i<8):
                    day.push(value[i]);
                    break;
                case (i<10):
                    hours.push(value[i]);
                    break;
                case (i<12):
                    minutes.push(value[i]);
                    break;
                case (i<14):
                    seconds.push(value[i]);
                    break;
                default:
                    break;
                }
            }
        formattedDate = `${year.join('')}-${month.join('')}-${day.join('')} ${hours.join('')}:${minutes.join('')}:${seconds.join('')}`;
        const fecha = new Date(formattedDate);
        if(Number.isNaN(fecha.getTime())){
            console.log('Invalid date: ' + fecha + ". Instead, value "+ value +" will be returned.");
            return(value);
        }else{
            return(fecha);
        }
    } catch (error) {
        console.log('Error al formatear fecha: '+ error);
        return null;
    }

}

const formatValue = (value) => {
    const formattedValue = formatToDate(value); //formatToDate() devuelve un objeto Date en formato ISOString
    if(typeof formattedValue == 'object' && formattedValue !== null){
        try {
            let newTime = new Date();
            let globalTime = formattedValue.getTime();
            let localeTime = new Date(newTime.setTime(globalTime + (-3 * 60 * 60 * 1000))); //Setea el valor ISOString a Hora Argentina UTC-3
            return (localeTime.toISOString().split('.')[0]);
        } catch (error) {
            console.log(error);
            return value;
        }
    }else {
        console.log("ERROR: "+value);
    }
}

//------------------------------ Públicos -----------------------------------------------------------------

// filter, edit, erase, add, dismissModal, post, update, modal
const cmd = (state, cmds, res, pos) => {

    // const resetStates = () => {
    //     if (states.length > 0) {
    //         states.forEach((el) => {
    //             el = null;
    //         })
    //     }
    //     states = [];
    // };

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

    const post = (state, payload, res) => {
        var options = {
            method: payload.method || 'GET',
            mode: payload.mode || 'cors',
            cache: payload.cache || 'no-cache',
            credentials: payload.credentials || 'same-origin',
            headers: payload.headers || {
                'Content-Type': 'application/json'
            },
            redirect: payload.redirect || 'follow',
            referrerPolicy: payload.referrerPolicy || 'no-referrer',
        };
        if (options.method == "POST") {
            options.body = JSON.stringify(payload.body || res)
        }
        return fetch(payload.url, options);
    };

    const showModal = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            try {
                modal.show(payload, null);
                resolve();
            } catch (error) {
                reject(error);
            }
        })
        
    };

    const updateEditRemoveBtns = (state, payload, res) => {

        return new Promise((resolve, reject) => {
            try {
                const enableBtns = () => {
                    state.targetedBtns.forEach((btn) => {
                        btn.disabled = false;
                    });
                    console.log("enableBtns true");
                };

                const disableBtns = () => {
                    state.targetedBtns.forEach((btn) => {
                        btn.disabled = true;
                    });
                    console.log("enableBtns false");
                };

                var enable = false;
                state.rowsCheckboxs.forEach((checkbox) => {
                    if (checkbox.checked) {
                        enable = true;
                    }
                });

                if (enable) {
                    enableBtns();
                } else {
                    disableBtns();
                }

                resolve();
            } catch (error) {
                console.log(error);
                reject(error);
            }

        });

    };

    const filter = (state, payload, res) => {
        return new Promise((res, rej) => {
            state.selectedPage = 0;
            state.paginationIndex = 0;
            update(state)
                .then(() => {
                    console.log("updated");
                    res();
                })
                .catch(err => {
                    console.log("failed update: " + err);
                    rej();
                });
        });

    };

    const confirmationBox = (state, payload, res) => {
        return new Promise((res, rej) => {
            rej("not implemented!");
        });
    };

    const ifCmd = (state, payload, res) => {
        return new Promise((res, rej) => {
            rej("not implemented!");
        });
    };

    const dismissModal = (state, payload, res) => {
        return new Promise((res, rej) => {
            rej("not implemented!");
        });
    };

    //Updates table data and view
    const update = (state, payload, res) => {

        const fetchData = () => {

            const getFiltersValues = () => {
                var result = {};
                if (state.filterForm) {
                    const formData = new FormData(state.filterForm);
                    var i = 0;
                    for (var pair of formData.entries()) {
                        result[pair[0]] = pair[1];
                    }
                };
                console.log("filter values: " + JSON.stringify(result));
                return result;
            };

            const getRows = () => {

                const buildPipeline = (filters) => {

                    const buildStage = (key, value) => {
                        console.log(key);
                        console.log(value);

                        const getStageDefinition = () => {
                            var result = null;
                            if (value == "")
                                return result;
                            Object.keys(state.filters).forEach((index) => {
                                Object.keys(state.filters[index].inputs).forEach((filter) => {
                                    if (state.filters[index].inputs[filter].name == key) {
                                        result = state.filters[index].inputs[filter].stage;
                                        console.log(result);
                                    }
                                })
                            })
                            return result;
                        };

                        var result = "";
                        var stageDef = getStageDefinition();
                        if (stageDef != null) {
                            switch (stageDef.type) {
                                case "match":
                                    switch (stageDef.transform) {
                                        case "date":
                                            value = formatDateToQuery(value);
                                            break;
                                        case "number":
                                            result += `{"$addFields":{"paquete.vel":{"$toInt": "$paquete.Velocidad"}}},`;
                                            value = parseInt(value);
                                            break;
                                        default:
                                            break;
                                    }
                                    var op = "";
                                    switch (typeof(stageDef.op)) {
                                        case 'string':
                                            if(stageDef.transform == "number"){
                                                op =  `{"${stageDef.op}":${value}}`;
                                            }else {
                                                op = `{"${stageDef.op}":"${value}"}`;
                                            }
                                            break;
                                        case 'undefined':
                                            op = `"${value}"`;
                                            break;
                                        case 'object':
                                            //TODO
                                            break;
                                        default:
                                            break;
                                    }
                                    result += `{"$match":{"${stageDef.var}":${op}}},`;
                                    break;
                                default:
                                    break;
                            }
                        }
                        return result;
                    }

                    var result = "[";
                    Object.keys(filters).forEach(key => {
                        result += buildStage(key, filters[key]);
                    });
                    Object.keys(state.finalStages).forEach((key) => {
                        result += state.finalStages[key] + ",";
                    })
                    result += `{"$skip": ${state.selectedPage*10} },{"$limit": 10 }]`; //Ordenamiento descendente por Hora (de nuevo a viejo) -- Hasta 10 resultados.
                    console.log(result);
                    return result;
                };
                var path = state.fetchPath;
                var filters = getFiltersValues();
                var pipeline = buildPipeline(filters);

                return new Promise((resolve, reject) => {
                    const options = `{"collation":{"locale":"en_US","numericOrdering":"true"},"allowDiskUse":"true"}`;
                    fetch(path + "?pipeline=" + pipeline + "&options=" + options, {
                            referrerPolicy: "origin-when-cross-origin",
                            credentials: 'include',
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                            }
                        })
                        .then(res => res.json())
                        .then(res => resolve(res))
                        .catch(err => {
                            console.log(err);
                            reject(err)
                        });
                });
            }

            const getCount = () => {
                const buildPipeline = (filters) => {

                    const buildStage = (key, value) => {
                        console.log(key);
                        console.log(value);

                        const getStageDefinition = () => {
                            var result = null;
                            if (value == "")
                                return result;
                            Object.keys(state.filters).forEach((index) => {
                                Object.keys(state.filters[index].inputs).forEach((filter) => {
                                    if (state.filters[index].inputs[filter].name == key) {
                                        result = state.filters[index].inputs[filter].stage;
                                        console.log(result);
                                    }
                                })
                            })
                            return result;
                        };

                        var result = "";
                        var stageDef = getStageDefinition();
                        console.log(stageDef);
                        if (stageDef != null) {
                            switch (stageDef.type) {
                                case "match":
                                    switch (stageDef.transform) {
                                        case "number":
                                            result += `{"$addFields":{"paquete.vel":{"$toInt": "$paquete.Velocidad"}}},`;
                                            value = parseInt(value);
                                            break;
                                        case "date":
                                            value = formatDateToQuery(value);
                                            break;
                                        default:
                                            break;
                                    }
                                    var op = "";
                                    switch (typeof(stageDef.op)) {
                                        case 'string':
                                            if(stageDef.transform == "number"){
                                                op =  `{"${stageDef.op}":${value}}`;
                                            }else {
                                                op = `{"${stageDef.op}":"${value}"}`;
                                            }
                                            break;
                                        case 'undefined':
                                            op = `"${value}"`;
                                            break;
                                        case 'object':
                                            //TODO
                                            break;
                                        default:
                                            break;
                                    }
                                    result += `{"$match":{"${stageDef.var}":${op}}},`;
                                    break;
                                default:
                                    break;
                            }
                        }
                        return result;
                    }

                    var result = "[";
                    Object.keys(filters).forEach(key => {
                        result += buildStage(key, filters[key]);
                    });
                    Object.keys(state.finalStages).forEach((key) => {
                        result += state.finalStages[key] + ",";
                    })
                    result += `{ "$count": "count" }]`; //Ordenamiento descendente por Hora (de nuevo a viejo) -- Hasta 10 resultados.
                    console.log(result);
                    return result;
                };
                var path = state.fetchPath;
                var filters = getFiltersValues();
                var pipeline = buildPipeline(filters);

                return new Promise((resolve, reject) => {
                    //const options = `{"collation":{"locale":"en_US","numericOrdering":"true"}, "allowDiskUse" : "true"}`;
                    const options = `{"collation":{"locale":"en_US","numericOrdering":"true"},"allowDiskUse":"true"}`;
                    fetch(path + "?pipeline=" + pipeline + "&options=" + options, {
                            referrerPolicy: "origin-when-cross-origin",
                            credentials: 'include',
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                            }
                        })
                        .then(res => {
                            console.log(res);
                            return res.json();
                        })
                        .then(res => {
                            console.log(res);
                            resolve(res);
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err)
                        });
                });
            };

            return new Promise((resolve, reject) => {
                var result = {};
                getRows()
                    .then(rows => {
                        result.rows = rows;
                        return getCount();
                    })
                    .then(count => {
                        if (count[0])
                            result.count = count[0].count;
                        else
                            result.count = 0;
                        resolve(result);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            });
        };

        const drawPagination = (state, count) => {
            try {
                state.paginationRoot.innerHTML = "";

                const removeAllActives = () => {
                    state.paginationRoot.childNodes.forEach(el => el.classList.remove("active"));
                }

                //Creo el btn first
                var first = document.createElement("li");
                first.className = "page-item";
                first.style.alignSelf = "center";
                first.style.minWidth = "fit-content";
                state.paginationRoot.appendChild(first);
                var firstButton = document.createElement("button");
                firstButton.className = "page-link ventum-pagination-btn";
                firstButton.innerHTML = "Principio";

                if (state.paginationIndex == 0) {
                    firstButton.disabled = true;
                    firstButton.style.color = "grey";
                }
                firstButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.paginationIndex = 0;
                    drawPagination(state, count);
                })
                first.appendChild(firstButton);

                //Creo el btn <<
                var previous = document.createElement("li");
                previous.className = "page-item";
                previous.style.alignSelf = "center";
                previous.style.minWidth = "fit-content";
                state.paginationRoot.appendChild(previous);
                var previousButton = document.createElement("button");
                previousButton.className = "page-link ventum-pagination-btn";
                previousButton.innerHTML = "<<";
                previousButton.style.alignSelf = "center";
                previousButton.style.minWidth = "fit-content";
                if (state.paginationIndex == 0) {
                    previousButton.disabled = true;
                    previousButton.style.color = "grey";
                }
                previousButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.paginationIndex -= 1;
                    drawPagination(state, count);
                });
                previous.appendChild(previousButton);

                //Creo los indices...
                for (let index = state.paginationIndex * 10;
                    (index < count / 10 && index < state.paginationIndex * 10 + 10); index++) {
                    console.log(index);
                    var li = document.createElement("li");
                    li.className = "page-item";
                    li.style.alignSelf = "center";
                    li.style.minWidth = "fit-content";
                    state.paginationRoot.appendChild(li);
                    var button = document.createElement("button");
                    button.className = "page-link ventum-pagination-btn";
                    button.innerHTML = (index + 1).toString();
                    button.style.alignSelf = "center";
                    button.style.minWidth = "fit-content";
                    const i = index;
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        removeAllActives();
                        state.selectedPage = i;
                        state.paginationRoot.childNodes[state.selectedPage % 10 + 2].className += " active";
                        update(state).then(() => console.log("updated")).catch(err => console.log("failed update: " + err));
                    })
                    li.appendChild(button);
                }

                removeAllActives();
                if (state.selectedPage >= state.paginationIndex * 10 && state.selectedPage <= (state.paginationIndex + 1) * 10 && state.paginationRoot.childNodes[state.selectedPage % 10 + 2])
                    state.paginationRoot.childNodes[state.selectedPage % 10 + 2].className += " active";

                //Creo el btn >>
                var next = document.createElement("li");
                next.className = "page-item";
                next.style.alignSelf = "center";
                next.style.minWidth = "fit-content";
                state.paginationRoot.appendChild(next);
                var nextButton = document.createElement("button");
                nextButton.className = "page-link ventum-pagination-btn";
                nextButton.innerHTML = ">>";

                if (Math.trunc(count / 100) == state.paginationIndex) {
                    nextButton.disabled = true;
                    nextButton.style.color = "grey";
                }

                nextButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.paginationIndex += 1;
                    drawPagination(state, count);
                });
                next.appendChild(nextButton);

                //Creo el btn last
                var last = document.createElement("li");
                last.className = "page-item";
                last.style.alignSelf = "center";
                last.style.minWidth = "fit-content";
                state.paginationRoot.appendChild(last);
                var lastButton = document.createElement("button");
                lastButton.className = "page-link ventum-pagination-btn";
                lastButton.innerHTML = "Último";
                if (Math.trunc(count / 100) == state.paginationIndex) {
                    lastButton.disabled = true;
                    lastButton.style.color = "grey";
                }

                lastButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.paginationIndex = Math.trunc(count / 100);
                    drawPagination(state, count);
                })
                last.appendChild(lastButton);

                //Pagina n de N
                var pages = document.createElement("li");
                pages.className = "page-item";
                pages.style["align-self"] = "center";
                pages.style.float = "right";
                pages.innerHTML = `${state.selectedPage + 1} de ${Math.trunc(count/10+ 1) } &nbsp`;
                pages.style.color = "grey";
                pages.style.alignSelf = "center";
                pages.style.minWidth = "fit-content";
                state.paginationRoot.appendChild(pages);

                //Input ir a
                var goToLi = document.createElement("li");
                goToLi.className = "page-item";
                goToLi.style.width = '5%';
                goToLi.style.alignSelf = "center";
                // goToLi.style.minWidth = "fit-content";
                state.paginationRoot.appendChild(goToLi);
                var goTo = document.createElement("input");
                goTo.className = "form-control";
                goTo.style.width = '95%';

                goToLi.appendChild(goTo);
                var goToButton = document.createElement("button");
                goToButton.className = "page-link ventum-pagination-btn";
                goToButton.innerHTML = "Ir";
                goToButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    var page = parseInt(goTo.value, 10);
                    if (page && page < count / 10) {
                        state.selectedPage = page - 1;
                        state.paginationIndex = Math.trunc(state.selectedPage / 10);
                        update(state).then(() => console.log("updated")).catch(err => console.log("failed update: " + err));
                    } else {
                        goTo.value = "";
                    }
                })
                state.paginationRoot.appendChild(goToButton);

                //Agrego los botones del footer
                var divBtns = document.createElement("div");
                divBtns.id = state.id + "-card-footer-div-btns";
                divBtns.className = "pagination ventum-table-footer-ul row";
                divBtns.style.width = "75%";
                //divBtns.style.paddingTop = "10px";
                state.paginationRoot.appendChild(divBtns);

                state.targetedBtns = [];
                var btns = Object.entries(state.footerBtns);
                var btnsCount = 0;
                btns.forEach(([key, value]) => {
                    if (value)
                        btnsCount++;
                });
                console.log("header buttons: " + btnsCount.toString());

                //Si tengo un solo boton agrego uno invisible para correrlo a la derecha
                if (btnsCount == 1) {
                    btns = [
                        [0, {
                            enabled: false,
                            type: "filter",
                            label: "filtrar",
                            onClick: {
                                cmds: {}
                            }
                        }],
                        [1, btns[0][1]]
                    ]
                    btnsCount++;
                }

                btns.forEach(([key, value]) => {
                    if (btnsCount < 4)
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

                    divBtns.appendChild(btnDiv);
                    var btn = buttons.createBtn(value);
                    btnDiv.appendChild(btn);
                    btnDiv.style.alignSelf = "center";
                    btnDiv.style.minWidth = "fit-content";
                    if (!value.enabled) {
                        btn.style.display = "none";
                    }
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        cmd(state, value.onClick.cmds, null, 0);
                    });

                    if (value.targeted) {
                        state.targetedBtns.push(btn);
                        btn.disabled = true;
                    }

                });

            } catch (error) {
                console.log(error);
            }
        };

        const drawRows = (data) => {
            try {

                const getCellValue = (row, path) => {
                    if (row[path[0]] == null) {
                        return null;
                    } else if (path.length > 1) {
                        var temp = path.shift();
                        return getCellValue(row[temp], path);
                    } else {
                        return row[path[0]];
                    }
                }

                console.log("drawRows data: " + JSON.stringify(data));
                console.log("drawRows headers: " + JSON.stringify(state.headers));
                state.rowsRoot.innerHTML = "";

                state.rowsCheckboxs = [];

                data.forEach(row => {
                    var tr = document.createElement("tr");
                    tr.className = "";
                    state.rowsRoot.appendChild(tr);

                    var addCheckbox = false;
                    //Si hay algun boton "targeted" agrego el checkbos a las filas
                    Object.values(state.headerBtns).forEach((btn) => {
                        if (btn.targeted)
                            addCheckbox = true;
                    });
                    if (addCheckbox) {
                        var th = document.createElement("th");
                        var checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.className = "";
                        state.rowsCheckboxs.push(checkbox);
                        checkbox.addEventListener('click', (e) => {
                            updateEditRemoveBtns(state);
                        })
                        th.appendChild(checkbox);
                        tr.appendChild(th);
                    }

                    Object.keys(state.headers).forEach(headerKey => {
                        var th = document.createElement("th");
                        var cellValue = getCellValue(row, state.headers[headerKey].name.split('.'));
                        if(!Number.isNaN(cellValue) && cellValue.length == 14){
                            cellValue = formatValue(cellValue);
                            cellValue = cellValue || state.emptyCellChar;
                            th.innerHTML = cellValue;
                            tr.appendChild(th);
                        } else {
                            cellValue = cellValue || state.emptyCellChar;
                            th.innerHTML = cellValue;
                            tr.appendChild(th);
                        }

                    });
                });
            } catch (error) {
                console.log(error);
            }
        };

        return new Promise((resolve, reject) => {
            state.targetedBtns = [];
            fetchData()
                .then(result => {
                    state.rowsData = result.rows;
                    drawRows(result.rows);
                    drawPagination(state, result.count);
                    resolve("ok");
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    };


    return new Promise((resolve, reject) => {
        //A: Si ya ejecute todos los comandos termino
        if (Object.keys(cmds).length == pos) {
            resolve();
        } else {
            console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);
            var c = null;
            var command = cmds[pos];
            switch (command.type) {
                case "parent-cmd":
                    c = () => parentCmd(state, command.payload, res);
                    break;
                case "filter":
                    c = () => filter(state, command.payload, res);
                    break;
                case "post":
                    c = () => post(state, command.payload, res);
                    break;
                case "modal":
                    c = () => showModal(state, command.payload, res);
                    break;
                    //TODO: CONFIRMATION BOX debería ser un template de modal...
                case "confirmationBox":
                    c = () => confirmationBox(state, command.payload, res);
                    break;
                case "if":
                    c = () => ifCmd(state, command.payload, res);
                    break;
                case "dismiss-modal":
                    c = () => dismissModal(state, command.payload, res);
                    break;
                case "update":
                    c = () => update(state, command.payload, res);
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
    });
};

const create = (newState, path) => {
    try{
        if (newState.type == "table") {
            newState = utils.fillObjWithDflt(newState, dfltState);
            newState.path = path;

            Object.entries(newState.childs).forEach(child => {
                switch (child[1].type) {
                    case "modal":
                        newState.childs[child[0]] = modal.create(child[1], path + "/" + child[0]);
                        break;
                    default:
                        console.log("Error creating table child, incorrect type: " + child[1].type);
                        break;
                }
            });
            //console.log("Table new State: " + JSON.stringify(newState));
            states.push(newState);
            return newState;
        } else {
            console.log("Error creating table, incorrect type: " + newState.type);
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const show = (state, parent) => {
    try {
        const createFilters = () => {
            try {
                var div = document.createElement("div");
                div.id = state.id + "-table-filters";
                div.className = "ventum-table-filters ";
                cardParent.body.appendChild(div);

                state.filterForm = document.createElement("form");
                state.filterForm.id = state.id + "-table-filters-form";
                state.filterForm.className = "ventum-table-filters-form";
                div.appendChild(state.filterForm);

                var formRow = document.createElement("div");
                formRow.id = state.id + "-table-filters-form-row";
                formRow.className = "form-row ventum-table-filters-form-row";
                state.filterForm.appendChild(formRow);

                //TODO modificar para que se puedan poner mas de 5 filtros
                for (let index = 0; index < 5; index++) {
                    var col = document.createElement("div");
                    col.id = state.id + "-table-filters-form-col-" + index.toString();
                    col.className = "col-2";
                    formRow.appendChild(col);
                    if (Object.keys(state.filters).length > index) {
                        var label = document.createElement("label");
                        label.id = state.id + "-table-filters-form-col-" + index.toString() + "-label";
                        label.innerHTML = state.filters[index].label;
                        col.appendChild(label);

                        var inputs = document.createElement("div");
                        inputs.className = "form-row";
                        col.appendChild(inputs);

                        var inputsArray = Object.values(state.filters[index].inputs);
                        inputsArray.forEach(input => {
                            var inputCol = document.createElement("div");
                            switch (inputsArray.length) {
                                case 1:
                                    inputCol.className = "col-12";
                                    break;
                                case 2:
                                    inputCol.className = "col-6";
                                    break;
                                case 3:
                                    inputCol.className = "col-4";
                                    break;
                                case 4:
                                    inputCol.className = "col-3";
                                    break;
                                default:
                                    inputCol.className = "col-12";
                                    break;
                            }
                            inputs.appendChild(inputCol);
                            if (input.type == "dropdown") {

                                var dropdownView = document.createElement("div");
                                dropdownView.className = "dropdown";
                                inputCol.appendChild(dropdownView);

                                var dropdownBtn = document.createElement("button");
                                dropdownBtn.className = "btn btn-secondary dropdown-toggle";
                                dropdownBtn.type = "button";
                                dropdownBtn.id = input.name;
                                dropdownBtn.setAttribute('data-toggle',"dropdown");
                                dropdownBtn.setAttribute('aria-haspopup',"true");
                                dropdownBtn.setAttribute('aria-expanded',"false");
                                dropdownBtn.innerHTML = input.placeholder;
                                dropdownView.appendChild(dropdownBtn);

                                var dropdownMenu = document.createElement("div");
                                dropdownMenu.className = "dropdown-menu";
                                dropdownMenu.setAttribute('aria-labelledby',input.name);
                                dropdownView.appendChild(dropdownMenu);

                                Object.values(input.options).forEach(option => {
                                    var dropdownLink = document.createElement("button");
                                    dropdownLink.href = "#";
                                    dropdownLink.innerHTML = option;
                                    dropdownMenu.appendChild(dropdownLink);
                                });


                            } else {
                                var field = document.createElement("input");
                                field.ishoveredin = "0";
                                field.isfocusedin = "0";
                                field.name = input.name;
                                field.type = input.type;
                                field.className = "form-control";
                                field.placeholder = input.placeholder;
                                field.value = input.value;
                                field.required = input.required;
                                inputCol.appendChild(field);
                            }
                        });
                    }

                }

                //Dibujo columna con los botones del header
                var col = document.createElement("div");
                col.id = state.id + "-table-filters-form-col-" + "6";
                col.className = "col-2";
                col.style.textAlign = "center";
                formRow.appendChild(col);
                var label = document.createElement("label");
                label.id = state.id + "-table-filters-form-col-" + "submit" + "-label";
                label.innerHTML = "  &nbsp";
                label.style.position = "relative";
                label.style.width = '100%';
                col.appendChild(label);

                var inputs = document.createElement("div");
                inputs.className = "form-row";
                col.appendChild(inputs);

                //Dibujo cada boton del header
                var btns = Object.entries(state.headerBtns);
                var btnsCount = 0;
                btns.forEach(([key, value]) => {
                    if (value)
                        btnsCount++;
                });
                console.log("header buttons: " + btnsCount.toString());
                state.targetedBtns = [];
                btns.forEach(([key, value]) => {
                    if (value.enabled) {
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
                            default:
                                btnDiv.className += "col-12";
                                break;
                        }
                        inputs.appendChild(btnDiv);
                        var btn = buttons.createBtn(value);
                        btnDiv.appendChild(btn);
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            cmd(state, value.onClick.cmds, null, 0);
                        });

                        if (value.targeted) {
                            state.targetedBtns.push(btn);
                            btn.disabled = true;
                        }
                    }
                });

                return div;
            } catch (error) {
                console.log(error);
                throw error;
            }

        };
        const createContent = () => {
            try {
                var table = document.createElement("table");
                table.id = state.id + "-table-content";
                //Ahora uso table-sm pero deberÃ­a adaptarse a la contenedor...
                table.className = "table table-sm table-striped table-hover ventum-table-content";
                cardParent.body.appendChild(table);

                //Creo los headers
                var thead = document.createElement("thead");
                thead.id = state.id + "-table-headers";
                thead.className = "thead-dark";
                table.appendChild(thead);
                var tr = document.createElement("tr");
                tr.id = state.id + "-table-headers-tr";
                tr.className = "";
                thead.appendChild(tr);

                Object.keys(state.headers).forEach(key => {
                    var th = document.createElement("th");
                    th.id = state.id + "-table-headers-th";
                    th.className = "";
                    th.innerHTML = state.headers[key].label;
                    thead.appendChild(th);
                });

                //Creo las filas
                var tbody = document.createElement("tbody");
                tbody.id = state.id + "-table-body";
                tbody.className = "";
                state.rowsRoot = tbody;
                table.appendChild(tbody);

                return table;
            } catch (error) {
                console.log(error);
                throw error;
            }

        };
        const createFooter = () => {
            try {
                var nav = document.createElement("nav");
                nav.id = state.id + "-card-footer-nav";
                nav.className = "ventum-table-footer";
                cardParent.footer.appendChild(nav);

                var ul = document.createElement("ul");
                ul.id = state.id + "-card-footer-ul";
                ul.className = "pagination ventum-table-footer-ul";
                nav.appendChild(ul);
                state.paginationRoot = ul;
                return nav;
            } catch (error) {
                console.log(error);
                throw error;
            }

        };

        console.log("Table show: " + JSON.stringify(state));
        const cardParent = card.create({ title: state.title }, parent);

        createFilters();
        createContent();
        createFooter();

        cmd(state, { 0: { type: "update", payload: {} } }, null, 0);

    } catch (error) {
        console.log("failed to show table: " + error.toString());
    }

};

export default { create, show, cmd};
