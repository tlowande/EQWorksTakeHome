$(() => {
  
  
  // console.log("got to poi.js file");
//-------------------------

  const createElement = obj => {
    const markup = `
    <tr>
      <th scope="row">${obj.poi_id}</th>
      <td>${obj.name}</td>
      <td>${obj.lat}</td>
      <td>${obj.lon}</td>
    </tr>
    `;
    return markup;
  };

//-------------------------

  let coordinates;
  
//-------------------------

  const getPoi = () => {
    return $.ajax("https://habitual-license.glitch.me/poi/api", {
      method: "GET"
    })
      .then(res => {
        coordinates = res;
      console.log(coordinates)
      let tags = []
      coordinates.forEach(e => tags.push(createElement(e)))
      $("tbody").append(tags);
      })
      .then(res => {
        /**
         * Create the map
         */
        var map = AmCharts.makeChart("mapdiv", {
          type: "map",
          projection: "winkel3",
          theme: "light",
          imagesSettings: {
            rollOverColor: "#089282",
            rollOverScale: 3,
            selectedScale: 3,
            selectedColor: "#089282",
            color: "#13564e"
          },

          areasSettings: {
            unlistedAreasColor: "#15A892",
            outlineThickness: 0.1
          },
          titles: [
            {
              color: "grey",
              size: 15,
              text: "EQ Works POI"
            }
          ],
          
          dataProvider: {
            map: "worldLow",
            images: coordinates.map(e => {
              return {
                id: e.poi_id,
                type: "circle",
                title: e.name,
                latitude: e.lat,
                longitude: e.lon
              };
            })
          },
          export: {
            enabled: true
          }
          // listeners: [
          //   {
          //     event: "init",
          //               method: function(e) {
          //                 // Get the object
          //                 var obj = e.chart.getObjectById("obj1");

          //                 // Set destination coordinates
          //                 // Rio
          //                 var dest = {
          //                   longitude: -43.172896,
          //                   latitude: -22.906847
          //                 };

          //                 // Calculate step we're going to move per each tick
          //                 var step = {
          //                   longitude: (dest.longitude - obj.longitude) / 200,
          //                   latitude: (dest.latitude - obj.latitude) / 200
          //                 };

          //                 // Let's start an interval which moves the image gradually
          //                 // to it's destination coordinates
          //                 var int = setInterval(function() {
          //                   if (
          //                     obj.longitude < dest.longitude &&
          //                     obj.latitude < dest.latitude
          //                   ) {
          //                     clearInterval(int);
          //                     return;
          //                   }

          //                   obj.longitude += step.longitude;
          //                   obj.latitude += step.latitude;
          //                   obj.validate();
          //                 }, 100);
          //               }
          //   }
          // ]
        });
      });
  };

//-------------------------
  
  getPoi();
  
//-------------------------
  $(".btn-danger").click(function() {
     window.location.href='https://habitual-license.glitch.me'
  })//end of eventlistener for btn-danger
  
  
});
