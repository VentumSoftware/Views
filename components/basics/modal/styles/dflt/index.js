const dfltState = {
  show: false,
  html: {},
  childs: {}
};

const render = (state, parent) => {

  const getHTML = (state) => {

    return `
    <!-- Modal -->
    <div class="modal" tabindex="-1" id="${state.id + "_root"}" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header" id="${state.id + "_header"}">
          </div>
          <div class="modal-body" id="${state.id + "_body"}">
          </div>
          <div class="modal-footer" id="${state.id + "_footer"}">
          </div>
        </div>
      </div>
    </div>
    `
  };

  const getReferences = (state, root) => {
    state.html = {
      root: root.getElementById(state.id + "_root"),
      header: root.getElementById(state.id + "_header"),
      body: root.getElementById(state.id + "_body"),
      footer: root.getElementById(state.id + "_footer")
    };
    return state;
  };

  const renderChilds = (state) => {
    return new Promise((res, rej) => {

      const renderHeader = (state) => {
        return new Promise((res, rej) => {
          if (state.title)
            state.html.header.appendChild(utils.stringToHTML(`<h5 class="modal-title">${state.title}</h5>`));

          if (state.childs.header) {
            views.render(state.childs.header, state.html.header)
              .then(child => {
                if (state.closeBtn)
                  state.html.header.appendChild(utils.stringToHTML(`<button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>`));
                state.childs.header = child;
                res(state);
              });
          } else if (state.closeBtn) {
            state.html.header.appendChild(
              utils.stringToHTML(`
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
            views.render(state.childs.body, state.html.body)
              .then(child => {
                state.childs.body = child;
                res(state);
              });
          }
          else if (state.description) {
            state.html.body.appendChild(utils.stringToHTML(`<p>${state.description}</p>`));
            res(state);
          } else {
            res(state);
          }
        });
      };

      const renderFooter = (state) => {
        return new Promise((res, rej) => {
          if (state.childs.footer) {
            views.render(state.childs.footer, state.html.footer)
              .then(child => {
                state.childs.footer = child;
                res(state);
              });
          }
          else if (state.footerText) {
            state.html.footer.appendChild(utils.stringToHTML(`<h5 class="modal-footer">${state.footerText}</h5>`));
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

  state = utils.fillObjWithDflt(state, dfltState);

  return new Promise((res, rej) => {
    var html = utils.stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html.getRootNode());
    renderChilds(state)
      .then(state => {
        if (state.show == true) $(`#${state.id}_root`).modal('show');
        else $(`#${state.id}_root`).modal('hide');
        res(state);
      });
  });
};


export default { dfltState, render };