//Herramientas utiles que usamos por ahí
import comp from './components/index.js';
import utils from './lib/index.js';
window.utils = utils;
// ---------------------------- Aux Funcs -------------------------

const serializeState = (state = globalState) => {
  let type = typeof (state);
  switch (type) {
    case 'object':
      if (state != null)
        Object.entries(state).forEach(el => state[el[0]] = serializeState(el[1]));
      break;
    case 'function':
      state = state.toString();
      break;
    case 'boolean':
      state = state.toString();
      break;
  }
  return state;
};

// Cargo los .js de los cmps
const loadComponents = () => {

  // Cargo los .css y scripts referenciados
  const loadDependencies = (cmps) => {
    const getLocalCSSFiles = () => {

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
                  } else if (name.endsWith(".css")) {
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
        let results = [];
        const rootFolder = '/public/Views/components';
        getCmpPaths(rootFolder)
          .then(p => {
            console.log("Dependencies found:");
            console.log(p);
            p.forEach(path => results.push(path));
            resolve(results);
          })
      });
    };
    return new Promise((res, rej) => {
      let dependencies = [];
      //Array de objetos {paths(strings):css}
      getLocalCSSFiles().then((CSSs) => {
        CSSs.forEach(css => {
          dependencies.push({
            href: css
          });
        });
        Object.values(cmps).forEach((cmp) => {
          dependencies.concat(cmp.dependencies || []);
        })
        dependencies.forEach((dependency) => {
          console.log(dependency)
          if (dependency.src) {
            //A: es un .js
            let oldScripts = Array.from(document.getElementsByTagName("script")).filter(s => s.src == dependency.src);
            oldScripts.forEach(old => old.remove());
            let script = document.createElement("script");
            script.src = dependency.src;
            if (dependency.integrity != null) script.integrity = dependency.integrity;
            script.crossOrigin = dependency.crossOrigin || "anonymous";
            document.head.appendChild(script);
          } else if (dependency.href) {
            //A: es un .css
            let oldLinks = Array.from(document.getElementsByTagName("link")).filter(css => css.href == dependency.href);
            oldLinks.forEach(old => old.remove());
            let link = document.createElement("link");
            link.rel = dependency.rel || "stylesheet";
            link.href = dependency.href;
            if (dependency.integrity != null) link.integrity = dependency.integrity;
            link.crossOrigin = dependency.crossOrigin || "anonymous";
            document.head.appendChild(link);
          } else {
            throw new Error("Error al cargar dependencia: " + dependency.path);
          }
        });
        window.dependencies = dependencies;
        res(dependencies);
      })
    });
  };

  return new Promise((res, rej) => {
    comp.getComponents()
      .then(comps => {
        window.cmps = comps;
        return loadDependencies(comps);
      })
      .then(() => res(cmps))
      .catch(err => rej(err));
  });
};

// ----------------------------- State funcs -------------------------

// Completa los valores que faltan a state con los dflt del cmp y le agrega las funciones
const create = (state) => cmps[state.type].create(state);
// Dibuja el componente dentro del parent (nodo html)
const render = (state, parent) => cmps[state.type].render(state, parent);
const hide = (state, parent) => cmps[state.type].hide(state, parent);
const show = (state, parent) => cmps[state.type].show(state, parent);
const isRendering = (state, parent) => cmps[state.type].isRendering(state, parent);
//Me devuelve el componente padre del child
const getParent = (state, root = globalState) => cmps[state.type].getParent(state, root);
const onEvent = (state, eventName, func, otherData) => cmps[state.type].onEvent(state, eventName, func, otherData);

const call = (func, state, params) => cmps[state.type][func](params);

export default {
  serializeState, loadComponents,
  create, render,hide,show, render, isRendering, getParent, onEvent, call,
};