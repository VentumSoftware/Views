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
            var divContainer =document.createElement("div");
            divContainer.className="container mx-auto mt-25";
            divContainer.style.marginTop="30px";
            divContainer.style.marginBottom="30px";
            cardParent.body.appendChild(divContainer);

            var divCard=document.createElement("div");
            divCard.className="col-lg-12"
            divContainer.appendChild(divCard)

            var divInput= document.createElement("div");
            divInput.className=" input-group-append";
            divCard.appendChild(divInput);



            var input = document.createElement("input");
            input.type="text";
            input.className="form-control";
            input.placeholder="Numero de patente";

            divInput.appendChild(input);

            var divButton= document.createElement("div");
            divButton.className="input-group-append";
            divInput.appendChild(divButton);

            var button = document.createElement("button");
            button.className="btn btn-outline-secondary";
            button.type="button";
            button.innerHTML="Buscar";
            divButton.appendChild(button);

            var divSelect = document.createElement("div");
            divSelect.className= "input-group";
            divSelect.style.marginTop="20px";

            divCard.appendChild(divSelect)


            var select = document.createElement("select");
            select.className="custom-select";
            divSelect.appendChild(select);

            var optionSelected = document.createElement("option");
            optionSelected.select=true;
            optionSelected.text="Buscar por ciudad";
            select.appendChild(optionSelected);

            var optionTest1 = document.createElement("option");
            optionTest1.text="Ciudad de Buenos Aires";
            select.appendChild(optionTest1);





        } catch (error) {
            console.log(error);
            throw error;
        }

    };
    const createwidgets = () => {
        try {

          var divContainer = document.createElement("div");
          divContainer.className="col-md-12 row noId-card-footer";
          cardParent.body.appendChild(divContainer);

          var divContent=document.createElement("div");
          divContent.className="col-lg-6";
          divContent.style.marginLeft="0px";
          divContent.style.paddingLeft="0px";
          divContent.style.marginTop="0px";
          divContainer.appendChild(divContent);

          var divCardContainer=document.createElement("div");
          divCardContainer.className="card l-bg-orange-dark";
          divCardContainer.style.background="linear-gradient(to right, #0a504a, #38ef7d) !important"
          divCardContainer.style.color="#fff"
          divContent.appendChild(divCardContainer)


          var divContent = document.createElement("div");
          divContent.style.fontSize ="110px";
          divContent.style.lineHeight ="50px";
          divContent.style.marginLeft ="15px";
          divContent.style.color="#000";
          divContent.style.position="absolute";
          divContent.style.right="5px";
          divContent.style.top="20px";
          divContent.style.opacity="0.1";
          divCardContainer.appendChild(divContent);

          var divMb=document.createElement("div");
          divMb.className="mb-4";
          divContent.appendChild(divMb);


         var text = document.createElement("h2");
         text.innerHTML="Hola mundo";

         divMb.appendChild(text);









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


            document.getElementById('select-map').addEventListener('change',function(e){

                L.tileLayer(e.target.value).addTo(map);


            })


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



                  async function getRunCoordsFrom_(imeiNumber){

var res = await fetch("http://localhost:80/rest/inti/recorridos");
const response = await res.json();
var coords = coordinatesFrom_(response, imeiNumber);
return(coords);
}

        async function drawRunOf(imeiNumber){


            var latlngs = await getRunCoordsFrom_(imeiNumber);


            var polyline = L.polyline(latlngs, {
                color: '#75E87A',
                weight: 3,
                opacity: 1

            })
            .addTo(map);
        }



        function coordinatesFrom_(obj, imeiNumber){
            let listaDeCoords = []

            //ITERA SOBRE TODOS LOS ELEMENTOS TRAIDOS. TODO: ITERAR CONDICIONALMENTE.
            for (const element in obj) {
                if (Object.hasOwnProperty.call(obj, element) && obj[element].imei === imeiNumber) {
                    var elem = (obj[element]);

                    let run = elem.recorrido;
                    for (let i = 0; i < run.length; i++) {
                        const element = run[i];
                        let position = Object.keys(element).toString();

                        switch (position) {
                            case "inicioPos":
                                listaDeCoords.push(element.inicioPos);
                                break;
                            case "runningPos":
                                for (let i = 0; i < element.runningPos.length; i++) {
                                    const elem = element.runningPos[i];
                                    listaDeCoords.push(elem);
                                }
                                break;
                            case "finalPos":
                                listaDeCoords.push(element.finalPos);
                                break;
                            default:
                                console.error("Valores incorrectos");
                                break;
                        }

                        //listaDeCoords.push([element.inicioPos, element.runningPos, element.finalPos]);
                    }

                }
            }
            return(listaDeCoords);

        }
         fetch('http://localhost:80/rest/inti/recorridos')
                            .then(res=>res.json())
                            .then(data=>{

                                 Object.values(data).forEach(option => {

                               drawRunOf(option.imei)

                             });
                             });


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
