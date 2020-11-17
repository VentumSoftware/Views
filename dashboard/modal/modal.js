import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';

const dfltState = {};

var state = null;
var root = null;
var modalDialog = null;
var modalContent = null;
//-----------------------------------------------------------------------------------------------

const show = (data) => {

    const drawContent = () => {
        modalContent.innerHTML = null;
        var f = form.create(data.form, modalContent);
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
    });

    return modalDialog;
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

export default { create, show };