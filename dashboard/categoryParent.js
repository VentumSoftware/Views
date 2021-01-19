import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';
import modal from 'https://ventumdashboard.s3.amazonaws.com/dashboard/modal/modal.js';
import table from 'https://ventumdashboard.s3.amazonaws.com/dashboard/table/table.js';
import wizard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/wizard/wizard.js';
import category from 'https://ventumdashboard.s3.amazonaws.com/dashboard/category.js';

//--------------------------------- Category --------------------------------------------

var dfltState = {
  id: "noId",
  name: "No Name",
  access: {},
  selectedChild : "",
  childs : {}
};

var states = [];

//--------------------------------- Public Interface ------------------------------------

const cmd = (state, cmds, res, pos) => {

  const removeState = (state, payload, res) => { };

  const resetStates = (state, payload, res) => {
    if (states.length > 0) {
      states.forEach((el) => {
        el = null;
      })
    }
    states = [];
  };

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

  //Vuelve a cargar la vista seleccionada
  const reloadCat = (state, payload, res) => {
    selectCategory(state.selectedCat);
  };

  //Hace un post al endpoint indicado en el payload con el estado de la categoria como body
  const post = (invokerState, payload, res) => {
    var body = {
      tablesState: table.states,
      formsStates: form.states,
    }
  };

  console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);

  try {
    //A: Si ya ejecute todos los comandos termino
    if (Object.keys(cmds).length <= pos) {
      resolve(res);
    } else {
      var c = null;
      var command = cmds[pos];
      switch (command.type) {
        case "reload":
          c = () => reloadCat(state, command.payload);
          break;
        case "post":
          c = () => post(state, command.payload);
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
  } catch (error) {
    console.log(error);
  }
};

const create = (newState, path) => {
  try {
    if (newState.type == "category-parent") {
      newState = utils.fillObjWithDflt(newState, dfltState);
      newState.path = path;

      Object.entries(newState.childs).forEach(child => {
        switch (child[1].type) {
          case "category":
            newState.childs[child[0]] = category.create(child[1], path + "/" + child[0]);
            break;
          case "category-parent":
            newState.childs[child[0]] = create(child[1], path + "/" + child[0]);
            break;
          default:
            console.log("Error creating category-parent child, incorrect type: " + child[1].type);
            break;
        }
      });
      //console.log("Category-Parent new State: " + JSON.stringify(newState));
      states.push(newState);
      return newState;
    } else {
      console.log("Error creating category-parent, incorrect type: " + newState.type);
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const show = (state, parent) => {

  console.log("Category-parent show: " + JSON.stringify(state));
  try {
    var child = state.categories[state.selectCategory];

    a = show(state, parent);
  } catch (error) {
    console.log("Error showing category! " + error);
  }
};

export default { create, show, cmd };