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