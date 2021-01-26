import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import buttons from 'https://ventumdashboard.s3.amazonaws.com/dashboard/buttons/buttons.js';
import modal from 'https://ventumdashboard.s3.amazonaws.com/dashboard/modal/modal.js';
import dashboard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js';

const dfltState = {
    id: "noID",
    title: "Mapa",
    childs:{}
};

var states = [];

//-----------------------------------------------------------------------------------------------

const cmd = (state, cmds, res, pos) => {

    const parentCmd = (state, payload, res) => {
        switch (state.parentState.type) {
            case "modal":
                payload.cmds = payload.cmds || res;
                return modal.cmd(state.parentState, payload.cmds, res, 0);
            default:
                return new Promise((resolve, reject) => {
                    reject("Error with type: " + key);
                })
        }
    };

    const pushForm = (state, payload, res) => {
        return new Promise((success, failed) => {
            try {
                console.log("cmd: pushForm. Payload: " + JSON.stringify(payload));
                modal.show(state, { spinner: {} });
                var options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(state)
                };
                fetch(payload.fetchPath, options)
                    .then(() => {
                        dashboard.reloadCat();
                        dismissModal();
                        success("ok");
                    })
                    .catch((err) => {
                        console.log(err);
                        failed(err);
                    });


            } catch (error) {
                console.log(error);
                failed(error);
            }
        });
    };

    // const dismissModal = (state, payload, res) => {
    //     return new Promise((success, failed) => {
    //         try {
    //             console.log("cmd: dismissModal. Payload: " + JSON.stringify(payload));
    //             const modalData = modal.getData();
    //             console.log("cmodalData: " + JSON.stringify(modalData));
    //             modal.close();
    //             success(modalData);
    //         } catch (error) {
    //             console.log(error);
    //             failed(error);
    //         }
    //     });
    // };

    const getData = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            resolve(state.inputs);
        });
    };

    const getState = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            resolve(state);
        });
    };

    console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);

    return new Promise((resolve, reject) => {
        //A: Si ya ejecute todos los comandos termino
        if (Object.keys(cmds).length <= pos) {
            resolve(res);
        } else {
            var c = null;
            var command = cmds[pos];
            switch (command.type) {
                case "parent-cmd":
                    c = () => parentCmd(state, command.payload, res);
                    break;
                case "push-form":
                    c = () => pushForm(state, command.payload, res);
                    break;
                case "dissmis-modal":
                    c = () => dismissModal(state, command.payload, res);
                    break;
                case "get-state":
                    c = () => getState(state, command.payload, res);
                    break;
                case "get-data":
                    c = () => getData(state, command.payload, res);
                    break;
                default:
                    console.log(`Cmd not found: ${command.type}`);
                    c = () => new Promise((res, rej) => { rej(`Cmd not found: ${command.type}`) });
                    break;
            }

            c()
                .then((res) => {
                    cmd(state, cmds, res, pos + 1);
                })
                .then((res) => resolve(res))
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        }
    })
};

const create = (newState, path) => {
    try {
        if (newState.type == "map") {
            newState = utils.fillObjWithDflt(newState, dfltState);
            newState.path = path;

            Object.entries(newState.childs).forEach(child => {
                switch (child[1].type) {
                    case "modal":
                        newState.childs[child[0]] = modal.create(child[1], path + "/" + child[0]);
                        break;
                    default:
                        console.log("Error creating map child, incorrect type: " + child[1].type);
                        break;
                }
            });
            //console.log("Modal new State: " + JSON.stringify(newState));
            states.push(newState);
            return newState;
        } else {
            console.log("Error creating map, incorrect type: " + newState.type);
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const show = (state, parent) => {
    const drawMap = () => {
        try {
            var div = document.createElement("div");
            div.id =  state.id + "-map";
            div.style.width="100%";
            var height=screen.height*0.6
            div.style.height=height.toString()+"px";
            div.style.position="relative";
            cardParent.body.appendChild(div);
            var origin= JSON.parse(state.origin)
            const map =L.map(div.id).setView(origin,state.zoom);
            L.tileLayer(state.layer).addTo(map);

            map.locate({enableHighAccuracy:true});

            map.on('locationfound',e=>{
            var coords=[e.latlng.lat, e.latlng.lng];
            var marker=L.marker(coords);
            marker.bindPopup('Ubicacion actual');
            map.addLayer(marker);
            });

            const marker=L.marker(origin);
            map.addLayer(marker);


            map.on('dblclick', e =>{
                let latLng = map.mouseEventToLatLng(e.originalEvent);
                var coords=[latLng.lat, latLng.lng];
                var marker=L.marker(coords);
                marker.bindPopup(`[${latLng.lat}, ${latLng.lng}]`);
                map.addLayer(marker);
            })
            map.doubleClickZoom.disable();

            var circle = L.circle(origin, {
            color: '#8fbbec',
            fillColor: '#b7c0ca',
            fillOpacity: 0.1,
            radius: 3000
            }).addTo(map);


            document.getElementById('select-location').addEventListener('change',function(e){
            var coord=e.target.value.split(",");
            var name=e.target.id;
            const marker=L.marker(coord);
            marker.bindPopup('Ciudad de '+ name);
            map.addLayer(marker);
            map.flyTo(coord, 13)
            })

        } catch (error) {
            console.log(error);
        }
    };
    const drawSelect= () => {
      try {

          var select = document.createElement("select");
          select.name = "select-location";
          select.id= "select-location";
          cardParent.body.appendChild(select);

          Object.keys(state.markers).forEach(marker => {
          var option = document.createElement("option");
          option.value = state.markers[marker].coords;
          option.text = state.markers[marker].name;
          option.id= state.markers[marker].name;
          select.appendChild(option);

                })



      } catch (error) {
          console.log(error);
      }
  };
    console.log("Map show: " + JSON.stringify(state));
    const cardParent = card.create({ title: state.title }, parent);
     drawSelect();
    drawMap();

};

export default { create, show, cmd };
