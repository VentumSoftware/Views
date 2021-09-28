const dfltState = {};

const render = (state, parent) => {

  const getHTML = (state) => {
    return `
    <!-- Dashboard -->
    <div id="${state.id}-nav" class="ventum-nav " style="height: ${window.innerHeight}px; overflow: hidden auto;">
      <!-- Sidebar -->
      <div id="${state.id}-sidebar" class="ventum-sidebar overflow-auto">
        <!-- Company -->
        <div id="${state.id}-sidebar-company-div" class="ventum-sidebar-company" style="align-items: center;">
          <div id="${state.id}-sidebar-company-logo-div" class="ventum-sidebar-company-logo"><i id="id-sidebar-company-logo-icon"
              class="icon-compass icon-2x ventum-sidebar-company-logo-i"></i></div>
          <div id="${state.id}-sidebar-company-name-div" class="ventum-sidebar-company-name"><button
              id="${state.id}-sidebar-company-name-text" class="ventum-sidebar-company-name-text">${state.company.name}</button></div>
        </div>
        <div class="ventum-sidebar-separator-line"></div>
        <!-- User -->
        <div id="${state.id}-sidebar-user-div" class="ventum-sidebar-user">
          <div id="${state.id}-sidebar-user-logo-div" class="ventum-sidebar-user-logo"><i id="${state.id}-sidebar-user-logo-icon"
              class="icon-compass icon-2x ventum-sidebar-user-logo-i"></i></div>
          <div id="${state.id}-sidebar-user-name-div" class="ventum-sidebar-user-name"><button id="${state.id}-sidebar-user-name-text"
              class="ventum-sidebar-user-name-text">${state.user.name}</button></div>
        </div>
        <div class="ventum-sidebar-separator-line"></div>
        <div class="ventum-sidebar-separator-space" style="height: 3%;"></div>
        <!-- Categorys -->
        <div id="${state.id}-categorys">
        </div>
      </div>
      <!-- Content -->
      <div id="${state.id}-content" class="ventum-content " style="overflow: hidden auto;">
        <!-- Navbar -->
        <div id="${state.id}-content-navbar-div" class="ventum-content-navbar-div row">
          <div id="${state.id}-content-navbar-div-exit" class="col-11"></div>
          <div id="${state.id}-content-navbar-div-exit" class="col-1 d-flex content-center" style="position: relative;"><button
              id="${state.id}-logout" class="btn btn-danger btn-sm"
              style="color: white; margin-top: 10%; margin-bottom: 10%;">Log Out</button></div>
        </div>
        <div class="ventum-content-separator-line"></div>
        <!-- Content Body -->
        <div id="${state.id}-content-main" class="ventum-main-content" style="height: 91%; overflow:auto"></div>
      </div>
    </div>
    `
  };

  const getReferences = (state, root) => {
    state.html = {
      categorys: root.getElementById(`${state.id}-categorys`),
      content: root.getElementById(`${state.id}-content-main`),
      logout: root.getElementById(`${state.id}-logout`)
    };
    return state;
  };

  const renderCategorys = (state) => {
    Object.values(state.categorys).forEach(category => {
      var catHTML = `
      <div id="dashboard-sidebar-user-div" class="ventum-sidebar-user">
        <div id="dashboard-sidebar-user-logo-div" class="ventum-sidebar-user-logo">
          <i id="dashboard-sidebar-user-logo-icon" class="icon-compass icon-2x ventum-sidebar-user-logo-i"></i>
        </div>
        <div id="dashboard-sidebar-user-name-div" class="ventum-sidebar-user-name">
          <button id="dashboard-sidebar-user-name-text" class="ventum-sidebar-user-name-text">${category.name}</button>
        </div>
      </div>
      `;
      var cat = stringToHTML(catHTML);
      var btn = cat.getElementsByTagName("button")[0];
      btn.addEventListener('click', () =>
        views.onEvent(state, "onSelect", category.onSelect, category))
      state.html.categorys.appendChild(cat.getRootNode());
    });
    return state;
  };

  return new Promise((res, rej) => {
    state = fillObjWithDflt(state, dfltState);
    var html = stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html.getRootNode());
    state = renderCategorys(state);
    state.html.logout.addEventListener('click', (e) => {
      e.preventDefault();
      document.cookie = 'access-token=; Max-Age=0';
      location.reload();
    })
    views.renderChilds(state).then(res);
  });
};


export default { dfltState, render };