
//Dflt Modal State
var dfltState = {
};

const hide = (state) => {
    const visible = state.show;
    if (visible) {
        views.onEvent(state, "onHide", state.onHide);
    }
    state.show = false;
    if (state.html.root) {
        $("#" + state.id + "_root").modal('hide');
    }
    console.log(`${state.type} "${state.id}" hidden!`);
    return state;
};

const show = (state, show = true) => {
    const visible = state.show;
    if (!visible) {
        views.onEvent(state, "onShow", state.onShow);
    }
    state.show = true;
    if (state.html.root) {
        $("#" + state.id + "_root").modal('show');
    }
    console.log(`${state.type} "${state.id}" showed!`);
    return state;
};
var old = {
    render: (state, parent) => {

        const showModal = () => {

            const createContent = (parent) => {
                const createRow = (parent) => {
                    const margins = 20;
                    var row = document.createElement("div");
                    row.style.position = 'relative';
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

                const body = document.getElementById('modal-body');
                state.selectedPage = state.selectedPage || 0;
                Object.values(state.pages[state.selectedPage].rows).forEach(row => {
                    var rowDiv = createRow(body);
                    Object.values(row.cols).forEach(col => {
                        var colDiv = createCol(rowDiv);
                        Object.values(col).forEach(element => {
                            //console.log("show child: " + element);
                            var content = state.childs[element];
                            //console.log("content: " + JSON.stringify(content))
                            eval(content.type).render(content, colDiv);
                        });
                    });
                });
            };

            const createFooterBtns = (parent) => {
                const footer = document.getElementById('modal-footer');
                footer.innerHTML = null;
                state.selectedPage = state.selectedPage || 0;
                var btns = Object.values(state.pages[state.selectedPage].footerBtns);

                var btnsRow = document.createElement("div");
                btnsRow.className = "row";
                btnsRow.style["justify-content"] = "flex-end";
                btnsRow.style.width = "100%";
                footer.appendChild(btnsRow);

                btns.forEach(value => {
                    var btnDiv = document.createElement("div");
                    btnDiv.className += "col-3";
                    btnsRow.appendChild(btnDiv);
                    button.render(state.childs[value], btnDiv);
                });
            };

            const body = document.getElementById("modal-body");
            const header = document.getElementById("modal-header");
            const footer = document.getElementById("modal-footer");

            //Limpio el modal anterior
            body.innerHTML = null;
            header.childNodes[1].innerHTML = state.title;
            footer.innerHTML = null;

            var modalDialog = document.getElementById("modal-dialog")
            modalDialog.style["max-width"] = "9999px"; // Esto es para sacar el maxwidth de la clase "modal-dialog"
            modalDialog.style.width = state.width;


            createContent(body);
            createFooterBtns(parent);

            $('#modal-root').modal('show');
        };

        window.views.onEvent(state, "onBeforeRender", state.onBeforeRender);

        showModal();

        window.views.onEvent(state, "onRender", state.onRender);
    },

    showSpinner: () => {
        //<div class="d-flex justify-content-center"></div>

        var justifyDiv = document.createElement("div");
        justifyDiv.className = "d-flex justify-content-center";
        parent.appendChild(justifyDiv);

        var spinnerBorder = document.createElement("div");
        spinnerBorder.className = "spinner-border text-light";
        spinnerBorder.role = "status";
        justifyDiv.appendChild(spinnerBorder);

        var span = document.createElement("div");
        span.className = "sr-only";
        span.innerHTML = "Loading...";
        spinnerBorder.appendChild(span);
    },

    hideSpinner: () => {
        var justifyDiv = document.createElement("div");
        justifyDiv.className = "d-flex justify-content-center";
        parent.appendChild(justifyDiv);

        var spinnerBorder = document.createElement("div");
        spinnerBorder.className = "spinner-border text-light";
        spinnerBorder.role = "status";
        justifyDiv.appendChild(spinnerBorder);

        var span = document.createElement("div");
        span.className = "sr-only";
        span.innerHTML = "Loading...";
        spinnerBorder.appendChild(span);
    },

    closeModal: () => {
        $('#modal-root').modal('hide');
    },

    update: () => {
    },
}

export default { dfltState, hide, show };