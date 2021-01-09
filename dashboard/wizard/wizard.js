import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import modal from 'https://ventumdashboard.s3.amazonaws.com/dashboard/modal/modal.js';
import buttons from 'https://ventumdashboard.s3.amazonaws.com/dashboard/buttons/buttons.js';
import table from 'https://ventumdashboard.s3.amazonaws.com/dashboard/table/table.js';


const dfltState = {
    id: "noID",
    title: "Wizard",
    dfltPage:0,
    pages:{}
};

var states = [];

//------------------------------ Públicos -----------------------------------------------------------------

// filter, edit, erase, add, dismissModal, post, update, modal
const cmd = (state, cmds, res, pos) => {

    const parentCmd = (state, payload, res) => {
        switch (state.parentState.type) {
            case "modal":
                payload.cmds = payload.cmds || res;
                return modal.cmd(state.parentState, payload.cmds, res, 0);
            default:
                return new Promise((resolve, reject) => {
                    reject("Error with type: " + key);
                })
        }
    };

    const post = (state, payload, res) => {
      var options = {
        method: payload.method || 'GET',
        mode: payload.mode || 'cors',
        cache: payload.cache || 'no-cache',
        credentials: payload.credentials || 'same-origin',
        headers: payload.headers || {
          'Content-Type': 'application/json'
        },
        redirect: payload.redirect || 'follow',
        referrerPolicy: payload.referrerPolicy || 'no-referrer',
      };
      if (options.method == "POST") {
        options.body = JSON.stringify(payload.body || res)
      }
      return fetch(payload.url, options);
    };

    const ifCmd = (state, payload, res) => {
        return new Promise((res, rej) => {
            rej("not implemented!");
        });
    };

    const dismissModal = (state, payload, res) => {
        return new Promise((res, rej) => {
            rej("not implemented!");
        });
    };
  
    const goToPage = (state, payload, res) => {
      return new Promise((res, rej) => {
        rej("not implemented!");
      });
    };

    console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);

    return new Promise((resolve, reject) => {
        //A: Si ya ejecute todos los comandos termino
        if (Object.keys(cmds).length == pos) {
            resolve();
        } else {
            var c = null;
            var command = cmds[pos];
            switch (command.type) {
                case "parent-cmd":
                    c = () => parentCmd(state, command.payload, res);
                    break;
                case "post":
                    c = () => post(state, command.payload, res);
                    break;
                case "modal":
                    c = () => modal.create(command.payload, res);
                    break;
                case "if":
                    c = () => ifCmd(state, command.payload, res);
                    break;
                case "dismiss-modal":
                    c = () => dismissModal(state, command.payload, res);
                    break;
                case "go-to":
                    c = () => goToPage(state, command.payload, res);
                    break;
                default:
                    console.log(`Cmd not found: ${command.type}`);
                    c = () => new Promise((res, rej) => { rej(`Cmd not found: ${command.type}`) });
                    break;
            }

            c()
                .then((res) => {
                    cmd(state, cmds, res, pos + 1);
                })
                .then((res) => resolve(res))
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        }
    });
};

const resetStates = () => {
    if (states.length > 0) {
        states.forEach((el) => {
            el = null;
        })
    }
    states = [];
};

const create = (data, parent) => {

  const createRow = (parent) => {
    const margins = 20;
    var row = document.createElement("div");
    row.style.position = 'relative';
    row.style.left = margins + 'px';
    row.style.right = margins + 'px';
    row.style.top = margins + 'px';
    row.style.bottom = margins + 'px';
    row.style.marginBottom = "20px";
    row.style.width = (parent.offsetWidth - margins) * 100 / parent.offsetWidth + '%';
    row.style.height = 'auto';
    row.className += " row";
    // tableRoot.style.height = (parent.offsetHeight - margins * 2) * 100 / parent.offsetHeight + '%';
    parent.appendChild(row);
    return row;
  };

  const createCol = (parent) => {
      const margins = 0;
      var col = document.createElement("div");
      col.style.position = 'relative';
      col.style.left = margins + 'px';
      col.style.right = margins + 'px';
      col.style.top = margins + 'px';
      col.style.bottom = margins + 'px';
      col.style.width = (parent.offsetWidth - margins * 2) * 100 / parent.offsetWidth + '%';
      col.style.height = 'auto';
      col.className += " col";
      // tableRoot.style.height = (parent.offsetHeight - margins * 2) * 100 / parent.offsetHeight + '%';
      parent.appendChild(col);
      return col;
  };

  try {
    table.resetStates();
    Object.values(data.content.rows).forEach(row => {
        var rowDiv = createRow(parent);
        Object.values(row.cols).forEach(col => {
            var colDiv = createCol(rowDiv);
            Object.values(col).forEach(element => {
                switch (element.type) {
                    case "table":
                        table.create(element.payload, colDiv);
                        break;
                    case "form":
                        form.create(element.payload, colDiv);
                        break;
                    default:
                        break;
                }
            });
        });
    });
  } catch (error) {
    console.log("Error creating wizard page! " + error);
  }
};

export default { create, resetStates, cmd, states };