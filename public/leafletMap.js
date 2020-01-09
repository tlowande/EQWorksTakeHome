$("#btn-leafletMap").click(function() {
  $("#mapDiv").toggle("slow");
  mymap.invalidateSize();
  mymap.setView([51.505, -0.09], 13);
}); //end of eventlistener for btn-poi

var mymap = L.map("leafletMap").setView([51.505, -0.09], 13);
// let mymap = L.map("leafletMap").setView([0, 0], 1);

// L.tileLayer(
//   "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=Hvlgte79sUUBdfr4vSxw",
//   {
//     attribution:
//       '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
//   }
// ).addTo(mymap);

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
