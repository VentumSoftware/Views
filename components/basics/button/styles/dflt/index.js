const dfltState = {};

const render = (state, parent) => {

  const getHTML = (state) => {

    var innerText = ""
    if (state.showLabel == "true") innerText = state.label;

    //https://getbootstrap.com/docs/4.0/components/buttons/
    var addOutline = "";
    if (state.outline == "true") addOutline = "-outline";
    var className = `btn btn${addOutline}-${state.btnType}`;

    var attr = ""
    if (state.selected == "true") {
      className += " active";
      attr += `aria-pressed="true"`;
    };

    var disabled = ""
    if (state.enabled != "true") disabled = "disabled";

    //https://fontawesome.com/v5.15/icons?d=gallery&p=2
    var iconClassName = `fa fa-${state.icon}`;
    var iconDisplay = "";
    if (state.showIcon == "true") iconDisplay = "inherit";
    else iconDisplay = "none";

    return `
    <!-- Btn -->
    <button class="${className.toString()}" id="btn-root" ${attr} style="
        display : state.display;
        width : state.width;
        height : state.height;
        position : state.position;
        overflowWrap : state.overflowWrap;
      " ${disabled}>
      ${innerText}
      <i class=${iconClassName.toString()} style="display="${iconDisplay}"">
    </button>
    `
  };

  const getReferences = (state, root) => {
    state.html = {
      btn: root.getElementsByTagName("button")[0],
    };
    state.html.btn.id = state.id + "_btn";
    return state;
  };

  state = utils.fillObjWithDflt(state, dfltState);

  return new Promise((res, rej) => {
    var html = utils.stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html);
    state.html.btn.addEventListener(
      'click',
      (e) => views.onEvent(state, "onClick", state.onClick)
    );
    res(state);
  });
}


export default { dfltState, render };