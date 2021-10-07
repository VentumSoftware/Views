// import utils from '../../lib/js';
// import views from "../../../views.js";

const dfltState = {
    outline: "false",
    width: "100%",
    height: "100%",
    position: "relative",
    overflowWrap: "normal",
    onClick: null
};

// const update = (state) => {
    
//     views.onEvent(state, "onBeforeUpdate", state.onBeforeUpdate);

//     state = fillObjWithDflt(state, dfltState);
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