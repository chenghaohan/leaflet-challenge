//URL to get earthquakes data in JSON format
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Create a map
var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 3
});

//This step is creating a mapbox map layer and add it to myMap
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);


//Define the color scale list for earthquake circles
const colorscale = [
    '#ff6666',   // red
    '#ff9933',   // orange
    '#ffb266',   // orange-yellow
    '#ffff33',   // yellow
    '#ffffcc',   // light yellow
    '#98fb98'     // neon green
  ]

//Create function to fill circle with diff colors based on it's depth.
getFillColor = function (depth) {
    if (depth >= 90)
      return colorscale[0];   // red
    else if (depth >= 70)
      return colorscale[1];   // orange
    else if (depth >= 50)
      return colorscale[2];   // orange-yellow
    else if (depth >= 30)
      return colorscale[3];   // yellow
    else if (depth >= 10)
      return colorscale[4];   // light yellow
    else
      return colorscale[5];   // neon green
  };

//This function is to create popup message that show earthquake information on each circle
function onEachFeature (feature, layer) {
    
    //Define the information to show in the pop window
    var popupINFO = ("<h3>" + feature.properties.place +"</h3><hr><p>" 
    + new Date(feature.properties.time) 
    +"; Magnitude: "+ feature.properties.mag + "</p>");

    //bind popup info window to the map layer
    layer.bindPopup(popupINFO)};


// //Using D3 to read earthquake JSON Data
d3.json(queryURL, function (data) {
    createCircleMap(data.features)});


//build create earthquake circle map function and attach a legend on the map
function createCircleMap (earthquakeData) {

    //build circles for each earthquake and display features on them
    L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
    
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: (+feature.properties.mag * 2.5),
            fillColor: getFillColor(+feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: .2,
            fillOpacity: 0.8
          });
        }
      }).addTo(myMap);
    
    //build color legend and define the position
    var legend = L.control({
        position: "bottomright"
      });
    
    //Set legend information(scales) and font/borders
    legend.onAdd = function createLegend(legend) {

        var div = L.DomUtil.create("div");
        var magnitudes = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<div style='font-weight: 600; text-align: center;'>Depth</div>";

        for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML += "<div style='background: " + colorscale[i] + "; text-align: center; padding: 1; border: 1px solid grey; min-width: 80px;'>"
          + magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "</div>" : "+</div>");
        }
        return div;
      };
      
      legend.addTo(myMap);
};