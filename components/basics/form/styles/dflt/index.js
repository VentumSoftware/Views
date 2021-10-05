const dfltState = {
  show: true,
  inputs: {},
  html: {},
  margin: "0px",
  childs: {}
};

const dfltInput = {
  colSize: 12, // 1-12 or "auto"
  name: "",
  label: "",
  type: "text",
  placeholder: "",
  prepend: null,
  helpText: "",
  size: "md", //sm, md, lg
  inline: false,
  disabled: false,
  required: true,
  validFeedback: "Ok",//Texto que aparece cuando completaste el campo ok, pero otro campo no
  invalidFeedback: "Campo obligatorio!", //Texto que aparece cuando no completaste el campo
  validation: {}
}

const getButtonHTML = (state) => {

  state.enabled = state.enabled || "true";
  state.showLabel = state.showLabel || "true";


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
    <button class="${className.toString()}" onClick="${(e) => views.onEvent(state, "onClick", state.onClick, e)}" id="btn-root" ${attr} style="
        width : 100%;
        height : 100%;"
    ${disabled}>
      ${innerText}
     
    </button>
    `
};

const render = (state, parent) => {

  const getHTML = (state) => {

    let noNameCounter = 0;

    const getCols = (cols) => {

      const getPrepend = (col) => {
        if (col.prepend != null && col.prepend != "null") {
          return `
          <div class="input-group-prepend">
            <span class="input-group-text">${col.prepend}</span>
          </div>
        `
        } else {
          return "";
        }
      };

      if (cols == null) return "";
      let result = "";
      Object.values(cols).forEach(col => {
        if (col.rows != null) {
          result = `
            <div class="form-group col-${col.size || "md"}-${col.colSize || 12}">
              ${getRows(col.rows)}
            </div>
            `;
        } else {
          col = fillObjWithDflt(col, dfltInput);
          if (col.name == null) col.name = "noNameInput" + noNameCounter++;


          if (col.type != "button") {
            if (eval(col.inline)) {
              result += `
              <div class="col-${col.size || "md"}-${col.colSize || 12}">
                <div class="row">
                  <div class="col-4">
                    <label for="${col.name + "_id"}" style="margin:0;vertical-align: -webkit-baseline-middle">${col.label}</label>
                  </div>
                  <div class="col-8">
                    <div class="input-group">
                      ${getPrepend(col)}
                      <input type="${col.type}" class="form-control" id="${col.name + "_id"}" name="${col.name}" placeholder="${col.placeholder || ""}" required>
                      <div class="valid-feedback">
                        ${col.validFeedback}
                      </div>
                      <div class="invalid-feedback">
                        ${col.invalidFeedback}
                      </div>
                      <small id="passwordHelpInline" class="text-muted">
                        ${col.helpText}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              `;
            } else {
              result += `
              <div class="col-${col.size || "md"}-${col.colSize || 12}">
                <label for="${col.name}">${col.label}</label>
                <div class="input-group">
                  ${getPrepend(col)}
                  <input type="${col.type}" class="form-control" id="${col.name}" placeholder="${col.placeholder || ""}" required>
                  <div class="valid-feedback">
                    ${col.validFeedback}
                  </div>
                  <div class="invalid-feedback">
                    ${col.invalidFeedback}
                  </div>
                  <small id="passwordHelpInline" class="text-muted">
                    ${col.helpText}
                  </small>
                </div>
              </div>
            `;
            }
          } else {
            if (eval(col.inline)) {
              result += `
              <div class="col-${col.size || "md"}-${col.colSize || 12}">
                <div class="row" style="height:100%";>
                  <div class="col-12">
                    ${getButtonHTML(col)}
                  </div>
                </div>
              </div>
              `;
            } else {
              result += `
              <div class="col-${col.size || "md"}-${col.colSize || 12}">
                  ${getButtonHTML(col)}

              </div>
            `;
            }
          }

        }
      });
      return result;
    };

    const getRows = (rows) => {
      if (rows == null) return "";
      let result = "";
      Object.values(rows).forEach(row => {
        result += `
        <div class="row" style="margin-bottom: 15px;">
          ${getCols(row.cols)}
        </div>
        `;
      });
      return result;
    };
    //console.log(state.inputs);
    return `
    <!-- Form -->
    <form id="${state.id + "-div-root"}" style="margin:${state.margin}">
      ${getRows(state.inputs.rows)}
    </form>
    `
  };

  const getReferences = (state, root) => {
    state.html = {
      root: root.getElementById(state.id + "-div-root"),
      row: root.getElementById(state.id + "-div-row"),
      col: root.getElementById(state.id + "-div-col")
    };
    return state;
  };

  return new Promise((res, rej) => {
    state = fillObjWithDflt(state, dfltState);
    var html = stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html.getRootNode());
    res(state);
  });
};

export default { dfltState, render };