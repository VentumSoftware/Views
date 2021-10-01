const dfltState = {
  index: 0,
  elementsPerPage: 10,
  totalElements: 0,
  section: 0,
  pagesPerSection: 10,
  firstText: "Primero",
  lastText: "Último",
  goText: "Ir",
  foundsText: "Resultados",
  //getData: (state) => {},
  //getCount: (state) => {},
  onBtnPressed: (state, btn) => {
    let page = Number.parseInt(btn.innerText);
    if (!Number.isNaN(page)) {
      page--;
      state.index = state.elementsPerPage * page;
    } else if (btn.innerText === "<<") {
      state.section = Math.max(Number.parseInt(state.section)-1, 0);
    } else if (btn.innerText === ">>") {
      const maxSection = Number.parseInt((state.totalElements/state.elementsPerPage)/state.pagesPerSection);
      state.section = Math.min(Number.parseInt(state.section)+1, maxSection);
    } else if (btn.innerText === "Primero") {
      state.index = 0;
      state.section = 0;
    }else if (btn.innerText === "Último") {
      const maxPage = Number.parseInt(state.totalElements/state.elementsPerPage);
      const maxSection = Number.parseInt(maxPage/state.pagesPerSection);
      state.index = state.totalElements - state.elementsPerPage;
      state.section = maxSection;
    }
    return update(state);
  },
  //onAfterUpdate: ()=>{console.log("hola")},
};
const update = (state) => {

  const getPagesHTML = (state) => {
    const aStyle = (state, N) => {
      if (N === cmps.pagination.getSelectedPage(state)) return `style="font-weight: bolder;"`;
      else return "";
    };
    let result = "";
    let pages = Math.min(state.pagesPerSection, ((state.totalElements - state.index) / state.elementsPerPage));
    for (let i = 0; i < pages; i++) {
      const pageN = state.section * state.pagesPerSection + i;
      result += `
      <li class="page-item">
        <a class="page-link" ${aStyle(state, pageN)} href="#">${pageN + 1}</a>
      </li>`;
    }
    return result;
  };

  return new Promise((res, rej) => {
    state.getData = eval(state.getData);
    state.getCount = eval(state.getCount);
    state.getData(state)
      .then(data => state.data = data)
      .then(_ => state.getCount(state))
      .then(count => state.totalElements = count)
      .then(_ => {
        state.html.root.innerHTML = `
            <nav aria-label="Page navigation example">
              <ul class="pagination" style="margin:0;">
                <li class="page-item"><a class="page-link" href="#">${state.firstText}</a></li>
                <li class="page-item"><a class="page-link" href="#"><<</a></li>
                ${getPagesHTML(state)}
                <li class="page-item"><a class="page-link" href="#">>></a></li>
                <li class="page-item"><a class="page-link" href="#">${state.lastText}</a></li>
                <li class="page-item">
                  <div class="input-group" style="width:40%">
                    <div class="input-group-prepend">
                      <button class="btn btn-outline-secondary page-link" type="button">${state.goText}</button>
                    </div>
                    <input type="number" class="form-control page-link" placeholder="1" aria-label="" aria-describedby="basic-addon1">
                  </div>
                </li>
                <li class="page-item" style="align-self:center;">${state.totalElements} ${state.foundsText}</li>
              </ul>
            </nav>
        `;
        let btns = state.html.root.getElementsByTagName("A");
        for (let i = 0; i < btns.length; i++) {
          btns[i].onclick = () => state.onBtnPressed(state, btns[i]);
        };
        return views.onEvent(state, "onAfterUpdate", state.onAfterUpdate, {});
      })
      .then(_ => {
        res(state);
      })
      .catch(rej);
  });
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
          <li class="page-item"><a class="page-link" href="#">Último</a></li>
          <li class="page-item">
            <div class="input-group" style="width:40%">
              <div class="input-group-prepend">
                <a class="btn btn-outline-secondary page-link" href="#" type="button">Ir</a>
              </div>
              <input type="number" class="form-control page-link" placeholder="1" aria-label="" aria-describedby="basic-addon1">
            </div>
          </li>
          <li class="page-item" style="align-self:center;min-inline-size:fit-content;">2341 Resultados</li>
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

  const renderChilds = (state) =>new Promise((resolve, reject) => resolve(state));
  state = fillObjWithDflt(state, dfltState);

  return new Promise((res, rej) => {
    var html = stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html.getRootNode());
    update(state)
      .then(state => renderChilds(state))
      .then(state => {
        if (state.show == true) state.html.root.style.display = "block";
        else state.html.root.style.display = "none";
        res(state);
      });
  });
};

export default { dfltState, render, update }
