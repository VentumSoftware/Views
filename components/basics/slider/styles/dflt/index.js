const dfltState = {
  show: true,
  html: {},
  childs: {}
};

const render = (state, parent) => {

  const getHTML = (state) => {
    return `
    <!-- Table -->
    <div id="${state.id + "_pagination_root"}">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item"><a class="page-link" href="#">Primero</a></li>
          <li class="page-item"><a class="page-link" href="#"><<</a></li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item"><a class="page-link" href="#">4</a></li>
          <li class="page-item"><a class="page-link" href="#">5</a></li>
          <li class="page-item"><a class="page-link" href="#">6</a></li>
          <li class="page-item"><a class="page-link" href="#">7</a></li>
          <li class="page-item"><a class="page-link" href="#">8</a></li>
          <li class="page-item"><a class="page-link" href="#">9</a></li>
          <li class="page-item"><a class="page-link" href="#">10</a></li>
          <li class="page-item"><a class="page-link" href="#">>></a></li>
          <li class="page-item"><a class="page-link" href="#">Último</a></li>
          <li class="page-item">
            <div class="input-group" style="width:40%">
              <div class="input-group-prepend">
                <button class="btn btn-outline-secondary page-link" type="button">Ir</button>
              </div>
              <input type="number" class="form-control page-link" placeholder="1" aria-label="" aria-describedby="basic-addon1">
            </div>
          </li>
          <li class="page-item">2341 Resultados</li>
        </ul>
      </nav>
    </div>
    `
  };

  const getReferences = (state, root) => {
    state.html = {
      root: root.getElementById(state.id + "_pagination_root"),
    };
    return state;
  };

  const renderChilds = (state) => new Promise((res, rej) =>res(state));

  state = window.utils.fillObjWithDflt(state, dfltState);

  return new Promise((res, rej) => {
    var html = window.utils.stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html.getRootNode());
    renderChilds(state)
      .then(state => {
        if (state.show == true) state.html.root.style.display = "block";
        else state.html.root.style.display = "none";
        res(state);
      });
  });
};


// const render = (state, parent) => {

//   views.onEvent(state, "onBeforeRender", state.onBeforeRender);

//   var btn = document.createElement("button");
//   btn.style.display = state.display;
//   btn.style.width = state.width;
//   btn.style.height = state.height;
//   btn.style.position = state.position;
//   btn.style.overflowWrap = state.overflowWrap;

//   if (state.showLabel == "true") btn.innerHTML = state.label;
//   else btn.innerHTML = "";

//   //https://getbootstrap.com/docs/4.0/components/buttons/
//   var addOutline = "";
//   if (state.outline == "true") addOutline = "-outline";
//   btn.className = `btn btn${addOutline}-${state.btnType}`;
//   if (state.selected == "true") {
//       btn.className += " active";
//       var attr = document.createAttribute("aria-pressed");
//       attr.value = "true";
//       btn.setAttributeNode(attr);
//   };
//   if (state.enabled != "true") btn.disabled = true;
//   else btn.disabled = false;

//   btn.addEventListener('click', (e) => {
//       e.preventDefault();
//       views.onEvent(state, "onClick", state.onClick);
//   });

//   //https://fontawesome.com/v5.15/icons?d=gallery&p=2
//   var icon = document.createElement("i");
//   icon.className = `fa fa-${state.icon}`;
//   if (state.showIcon == "true") icon.style.display = "inherit";
//   else icon.style.display = "none";
//   btn.appendChild(icon);

//   state.html = {};
//   state.html.label = btn.innerHTML;
//   state.html.btn = btn;
//   state.html.icon = icon;

//   parent.appendChild(btn);

//   views.onEvent(state, "onRender", state.onRender);
//   return state;
// };

// const update = (state) => {
  
//   views.onEvent(state, "onBeforeUpdate", state.onBeforeUpdate);

//   state = utils.fillObjWithDflt(state, dfltState);
//   var btn = state.html.btn;
//   btn.style.display = state.display;
//   btn.style.width = state.width;
//   btn.style.height = state.height;
//   btn.style.position = state.position;
//   btn.style.overflowWrap = state.overflowWrap;

//   if (state.showLabel == "true") btn.innerHTML = state.label;
//   else btn.innerHTML = "";

//   //https://getbootstrap.com/docs/4.0/components/buttons/
//   var addOutline = "";
//   if (state.outline == "true") addOutline = "-outline";
//   btn.className = `btn btn${addOutline}-${state.btnType}`;
//   if (state.selected == "true") {
//       btn.className += " active";
//       var attr = document.createAttribute("aria-pressed");
//       attr.value = "true";
//       btn.setAttributeNode(attr);
//   } else {
//       btn.removeAttribute("aria-pressed");
//   }

//   if (state.enabled != "true") btn.setAttribute(document.createAttribute("disabled"));
//   else btn.removeAttribute("disabled");
      
//   //https://fontawesome.com/v5.15/icons?d=gallery&p=2
//   var icon = state.html.icon;
//   icon.className = `fa fa-${state.icon}`;
//   if (state.showIcon == "true") icon.style.display = "inherit";
//   else icon.style.display = "none";

//   views.onEvent(state, "onUpdate", state.onUpdate);
//   return state;
// };

export default { dfltState, render }
