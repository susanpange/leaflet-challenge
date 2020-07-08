var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var faultlines_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


renderMap(earthquake_url, faultlines_url);


function renderMap(earthquake_url, faultlines_url) {

    d3.json(earthquake_url, function(data) {
        let earthquakeData = data.features;
      
        d3.json(faultlines_url, function(data) {
            let faultLineData = data.features;
            createFeatures(earthquakeData, faultLineData);
        });
    });  
};
  

function createFeatures(earthquakeData, faultLineData) {

    function onEachCircle(feature, layer) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: true,
            color: "grey",
            weight: 1,
            fillOpacity: 1,
            fillColor: chooseColor(feature.properties.mag),
            radius: feature.properties.mag*5
        });
    }

    function onEachData(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachData,
        pointToLayer: onEachCircle
    });

    function onEachFaultline(feature, layer) {
        L.polyline(feature.geometry.coordinates);
    }

    var faultLines = L.geoJSON(faultLineData, {
        onEachFeature: onEachFaultline,
        style: {
            weight: 3,
            color: 'orange'
          }
    });
  
    createMap(earthquakes, faultLines);
};

function chooseColor(mag) {

  if (mag > 5) {
    return "red";
  }
  else if (mag >4) {
    return "orange";
  }
  else if (mag > 3) {
    return "gold";
  }
  else if (mag > 2) {
    return "yellow";
  }
  else if (mag > 1) {
    return "yellowgreen";
  }
  else {
      return "green"
  }

};



function createMap(earthquakes, faultLines) {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    });

    var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/outdoors-v11",
      accessToken: API_KEY
    });
  

    var baseMaps = {
      "Street": streetmap,
      "Satellite": satellitemap,
      "Outdoor": outdoormap
    };
  
    var overlayMaps = {
      "Fault Lines": faultLines, 
      "Earthquakes": earthquakes
    };
  
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
};



