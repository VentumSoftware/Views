const dfltState = {
  show: true,
  inputs: {},
  html: {},
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
                    <input type="${col.type}" class="form-control" id="${col.name+ "_id"}" name="${col.name}" placeholder="${col.placeholder|| ""}" required>
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
    <form id="${state.id + "-div-root"}">
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