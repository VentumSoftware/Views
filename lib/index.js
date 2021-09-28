window.getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

window.fillObjWithDflt = (object, dflt, options) => {
  options = options || {};
  options.includeNonDflt = options.includeNonDflt || true;
  object = object || {};
  dflt = dflt || {};

  Object.keys(dflt).forEach(key => {
    if (key in object) {
      if (typeof (object[key]) === 'object')
        object[key] = fillObjWithDflt(object[key], dflt[key]);
      else
        object[key] = object[key];
    } else
      object[key] = dflt[key];
  })

  if (options.includeNonDflt) {
    Object.keys(object).forEach(key => {
      if (!(key in object)) {
        object[key] = object[key];
      }
    })
  }

  return object;
};

window.evalString = (str, vars) => {
  const getVars = (x, g) => {
    var result = "";
    console.log(`getVars g: ${g}`);
    if (vars[g] != null && vars[g] != undefined) result = vars[g];
    else result = eval(g);
    if (typeof result === 'object') result = JSON.stringify(result);
    console.log(`getVars result: ${result}`);
    return result;
  }

  return str.replace(/\${(.*?)}/g, getVars);
};

//callback function to stringify circular objects into json
window.refReplacer = () => {
  let m = new Map(), v = new Map(), init = null;

  return function (field, value) {
    let p = m.get(this) + (Array.isArray(this) ? `[${field}]` : '.' + field);
    let isComplex = value === Object(value)

    if (isComplex) m.set(value, p);

    let pp = v.get(value) || '';
    let path = p.replace(/undefined\.\.?/, '');
    let val = pp ? `#REF:${pp[0] == '[' ? '$' : '$.'}${pp}` : value;

    !init ? (init = value) : (val === init ? val = "#REF:$" : 0);
    if (!pp && isComplex) v.set(value, path);

    return val;
  }
};

//Ejecuta la promesa fn para cada elemento
window.forEachPromise = (items, fn) => {
  return items.reduce(function (promise, item) {
    return promise.then(function () {
      return fn(item);
    });
  }, Promise.resolve());
};

window.loadIndexes = (rootFolder) => {

  return new Promise((resolve, reject) => {
    var results = [];
    fetch(rootFolder)
      .then(res => res.json())
      .then(dirs => {
        return forEachPromise(dirs.fileList, (dir) => {
          return new Promise((res, rej) => {
            if (dir.name != '..' && dir.name.split('.').length === 1)
              import(rootFolder + "/" + dir.name + '/index.js')
                .then(({ default: style }) => results[dir.name] = style)
                .then(() => res());
            else res();
          })
        })
      })
      .then(() => resolve(results))

  })
};

window.stringToHTML = (str) => {
  var body = new DOMParser().parseFromString(str, 'text/html').body;
  var div = document.createElement('div');
  div.innerHTML = body.innerHTML;
  return div;
};

window.fetchWAT = (url, options = {}) => {
  options.headers = { "access-token": getCookie("access-token") };
  return fetch(url, options);
};

export default {}