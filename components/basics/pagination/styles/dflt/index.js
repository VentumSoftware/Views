const dfltState = {

};

const render = (state, parent) => {

  const getHTML = (state) => {
    return `
    <!-- Table -->
    <div id="${state.id + "_pagination_root"}">
      <nav aria-label="Page navigation example">
        <ul class="pagination" style="margin:0;">
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
          <li class="page-item" style="align-self:center;">2341 Resultados</li>
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

export default { dfltState, render }
