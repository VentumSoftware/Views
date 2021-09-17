const dfltState = {
  //title: null,
  //description: null,
  //footerText: null,
  closeBtn: false,
  margin: "15px"
};

const render = (state, parent) => {

  const getHTML = (state) => {
    return `
    <div class="card shadow ventum-card" style="margin:${state.margin};" id="${state.id + "_root"}">
    <!-- Card -->
      <div class="card-header ventum-card-header" id="${state.id + "_header"}">
      </div>
      <div class="card-body ventum-card-body" id="${state.id + "_body"}">
      </div>
      <div class="card-footer ventum-card-footer" id="${state.id + "_footer"}">
      </div>
    </div>
    `
  };

  const getReferences = (state, root) => {
    console.log(state);
    state.html = {
      root: root.getElementById(state.id + "_root"),
      header: root.getElementById(state.id + "_header"),
      body: root.getElementById(state.id + "_body"),
      footer: root.getElementById(state.id + "_footer")
    };
    console.log(state);
    return state;
  };

  const renderChilds = (state) => {
    return new Promise((res, rej) => {

      const renderHeader = (state) => {
        return new Promise((res, rej) => {
          if (state.title)
            state.html.header.innerText = state.title;

          if (state.childs.header) {
            window.views.render(state.childs.header, state.html.header)
              .then(child => {
                if (state.closeBtn)
                  state.html.header.appendChild(window.utils.stringToHTML(`<button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>`));
                state.childs.header = child;
                res(state);
              });
          } else if (state.closeBtn) {
            state.html.header.appendChild(
              window.utils.stringToHTML(`
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              `));
            res(state);
          } else
            res(state);
        });
      };

      const renderBody = (state) => {
        return new Promise((res, rej) => {
          if (state.childs.body) {
            window.views.render(state.childs.body, state.html.body)
              .then(child => {
                state.childs.body = child;
                res(state);
              });
          }
          else if (state.description) {
            state.html.body.appendChild(window.utils.stringToHTML(`<p>${state.description}</p>`));
            res(state);
          } else {
            res(state);
          }
        });
      };

      const renderFooter = (state) => {
        return new Promise((res, rej) => {
          if (state.childs.footer) {
            window.views.render(state.childs.footer, state.html.footer)
              .then(child => {
                state.childs.footer = child;
                res(state);
              });
          }
          else if (state.footerText) {
            state.html.footer.appendChild(window.utils.stringToHTML(`<h5 class="modal-footer">${state.footerText}</h5>`));
            res(state);
          }
          else {
            res(state);
          }
        });
      };
      renderHeader(state)
        .then(state => renderBody(state))
        .then(state => renderFooter(state))
        .then(state => res(state))
    });
  };

  state = window.utils.fillObjWithDflt(state, dfltState);

  return new Promise((res, rej) => {
    var html = window.utils.stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html.getRootNode());
    renderChilds(state)
      .then(state => {
        if (state.show == true) state.html.root.style.display = "none";
        else state.html.root.style.display = "block";
        res(state);
      });
  });
};

export default { dfltState, render};