
//Hace algo parecido a los "backslashs": hace un eval de los que esta andentro de ${}
const evalString = (str) => str.replace(/\${(.*?)}/g, (x, g) => eval(g));

// Llena los campos de "object" que no estan definidos con los de dflt
const fillObjWithDflt = (object, dflt, options) => {
    options = options || {};
    options.includeNonDflt = options.includeNonDflt || true;
    object = object || {};
    dflt = dflt || {};
    var result = {};

    Object.keys(dflt).forEach(key => {
        if (key in object) {
            if (typeof(object[key]) == 'object')
                result[key] = fillObjWithDflt(object[key], dflt[key]);
            else
                result[key] = object[key];
        } else
            result[key] = dflt[key];
    })

    if (options.includeNonDflt) {
        Object.keys(object).forEach(key => {
            if (!(key in result)) {
                result[key] = object[key];
            }
        })
    }

    return result;
}

//Esto lo uso para eliminar los listeners del elemento hmtl
const replaceWithClone = (element) => {
    var new_element = element.cloneNode(true);
    element.parentNode.replaceChild(new_element, element);
    return new_element;
}

export default { fillObjWithDflt,replaceWithClone,evalString };