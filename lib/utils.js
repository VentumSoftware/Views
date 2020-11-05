const dataUrl = "http://localhost:3000/api/get/";
const countUrl = "http://localhost:3000/api/getCount/";

const getData = (collection, query, queryOptions) => {
    return fetch(dataUrl + collection + "?query=" + JSON.stringify(query) + "&options=" + JSON.stringify(queryOptions))
        .then(response => response.json())
        .catch(err => console.log(err));
}

const getCount = (collection, query, queryOptions) => {
    if (query == null)
        query = {};
    if (queryOptions == null)
        queryOptions = {};
    return fetch(countUrl + collection + "?query=" + JSON.stringify(query) + "&options=" + JSON.stringify(queryOptions))
        .then(response => response.json())
        .catch(err => console.log(err));
}

const addCss = (path) => {
    var file = path.split("/").pop();

    var link = document.createElement("link");
    link.href = file.substr(0, file.lastIndexOf(".")) + ".css";
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";

    document.getElementsByTagName("head")[0].appendChild(link);
}

const isAnObjectArray = (obj) => {
    return isnu
}


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

const jsonToURLQuery = (query) => {
    var result = "?";
    if (typeof(query) != 'object') {
        return result;
    }
    Object.keys(query).forEach((key) => {
        result += key + "=" + query[key] + "&";
    });
    return result;
}

//Esto lo uso para eliminar los listeners del elemento hmtl
const replaceWithClone = (element) => {
    var new_element = element.cloneNode(true);
    element.parentNode.replaceChild(new_element, element);
    return new_element;
}
export default { getData, getCount, addCss, fillObjWithDflt, jsonToURLQuery, replaceWithClone };