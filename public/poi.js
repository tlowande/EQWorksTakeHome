$(() => {
  
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
    }).then(res => {
      coordinates = res;
      // console.log(coordinates)
      let tags = [];
      coordinates.forEach(location => tags.push(createElement(location)));
      $("tbody").append(tags);
    })
    .then(res => {
      /**
       * Create the map
       */
      var map = AmCharts.makeChart("mapdiv-Amcharts", {
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
      });
    })
    .catch(error => {
    console.log("got to the catch on amchart map poi2")
    location.reload()
    })
  };

  //-------------------------

  getPoi();

  //-------------------------
  $(".btn-danger").click(function() {
    window.location.href = "https://habitual-license.glitch.me";
  }); //end of eventlistener for btn-danger
});
