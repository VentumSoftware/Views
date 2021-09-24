//Dflt Dashboards State
var dfltState = {
    headers: {},
    rows: {},
    maxCharsPerCell: 20,
    emptyCellChar: "-",
};

export default { dfltState}
//getRows, update, setRowCheckbox, getRowCheckbox, getAllCheckboxs, updateHeaderBtns };


// var old = {
// Función que dibuja al componente (table)
// var render = (state, parent) => {
//     const createHeader = () => {
//         var div = document.createElement("div");
//         div.id = state.id + "-table-filters";
//         div.className = "ventum-table-filters ";
//         cardParent.body.appendChild(div);

//         state.filterForm = document.createElement("form");
//         state.filterForm.id = state.id + "-table-filters-form";
//         state.filterForm.className = "ventum-table-filters-form";
//         div.appendChild(state.filterForm);

//         var formRow = document.createElement("div");
//         formRow.id = state.id + "-table-filters-form-row";
//         formRow.className = "form-row ventum-table-filters-form-row";
//         state.filterForm.appendChild(formRow);

//         TODO modificar para que se puedan poner mas de 5 filtros
//         for (let index = 0; index < 5; index++) {
//             var col = document.createElement("div");
//             col.id = state.id + "-table-filters-form-col-" + index.toString();
//             col.className = "col-2";
//             formRow.appendChild(col);
//             if (Object.keys(state.filters).length > index) {
//                 var label = document.createElement("label");
//                 label.id = state.id + "-table-filters-form-col-" + index.toString() + "-label";
//                 label.innerHTML = state.filters[index].label;
//                 col.appendChild(label);

//                 var inputs = document.createElement("div");
//                 inputs.className = "form-row";
//                 col.appendChild(inputs);

//                 var inputsArray = Object.values(state.filters[index].inputs);
//                 inputsArray.forEach(input => {
//                     var inputCol = document.createElement("div");
//                     switch (inputsArray.length) {
//                         case 1:
//                             inputCol.className = "col-12";
//                             break;
//                         case 2:
//                             inputCol.className = "col-6";
//                             break;
//                         case 3:
//                             inputCol.className = "col-4";
//                             break;
//                         case 4:
//                             inputCol.className = "col-3";
//                             break;
//                         default:
//                             inputCol.className = "col-12";
//                             break;
//                     }
//                     inputs.appendChild(inputCol);
//                     if (input.type == "dropdown") {

//                         var dropdownView = document.createElement("div");
//                         dropdownView.className = "dropdown";
//                         inputCol.appendChild(dropdownView);

//                         var dropdownBtn = document.createElement("button");
//                         dropdownBtn.className = "btn btn-secondary dropdown-toggle";
//                         dropdownBtn.type = "button";
//                         dropdownBtn.id = input.name;
//                         dropdownBtn.setAttribute('data-toggle', "dropdown");
//                         dropdownBtn.setAttribute('aria-haspopup', "true");
//                         dropdownBtn.setAttribute('aria-expanded', "false");
//                         dropdownBtn.innerHTML = input.placeholder;
//                         dropdownView.appendChild(dropdownBtn);

//                         var dropdownMenu = document.createElement("div");
//                         dropdownMenu.className = "dropdown-menu";
//                         dropdownMenu.setAttribute('aria-labelledby', input.name);
//                         dropdownView.appendChild(dropdownMenu);

//                         Object.values(input.options).forEach(option => {
//                             var dropdownLink = document.createElement("button");
//                             dropdownLink.href = "#";
//                             dropdownLink.innerHTML = option;
//                             dropdownMenu.appendChild(dropdownLink);
//                         });


//                     } else {
//                         var field = document.createElement("input");
//                         field.ishoveredin = "0";
//                         field.isfocusedin = "0";
//                         field.name = input.name;
//                         field.type = input.type;
//                         field.className = "form-control";
//                         field.placeholder = input.placeholder;
//                         field.value = input.value;
//                         field.required = input.required;
//                         inputCol.appendChild(field);
//                     }
//                 });
//             }
//         }

//         Dibujo columna con los botones del header
//         var col = document.createElement("div");
//         col.id = state.id + "-table-filters-form-col-" + "6";
//         col.className = "col-2";
//         col.style.textAlign = "left";
//         formRow.appendChild(col);
//         var label = document.createElement("label");
//         label.id = state.id + "-table-filters-form-col-" + "submit" + "-label";
//         label.innerHTML = "  &nbsp";
//         label.style.position = "relative";
//         label.style.width = '100%';
//         label.style.height = '50%';
//         label.style.margin = 0;
//         col.appendChild(label);

//         var inputs = document.createElement("div");
//         inputs.className = "form-row";
//         inputs.style.height = '50%';
//         col.appendChild(inputs);

//         Dibujo cada boton del header
//         var btns = Object.entries(state.headerBtns);
//         var btnsCount = btns.length;
//         console.log("header buttons: " + btnsCount.toString());

//         state.html.headerBtns = [];
//         btns.forEach(([key, value]) => {
//             value = state.childs[value];
//             value.showLabel = false;
//             value.height = "100%";

//             var btnDiv = document.createElement("div");
//             switch (btnsCount) {
//                 case 1:
//                     btnDiv.className += "col-12";
//                     break;
//                 case 2:
//                     btnDiv.className += "col-6";
//                     break;
//                 case 3:
//                     btnDiv.className += "col-4";
//                     break;
//                 case 4:
//                     btnDiv.className += "col-3";
//                     break;
//                 default:
//                     btnDiv.className += "col-12";
//                     break;
//             }
//             inputs.appendChild(btnDiv);
//             var btn = button.render(value, btnDiv);
//             state.html.headerBtns.push(btn.btn);
//         });

//         views.onEvent(state, "onRender", state.onRender);
//         return div;
//     };
//     const createContent = () => {
//         var table = document.createElement("table");
//         table.id = state.id + "-table-content";
//         Ahora uso table-sm pero deberÃ­a adaptarse a la contenedor...
//         table.className = "table table-sm table-striped table-hover ventum-table-content";
//         cardParent.body.appendChild(table);

//         Creo los headers
//         var thead = document.createElement("thead");
//         thead.id = state.id + "-table-headers";
//         thead.className = "thead-dark";
//         table.appendChild(thead);

//         Object.keys(state.headers).forEach(key => {
//             var th = document.createElement("th");
//             th.id = state.id + "-table-headers-th";
//             th.className = "";
//             th.innerHTML = state.headers[key].label;
//             thead.appendChild(th);
//         });

//         Creo las filas
//         var tbody = document.createElement("tbody");
//         tbody.id = state.id + "-table-body";
//         tbody.className = "";
//         state.html.rowsRoot = tbody;
//         table.appendChild(tbody);

//         return table;


//     };
//     const createFooter = () => {
//         var nav = document.createElement("nav");
//         nav.id = state.id + "-card-footer-nav";
//         nav.className = "ventum-table-footer";
//         cardParent.footer.appendChild(nav);

//         var ul = document.createElement("ul");
//         ul.id = state.id + "-card-footer-ul";
//         ul.className = "pagination ventum-table-footer-ul";
//         nav.appendChild(ul);
//         state.paginationRoot = ul;
//         return nav;
//     };

//     views.onEvent(state, "onBeforeRender", state.onBeforeRender);

//     state.html = {}; // Borro las referencias anteriores al documento
//     console.log("Table show: " + JSON.stringify(state));
//     const cardParent = card.create({ title: state.title }, parent);

//     createHeader();
//     createContent();
//     createFooter();
//     update(state);

//     views.onEvent(state, "onRender", state.onRender);

//     return state;
// };

// var getRows = (state) => {
//     return new Promise((resolve, reject) => {
//         resolve(state.inputs);
//     });
// };

// var setRowCheckbox = (state, check = true, row, col) => {
//     var rowsCheckboxs = state.html.rowsCheckboxs || {};
//     row = Object.values(rowsCheckboxs)[row];
//     var cell = row[col.name || col];
//     cell.value = check;
//     return cell;
// };

// var getRowCheckbox = (state, row, col) => {
//     var rowsCheckboxs = state.html.rowsCheckboxs || {};
//     row = Object.values(rowsCheckboxs)[row];
//     var cell = row[col.name || col];
//     return cell;
// };

// var getAllCheckboxs = (state) => {
//     return state.html.rowsCheckboxs || {};
// };

// var setAllRowsCheckboxs = (state, check = true) => {
//     var rowsCheckboxs = state.html.rowsCheckboxs || {};
//     Object.values(rowsCheckboxs).forEach(row => {
//         Object.values(row).forEach(checkbox => {
//             checkbox.checked = check;
//         });
//     });
// };

// var updateHeaderBtns = (state) => {
//     Object.values(state.headerBtns).forEach(btn => {
//         btn = state.childs[btn];
//         button.update(btn);
//     });
// };

// Updates table data and view
// var update = (state) => {

//     const drawRows = (state) => {
//         try {

//             const getCellValue = (row, path) => {
//                 try {
//                     if (row[path[0]] == null) {
//                         return null;
//                     } else if (path.length > 1) {
//                         var temp = path.shift();
//                         return getCellValue(row[temp], path);
//                     } else {
//                         return row[path[0]];
//                     }
//                 } catch (error) {
//                     console.log(error);
//                     throw "Failed to getCellValue";
//                 }

//             }

//             console.log("drawRows data: " + JSON.stringify(state));
//             console.log("drawRows headers: " + JSON.stringify(state.headers));

//             Borro lo anterior
//             state.html.rowsRoot.innerHTML = "";
//             state.html.rowsCheckboxs = {};
//             var i = 0;
//             state.rows.forEach(row => {

//                 var tr = document.createElement("tr");
//                 tr.className = "";
//                 state.html.rowsRoot.appendChild(tr);

//                 state.html.rowBtns = [];

//                 state.html.rowsCheckboxs[tr.rowIndex] = {};
//                 Object.keys(state.headers).forEach(headerKey => {
//                     var th = document.createElement("th");

//                     if (state.headers[headerKey].type === "button") {
//                         var value = state.headers[headerKey].btn;
//                         var btn = button.render(value, th);
//                         state.html.rowBtns.push(btn.btn);
//                     } else if (state.headers[headerKey].type === "checkbox") {
//                         var th = document.createElement("th");
//                         var checkbox = document.createElement("input");
//                         checkbox.type = "checkbox";
//                         checkbox.className = "";

//                         var r = i;
//                         var c = headerKey;

//                         checkbox.addEventListener('click', (e) => {
//                             views.onEvent(state, "checkboxClick", state.onRowCheckboxClick, { row: r, col: c });
//                         });

//                         var c = headerKey;
//                         state.html.rowsCheckboxs[tr.rowIndex][c] = checkbox;
//                         th.appendChild(checkbox);
//                         tr.appendChild(th);
//                     } else {
//                         var header = state.headers[headerKey];
//                         var cellValue = null;
//                         if (header.transform)
//                             views.onEvent(state, "rowTransform", header.transform, row)
//                                 .then(cell => {
//                                     cellValue = cell
//                                     cellValue = cellValue || state.emptyCellChar;
//                                     if (!isNaN(cellValue)) cellValue = cellValue.toString();

//                                     if (cellValue.length > state.maxCharsPerCell)
//                                         cellValue = cellValue.substr(0, state.maxCharsPerCell) + "...";
//                                     th.innerHTML = cellValue;
//                                 });
//                         else {
//                             cellValue = getCellValue(row, header.name.split('.'));
//                             cellValue = cellValue || state.emptyCellChar;
//                             if (!isNaN(cellValue)) cellValue = cellValue.toString();

//                             if (cellValue.length > state.maxCharsPerCell)
//                                 cellValue = cellValue.substr(0, state.maxCharsPerCell) + "...";
//                             th.innerHTML = cellValue;
//                         }



//                     }
//                     tr.appendChild(th);
//                 });
//                 i++;
//             });
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const drawPagination = (state) => {
//         try {
//             state.paginationRoot.innerHTML = "";

//             const removeAllActives = () => {
//                 state.paginationRoot.childNodes.forEach(el => el.classList.remove("active"));
//             }

//             Creo el btn first
//             var first = document.createElement("li");
//             first.className = "page-item";
//             first.style.alignSelf = "center";
//             first.style.minWidth = "fit-content";
//             state.paginationRoot.appendChild(first);
//             var firstButton = document.createElement("button");
//             firstButton.className = "page-link ventum-pagination-btn";
//             firstButton.innerHTML = "Principio";

//             if (state.paginationIndex == 0) {
//                 firstButton.disabled = true;
//                 firstButton.style.color = "grey";
//             }
//             firstButton.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 state.paginationIndex = 0;
//                 drawPagination(state);
//             })
//             first.appendChild(firstButton);

//             Creo el btn <<
//             var previous = document.createElement("li");
//             previous.className = "page-item";
//             previous.style.alignSelf = "center";
//             previous.style.minWidth = "fit-content";
//             state.paginationRoot.appendChild(previous);
//             var previousButton = document.createElement("button");
//             previousButton.className = "page-link ventum-pagination-btn";
//             previousButton.innerHTML = "<<";
//             previousButton.style.alignSelf = "center";
//             previousButton.style.minWidth = "fit-content";
//             if (state.paginationIndex == 0) {
//                 previousButton.disabled = true;
//                 previousButton.style.color = "grey";
//             }
//             previousButton.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 state.paginationIndex -= 1;
//                 drawPagination(state);
//             });
//             previous.appendChild(previousButton);

//             Creo los indices...
//             for (let index = state.paginationIndex * 10;
//                 (index < state.count / 10 && index < state.paginationIndex * 10 + 10); index++) {
//                 var li = document.createElement("li");
//                 li.className = "page-item";
//                 li.style.alignSelf = "center";
//                 li.style.minWidth = "fit-content";
//                 state.paginationRoot.appendChild(li);
//                 var button = document.createElement("button");
//                 button.className = "page-link ventum-pagination-btn";
//                 button.innerHTML = (index + 1).toString();
//                 button.style.alignSelf = "center";
//                 button.style.minWidth = "fit-content";
//                 const i = index;
//                 button.addEventListener('click', (e) => {
//                     e.preventDefault();
//                     removeAllActives();
//                     state.selectedPage = i;
//                     state.paginationRoot.childNodes[state.selectedPage % 10 + 2].className += " active";
//                     update(state);
//                 })
//                 li.appendChild(button);
//             }

//             removeAllActives();
//             if (state.selectedPage >= state.paginationIndex * 10 && state.selectedPage <= (state.paginationIndex + 1) * 10 && state.paginationRoot.childNodes[state.selectedPage % 10 + 2])
//                 state.paginationRoot.childNodes[state.selectedPage % 10 + 2].className += " active";

//             Creo el btn >>
//             var next = document.createElement("li");
//             next.className = "page-item";
//             next.style.alignSelf = "center";
//             next.style.minWidth = "fit-content";
//             state.paginationRoot.appendChild(next);
//             var nextButton = document.createElement("button");
//             nextButton.className = "page-link ventum-pagination-btn";
//             nextButton.innerHTML = ">>";

//             if (Math.trunc(state.count / 100) == state.paginationIndex) {
//                 nextButton.disabled = true;
//                 nextButton.style.color = "grey";
//             }

//             nextButton.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 state.paginationIndex += 1;
//                 drawPagination(state);
//             });
//             next.appendChild(nextButton);

//             Creo el btn last
//             var last = document.createElement("li");
//             last.className = "page-item";
//             last.style.alignSelf = "center";
//             last.style.minWidth = "fit-content";
//             state.paginationRoot.appendChild(last);
//             var lastButton = document.createElement("button");
//             lastButton.className = "page-link ventum-pagination-btn";
//             lastButton.innerHTML = "Último";
//             if (Math.trunc(state.count / 100) == state.paginationIndex) {
//                 lastButton.disabled = true;
//                 lastButton.style.color = "grey";
//             }

//             lastButton.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 state.paginationIndex = Math.trunc(state.count / 100);
//                 drawPagination(state);
//             })
//             last.appendChild(lastButton);

//             Pagina n de N
//             var pages = document.createElement("li");
//             pages.className = "page-item";
//             pages.style["align-self"] = "center";
//             pages.style.float = "right";
//             pages.innerHTML = `${state.selectedPage + 1} de ${Math.max(Math.trunc(state.count / 10), 1)} &nbsp`;
//             pages.style.color = "grey";
//             pages.style.alignSelf = "center";
//             pages.style.minWidth = "fit-content";
//             state.paginationRoot.appendChild(pages);

//             Input ir a
//             var goToLi = document.createElement("li");
//             goToLi.className = "page-item";
//             goToLi.style.width = '5%';
//             goToLi.style.alignSelf = "center";
//             goToLi.style.minWidth = "fit-content";
//             state.paginationRoot.appendChild(goToLi);
//             var goTo = document.createElement("input");
//             goTo.className = "form-control";
//             goTo.style.width = '95%';

//             goToLi.appendChild(goTo);
//             var goToButton = document.createElement("button");
//             goToButton.className = "page-link ventum-pagination-btn";
//             goToButton.innerHTML = "Ir";
//             goToButton.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 var page = parseInt(goTo.value, 10);
//                 if (page && page < state.count / 10) {
//                     state.selectedPage = page - 1;
//                     state.paginationIndex = Math.trunc(state.selectedPage / 10);
//                     update(state);
//                 } else {
//                     goTo.value = "";
//                 }
//             })
//             state.paginationRoot.appendChild(goToButton);

//             Agrego los botones del footer
//             var divBtns = document.createElement("div");
//             divBtns.id = state.id + "-card-footer-div-btns";
//             divBtns.className = "pagination ventum-table-footer-ul row";
//             divBtns.style.width = "75%";
//             divBtns.style.paddingTop = "10px";
//             state.paginationRoot.appendChild(divBtns);


//             var btns = Object.entries(state.footerBtns);
//             var btnsCount = 0;
//             btns.forEach(([key, value]) => {
//                 if (value)
//                     btnsCount++;
//             });
//             console.log("header button: " + btnsCount.toString());

//             Si tengo un solo boton agrego uno invisible para correrlo a la derecha
//             if (btnsCount == 1) {
//                 btns = [
//                     [0, {
//                         enabled: false,
//                         type: "filter",
//                         label: "filtrar",
//                         onClick: {
//                             msgs: {}
//                         }
//                     }],
//                     [1, btns[0][1]]
//                 ]
//                 btnsCount++;
//             }

//             btns.forEach(([key, value]) => {
//                 if (btnsCount < 4)
//                     value.showLabel = true;
//                 else
//                     value.showLabel = false;

//                 var btnDiv = document.createElement("div");

//                 switch (btnsCount) {
//                     case 1:
//                         btnDiv.className += "col-12";
//                         break;
//                     case 2:
//                         btnDiv.className += "col-6";
//                         break;
//                     case 3:
//                         btnDiv.className += "col-4";
//                         break;
//                     case 4:
//                         btnDiv.className += "col-3";
//                         break;
//                     case 5:
//                         btnDiv.className += "col-2";
//                         break;
//                     case 6:
//                         btnDiv.className += "col-2";
//                         break;
//                     default:
//                         btnDiv.className += "col-12";
//                         break;
//                 }

//                 divBtns.appendChild(btnDiv);
//                 button.render(value, btnDiv);

//             });

//         } catch (error) {
//             console.log(error);
//         }
//     };

//     views.onEvent(state, "onBeforeUpdate", state.onBeforeUpdate)
//         .then(res => {
//             updateHeaderBtns(state);
//             drawRows(state);
//             drawPagination(state);
//             setAllRowsCheckboxs(state, false);
//             return views.onEvent(state, "onUpdate", state.onUpdate);
//         });
// };
// }


