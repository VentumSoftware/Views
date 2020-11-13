import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';

const dfltState = {
    id: "noID",
    title: "Table",
    fetchPath: "/api/aggregate",
    headers: {},
    filters: {},
    enabledBtns: {
        filter: {},
        erase: {},
        edit: {},
        add: {},
    },
    initialStages: {},
    finalStages: {},
    footerButtons: {},
    rowsData: [],
    rowsCheckboxs: [],
    emptyCellChar: "-",
    selectedPage: 0,
    paginationIndex: 0,

    //HTML References:
    filterBtn: null,
    eraseBtn: null,
    editBtn: null,
    addBtn: null,
};

var state = null;
var root = null;
var modalDialog = null;
//-----------------------------------------------------------------------------------------------

const show = (data) => {

    const drawContent = () => {
        modalDialog.innerHTML = null;
        var f = form.create(data.form, modalDialog);

    };

    if (state == null) {
        create();
    }
    drawContent();
    root.modal('show');
    root.on('hidden.bs.modal', function(e) {
        console.log("modalCerrado");
        $(e.currentTarget).unbind(); // or $(this)        
    });

    return modalDialog;

}

const create = () => {

    // <div id="modal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    //       <div class="modal-dialog modal-lg">
    //           <div class="modal-content">
    //               <div class="modal-header">
    //                   <h5 class="modal-title" id="exampleModalLabel">New message</h5>
    //                   <button type="button" class="close" data-dismiss="modal" aria-label="Close">
    //                   <span aria-hidden="true">&times;</span>
    //                 </button>
    //               </div>
    //               <div class="modal-body">
    //                   <form>
    //                       <div class="form-group">
    //                           <label for="recipient-name" class="col-form-label">Recipient:</label>
    //                           <input type="text" class="form-control" id="recipient-name">
    //                       </div>
    //                       <div class="form-group">
    //                           <label for="message-text" class="col-form-label">Message:</label>
    //                           <textarea class="form-control" id="message-text"></textarea>
    //                       </div>
    //                   </form>
    //               </div>
    //               <div class="modal-footer">
    //                   <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    //                   <button type="button" class="btn btn-primary">Send message</button>
    //               </div>
    //           </div>
    //       </div>
    //   </div>

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

        //card.create({ title: "holaa" }, modalDialog);
        // var modalHeader = document.createElement("div");
        // modalHeader.className = "modal-header";
        // modalDialog.appendChild(modalHeader);

        // var modalBody = document.createElement("div");
        // modalBody.className = "modal-body";
        // modalDialog.appendChild(modalBody);

        // var modalFooter = document.createElement("div");
        // modalFooter.className = "modal-footer";
        // modalDialog.appendChild(modalFooter);

        return modalRoot;
    };

    // state = utils.fillObjWithDflt(data, dfltState);
    createModal();
    root = $('#modal');
};

export default { create, show };