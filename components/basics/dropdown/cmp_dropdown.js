// import views from "../../views.js"
// import utils from "../../lib/utils.js"

// import category from "../category.js"

// import card from '../card/index.js';
// import button from '../button/index.js';
// import modal from "../modal/cmp_modal.js";
// import form from "../form/cmp_form.js";

/* <div class="form-group">
    <label for="exampleFormControlSelect1">Example select</label>
    <select class="form-control" id="exampleFormControlSelect1">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div> */

const createDropdown = (data) => {
    //console.log(`createDropdown: ${data}`);
    var root = document.createElement('div');
    root.className = "form-group";
    root.style.marginBottom = "0";
    root.id = data.id + "_root";

    var select = document.createElement("select");
    select.className = "form-control";
    select.id = data.id + "_select";
    select.addEventListener('change', (e) => {
        if (data.onChange != null) {
            if (typeof data.onChange === 'string') data.onChange = eval(data.onChange);
            data.onChange(select.value);
        }
    });
    root.appendChild(select);

    Object.values(data.options).forEach(opt => {
        var option = document.createElement('option');
        option.innerHTML = opt.label;
        option.value = opt.name;
        select.appendChild(option);
    });

    

    return root;
};

const dfltState = {
    type: "dropdown"
};

// const render = (state, parent) => {

//     views.onEvent(state, "onBeforeRender", state.onBeforeRender);

//     var btn = document.createElement("button");
//     btn.style.display = state.display;
//     btn.style.width = state.width;
//     btn.style.height = state.height;
//     btn.style.position = state.position;
//     btn.style.overflowWrap = state.overflowWrap;

//     if (state.showLabel == "true") btn.innerHTML = state.label;
//     else btn.innerHTML = "";

//     //https://getbootstrap.com/docs/4.0/components/buttons/
//     var addOutline = "";
//     if (state.outline == "true") addOutline = "-outline";
//     btn.className = `btn btn${addOutline}-${state.btnType}`;
//     if (state.selected == "true") {
//         btn.className += " active";
//         var attr = document.createAttribute("aria-pressed");
//         attr.value = "true";
//         btn.setAttributeNode(attr);
//     };
//     if (state.enabled != "true") btn.disabled = true;
//     else btn.disabled = false;

//     btn.addEventListener('click', (e) => {
//         e.preventDefault();
//         views.onEvent(state, "onClick", state.onClick);
//     });

//     //https://fontawesome.com/v5.15/icons?d=gallery&p=2
//     var icon = document.createElement("i");
//     icon.className = `fa fa-${state.icon}`;
//     if (state.showIcon == "true") icon.style.display = "inherit";
//     else icon.style.display = "none";
//     btn.appendChild(icon);

//     state.html = {};
//     state.html.label = btn.innerHTML;
//     state.html.btn = btn;
//     state.html.icon = icon;

//     parent.appendChild(btn);

//     views.onEvent(state, "onRender", state.onRender);
//     return state;
// };

// const update = (state) => {
    
//     views.onEvent(state, "onBeforeUpdate", state.onBeforeUpdate);

//     state = utils.fillObjWithDflt(state, dfltState);
//     var btn = state.html.btn;
//     btn.style.display = state.display;
//     btn.style.width = state.width;
//     btn.style.height = state.height;
//     btn.style.position = state.position;
//     btn.style.overflowWrap = state.overflowWrap;

//     if (state.showLabel == "true") btn.innerHTML = state.label;
//     else btn.innerHTML = "";

//     //https://getbootstrap.com/docs/4.0/components/buttons/
//     var addOutline = "";
//     if (state.outline == "true") addOutline = "-outline";
//     btn.className = `btn btn${addOutline}-${state.btnType}`;
//     if (state.selected == "true") {
//         btn.className += " active";
//         var attr = document.createAttribute("aria-pressed");
//         attr.value = "true";
//         btn.setAttributeNode(attr);
//     } else {
//         btn.removeAttribute("aria-pressed");
//     }

//     if (state.enabled != "true") btn.setAttribute(document.createAttribute("disabled"));
//     else btn.removeAttribute("disabled");
        
//     //https://fontawesome.com/v5.15/icons?d=gallery&p=2
//     var icon = state.html.icon;
//     icon.className = `fa fa-${state.icon}`;
//     if (state.showIcon == "true") icon.style.display = "inherit";
//     else icon.style.display = "none";

//     views.onEvent(state, "onUpdate", state.onUpdate);
//     return state;
// };

export default { dfltState };