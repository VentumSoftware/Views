import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';
import dashboard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js';

const dfltState = {};

//Estados de los elementos del modal: forms, tables, etc...
var subStates = []

var state = null;
var root = null;
var modalDialog = null;
var modalContent = null;

//-----------------------------------------------------------------------------------------------


const getData = () => {
    return subStates;
};

const show = (invokerState, data) => {

    const spinner = (payload, parent) => {
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
    }

    return new Promise((resolve, reject) => {
        const drawContent = () => {
            modalContent.innerHTML = null;
            subStates = [];
            if (data.form) {
                var formState = form.create(data.form, modalContent);
                subStates.push(formState);
            }

            if (data.spinner) {
                spinner(data.spinner, modalContent);
            }
        };

        if (state == null) {
            create();
        }

        drawContent();
        root.modal('show');
        root.on('hidden.bs.modal', function(e) {
            e.preventDefault();
            console.log("modalCerrado");
            $(e.currentTarget).unbind(); // or $(this)  
            //sacar state del form 
            resolve();
        });
    });
};

const close = () => {
    //remover subStates acá;
    root.modal('hide');
}

const create = (data) => {

    const createModal = () => {
        var modalRoot = document.createElement("div");
        modalRoot.id = "modal";
        modalRoot.className = "modal fade bd-example-modal-lg";
        modalRoot.tabIndex = "-1";
        modalRoot.role = "dialog";
        modalRoot["aria-labelledby"] = "myLargeModalLabel";
        modalRoot["aria-hidden"] = "true";
        document.body.appendChild(modalRoot);

        modalDialog = document.createElement("div");
        modalDialog.className = "modal-dialog modal-lg";
        modalRoot.appendChild(modalDialog);

        modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.style.display = "contents";
        modalDialog.appendChild(modalContent);

        return modalRoot;
    };

    state = utils.fillObjWithDflt(data, dfltState);
    createModal();
    root = $('#modal');
    root.modal({ backdrop: 'static', keyboard: true }); // Para q no se cierre cuando hago click
};

export default { create, show, close, getData };