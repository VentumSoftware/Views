import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';

const dfltState = {
    id: "noID",
    title: "Table",
    fetchPath: "/api/aggregate",
    headers: {},
    filters: {},
    filterButtons: {
        filter: true,
        erase: true,
        edit: true,
        add: true,
    },
    initialStages: {},
    finalStages: {},
    footerButtons: {},
    rows: [],
    selectedRows: [],
    emptyCellChar: "-",
    selectedPage: 0,
    paginationIndex: 0,
};

var states = [];

const getRows = (state) => {

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
                            case "date":
                                value = formatDateToQuery(value);
                                break;
                            default:
                                break;
                        }
                        var op = "";
                        switch (typeof(stageDef.op)) {
                            case 'string':
                                op = `{"${stageDef.op}":"${value}"}`;
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
    var filters = getFiltersValues(state);
    var pipeline = buildPipeline(filters);

    return new Promise((resolve, reject) => {
        const options = `{"collation":{"locale":"en_US","numericOrdering":true}}`;
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

const getCount = (state) => {
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
                            case "date":
                                value = formatDateToQuery(value);
                                break;
                            default:
                                break;
                        }
                        var op = "";
                        switch (typeof(stageDef.op)) {
                            case 'string':
                                op = `{"${stageDef.op}":"${value}"}`;
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
    var filters = getFiltersValues(state);
    var pipeline = buildPipeline(filters);

    return new Promise((resolve, reject) => {
        const options = `{"collation":{"locale":"en_US","numericOrdering":true}}`;
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

const fetchData = (state) => {
    return new Promise((resolve, reject) => {
        var result = {};
        getRows(state)
            .then(rows => {
                result.rows = rows;
                return getCount(state);
            })
            .then(count => {
                result.count = count[0].count;
                resolve(result);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//--------------------------------------------------------------------------------------------

const formatDateToQuery = (date) => {
    var dateToFormat = date.split("-");
    dateToFormat = dateToFormat[0] + dateToFormat[1] + dateToFormat[2];
    return (dateToFormat[0] + dateToFormat[1] + dateToFormat[2]);
};

const getFiltersValues = (state) => {
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

//----------------------------------------------------------------------------------------------

const addNewElement = () => {

};

const eraseSelectedRows = () => {

};

const editSelectedRows = () => {

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
        state.paginationRoot.appendChild(previous);
        var previousButton = document.createElement("button");
        previousButton.className = "page-link ventum-pagination-btn";
        previousButton.innerHTML = "<<";
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
            state.paginationRoot.appendChild(li);
            var button = document.createElement("button");
            button.className = "page-link ventum-pagination-btn";
            button.innerHTML = (index + 1).toString();
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
        if (state.selectedPage >= state.paginationIndex * 10 && state.selectedPage <= (state.paginationIndex + 1) * 10)
            state.paginationRoot.childNodes[state.selectedPage % 10 + 2].className += " active";

        //Creo el btn >>
        var next = document.createElement("li");
        next.className = "page-item";
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
        state.paginationRoot.appendChild(pages);

        //Input ir a
        var goToLi = document.createElement("li");
        goToLi.className = "page-item";
        goToLi.style.width = '5%';
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
    } catch (error) {
        console.log(error);
    }
};

const drawRows = (state, data) => {
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

        data.forEach(row => {
            var tr = document.createElement("tr");
            tr.className = "";
            state.rowsRoot.appendChild(tr);

            if (true) {
                var th = document.createElement("th");
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "";
                th.appendChild(checkbox);
                tr.appendChild(th);
            }

            Object.keys(state.headers).forEach(headerKey => {
                var th = document.createElement("th");
                var cellValue = getCellValue(row, state.headers[headerKey].name.split('.'));
                cellValue = cellValue || state.emptyCellChar;
                th.innerHTML = cellValue;
                tr.appendChild(th);
            });
        });
    } catch (error) {
        console.log(error);
    }
};

const update = (state) => {
    return new Promise((resolve, reject) => {
        fetchData(state)
            .then(result => {
                drawRows(state, result.rows);
                drawPagination(state, result.count);
                resolve("ok");
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

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

    const createFilters = () => {
        var div = document.createElement("div");
        div.id = newState.id + "-table-filters";
        div.className = "ventum-table-filters ";
        cardParent.body.appendChild(div);

        newState.filterForm = document.createElement("form");
        newState.filterForm.id = newState.id + "-table-filters-form";
        newState.filterForm.className = "ventum-table-filters-form";
        div.appendChild(newState.filterForm);

        var formRow = document.createElement("div");
        formRow.id = newState.id + "-table-filters-form-row";
        formRow.className = "form-row ventum-table-filters-form-row";
        newState.filterForm.appendChild(formRow);

        //TODO modificar para que se puedan poner mas de 5 filtros
        for (let index = 0; index < 5; index++) {
            var col = document.createElement("div");
            col.id = newState.id + "-table-filters-form-col-" + index.toString();
            col.className = "col-2";
            formRow.appendChild(col);
            if (Object.keys(newState.filters).length > index) {
                var label = document.createElement("label");
                label.id = newState.id + "-table-filters-form-col-" + index.toString() + "-label";
                label.innerHTML = newState.filters[index].label;
                col.appendChild(label);

                var inputs = document.createElement("div");
                inputs.className = "form-row";
                col.appendChild(inputs);

                var inputsArray = Object.values(newState.filters[index].inputs);
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
                });
            }

        }
        var col = document.createElement("div");
        col.id = newState.id + "-table-filters-form-col-" + "6";
        col.className = "col-2";
        col.style.textAlign = "center";
        formRow.appendChild(col);
        var label = document.createElement("label");
        label.id = newState.id + "-table-filters-form-col-" + "submit" + "-label";
        label.innerHTML = "  &nbsp";
        label.style.position = "relative";
        label.style.width = '100%';
        col.appendChild(label);

        var inputs = document.createElement("div");
        inputs.className = "form-row";
        col.appendChild(inputs);

        var btns = Object.entries(newState.filterButtons);
        var btnsCount = 0;
        btns.forEach(([key, value]) => {
            if (value)
                btnsCount++;
        });
        console.log("btncount: " + btnsCount.toString());
        btns.forEach(([key, value]) => {
            if (value) {
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

                var btn = document.createElement("button");
                btn.type = "submit";
                btn.style.position = "relative";
                btn.style.width = '100%';
                btn.style.overflowWrap = "normal";


                //<i class="fa fa-home"></i>
                btnDiv.appendChild(btn);

                switch (key) {
                    case "filter":
                        btn.className = "btn btn-secondary";
                        if (btnsCount <= 3)
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
                        break;
                    case "erase":
                        btn.className = "btn btn-danger";
                        if (btnsCount <= 3)
                            btn.innerHTML = "Borrar";
                        btn.value = "submit";
                        btn.disabled = true;
                        var icon = document.createElement("i");
                        icon.className = "fa fa-trash";
                        btn.appendChild(icon);
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            eraseSelectedRows();
                        });
                        break;
                    case "edit":
                        btn.className = "btn btn-primary";
                        if (btnsCount <= 3)
                            btn.innerHTML = "Editar";
                        btn.value = "submit";
                        btn.disabled = true;
                        var icon = document.createElement("i");
                        icon.className = "fa fa-pencil";
                        btn.appendChild(icon);
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            editSelectedRows();
                        });
                        break;
                    case "add":
                        btn.className = "btn btn-success";
                        if (btnsCount <= 3)
                            btn.innerHTML = "Agregar";
                        btn.value = "submit";
                        var icon = document.createElement("i");
                        icon.className = "fa fa-plus";
                        btn.appendChild(icon);
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            addNewElement();
                        });
                        break;
                    default:
                        break;
                }


            }
        });

        // if (newState.filterButtons.filter) {
        //     var btn = document.createElement("button");
        //     btn.type = "submit";
        //     btn.className = "btn btn-success";
        //     btn.value = "submit";
        //     btn.innerHTML = "Filtrar";
        //     btn.style.position = "relative";
        //     btn.style.width = '95%';

        //     col.appendChild(btn);
        // }

        // btn.addEventListener('click', (e) => {
        //     e.preventDefault();
        //     newState.selectedPage = 0;
        //     newState.paginationIndex = 0;
        //     update(newState).then(() => console.log("updated")).catch(err => console.log("failed update: " + err));
        // });

        return div;
    };
    const createContent = () => {
        var table = document.createElement("table");
        table.id = newState.id + "-table-content";
        //Ahora uso table-sm pero deberÃ­a adaptarse a la contenedor...
        table.className = "table table-sm table-striped table-hover ventum-table-content";
        cardParent.body.appendChild(table);

        //Creo los headers
        var thead = document.createElement("thead");
        thead.id = newState.id + "-table-headers";
        thead.className = "thead-dark";
        table.appendChild(thead);
        var tr = document.createElement("tr");
        tr.id = newState.id + "-table-headers-tr";
        tr.className = "";
        thead.appendChild(tr);

        if (true) {
            var th = document.createElement("th");
            th.id = newState.id + "-table-headers-th";
            th.className = "";
            th.innerHTML = " &nbsp";
            thead.appendChild(th);
        }

        Object.keys(newState.headers).forEach(key => {
            var th = document.createElement("th");
            th.id = newState.id + "-table-headers-th";
            th.className = "";
            th.innerHTML = newState.headers[key].label;
            thead.appendChild(th);
        });

        //Creo las filas
        var tbody = document.createElement("tbody");
        tbody.id = newState.id + "-table-body";
        tbody.className = "";
        newState.rowsRoot = tbody;
        table.appendChild(tbody);

        return table;
    };
    const createFooter = () => {
        var nav = document.createElement("nav");
        nav.id = newState.id + "-card-footer-nav";
        nav.className = "ventum-table-footer";
        cardParent.footer.appendChild(nav);

        var ul = document.createElement("ul");
        ul.id = newState.id + "-card-footer-ul";
        ul.className = "pagination ventum-table-footer-ul";
        nav.appendChild(ul);
        newState.paginationRoot = ul;

        return nav;
    };

    var newState = utils.fillObjWithDflt(data, dfltState);
    const cardParent = card.create({ title: newState.title }, parent);

    var filters = createFilters();
    var content = createContent();
    var footer = createFooter();

    console.log("states: " + states.push(newState).toString());

    update(newState)
        .then(res => console.log(`Tabla creada y updeteada: ${res}`))
        .catch(err => console.log(`Tabla creada y err: ${err}`));

    return newState;
};

export default { create, resetStates };