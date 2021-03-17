import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import buttons from 'https://ventumdashboard.s3.amazonaws.com/dashboard/buttons/buttons.js';

//Caracteristicas de este componente (map)
const component = {
    //Dflt Modal State
    dfltState: {
        id: "noID",
        title: "Mapas",
        childs:{},
        headers: {},
        filters: {},
        headerBtns: {},
        childs: {},
        html: {}
    },
    //Commandos específicos para el componente (map)
    cmds: {},
    //Typos de hijos que puede tener el componente (modal)
    childTypes: ["modal"],
    show: (state, parent) => {

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
          divContainer.className="col-md-12 container";
          cardParent.body.appendChild(divContainer);

          var divContent=document.createElement("div");
          divContent.className="col-lg-6";
          divContent.style.marginLeft="0px";
          divContent.style.paddingLeft="0px";
          divContent.style.marginTop="20px";
          divContainer.appendChild(divContent);

          var divCardContainer=document.createElement("div");
          divCardContainer.className="card l-bg-orange-dark";
          divContent.appendChild(divCardContainer)



          var divContentCard = document.createElement("div");
          divContentCard.className="card-statistic-3 p-4";
          divCardContainer.appendChild(divContentCard);

          var iconCard = document.createElement("div");
          iconCard.className="card-icon card-icon-large";
          iconCard.style.fontSize="110px";
          iconCard.style.textAlign="center";
          iconCard.style.lineHeight="50px";
          iconCard.style.marginLeft="15px";
          iconCard.style.color="#000";
          iconCard.style.position="absolute";
          iconCard.style.right="5px";
          iconCard.style.top="20px";
          iconCard.style.opacity="0,1";
          divContentCard.appendChild(iconCard);

          var icon =document.createElement("i");
          icon.className="fas fa-truck-moving";
          iconCard.appendChild(icon);


          var divText=document.createElement("div");
          divText.className="mb-4";
          divContentCard.appendChild(divText);

          var text = document.createElement("h5");
          text.className="card-title mb-0";
          text.innerHTML="hola mundo";

          divText.appendChild(text);












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
        createwidgets();

    }
};

export default component;
