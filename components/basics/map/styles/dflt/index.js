const dfltState = {
  show: true,
  width: "100%",
  height: "400px",
  apiuri: null,
  apitoken: null,
  initialPos: [-34.603722, -58.381592],
  initialZoom: 13,
  maxZoom: 18,
  tileSize: 512,
  zoomOffset: -1,
  icons: {},
  markers: {},
  polygons: {},
  circles: {},
  editor: {
    onCreate: function onCreate(e) {
      //Get data from layers and put into state to fetch to endpoint...  
      let description = window.prompt(`Ingrese la nueva descripción del Layer.`);
      e.layer.bindPopup(description);
      this.options.push(description);
      this.layers.push(e.layer);
      console.log(this.layers);
    },
    onDrawStart: (state) => { },
    controls: {
      position: 'topleft',
      drawRectangle: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawCircle: false
    },
    customs: {
      uploadPayload: {
        name: 'Upload Button',
        block: 'custom',
        title: 'Subir Referencias',
        toggle: false,
        onClick: function upload() {
          let data = window.globalState.childs.daviMap.childs.body.childs[1].editor.layers;
          let options = window.globalState.childs.daviMap.childs.body.childs[1].editor.options;
          data = L.layerGroup(data).toGeoJSON();
          data.features.forEach((feature, i) => {
            feature.properties = options[i];
            console.log(feature);
          })
          console.log(data);
          data.features.forEach((layer)=>{
            fetch('/davi/map', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(layer)
            })
              .then(res => res.json())
              .then(res => layer.id = res.id );
          })
        },
icon: "item"
      }
    }
  }

};


const render = (state, parent) => {

  const getHTML = (state) => {
    return `
    <!-- Map -->
    <div id="${state.id}" style="width: ${state.width}; height: ${state.height}; position: relative;"></div>
    `
  };

  const getReferences = (state, root) => {
    state.html = {
      root: root.getElementById(state.id),

    };

    return state;
  };

  const renderChilds = (state) => {
    return new Promise((res, rej) => {
      //MODAL CHILDS
      const renderHeader = (state) => {
        return new Promise((res, rej) => {
          if (state.title)
            state.html.header.innerText = state.title;

          if (state.childs.header) {
            window.views.render(state.childs.header, state.html.header)
              .then(child => {
                if (state.closeBtn)
                  state.html.header.appendChild(window.utils.stringToHTML(`<button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>`));
                state.childs.header = child;
                res(state);
              });
          } else if (state.closeBtn) {
            state.html.header.appendChild(
              window.utils.stringToHTML(`
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              `));
            res(state);
          } else
            res(state);
        });
      };

      const renderBody = (state) => {
        return new Promise((res, rej) => {
          if (state.childs.body) {
            window.views.render(state.childs.body, state.html.body)
              .then(child => {
                state.childs.body = child;
                res(state);
              });
          }
          else if (state.description) {
            state.html.body.appendChild(window.utils.stringToHTML(`<p>${state.description}</p>`));
            res(state);
          } else {
            res(state);
          }
        });
      };

      const renderFooter = (state) => {
        return new Promise((res, rej) => {
          if (state.childs.footer) {
            window.views.render(state.childs.footer, state.html.footer)
              .then(child => {
                state.childs.footer = child;
                res(state);
              });
          }
          else if (state.footerText) {
            state.html.footer.appendChild(window.utils.stringToHTML(`<h5 class="modal-footer">${state.footerText}</h5>`));
            res(state);
          }
          else {
            res(state);
          }
        });
      };
      renderHeader(state)
        .then(state => renderBody(state))
        .then(state => renderFooter(state))
        .then(state => res(state))
    });
  };
  //TODO: Make an editor inside map to update data about areas.
  const customEditor = (state, map) => {
    state.editor.layers = [];
    state.editor.options = [];
    //TODO: Add endpoint and payload to body...
    //Crea un control customizable
    map.pm.Toolbar.createCustomControl(state.editor.customs.uploadPayload);
    map.pm.addControls(state.editor.controls);
    map.on('pm:drawstart', (e) => eval(state.editor.onDrawStart)(e));
    //Triggered when a new layer is created.
    map.on('pm:create', (e) => state.editor.onCreate(e));
  }

  const drawIcons = (state, map) => {

    //Dibujo Markers
    Object.values(state.markers).forEach(markerData => {
      var marker = L.marker(Object.values(markerData.pos)).addTo(map);
      if (markerData.popUp.show == "true")
        marker.bindPopup(markerData.popUp.innerHTML).openPopup();
      else
        marker.bindPopup(markerData.popUp.innerHTML);

      markerData.ref = marker;
      views.onEvent(state, "markerOnCreate", markerData.onCreate, marker);
    });

    //Dibujo Circulos
    Object.values(state.circles).forEach(circleData => {
      var circle = L.circle(Object.values(circleData.pos), {
        color: circleData.color || 'red',
        fillColor: circleData.fillColor || '#f03',
        fillOpacity: circleData.fillOpacity || 0.5,
        radius: circleData.radius || 500
      }).addTo(map);

      if (circleData.popUp.show == "true")
        circle.bindPopup(circleData.popUp.innerHTML).openPopup();
      else
        circle.bindPopup(circleData.popUp.innerHTML);
    });

    //Dibujo Poligonos
    Object.values(state.polygons).forEach(polygonData => {
      var positions = [];
      Object.values(polygonData.pos).forEach(pos => positions.push(Object.values(pos)))
      var polygon = L.polygon(positions, {
        color: polygonData.color || 'blue',
        fillColor: polygonData.fillColor || '#008',
        fillOpacity: polygonData.fillOpacity || 0.5,
      }).addTo(map);

      if (polygonData.popUp.show == "true")
        polygon.bindPopup(polygonData.popUp.innerHTML).openPopup();
      else
        polygon.bindPopup(polygonData.popUp.innerHTML);
    });
    //             marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    // circle.bindPopup("I am a circle.");
    // polygon.bindPopup("I am a polygon.");
    //             var marker = L.marker([51.5, -0.09]).addTo(mymap);
    //             var circle = L.circle([51.508, -0.11], {
    //               color: 'red',
    //               fillColor: '#f03',
    //               fillOpacity: 0.5,
    //               radius: 500
    //             }).addTo(mymap);
    //             var polygon = L.polygon([
    //               [51.509, -0.08],
    //               [51.503, -0.06],
    //               [51.51, -0.047]
    //           ]).addTo(mymap);
    return state;
  }

  state = window.utils.fillObjWithDflt(state, dfltState);

  return new Promise((res, rej) => {
    var html = window.utils.stringToHTML(getHTML(state));
    html = parent.appendChild(html);
    state = getReferences(state, html.getRootNode());
    var mymap = L.map(state.id).setView(Object.values(state.initialPos), state.initialZoom);
    state.map = mymap;
    L.tileLayer(state.apiuri, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: state.maxZoom,
      id: 'mapbox/streets-v11',
      tileSize: state.tileSize,
      zoomOffset: state.zoomOffset,
      accessToken: state.apitoken
    })
      .addTo(mymap);
    customEditor(state, mymap);
    state = drawIcons(state, mymap);
    renderChilds(state)
      .then(state => {
        if (state.show == true) state.html.root.style.display = "block";
        else state.html.root.style.display = "none";
        res(state);
      });
  });
};


export default { dfltState, render };