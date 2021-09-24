//Dflt Modal State
var dfltState = {
  company: {
    name: "Company Name",
    icon: null
  },
  user: {
    name: "User Name",
    profPic: null
  },
  selectedCat: null,
};

const selectCat = (state, childName) => {
  Object.values(state.childs).forEach(views.hide);
  views.show(state.childs[childName]);
  console.log(`cmp_dashboard: category selected "${childName}"`)
};

export default { dfltState, selectCat };