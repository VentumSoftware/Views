const dfltState = {
  show: true,
  html: {},
  childs: {}
};

const render = (state, parent) => {

  const getHTML = (state) => {
    return `
    <!-- Div -->
    <div id="${state.id}-div-root">
      <div class="row" id="${state.id}-div-row">
        <div class="col" id="${state.id}-div-col">
        </div>
      </div>
    </div>
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
      forEachPromise(childsKV, (childKV) => {
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

  state = fillObjWithDflt(state, dfltState);

  return new Promise((res, rej) => {
    var html = stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html.getRootNode());
    renderChilds(state)
      .then(state => {
        if (state.show == true) state.html.root.style.display = "block";
        else state.html.root.style.display = "none";
        res(state);
      });
  });
};


export default { dfltState, render };