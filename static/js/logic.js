// // var newYorkCoords = [40.73, -74.0059];
// // var mapZoomLevel = 12;

// // Create the createMap function
// function createMap(earthquakes) {

//   // Create the tile layer that will be the background of our map
//   var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox/light-v10",
//     accessToken: API_KEY
//   });

//   // Create a baseMaps object to hold the lightmap layer
//   var baseMaps = {
//     "Light Map": lightmap
//   };

//   // Create an overlayMaps object to hold the earthquakes layer
//   var overlayMaps = {
//     "Earthquakes": earthquakes
//   };

//   // Create the map object with options
//   var map = L.map("map-id", {
//     center: [40.73, -74.0059],
//     zoom: 12,
//     layers: [lightmap, earthquakes]
//   });

//   // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(map);
// }

// // Create the createMarkers function
// function createMarkers(response) {

//   console.log(response);

//   // Pull the "stations" property off of response.data
//   var locations = response.data.features;

//     console.log(locations);

//   // Initialize an array to hold earthquake markers
//   var quakeSpots = [];

//   // Loop through the locations array
//   locations.forEach(location => {
//     // For each station, create a marker and bind a popup with the station's name
//     var quakeSpot = L.circle([features.geometry.coordinates[1], features.geometry.coordinates[0]])
//       .bindPopup("<h3>Location: " + features.properties.title +
//       "</h3><hr><p>Date: " + new Date(features.properties.time) + "</p><p>Magnitude: " + features.properties.mag + 
//       "</p><p>Depth: " + features.geometry.coordinates[2] + "</p>"); 
//     // Add the marker to the bikeMarkers array
//     quakeSpots.push(quakeSpot);
//   })
//   // Create a layer group made from the bike markers array, pass it into the createMap function
//   createMap(L.layerGroup(quakeSpots));
// }
 
// // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(data => createMarkers(data));






// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(data => {
  console.log(data);
 
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

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
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
          radius: feature.properties.mag*10,
          // opacity: .9,                            
          fillcolor: getColor(feature.geometry.coordinates[2]),
          stroke: null,
          // fillColor: feature.geometry.coordinates[2],
          // fillOpacity: 0.3,
      });
    }

  });

  // var mags = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature,
  //   pointToLayer: (feature, latlng) => {
  //     return new L.Circle(latlng, {
  //       radius: feature.properties.mag*20000,
  //       fillColor: "red",
  //       stroke: false 
  //     });
  //   }
  // });

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
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
