let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
                   
// Once we get a response, send the data.features object to the createFeatures function.
  
createFeatures(data.features);
  console.log(data.features)
});

function chooseColor(magnitude) {
  switch (true) {
  case magnitude > 5:
      return "#891446";
  case magnitude > 4:
      return "#ff4040";
  case magnitude > 3:
      return "#00729c";
  case magnitude > 2:
      return "#9c9200";
  case magnitude > 1:
      return "#fc74fd";
  default:
      return "#3a9c00";
  }
}

function createFeatures(earthquakeData) {
// Define a function that we want to run once for each feature in the features array.
// Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><h2>${feature.properties.mag}"</h2>`);
  }

  function createCircleMarker(feature,latlng){
    let options = {
        radius:feature.properties.mag*8,
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color:chooseColor(feature.properties.mag),

        weight: 1,
        opacity: .8,
        fillOpacity: 0.35
    }
    return L.circleMarker(latlng, options);
}
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
    
  });
  // set legend at bottom right of screen
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  let legend = L.control({
    position: 'bottomright'
  });
  
  // add legend
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let levels = ['-10-10','10-30','30-50','50-70','70-90','90+'];
    let colors = ['#3a9c00','#fc74fd','#9c9200','#00729c','#ff4040','#891446'];
    for (let i=0; i < levels.length; i++) {
      div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
    }
    return div;
  }
  legend.addTo(myMap);
}

d3.json(queryUrl).then(function (data) {
 
});