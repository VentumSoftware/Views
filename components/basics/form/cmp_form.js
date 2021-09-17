//Dflt Dashboards State
const dfltState = {
    title: "Form",
    inputs: {},
    footerBtns: {},
};

const reset = (state) => {
    hideValidations(state);
    const form = state.html.root;
    const inputs = form.getElementsByTagName('INPUT');
    Object.values(inputs).forEach(input => input.value = null);
};

const hideValidations = (state) => {
    const form = state.html.root;
    const inputs = form.getElementsByTagName('INPUT');
    Object.values(inputs).forEach((input) => {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
    });
};

const validate = (state, showValidations = true) => {
    let result = true;
    const form = state.html.root;
    const inputs = form.getElementsByTagName('INPUT');
    hideValidations(state);
    Object.values(inputs).forEach((input) => {
        if (input.checkValidity(state) === false) {
            result = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.add('is-valid');
        }
    });
    if (!showValidations) {
        hideValidations(state);
    }
    return result;
};

const submit = (state, path, options = {}) => {
    return new Promise((res, rej) => {
        const form = state.html.root;
        const data = Object.fromEntries(new FormData(form).entries());
        fetch(path, {
            method: options.method || "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(res);
    })

}

// var render = (state, parent) => {
//     const drawForm = () => {
//         try {
//             var form = document.createElement("form");
//             form.id = state.id + "-form";
//             form.style.margin = "20px";
//             //Esto evita que se resetee la página cuando apretamos "enter" y el form esta completo
//             form.setAttribute('onkeydown', "return event.key != 'Enter';");
//             cardParent.body.appendChild(form);

//             var row = document.createElement("div");
//             row.id = state.id + "-row";
//             row.className = "row";
//             form.appendChild(row);

//             state.inputs = {};
//             Object.values(state.cols).forEach(col => {
//                 var inputCol = document.createElement("div");
//                 inputCol.className = "col";
//                 row.appendChild(inputCol);
//                 Object.values(col).forEach(input => {
//                     var inputRow = document.createElement("div");
//                     inputRow.className = "row";
//                     inputRow.style.marginTop = "8px";
//                     inputRow.style.marginBottom = "8px";
//                     inputRow.id = state.id + "_" + input.name + "_inputDiv";
//                     inputCol.appendChild(inputRow);
//                     var label = document.createElement("label");
//                     label.className = "col-md-4 col-form-label";
//                     label.style["overflow-wrap"] = "initial";
//                     label.innerHTML = input.label;
//                     inputRow.appendChild(label);
//                     var inputDiv = document.createElement("div");
//                     inputDiv.className = "col-md-8";
//                     inputRow.appendChild(inputDiv);
//                     var inputIn = document.createElement("input");
//                     state.inputs[input.name] = input.value;

//                     //readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"
//                     switch (input.type) {
//                         case "text":
//                             inputIn.className = "form-control";
//                             inputIn.placeholder = input.placeholder;
//                             if(input.value) inputIn.value = input.value;
//                             break;
//                         case "date":
//                             inputIn.className = "form-control";
//                             inputIn.placeholder = input.placeholder;
//                             inputIn.type = "date"
//                             if(input.value) inputIn.value = input.value;
//                             break;
//                         case "fixed":
//                             inputIn.readOnly = true;
//                             inputIn.className = "form-control-plaintext";
//                             if(input.value) inputIn.value = input.value;
//                             break;
//                         case "password":
//                             inputIn.readOnly = false;
//                             inputIn.className = "form-control";
//                             inputIn.type = "password";
//                             if(input.value) inputIn.value = input.value;
//                             break;
//                         case "fixed-hour":
//                             inputIn.readOnly = true;
//                             inputIn.className = "form-control-plaintext";
//                             //TODO: VER SI HAY UN MEMORY LEAK ACÁ, O SI TENGO Q GUARDAR LA REF PARA MATARLO
//                             var d = new Date();
//                             var n = `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`;
//                             inputIn.value = n;
//                             state.inputs[input.label] = inputIn.value;
//                             setInterval(() => {
//                                 var d = new Date();
//                                 var n = `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`;
//                                 inputIn.value = n;
//                                 state.inputs[input.label] = inputIn.value;
//                             }, 1000);
//                             break;
//                         case "fixed-date":
//                             inputIn.readOnly = true;
//                             inputIn.className = "form-control-plaintext";
//                             var d = new Date();
//                             var n = `${(d.getUTCFullYear())}/${("0" + (d.getUTCMonth() + 1)).slice(-2)}/${("0" + d.getUTCDate()).slice(-2)}`;
//                             inputIn.value = n;
//                             state.inputs[input.label] = inputIn.value;
//                             setInterval(() => {
//                                 var d = new Date();
//                                 var n = `${(d.getUTCFullYear())}/${("0" + (d.getUTCMonth() + 1)).slice(-2)}/${("0" + d.getUTCDate()).slice(-2)}`;
//                                 state.inputs[input.label] = inputIn.value;
//                             }, 1000);
//                             break;
//                         case "file":
//                             inputIn.className = "form-control-file";
//                             inputIn.type = "file";
//                             inputIn.accept = "application/pdf";
//                             break;
//                         case "cert-file":
//                             inputIn.className = "form-control-pfx-file";
//                             inputIn.type = "file";
//                             inputIn.accept = "application/pkcs12";
//                             break;
//                         case "dropdown":
//                             inputIn.style.display = "none";
//                             var dropD = dropdown.createDropdown(input);
//                             var select = dropD.firstChild;
//                             select.addEventListener('change', (e) => {
//                                 inputIn.value = select.value;
//                                 inputIn.dispatchEvent(new Event("change"))
//                             });
//                             state.inputs[input.name] = input.options[0].name;
//                             inputDiv.appendChild(dropD);
//                             break;
//                         default:
//                             inputIn.className = "form-control";
//                             inputIn.placeholder = input.placeholder;
//                             break;
//                     }

//                     inputIn.addEventListener('change', (event) => {
//                         state.inputs[input.name] = event.target.value;
//                         views.onEvent(state, "onAnyValueChange", state.onAnyValueChange, input);
//                         views.onEvent(state, "onValueChange", input.onValueChange, input);
//                     });

//                     inputIn.id = state.id + "_" + input.name + "_input";

//                     inputDiv.appendChild(inputIn);
//                 });
//             });

//             var btns = Object.entries(state.footerBtns);
//             var btnsCount = 0;
//             btns.forEach(([key, value]) => {
//                 if (value)
//                     btnsCount++;
//             });

//             var btnsRow = document.createElement("div");
//             btnsRow.className = "row";
//             btnsRow.style["justify-content"] = "flex-end";
//             cardParent.footer.appendChild(btnsRow);

//             console.log("btncount: " + btnsCount.toString());
//             btns.forEach(([key, value]) => {
//                 value.showLabel = true;
//                 var btnDiv = document.createElement("div");
//                 btnDiv.className += "col-3";
//                 btnsRow.appendChild(btnDiv);
//                 var btn = button.createBtn(value, state);
//                 btnDiv.appendChild(btn);
//                 btn.addEventListener('click', (e) => {
//                     e.preventDefault();
//                     views.onEvent(state, "onFormFooterBtnClick", value.onClick);
//                 });
//             });
//             views.onEvent(state, "onRender", state.onRender)
//             return form;

//         } catch (error) {
//             console.log(error);
//         }
//     };
//     views.onEvent(state, "onBeforeRender", state.onBeforeRender);
//     const cardParent = card.create({ title: state.title }, parent);
//     state.inputs = {};
//     drawForm();
//     views.onEvent(state, "onRender", state.onRender);
// };

var getData = (state) => {
    return state.inputs;
};

var fillInputs = (state, values) => {
    Object.keys(values).forEach(key => {
        var input = document.getElementById(state.id + "_" + key + "_input");
        if (input != null) {
            input.value = values[key];
            state.inputs[key] = values[key]
            views.onEvent(state, "onAnyValueChange", state.onAnyValueChange, state.inputs[key]);
            views.onEvent(state, "onValueChange", state.inputs[key].onValueChange, state.inputs[key]);
        }
    });
};

var getFile = (state, msg) => {
    var url = msg.url.replace(/\${(.*?)}/g, (x, g) => eval(g));
    var options = {
        method: 'POST',
        mode: msg.mode || 'cors',
        cache: msg.cache || 'no-cache',
        credentials: msg.credentials || 'same-origin',
        headers: msg.headers || {
            'access-token': utils.getCookie('access-token')
        },
        redirect: msg.redirect || 'follow',
        referrerPolicy: msg.referrerPolicy || 'no-referrer'
    };
    return dashboard.fetchWAT(url, options);
}

var postWebForm = (state, msg) => {
    const formularioId = state.id + "-form";
    var form = document.getElementById(formularioId);
    var files;
    Array.from(form.elements).forEach(input => {
        files = input.files;
    });
    console.log(files[0])
    const formData = new FormData();
    formData.append("files", files[0]);

    for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }
    try {
        var url = msg.url.replace(/\${(.*?)}/g, (x, g) => eval(g));
        var options = {
            method: 'POST',
            mode: msg.mode || 'cors',
            cache: msg.cache || 'no-cache',
            credentials: msg.credentials || 'same-origin',
            headers: msg.headers || {
                'access-token': utils.getCookie('access-token')
            },
            redirect: msg.redirect || 'follow',
            referrerPolicy: msg.referrerPolicy || 'no-referrer',
            body: formData
        };
        console.log(`fetch url: ${url}  options: ${JSON.stringify(options)}`);
        return dashboard.fetchWAT(url, options);
    } catch (error) {
        console.log(error);
        return Promise.reject("Failed fetch cmd!");
    }
};


export default { dfltState, getData, fillInputs, postWebForm, getFile, reset, submit, validate , hideValidations};