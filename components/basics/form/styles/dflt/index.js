const dfltState = {
  show: true,
  html: {},
  childs: {}
};

const render = (state, parent) => {
  const getHTML = (state) => {
    var formChilds = "";
    var i = 0;
    var j = 0;
    var childs = Object.values(state.childs);
    var childPos = 0;
    // <div class="form-group row">
    //   <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
    //   <div class="col-sm-10">
    //     <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
    //   </div>
    // </div>
    for (let i = 0; i < state.rows; i++) {
      formChilds += `<div class="form-group row">`;
      for (let j = 0; j < state.cols; j++) {
        formChilds += `<div class="col">`;
        if (childPos < childs.length) {
          var child = childs[childPos];
          if(child.label ||true)
            formChilds += `<label class="col-form-label">ssss</label>`;
            formChilds += `<input type="email" class="form-control" id="inputEmail3" placeholder="Email">`;
        };
        formChilds += `</div>`;
      }
      formChilds += `</div>`;
    }
    return `
    <!-- Form -->
    <form>
      ${formChilds}
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

  const renderChilds = (state) => {
    return new Promise((res, rej) => {
      var childsKV = Object.entries(state.childs);
      window.utils.forEachPromise(childsKV, (childKV) => {
        return new Promise((res, rej) => {
          window.views.render(childKV[1], state.html.col)
            .then(childSt => {
              state.childs[childKV[0]] = childSt;
              res(state);
            });
        })
      });
      res(state);
    });
  };

  state = window.utils.fillObjWithDflt(state, dfltState);

  return new Promise((res, rej) => {
    var html = window.utils.stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html.getRootNode());
    // renderChilds(state)
    //   .then(state => {
    //     if (state.show == true) state.html.root.style.display = "none";
    //     else state.html.root.style.display = "block";
    //     res(state);
    //   });
    
      res(state);
  });
};

export default { dfltState, render };