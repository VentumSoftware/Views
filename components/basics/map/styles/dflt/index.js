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
    onRemove: function onRemove(e) {
      let confirmDelete = window.confirm("¿Está seguro de eliminar esta referencia?");
      if (confirmDelete) {
        fetch('/davi/map', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(e.layer.feature)
        })
          .then(res => res.json())
          .then(res => window.alert("¡La referencia seleccionada fue eliminada con éxito!"));
      }
    },
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
        className: 'icon-save',
        title: 'Subir Referencias',
        toggle: false,
        onClick: function upload() {
<<<<<<< HEAD
          let confirmacion = window.confirm("¿Desea confirmar y guardar las nuevas referencias?");
          if (confirmacion) {
            let data = window.globalState.childs.daviMap.childs.body.childs[1].editor.layers;
            let options = window.globalState.childs.daviMap.childs.body.childs[1].editor.options;
            data = L.layerGroup(data).toGeoJSON();
            console.log(data);
            let i = 0;
            data.features.forEach((layer) => {
              //Se repite código... REFACTOR Pendiente
              if (layer.hasOwnProperty('_id')) {
                fetch('/davi/map', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(layer)
                })
                  .then(res => res.json())
                  .then(res => {
                    updateLayers(res, layer);
                  })
                  .catch(err => {
                    window.alert("¡Los datos no se pudieron guardar!")
                    throw new Error("Falló la carga de datos: " + err);
                  });
              } else {
                layer.properties = options[i];
                fetch('/davi/map', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(layer)
                })
                  .then(res => res.json())
                  .then((res) => {
                    updateLayers(res, layer);
                  })
                  .catch(err => {
                    window.alert("¡Los datos no se pudieron guardar!")
                    throw new Error("Falló la carga: " + err);
                  });
=======
          let data = globalState.childs.daviMap.childs.body.childs[1].editor.layers;
          let options = globalState.childs.daviMap.childs.body.childs[1].editor.options;
          data = L.layerGroup(data).toGeoJSON();
          console.log(data);
          let i = 0;
          data.features.forEach((layer) => {
            if (layer.hasOwnProperty('_id')) {
              fetch('/davi/map', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(layer)
              })
                .then(res => res.json())
                .then(res => layer.id = res.id);
            } else {
              layer.properties = options[i];
              fetch('/davi/map', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(layer)
              })
                .then(res => res.json())
                .then(res => layer.id = res.id);
>>>>>>> 9f179b1a122ca1cc4ff30622c6b83e3e0b1811e4
                i++;
              }
            });
            window.alert("¡Los datos han sido guardados con éxito!");
          }
        }

      }
    }
  }

};

<<<<<<< HEAD
const updateLayers = (res, layer) => {
  layer.id = res.id;
  window.globalState.childs.daviMap.childs.body.childs[1].editor.layers = [];
  window.globalState.childs.daviMap.childs.body.childs[1].editor.options = [];
}


=======
>>>>>>> 9f179b1a122ca1cc4ff30622c6b83e3e0b1811e4
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
            views.render(state.childs.header, state.html.header)
              .then(child => {
                if (state.closeBtn)
                  state.html.header.appendChild(stringToHTML(`<button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>`));
                state.childs.header = child;
                res(state);
              });
          } else if (state.closeBtn) {
            state.html.header.appendChild(
              stringToHTML(`
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
            views.render(state.childs.body, state.html.body)
              .then(child => {
                state.childs.body = child;
                res(state);
              });
          }
          else if (state.description) {
            state.html.body.appendChild(stringToHTML(`<p>${state.description}</p>`));
            res(state);
          } else {
            res(state);
          }
        });
      };

      const renderFooter = (state) => {
        return new Promise((res, rej) => {
          if (state.childs.footer) {
            render(state.childs.footer, state.html.footer)
              .then(child => {
                state.childs.footer = child;
                res(state);
              });
          }
          else if (state.footerText) {
            state.html.footer.appendChild(stringToHTML(`<h5 class="modal-footer">${state.footerText}</h5>`));
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
<<<<<<< HEAD
=======

  //TODO: Make an editor inside map to update data about areas.
>>>>>>> 9f179b1a122ca1cc4ff30622c6b83e3e0b1811e4
  const customEditor = (state, map) => {
    state.editor.layers = [];
    state.editor.options = [];
    map.pm.Toolbar.createCustomControl(state.editor.customs.uploadPayload);
    map.pm.addControls(state.editor.controls);
    map.on('pm:drawstart', (e) => eval(state.editor.onDrawStart)(e));
    map.on('pm:create', (e) => state.editor.onCreate(e));
<<<<<<< HEAD
    map.on('pm:remove', (e) => {
      //TODO: FIX POPUP BUG
      state.editor.onRemove(e);
    });
=======
    map.on('pm:remove', (e) => state.editor.onRemove(e));
>>>>>>> 9f179b1a122ca1cc4ff30622c6b83e3e0b1811e4
  };

  const drawLayers = (state, map) => {
    //Layers de referencias (Markers, Polyline, Circles)
    fetch('/davi/map', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((references) => references.json())
      .then((references) => {
        references.forEach((ref) => {
          L.geoJSON(ref, {onEachFeature(feature, layer) {layer.on('pm:edit', (e) => state.editor.onEdit(e))}
          }).bindPopup(ref => { return ref.feature.properties }).addTo(map)
        });
      });


    //Markers de vehiculos (Última posición)
    fetch('/davi/vehiclesNow', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((vehicles) => vehicles.json())
      .then((vehicles) => {
        state.markers = {};
        let markers = {};
        for (let i = 0; i < vehicles.length; i++) {
          markers[vehicles[i].id] = {
            pos: [vehicles[i].gps.lat, vehicles[i].gps.lon],
            popUp: {
              innerHTML: `<b>${vehicles[i].name}</b>
            <br>ID: ${vehicles[i].id}.
            <br>Patente: ${vehicles[i].licensePlate}.
            <br>Conductor: ${vehicles[i].driver}.
            <br>Marca: ${vehicles[i].vehicleBrand}.
            <br>Modelo: ${vehicles[i].vehicleModel}.
            <br>Actualizado a las ${vehicles[i].gral.time}.
            `,
              show: false,
            }
          }
        }
        Object.entries(markers).forEach(kv => {
          var marker = L.marker(Object.values(kv[1].pos)).addTo(map);
          if (kv[1].popUp.show == "true")
            marker.bindPopup(kv[1].popUp.innerHTML).openPopup();
          else
            marker.bindPopup(kv[1].popUp.innerHTML);

          kv[1].ref = marker;
          state.markers[kv[0]] = kv[1];
          views.onEvent(state, "markerOnCreate", kv[1].onCreate, marker);
        });
      });

    // //Dibujo Poligonos
    // Object.values(state.polygons).forEach(polygonData => {
    //   var positions = [];
    //   Object.values(polygonData.pos).forEach(pos => positions.push(Object.values(pos)))
    //   var polygon = L.polygon(positions, {
    //     color: polygonData.color || 'blue',
    //     fillColor: polygonData.fillColor || '#008',
    //     fillOpacity: polygonData.fillOpacity || 0.5,
    //   }).addTo(map);

    //   if (polygonData.popUp.show == "true")
    //     polygon.bindPopup(polygonData.popUp.innerHTML).openPopup();
    //   else
    //     polygon.bindPopup(polygonData.popUp.innerHTML);
    // });
    return state;
  };

  state = fillObjWithDflt(state, dfltState);

  return new Promise((res, rej) => {
    var html = stringToHTML(getHTML(state));
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
    }).addTo(mymap);
    state = drawLayers(state, mymap);
    customEditor(state, mymap);
    renderChilds(state)
      .then(state => {
        if (state.show) state.html.root.style.display = "block";
        else state.html.root.style.display = "none";
        res(state);
      });
  });
};


export default { dfltState, render };