import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import table from 'https://ventumdashboard.s3.amazonaws.com/dashboard/table/table.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';

//--------------------------------- Dashboard --------------------------------------------

const dfltState = {
    contentDiv: null, //Contenedor donde voy a dibujar cada pantalla...
    id: "id",
    company: {
        name: "CompanyName"
    },
    user: {
        name: "UserName",
    },
    categories: {
        // URBETRACK: {
        //     name: "URBETRACK",
        //     access: {
        //         names: ["URBE", "Admin"],
        //         roles: ["Admin"]
        //     },
        //     content: {
        //         rows: {
        //             //Rows
        //             0: {
        //                 cols: {
        //                     //Columns
        //                     0: {
        //                         //Columns elements
        //                         0: {
        //                             type: "table",
        //                             payload: {
        //                                 title: "URBE",
        //                                 fetchPath: "/api/aggregate/Masterbus-IOT/urbe",
        //                                 headers: {
        //                                     Fecha: "Fecha",
        //                                     Mensaje: "Mensaje",
        //                                     Codigo: "Código",
        //                                     Latitud: "Latitud",
        //                                     Longitud: "Longitud",
        //                                     Interno: "Interno",
        //                                     Patente: "Patente",
        //                                 },
        //                                 filters: [{
        //                                         label: "Desde",
        //                                         inputs: {
        //                                             desde: {
        //                                                 name: "desde",
        //                                                 type: "date",
        //                                                 placeholder: "Desde",
        //                                                 value: "",
        //                                                 required: "",
        //                                             }
        //                                         }
        //                                     },
        //                                     {
        //                                         label: "Hasta",
        //                                         inputs: {
        //                                             hasta: {
        //                                                 name: "hasta",
        //                                                 type: "date",
        //                                                 placeholder: "Hasta",
        //                                                 value: "",
        //                                                 required: "",
        //                                             }
        //                                         }
        //                                     },
        //                                     {
        //                                         label: "Código",
        //                                         codigo: {
        //                                             id: {
        //                                                 name: "codigo",
        //                                                 type: "text",
        //                                                 placeholder: "código",
        //                                                 value: "",
        //                                                 required: "",
        //                                             }
        //                                         }
        //                                     },
        //                                     {
        //                                         label: "Interno",
        //                                         inputs: {
        //                                             desde: {
        //                                                 name: "interno",
        //                                                 type: "number",
        //                                                 placeholder: "interno",
        //                                                 value: "",
        //                                                 required: "",
        //                                             }
        //                                         }
        //                                     },
        //                                     {
        //                                         label: "Patente",
        //                                         inputs: {
        //                                             Patente: {
        //                                                 name: "aceleracion-desde",
        //                                                 type: "number",
        //                                                 placeholder: "patente",
        //                                                 value: "",
        //                                                 required: "",
        //                                             }
        //                                         }
        //                                     }
        //                                 ],
        //                                 rows: [],
        //                                 emptyCellChar: "-",
        //                                 selectedPage: 0,
        //                                 paginationIndex: 0,
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         },
        //     }
        // },
        // INTI: {
        //     name: "INTI",
        //     access: {
        //         names: ["INTI", "Admin"],
        //         roles: ["Admin"]
        //     },
        //     content: {
        //         rows: [{
        //             cols: [
        //                 [{
        //                     type: "table",
        //                     payload: {
        //                         title: "URBE",
        //                         fetchPath: "/api/aggregate/Masterbus-IOT/urbe",
        //                         headers: {
        //                             Fecha: "Fecha",
        //                             Mensaje: "Mensaje",
        //                             Codigo: "Código",
        //                             Latitud: "Latitud",
        //                             Longitud: "Longitud",
        //                             Interno: "Interno",
        //                             Patente: "Patente",
        //                         },
        //                         filters: [{
        //                                 label: "Desde",
        //                                 inputs: {
        //                                     desde: {
        //                                         name: "desde",
        //                                         type: "date",
        //                                         placeholder: "Desde",
        //                                         value: "",
        //                                         required: "",
        //                                     }
        //                                 }
        //                             },
        //                             {
        //                                 label: "Hasta",
        //                                 inputs: {
        //                                     hasta: {
        //                                         name: "hasta",
        //                                         type: "date",
        //                                         placeholder: "Hasta",
        //                                         value: "",
        //                                         required: "",
        //                                     }
        //                                 }
        //                             },
        //                             {
        //                                 label: "Código",
        //                                 codigo: {
        //                                     id: {
        //                                         name: "codigo",
        //                                         type: "text",
        //                                         placeholder: "código",
        //                                         value: "",
        //                                         required: "",
        //                                     }
        //                                 }
        //                             },
        //                             {
        //                                 label: "Interno",
        //                                 inputs: {
        //                                     desde: {
        //                                         name: "interno",
        //                                         type: "number",
        //                                         placeholder: "interno",
        //                                         value: "",
        //                                         required: "",
        //                                     }
        //                                 }
        //                             },
        //                             {
        //                                 label: "Patente",
        //                                 inputs: {
        //                                     Patente: {
        //                                         name: "aceleracion-desde",
        //                                         type: "number",
        //                                         placeholder: "patente",
        //                                         value: "",
        //                                         required: "",
        //                                     }
        //                                 }
        //                             }
        //                         ],
        //                         rows: [],
        //                         emptyCellChar: "-",
        //                         selectedPage: 0,
        //                         paginationIndex: 0,
        //                     }
        //                 }]
        //             ]
        //         }]
        //     }
        // },
    },
    logOut: {}
};

var state = {};

//--------------------------------- Public Interface ------------------------------------

const getDivs = (parent, cols) => {
    if (!cols) cols = 1;
    var divs = [];

    const margins = 20;
    var row = document.createElement("div");
    row.className = "row";
    row.style.position = 'relative';
    row.style.left = margins + 'px';
    row.style.right = margins + 'px';
    row.style.top = margins + 'px';
    row.style.bottom = margins + 'px';
    row.style.marginLeft = '0px';
    row.style.marginRight = '0px';
    row.style.width = ((parent.offsetWidth - margins * 2) * 100 / parent.offsetWidth) + '%';
    row.style.height = 'auto';
    parent.appendChild(row);


    for (let index = 0; index < cols; index++) {
        const internalMargins = 5;
        var col = document.createElement("div");
        col.className = "col-" + (12 / cols).toString();
        col.style.position = 'relative';
        col.style.padding = internalMargins + 'px';
        col.style.height = 'auto';
        row.appendChild(col);
        divs.push(col);
    }

    return divs;
};

const mainCard = (parent) => {
    const margins = 20;
    var tableRoot = document.createElement("div");
    tableRoot.style.position = 'relative';
    tableRoot.style.left = margins + 'px';
    tableRoot.style.right = margins + 'px';
    tableRoot.style.top = margins + 'px';
    tableRoot.style.bottom = margins + 'px';
    tableRoot.style.width = (parent.offsetWidth - margins * 2) * 100 / parent.offsetWidth + '%';
    tableRoot.style.height = 'auto';
    // tableRoot.style.height = (parent.offsetHeight - margins * 2) * 100 / parent.offsetHeight + '%';
    parent.appendChild(tableRoot);
    return tableRoot;
};

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

//--------------------------------- Public Interface ------------------------------------

//Hace un post al endpoint indicado en el payload con el estado de la categoria como body
const post = (payload) => {
    var body = {
        tablesState: table.states,
        formsStates: form.states,
    }



}

const selectCategory = (cat) => {
    try {
        var index = Object.keys(state.categories).indexOf(cat.name);
        var text = document.getElementById(state.id + "-" + cat.name + "-sidebar-main-category-name-text");

        Array.prototype.forEach.call(document.getElementsByClassName('ventum-sidebar-main-category-name-text'), (node) => {
            node.style.color = "";
        });
        text.style.color = "green";
        state.contentDiv.innerHTML = "";

        table.resetStates();

        Object.values(cat.content.rows).forEach(row => {
            var rowDiv = createRow(state.contentDiv);
            Object.values(row.cols).forEach(col => {
                var colDiv = createCol(rowDiv);
                Object.values(col).forEach(element => {
                    switch (element.type) {
                        case "table":
                            table.create(element.payload, colDiv);
                            break;
                        case "form":
                            form.create(element.payload, colDiv);
                            break;
                        default:
                            break;
                    }
                });
            });
        });
    } catch (error) {
        console.log("Error with selected cat! " + error);
    }
};

const logOut = () => {
    document.cookie = "access-token=; expires=0; path=/";
    location.reload();
};

const create = (data) => {

    const createNav = () => {
        var nav = document.createElement("div");
        nav.id = state.id + "-nav";
        nav.className = 'ventum-nav '; //overflow-auto
        nav.style.height = window.innerHeight + "px";
        nav.style.overflowY = "auto";
        nav.style.overflowX = "hidden";
        return nav;
    };

    const createSidebar = () => {

        const companyInfo = () => {
            var companyDiv = document.createElement("div");
            companyDiv.id = state.id + "-sidebar-company-div";
            companyDiv.className = 'ventum-sidebar-company';

            var logoDiv = document.createElement("div");
            logoDiv.id = state.id + "-sidebar-company-logo-div";
            logoDiv.className = 'ventum-sidebar-company-logo';

            var logo = document.createElement("i");
            logo.id = state.id + "-sidebar-company-logo-icon";
            logo.className = 'icon-compass icon-2x ventum-sidebar-company-logo-i';

            logoDiv.appendChild(logo);
            companyDiv.appendChild(logoDiv);

            var nameDiv = document.createElement("div");
            nameDiv.id = state.id + "-sidebar-company-name-div";
            nameDiv.className = 'ventum-sidebar-company-name';

            var nameText = document.createElement("button");
            nameText.id = state.id + "-sidebar-company-name-text";
            nameText.className = 'ventum-sidebar-company-name-text';
            nameText.href = "";
            nameText.innerHTML = state.company.name;

            nameDiv.appendChild(nameText);
            companyDiv.appendChild(nameDiv);

            return companyDiv;
        };

        const separatorLine = () => {
            var line = document.createElement("div");
            line.className = 'ventum-sidebar-separator-line';
            return line;
        };

        const separatorSpace = (height) => {
            var companyDiv = document.createElement("div");
            companyDiv.className = 'ventum-sidebar-separator-space';
            companyDiv.style.height = (height || 3) + '%';
            return companyDiv;
        };

        const userInfo = () => {
            var userDiv = document.createElement("div");
            userDiv.id = state.id + "-sidebar-user-div";
            userDiv.className = 'ventum-sidebar-user';

            var logoDiv = document.createElement("div");
            logoDiv.id = state.id + "-sidebar-user-logo-div";
            logoDiv.className = 'ventum-sidebar-user-logo';

            var logo = document.createElement("i");
            logo.id = state.id + "-sidebar-user-logo-icon";
            logo.className = 'icon-compass icon-2x ventum-sidebar-user-logo-i';

            logoDiv.appendChild(logo);
            userDiv.appendChild(logoDiv);

            var nameDiv = document.createElement("div");
            nameDiv.id = state.id + "-sidebar-user-name-div";
            nameDiv.className = 'ventum-sidebar-user-name';

            var nameText = document.createElement("button");
            nameText.id = state.id + "-sidebar-user-name-text";
            nameText.className = 'ventum-sidebar-user-name-text';
            nameText.href = "";
            nameText.innerHTML = state.user.name;

            nameDiv.appendChild(nameText);
            userDiv.appendChild(nameDiv);

            return userDiv;
        };

        const createCat = (cat) => {
            var catDiv = document.createElement("div");
            catDiv.id = state.id + "-" + cat.name + "-sidebar-main-category-div";
            catDiv.className = 'ventum-sidebar-main-category';

            var logoDiv = document.createElement("div");
            logoDiv.id = state.id + "-" + cat.name + +"-sidebar-main-category-logo-div";
            logoDiv.className = 'ventum-sidebar-main-category-logo';

            var logo = document.createElement("i");
            logo.id = state.id + "-" + cat.name + "-sidebar-main-category-logo-icon";
            logo.className = 'icon-compass icon-2x ventum-sidebar-main-category-logo-i';

            logoDiv.appendChild(logo);
            catDiv.appendChild(logoDiv);

            var nameDiv = document.createElement("div");
            nameDiv.id = state.id + "-" + cat.name + "-sidebar-main-category-name-div";
            nameDiv.className = 'ventum-sidebar-main-category-name';

            var nameText = document.createElement("button");
            nameText.id = state.id + "-" + cat.name + "-sidebar-main-category-name-text";
            nameText.className = 'ventum-sidebar-main-category-name-text';
            nameText.innerHTML = cat.name;

            nameText.onclick = (e) => {
                e.preventDefault();
                console.log("Category selected: " + cat.name);
                selectCategory(cat);
            };

            nameDiv.appendChild(nameText);
            catDiv.appendChild(nameDiv);

            return catDiv;

        };

        try {
            var sidebar = document.createElement("div");
            sidebar.id = state.id + "-sidebar";
            sidebar.className = 'ventum-sidebar overflow-auto';

            sidebar.appendChild(companyInfo());
            sidebar.appendChild(separatorLine());
            sidebar.appendChild(userInfo());
            sidebar.appendChild(separatorLine());
            sidebar.appendChild(separatorSpace(3));
            Object.keys(state.categories).forEach(key => {
                var access = state.categories[key].access;
                if (Object.values(access.names).includes(state.user.name) || Object.values(access.roles).includes(state.user.role))
                    sidebar.appendChild(createCat(state.categories[key]));
            });

            return sidebar;
        } catch (error) {
            console.log("Error creating sidebar: " + error);
            return null;
        }

    };

    const createContent = () => {

        const navBar = () => {
            var navbarDiv = document.createElement("div");
            navbarDiv.id = state.id + "-content-navbar-div";
            navbarDiv.className = 'ventum-content-navbar-div row';

            var empty = document.createElement("div");
            empty.id = state.id + "-content-navbar-div-exit";
            empty.className = 'col-11';
            navbarDiv.appendChild(empty);

            var exit = document.createElement("div");
            exit.id = state.id + "-content-navbar-div-exit";
            exit.style.position = "relative";
            exit.className = 'col-1 d-flex content-center';
            navbarDiv.appendChild(exit);
            var exitBtn = document.createElement("button");
            exitBtn.id = state.id + "-content-navbar-div-exit";
            exitBtn.className = "btn btn-danger btn-sm";
            exitBtn.style.color = "white";
            exitBtn.style.marginTop = "10%";
            exitBtn.style.marginBottom = "10%";
            exitBtn.innerHTML = "Log Out";
            exitBtn.addEventListener('click', () => {
                logOut(state.logOut);
            });
            exit.appendChild(exitBtn);
            return navbarDiv;
        };

        const separatorLine = () => {
            var line = document.createElement("div");
            line.className = 'ventum-content-separator-line';

            return line;
        };
        try {
            var content = document.createElement("div");
            content.id = state.id + "-content";
            content.className = 'ventum-content '; //overflow-auto
            content.style.overflowY = "auto";
            content.style.overflowX = "hidden";
            content.appendChild(navBar());
            content.appendChild(separatorLine());
            var mainContent = document.createElement("div");
            mainContent.id = state.id + "-content-main";
            mainContent.className = 'ventum-main-content';
            mainContent.style.height = '91%';
            content.appendChild(mainContent);
            return content;
        } catch (error) {
            console.log("Error creating sidebar: " + error);
            return null;
        }

    };

    state = utils.fillObjWithDflt(data, dfltState);
    var nav = createNav();
    var sidebar = createSidebar();
    nav.appendChild(sidebar);
    var content = createContent();
    nav.appendChild(content);

    document.body.appendChild(nav);
    state.contentDiv = content.getElementsByClassName('ventum-main-content')[0];
    return nav;
};

export default { create, post };