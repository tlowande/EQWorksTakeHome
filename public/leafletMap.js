$("#btn-leafletMap").click(function() {
  $("#mapDiv").toggle("slow");
  coord();
  //in case tiles don't load properly, reset below
  // mymap.invalidateSize();
  // mymap.setView([51.505, -0.09], 13);
}); //end of eventlistener for btn-poi

const coord = () => {
  return $.ajax("https://habitual-license.glitch.me/poi/api", {
    method: "GET"
  }).then(res => {
    coordinates = res;
    // console.log(coordinates);

    var mymap = L.map("leafletMap").setView([47.211, -97.23], 4);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGxvd2FuZGUiLCJhIjoiY2s1NnpqcnNpMWE1cjNldDdwZXZvM3AzcyJ9.5V6-QEZcWtUYJ6PsxSyazQ",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken:
          "pk.eyJ1IjoidGxvd2FuZGUiLCJhIjoiY2s1NnpqcnNpMWE1cjNldDdwZXZvM3AzcyJ9.5V6-QEZcWtUYJ6PsxSyazQ"
      }
    ).addTo(mymap);

    const markerClusters = L.markerClusterGroup();

    coordinates.forEach(poi => {
      // let marker = L.marker([poi.lat, poi.lon]).addTo(mymap);
      let marker = L.marker([poi.lat, poi.lon]);
      marker.bindPopup(poi.name);
      marker.on("mouseover", function(e) {
        this.openPopup();
      });
      marker.on("mouseout", function(e) {
        this.closePopup();
      });

      markerClusters.addLayer(marker);
      mymap.addLayer(markerClusters);
    });
  }); //end of then
}; //end of function
