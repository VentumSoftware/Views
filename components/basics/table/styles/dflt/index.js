const dfltState = {
};

const getHeadersRowsHTML = (state, root) => {
  state.html.headers = Array.from(root.getElementsByTagName("TH"));
  let rows = Array.from(root.getElementsByTagName("TR"));
  state.html.rows = rows.map(r=> Array.from(r.getElementsByTagName("TD")));
  return state;
};

const renderChilds = (state) => {
  let childs = Object.entries(state.childs);
  return new Promise((res,rej) => {
    forEachPromise(childs, (child) => {
      let i = child[0].split("_")[0];
      let j = child[0].split("_")[1];
      return views.render(child[1], state.html.rows[Number.parseInt(i) +1][j]);
    }).then(_=> res(state));
  })
  
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
        body += `<td style="padding: .5rem;vertical-align: middle;">${row[i] || state.emptyCellChar}</td>`;
      }
      body += `</tr>`;
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
    state= getHeadersRowsHTML(state, state.html.root);
    return state;
  };

  state = fillObjWithDflt(state, dfltState);

  return new Promise((res, rej) => {
    var html = stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html.getRootNode());
    renderChilds(state)
      .then(_ => {
        if (state.show == true) state.html.root.style.display = "block";
        else state.html.root.style.display = "none";
        res(state);
      });
  });
};

const update = (state) => {

  console.log("update")
  console.log(state)

  return new Promise((res, rej) => {
    var headers = "";

    Object.values(state.headers).forEach(header => {
      headers += `<th>${header.title}</th>`;
    });

    var body = "";
    Object.values(state.rows).forEach((row, index) => {
      body += `<tr>`;
      for (let i = 0; i < Object.values(state.headers).length; i++) {
          body += `<td style="padding: .5rem;vertical-align: middle;">${row[i] || state.emptyCellChar}</td>`;
      }
      body += `</tr>`;
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

    state = getHeadersRowsHTML(state, state.html.root);
    renderChilds(state).then(res).catch(console.log);
  });
};


export default { dfltState, render, update };