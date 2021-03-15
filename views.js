//Herramientas utiles que usamos por ahí
import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';

//Componente "root" del view
import dashboard from "https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js";

//Componentes que pueden ser hijos del "dashboard"
import category from 'https://ventumdashboard.s3.amazonaws.com/dashboard/category.js';
import categoryParent from 'https://ventumdashboard.s3.amazonaws.com/dashboard/categoryParent.js';

//Componentes que pueden ser hijos del "category"
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';
import table from 'https://ventumdashboard.s3.amazonaws.com/dashboard/table/table.js';
import wizard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/wizard/wizard.js';
import map from 'https://ventumdashboard.s3.amazonaws.com/dashboard/maps/maps.js';
import modal from 'https://ventumdashboard.s3.amazonaws.com/dashboard/modal/modal.js';
import chart from 'https://ventumdashboard.s3.amazonaws.com/dashboard/chart/chart.js';

//Comandos genéricos para cualquier elemento
var cmds = {
  getState: (state, payload, res) => {
    return new Promise((resolve, reject) => {
      resolve(state);
    });
  },
  parentCmd: (state, payload, res) => {
    try {
      return [state.parentState.type].cmd(state.parentState, payload.msgs, res);
    } catch (error) {
      console.log(error);
      reject("Failed to run parentCmd");
    }
  },
  childCmd: (state, payload, res) => {
    try {
      var child = state.childs[payload.child];
      return [child.type].cmd(child, payload.msgs, res);
    } catch (error) {
      console.log(error);
      reject("Failed to run childCmd");
    }
  },
  showModal: (state, payload, res) => {
    return new Promise((resolve, reject) => {
        try {
            modal.show(state.childs[payload.child], state);
            resolve();
        } catch (error) {
            console.log(error)
            reject("Failed to show modal!");
        }
    })
  },
  fetch: (state, payload, res) => {
    try {
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
        if (typeof options.body === 'object') options.body = JSON.stringify(options.body);
        options.body = utils.evalString(options.body);
      };
      return fetch(payload.url, options);
    } catch (error) {
      console.log(error);
      return Promise.reject("Failed fetch cmd!");
    }
  },
  if: (state, payload, res) => {
    return new Promise((resolve, reject) => {
      if (eval(payload.condition)) {
          console.log("condicion cumplida!");
      } else {
          console.log("condicion NO cumplida!");
      }
      resolve("ok");
    });
  },
  showCmd: (state, payload, res) => {
    return new Promise((resolve, reject) => {
      try {
        eval(state.type).show(state, payload.parent);
        resolve("ok");
      } catch (error) {
        console.log(error);
        reject(`Failed to show: ${state}`);
      }
    });
  }
};

//Ejecuta una lista de comandos
const run = (state, msgs, res) => {
  return new Promise((resolve, reject) => {
    try {
      //Si msgs es un objeto lo convierto a un array
      if (typeof msgs === 'object') msgs = Object.values(msgs);

      //console.log(`run "state": ${JSON.stringify(state)}`);
      console.log(`run "state": ${JSON.stringify(state.type)}`);
      console.log(`run "msgs": ${JSON.stringify(msgs)}`);
      //console.log(`run "res": ${JSON.stringify(res)}`);

      //A: Si ya ejecuté todos los comandos termino
      if (Object.keys(msgs).length === 0) {
        //console.log(`run completed "state": ${JSON.stringify(state)}`);
        console.log(`run completed "state": ${state.type}`);
        //console.log(`run completed "res": ${JSON.stringify(res)}`);
        resolve(res);
      } else {
        var msg = msgs.shift();
        var cmd = eval(state.type).cmds[msg.type] || cmds[msg.type];
        if (cmd === null || cmd === undefined) {
          reject(`Cmd: ${msg.type} not found!`);
        } else {
          var c = () => cmd(state, msg, res);
          c()
            .then((res) => {
              console.log(`cmd executed: ${msgs.shift()}`);
              //console.log(`cmd "res": ${res}`);
              return run(state, msgs, res);
            })
            .then((res) => resolve(res))
            .catch(err => {
              console.log(err);
              reject("Failed to run msg!");
            });
        }
      }
    } catch (error) {
      console.log(error);
      reject(`run failed: ${JSON.stringify(msgs)}`)
    }
  });
};

const create = (newState) => {
  try {
    newState = utils.fillObjWithDflt(newState, eval(newState.type).dfltState);
    Object.entries(newState.childs).forEach(child => {
      if (eval(newState.type).childTypes.includes(child[1].type)) {
        child[1].path = newState.path + "/" + child[0];
        newState.childs[child[0]] = create(child[1]);
      } else {
        throw `Incorrect child type (${child[1].type}) for ${newState.type}`;
      }
      
    });
  } catch (error) {
    console.log(error);
    throw "Failed to create state: " + JSON.stringify(newState);
  }
  return newState;
};

const show = (state, parent) => {
  try {
    eval(state.type).show(state, parent);
  } catch (error) {
    console.log(error);
    throw "Failed to show state: " + JSON.stringify(state);
  }
  return state;
};


export default { cmds, run, create, show };