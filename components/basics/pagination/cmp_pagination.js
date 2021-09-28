
const dfltState = {
    type: "pagination",
    style: "dflt"
};

const getSelectedPage = (state) => {
    return Math.trunc(state.index / state.elementsPerPage);
};

export default { dfltState, getSelectedPage }

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

// export default { dfltState, render, update };