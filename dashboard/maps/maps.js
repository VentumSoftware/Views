import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import buttons from 'https://ventumdashboard.s3.amazonaws.com/dashboard/buttons/buttons.js';
import modal from 'https://ventumdashboard.s3.amazonaws.com/dashboard/modal/modal.js';
import dashboard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js';

const dfltState = {
    id: "noID",
    title: "Mapas",
    childs:{},
    headers: {},
    filters: {},
    headerBtns: {}
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
    const createFilters = () => {
        try {
            var div = document.createElement("div");
            div.id = state.id + "-map-filters";
            div.className = "ventum-table-filters ";
            cardParent.body.appendChild(div);

            state.filterForm = document.createElement("form");
            state.filterForm.id = state.id + "-map-filters-form";
            state.filterForm.className = "ventum-table-filters-form";
            div.appendChild(state.filterForm);

            var formRow = document.createElement("div");
            formRow.id = state.id + "-map-filters-form-row";
            formRow.className = "form-row ventum-table-filters-form-row";
            state.filterForm.appendChild(formRow);

            //TODO modificar para que se puedan poner mas de 5 filtros
            for (let index = 0; index < 5; index++) {
                var col = document.createElement("div");
                col.id = state.id + "-map-filters-form-col-" + index.toString();
                col.className = "col-2";
                formRow.appendChild(col);
                if (Object.keys(state.filters).length > index) {
                    var label = document.createElement("label");
                    label.id = state.id + "-map-filters-form-col-" + index.toString() + "-label";
                    label.innerHTML = state.filters[index].label;
                    col.appendChild(label);

                    var inputs = document.createElement("div");
                    inputs.className = "form-row";
                    col.appendChild(inputs);

                    var inputsArray = Object.values(state.filters[index].inputs);
                    inputsArray.forEach(input => {
                        var inputCol = document.createElement("div");
                        switch (inputsArray.length) {
                            case 1:
                                inputCol.className = "col-12";
                                break;
                            case 2:
                                inputCol.className = "col-6";
                                break;
                            case 3:
                                inputCol.className = "col-4";
                                break;
                            case 4:
                                inputCol.className = "col-3";
                                break;
                            default:
                                inputCol.className = "col-12";
                                break;
                        }
                        inputs.appendChild(inputCol);
                        if (input.type == "dropdown") {

                            var dropdownView = document.createElement("div");
                            dropdownView.className = "dropdown";
                            inputCol.appendChild(dropdownView);

                            var dropdownBtn = document.createElement("button");
                            dropdownBtn.className = "btn btn-secondary dropdown-toggle";
                            dropdownBtn.type = "button";
                            dropdownBtn.id = input.name;
                            dropdownBtn.setAttribute('data-toggle',"dropdown");
                            dropdownBtn.setAttribute('aria-haspopup',"true");
                            dropdownBtn.setAttribute('aria-expanded',"false");
                            dropdownBtn.innerHTML = input.placeholder;
                            dropdownView.appendChild(dropdownBtn);

                            var dropdownMenu = document.createElement("div");
                            dropdownMenu.className = "dropdown-menu";
                            dropdownMenu.setAttribute('aria-labelledby',input.name);
                            dropdownView.appendChild(dropdownMenu);

                            Object.values(input.options).forEach(option => {
                                var dropdownLink = document.createElement("button");
                                dropdownLink.href = "#";
                                dropdownLink.innerHTML = option;
                                dropdownMenu.appendChild(dropdownLink);
                            });


                        } else {
                            var field = document.createElement("input");
                            field.ishoveredin = "0";
                            field.isfocusedin = "0";
                            field.name = input.name;
                            field.type = input.type;
                            field.className = "form-control";
                            field.placeholder = input.placeholder;
                            field.value = input.value;
                            field.required = input.required;
                            inputCol.appendChild(field);
                        }
                    });
                }

            }

            //Dibujo columna con los botones del header
            var col = document.createElement("div");
            col.id = state.id + "-table-filters-form-col-" + "6";
            col.className = "col-2";
            col.style.textAlign = "center";
            formRow.appendChild(col);
            var label = document.createElement("label");
            label.id = state.id + "-table-filters-form-col-" + "submit" + "-label";
            label.innerHTML = "  &nbsp";
            label.style.position = "relative";
            label.style.width = '100%';
            col.appendChild(label);

            var inputs = document.createElement("div");
            inputs.className = "form-row";
            col.appendChild(inputs);

            //Dibujo cada boton del header
            var btns = Object.entries(state.headerBtns);
            var btnsCount = 0;
            btns.forEach(([key, value]) => {
                if (value)
                    btnsCount++;
            });
            console.log("header buttons: " + btnsCount.toString());
            state.targetedBtns = [];
            btns.forEach(([key, value]) => {
                if (value.enabled) {
                    if (btnsCount < 3)
                        value.showLabel = true;
                    else
                        value.showLabel = false;

                    var btnDiv = document.createElement("div");
                    switch (btnsCount) {
                        case 1:
                            btnDiv.className += "col-12";
                            break;
                        case 2:
                            btnDiv.className += "col-6";
                            break;
                        case 3:
                            btnDiv.className += "col-4";
                            break;
                        case 4:
                            btnDiv.className += "col-3";
                            break;
                        default:
                            btnDiv.className += "col-12";
                            break;
                    }
                    inputs.appendChild(btnDiv);
                    var btn = buttons.createBtn(value);
                    btnDiv.appendChild(btn);
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        cmd(state, value.onClick.cmds, null, 0);
                    });

                    if (value.targeted) {
                        state.targetedBtns.push(btn);
                        btn.disabled = true;
                    }
                }
            });

            return div;
        } catch (error) {
            console.log(error);
            throw error;
        }

    };
    const drawMap = () => {
        try {
            var div = document.createElement("div");
             div.class = "";
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
            var circle = L.circle(coords, {
            color: '#8fbbec',
            fillColor: '#b7c0ca',
            fillOpacity: 0.1,
            radius: 3000
            }).addTo(map);

            map.addLayer(marker);
            });




            map.on('dblclick', e =>{
                let latLng = map.mouseEventToLatLng(e.originalEvent);
                var coords=[latLng.lat, latLng.lng];
                var marker=L.marker(coords);
                marker.bindPopup(`[${latLng.lat}, ${latLng.lng}]`);
                map.addLayer(marker);
            })
            map.doubleClickZoom.disable();



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
   const drawCard= () => {
      try {

           var div = document.createElement("div");
             div.class = "";
            div.id =  state.id + "-map";
            div.style.width="100%";
            var height=screen.height*0.6
            div.style.height=height.toString()+"px";
            div.style.position="relative";
            div.appendChild(drawMap());


      } catch (error) {
          console.log(error);
      }
  };
    console.log("Map show: " + JSON.stringify(state));
    const cardParent = card.create({ title: state.title }, parent);
    createFilters();
    drawCard();

};

export default { create, show, cmd };
