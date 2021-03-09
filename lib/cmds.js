//Comandos genericos para cualquier elemento
var cmds = {
  getStateCmd : (state, payload, res) => {
  },
  parentCmd : (state, payload, res) => {
      switch (state.parentState.type) {
          case "modal":
              payload.cmds = payload.cmds || res;
              return modal.cmd(state.parentState, payload.cmds, res, 0);
          default:
              return new Promise((resolve, reject) => {
                  reject("Error with type: " + key);
              })
      }
  },
  childCmd : (state, payload, res) => {
  },
  fetch : (state, payload, res) => {
      console.log("fetch: " + JSON.stringify(payload))
      var options = {
          method: payload.method || 'GET',
          mode: payload.mode || 'cors',
          cache: payload.cache || 'no-cache',
          credentials: payload.credentials || 'same-origin',
          headers: payload.headers || { 'Content-Type': 'application/json' },
          redirect: payload.redirect || 'follow',
          referrerPolicy: payload.referrerPolicy || 'no-referrer',
      };
      if (options.method === "POST") {
          options.body = payload.body || {};

          if (typeof options.body === 'object')
              options.body = JSON.stringify(options.body);
          
          options.body = getStringVars(options.body);
      };

      return fetch(payload.url, options);
  },
  ifCond : (state, payload, res) => {
      return new Promise((res, rej) => {
          rej("not implemented!");
      });
  }
};

//Ejecuta una lista de comandos
const run = (state, cmds, res, pos) => {
  return new Promise((resolve, reject) => {
    //A: Si ya ejecuté todos los comandos termino
    if (Object.keys(cmds).length == pos) {
        resolve(res);
    } else {
        console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);
        if(typeof res === 'object') console.log(`res (${JSON.stringify(res)})`);  
        else console.log(`res (${res})`);

        var c = null;
        var command = cmds[pos];
        switch (command.type) {
            case "selected-rows":
                c = () => getSelectedRows(state, command.payload, res);
                break;
            case "delete-selected-rows":
                c = () => deleteSelectedRows(state, command.payload, res);
                break;
            case "parent-cmd":
                c = () => parentCmd(state, command.payload, res);
                break;
            case "filter":
                c = () => filter(state, command.payload, res);
                break;
            case "fetch":
                c = () => fetchCmd(state, command.payload, res);
                break;
            case "show-modal":
                c = () => showModal(state, command.payload, res);
                break;
            //TODO: CONFIRMATION BOX debería ser un template de modal...
            case "confirmationBox":
                c = () => confirmationBox(state, command.payload, res);
                break;
            case "if":
                c = () => ifCmd(state, command.payload, res);
                break;
            case "dismiss-modal":
                c = () => dismissModal(state, command.payload, res);
                break;
            case "update":
                c = () => update(state, command.payload, res);
                break;
            default:
                console.log(`Cmd not found: ${command.type}`);
                c = () => new Promise((res, rej) => { rej(`Cmd not found: ${command.type}`) });
                break;
        }

        c()
            .then((res) => cmd(state, cmds, res, pos + 1))
            .then((res) => resolve(res))
            .catch(err => {
                console.log(err);
                reject("Failed to executed cmds!");
            });
    }
});
};


export default { cmds, run };