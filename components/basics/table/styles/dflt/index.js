const dfltState = {
};

const render = (state, parent) => {

  const getHTML = (state) => {

    var headers = "";

    Object.values(state.headers).forEach(header => {
      headers += `<th>${header.title}</th>`;
    })


    var body = "";
    Object.values(state.rows).forEach(row => {
      body += `<tr>`;
      for (let i = 0; i < Object.values(state.headers).length; i++) {
        body += `<td>${row[i] || state.emptyCellChar}</td>`;
      }
      body += `<tr>`;
    })

    return `
    <!-- Table -->
    <div class="table-responsive" id="${state.id + "-table-root"}">
      <table class="table table-striped" style="margin-bottom:0;">
        <thead>
          <tr>
          ${headers}
          </tr>
        </thead>
        <tbody>
          ${body}
        </tbody>
      </table>
    </div>
    `
  };

  const getReferences = (state, root) => {
    state.html = {
      root: root.getElementById(state.id + "-table-root"),
    };
    return state;
  };

  const renderChilds = (state) => {
    return new Promise((res, rej) => {
      var childsKV = Object.entries(state.childs);
      forEachPromise(childsKV, (childKV) => {
        return new Promise((res, rej) => {
          views.render(childKV[1], state.html.col)
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

const update = (state) => {

  return new Promise((res, rej) => {
    var headers = "";

    Object.values(state.headers).forEach(header => {
      headers += `<th>${header.title}</th>`;
    });

    var body = "";
    Object.values(state.rows).forEach(row => {
      body += `<tr>`;
      for (let i = 0; i < Object.values(state.headers).length; i++) {
        body += `<td>${row[i] || state.emptyCellChar}</td>`;
      }
      body += `<tr>`;
    });

    state.html.root.innerHTML = `
      <table class="table table-striped" style="margin-bottom:0;">
        <thead>
          <tr>
          ${headers}
          </tr>
        </thead>
        <tbody>
          ${body}
        </tbody>
      </table>
    `;

    res(state);
  });
};


export default { dfltState, render, update };