const dfltState = {
  style: "dflt",
  show: true,
  html: {},
  childs: {}
};

const dfltCmp = {
  create: function (state) {
    state.style = state.style || "dflt";
    state = utils.fillObjWithDflt(state, this.styles[state.style].dfltState);
    state = utils.fillObjWithDflt(state, this.dfltState);
    const childKVs = Object.entries(state.childs);
    childKVs.forEach(childKV => state.childs[childKV[0]] = views.create(childKV[1]));
    return state;
  },
  renderChilds: function (state) {
    return new Promise((res, rej) => {
      var childsKV = Object.entries(state.childs);
      utils.forEachPromise(childsKV, (childKV) => {
        return new Promise((res, rej) => {
          views.render(childKV[1], state.html.content)
            .then(childSt => {
              state.childs[childKV[0]] = childSt;
              res(state);
            });
        })
      });
      res(state);
    });
  },
  render: function(state, parent) {
    return new Promise((res, rej) => {
      this.onEvent(state, "onBeforeRender", state.onBeforeRender);
      if (state.html.root != null) {
        state.html.root.parentNode.removeChild(state.html.root);
      }
      state.html = {};
      this.styles[state.style].render(state, parent)
        .then(state => {
          views.onEvent(state, "onAfterRender", state.onAfterRender);
          res(state);
        });
    });
  },
  hide: function (state) {
    const visible = views.isRendering(state);
    if (visible) {
      views.onEvent(state, "onHide", state.onHide);
    }
    state.show = false;
    if (state.html.root) {
      state.html.root.style.display = "none";
    }
    console.log(`${state.type} "${state.id}" hidden!`);
    return state;
  },
  show: function (state, show = true) {
    const visible = views.isRendering(state);
    if (!visible) {
      views.onEvent(state, "onShow", state.onShow);
    }
    state.show = true;
    if (state.html.root) {
      state.html.root.style.display = "block";
    }
    console.log(`${state.type} "${state.id}" showed!`);
    return state;
  },
  isRendering: function (state) {
    if (state.html.root == null) return false;
    var result = true;
    var parent = state.html.root.parentNode;
    while (parent != null) {
      if (parent.style && parent.style.display == "none")
        result = false;
      parent = parent.parentNode;
    }
    return result;
  }, //reviso todo el arblo a ver si tiene un parent apagado
  getParent: function(state, root = globalState) {
    let containsChild = (state, parent) => {
      let found = Object.values(parent.childs).find(c => c === state);
      if (found) return true;
      else return false;
    };
  
    try {
      if (root.childs == null || Object.values(root.childs).length == 0)
        return null;
      else if (containsChild(state, root))
        return root;
      else {
        let childs = Object.values(root.childs);
        for (let i = 0; i < childs.length; i++) {
          let a = views.getParent(state, childs[i]);
          if (a != null) return a;
        }
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  onEvent: function(state, eventName, func, otherData){
    //Ejecución de un evento de un componente (Ej: Click en un botón)
    return new Promise((resolve, reject) => {
      if (func != null) {
        try {
          console.log(`Event: ${eventName}`);
          console.log(state);
          if (typeof func === 'string') func = eval(func);
          let r = func(state, otherData);
          if (r instanceof Promise) r.then((res) => resolve(state));
          else resolve(state);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      } else {
        //console.log(`Event not defined: ${eventName}`);
        console.log(`Event: ${eventName} is null`);
        console.log(state);
        resolve(state);
      }
    });
  }
};

const getComponents = () => {

  const createCmp = (cmp, path) => {
    return new Promise((res, rej) => {
      cmp.type = path.split("cmp_")[1].split(".")[0];
      cmp.path = path;
      cmp.stylesPath = path.split("cmp_")[0] + 'styles';
      cmp.dfltState = utils.fillObjWithDflt(cmp.dfltState, dfltState);
      utils.loadIndexes(cmp.stylesPath)
        .then(styles => {
          cmp.styles = styles;
          cmp = utils.fillObjWithDflt(cmp, dfltCmp);
          res(cmp);
        });
    });
  };

  // Me devuelve los path de todos los archivos con el formato cmp_<componente>.js
  const getCmpPaths = (rootFolder) => {
    return new Promise((resolve, reject) => {
      let results = [];
      fetch(rootFolder)
        .then(res => res.json())
        .then(dirs => {
          let promises = [];
          dirs.fileList.forEach(dir => {
            let name = dir.name;
            //".." es el nombre de la carpeta donde estamos
            if (name !== "..") {
              if (name.split('.').length === 1) {
                //A: es una carpeta
                promises.push(getCmpPaths(rootFolder + "/" + name));
              } else if (name.startsWith("cmp_") && name.endsWith(".js")) {
                //A: es un componente
                results.push(rootFolder + "/" + name);
              }
            }
          });
          return Promise.all(promises);
        })
        .then(paths => {
          paths.forEach(subPaths => results = results.concat(subPaths));
          resolve(results);
        });
    })
  };

  return new Promise((resolve, reject) => {
    let results = {};
    const rootFolder = '/public/Views/components';
    let paths = [];
    getCmpPaths(rootFolder)
      .then(p => {
        paths = p;
        let promises = [];
        console.log("Components paths found:");
        console.log(paths);
        paths.forEach(path => {
          promises.push(import(path)
            .then(({ default: cmp }) => createCmp(cmp, path))
            .then(cmp => results[cmp.type] = cmp));
        });
        return Promise.all(promises);
      })
      .then(_ => {
        console.log("Components loaded:");
        console.log(results);
        resolve(results);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
  });
};

export default { getComponents };

// const dfltCmp = {
      //   id: "no-ID-" + type,
      //   type: type,
      //   style: "dflt",
      //   show: true,
      //   log: false,
      //   html: {},// Referencias a los componentes de html
      //   childs: {},
      //   render: (parent) => {
      //     return new Promise((res, rej) => {
      //       onEvent("onBeforeRender", this.onBeforeRender);

      //       if (state.html.root != null)
      //         state.html.root.parentNode.removeChild(state.html.root);
      //       state.html = {};
      //       styles[state.style].render(state, parent)
      //         .then(state => {
      //           views.onEvent(state, "onAfterRender", state.onAfterRender);
      //           res(state);
      //         });
      //     });
      //   },
      //   hide: (show = false) => {
      //     if (state._showing)
      //       views.onEvent(state, "onHide", state.onHide);
      //     state._showing = false;
      //     state.show = show;
      //     if (!state.show)
      //       state.html.root.style.display = "none";
      //     Object.values(childs).forEach(child => window.views.hide(child, child.show));
      //     return state;
      //   },
      //   show: (show = false) => {
      //     if (!state._showing)
      //       views.onEvent(state, "onShow", state.onShow);
      //     state._showing = false;
      //     state.show = show;
      //     if (!state.show)
      //       state.html.root.style.display = "none";
      //     Object.values(childs).forEach(child => window.views.hide(child, child.show));
      //     return state;
      //   },
      //   isRendering: (state) => state._showing,
      //   getParent: (root) => window.views.getParent(this, root),
      //   onEvent: (eventName, func, otherData) => {
      //     //Ejecución de un evento de un componente (Ej: Click en un botón)
      //     return new Promise((resolve, reject) => {
      //       if (func != null) {
      //         try {
      //           console.log(`Event: ${eventName}`);
      //           console.log(cmps)
      //           if (typeof func === 'string') func = eval(func);
      //           let r = func(state, otherData);
      //           if (r instanceof Promise) r.then((res) => resolve(state));
      //           else resolve(state);
      //         } catch (error) {
      //           console.log(error);
      //           reject(error);
      //         }
      //       } else {
      //         //console.log(`Event not defined: ${eventName}`);
      //         resolve(state);
      //       }
      //     });
      //   }
      // }


      // const onEvent = (eventName, func, otherData) => {
      //   //Ejecución de un evento de un componente (Ej: Click en un botón)
      //   return new Promise((resolve, reject) => {
      //     if (func != null) {
      //       try {
      //         console.log(`Event: ${eventName}`);
      //         console.log(cmps)
      //         if (typeof func === 'string') func = eval(func);
      //         let r = func(state, otherData);
      //         if (r instanceof Promise) r.then((res) => resolve(state));
      //         else resolve(state);
      //       } catch (error) {
      //         console.log(error);
      //         reject(error);
      //       }
      //     } else {
      //       //console.log(`Event not defined: ${eventName}`);
      //       resolve(state);
      //     }
      //   });
      // };