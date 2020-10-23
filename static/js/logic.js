// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(data => {
  console.log(data);
 
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Create color function
function getColor(d) {
    return  d > 90 ? "Red" :
            d > 70 ? "Orange" :
            d > 50 ? "Gold" :
            d > 30 ? "Yellow" :
            d > 10 ? "GreenYellow" :
                     "Lime" ;
}



function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.title +
            "</h3><hr><p>Date: " + new Date(feature.properties.time) + "</p><p>Magnitude: " + feature.properties.mag + 
            "</p><p>Depth: " + feature.geometry.coordinates[2] + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: (feature, latlng) => {
            return new L.circle(latlng, {
                radius: feature.properties.mag*30000,
                //   opacity: .9,
                color: "white",
                fillColor: getColor(feature.geometry.coordinates[2]),
                stroke: false,
                //   weight: 2,
                fillOpacity: 0.7,
        });
        }
    });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    // Magnitudes: mags
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: "bottomright"});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),

            depth = [0, 10, 30, 50, 70, 90];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);
}

   
