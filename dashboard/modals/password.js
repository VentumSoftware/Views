import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
var modal;

const createModal = () => {
    var root = document.createElement("div");
    root.id = "login-modal";
    root.tabindex = "-1";
    root.role = "dialog";
    root["aria-labelledby"] = "exampleModalCenterTitle";
    root["aria-hidden"] = "true";
    root.className = "modal fade";
    document.body.appendChild(root);

    var div1 = document.createElement("div");
    div1.role = "document";
    div1.className = "modal-dialog modal-dialog-centered";
    root.appendChild(div1);
    // <div class="modal-dialog modal-dialog-centered" role="document"></div>

    var div2 = document.createElement("div");
    div2.className = "modal-content";
    div1.appendChild(div2);

    var header = document.createElement("div");
    header.className = "modal-header";
    div2.appendChild(header);

    var title = document.createElement("h5");
    title.className = "modal-title";
    title.innerHTML = "Ingrese el usuario y contraseña"
    header.appendChild(title);

    var closeBtn = document.createElement("button");
    closeBtn.className = "close";
    closeBtn.type = "button";
    closeBtn.class = "close";
    closeBtn["data-dismiss"] = "modal";
    closeBtn[" aria-label"] = "close";
    closeBtn.addEventListener("click", () => $("#login-modal").modal('toggle'));
    title.appendChild(closeBtn);

    var span = document.createElement("span");
    span["aria-hidden"] = "true";
    span.innerHTML = "&times"
    closeBtn.appendChild(span);

    var body = document.createElement("div");
    body.className = "modal-body";
    div2.appendChild(body);


    var loginForm = document.createElement("form");
    body.appendChild(loginForm);

    var passDiv = document.createElement("div");
    passDiv.className = "form-group";
    loginForm.appendChild(passDiv);
    var passLabel = document.createElement("label");
    passLabel.innerHTML = "Contraseña";
    passDiv.appendChild(passLabel);
    var passInput = document.createElement("input");
    passInput.type = "password";
    passInput.className = "form-control";
    passInput.placeholder = "Password";
    passDiv.appendChild(passInput);


    //     <form>
    //   <div class="form-group">
    //     <label for="exampleInputPassword1">Password</label>
    //     <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
    //   </div>
    //   <button type="submit" class="btn btn-primary">Submit</button>
    // </form>



    var footer = document.createElement("div");
    footer.className = "modal-footer";
    div2.appendChild(footer);


    var submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.className = "btn btn-primary";
    submitBtn.innerHTML = "Send";
    footer.appendChild(submitBtn);


    return root;
}

//Me muestra un modal donde ingreso el user y pass, si son correctos se cumple la promesa
const showModal = () => {
    if (modal == null)
        modal = createModal();
    return new Promise((resolve, reject) => {
        modal.getElementsByClassName("modal-title")[0].innerHTML = "Ingrese contraseña para USUARIO";
        $("#login-modal").modal('toggle');
        var btn = modal.getElementsByClassName("btn-primary")[0];
        btn = utils.replaceWithClone(btn); //Esto lo uso para eliminar los listeners del elemento
        btn.addEventListener("click", (e) => {
            console.log("logeandome!");

        })

        reject("modal login no implementado todavía!");
    });
}
export default { showModal };