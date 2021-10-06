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
  display: "block",
  helpText: "",
  size: "md", //sm, md, lg
  inline: false,
  disabled: false,
  required: true,
  validFeedback: "Ok",//Texto que aparece cuando completaste el campo ok, pero otro campo no
  invalidFeedback: "Campo obligatorio!", //Texto que aparece cuando no completaste el campo
  validation: {}
}



const render = (state, parent) => {

  const getButtonHTML = (col) => {

    col.enabled = col.enabled || "true";
    col.showLabel = col.showLabel || "true";


    var innerText = ""
    if (col.showLabel == "true") innerText = col.label;

    //https://getbootstrap.com/docs/4.0/components/buttons/
    var addOutline = "";
    if (col.outline == "true") addOutline = "-outline";
    var className = `btn btn${addOutline}-${col.btnType}`;

    var attr = ""
    if (col.selected == "true") {
      className += " active";
      attr += `aria-pressed="true"`;
    };

    var disabled = ""
    if (eval(col.enabled) != true) disabled = "disabled";

    //https://fontawesome.com/v5.15/icons?d=gallery&p=2
    var iconClassName = `fa fa-${col.icon}`;
    var iconDisplay = "";
    if (col.showIcon == "true") iconDisplay = "inherit";
    else iconDisplay = "none";

    return `
      <!-- Btn -->
      <button class="${className.toString()}" type="button" id="${state.id + "_" + col.name}" ${attr} style="
          width : 100%;
          height : 100%;"
      ${disabled}>
        ${innerText}
       
      </button>
      `
  };

  const getHTML = (state) => {

    let noNameCounter = 0;

    const getCols = (cols) => {

      const isRequired = (col) => {
        if (eval(col.required) === true) return "required";
        else return "";
      }

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
          if (col.display === 'none') col.required = false;

          if (col.name == null) col.name = "noNameInput" + noNameCounter++;


          if (col.type != "button") {
            if (eval(col.inline)) {
              result += `
              <div class="col-${col.size || "md"}-${col.colSize || 12}">
                <div class="row" style="display:${col.display || "block"}">
                  <div class="col-4">
                    <label for="${col.name + "_id"}" style="margin:0;vertical-align: -webkit-baseline-middle">${col.label}</label>
                  </div>
                  <div class="col-8">
                    <div class="input-group">
                      ${getPrepend(col)}
                      <input type="${col.type}" class="form-control" id="${state.id + "_" + col.name}" name="${col.name}" placeholder="${col.placeholder || ""}" ${isRequired(col)}>
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
                  <input type="${col.type}" class="form-control" id="${state.id + "_" + col.name}" placeholder="${col.placeholder || ""}" ${isRequired(col)}>
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

    return `
    <!-- Form -->
    <form id="${state.id + "-div-root"}" style="margin:${state.margin}">
      ${getRows(state.inputs.rows)}
    </form>
    `
  };

  const getReferences = (state, root) => {

    const getInputs = (rows, root) => {
      if (rows == null) return {};
      let result = {};
      const rs = Object.entries(rows);
      rs.forEach(r => {
        console.log("r")
        console.log(r)
        result[r[0]] = { cols: {} };
        const cs = Object.entries(r[1].cols);
        cs.forEach(c => {
          console.log("c")
          console.log(c)
          if (c[1].rows == null) {
            console.log("c1")
            console.log(c[1])
            console.log("result[r[0]].cols[c[0]]")
            console.log(result[r[0]].cols[c[0]])
            result[r[0]].cols[c[0]] = root.getElementById(`${state.id + "_" + c[1].name}`);
            if (c[1].onClick != null) {
              result[r[0]].cols[c[0]].addEventListener('click', (e) => {
                e.preventDefault();
                views.onEvent(state, "onClick", c[1].onClick, e);
              });
            }
          } else {
            result[r[0]].cols[c[0]] = { rows: getInputs(c[1].rows, root) };
          }
        })
      })
      return result;
    };

    state.html = {
      root: root.getElementById(state.id + "-div-root"),
    };
    state.html.inputs = {
      rows: getInputs(state.inputs.rows, root)
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