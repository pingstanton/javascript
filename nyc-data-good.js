let nycMap;
nycMap = L.map("map");

// create tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(nycMap);

nycMap.setView([40.7128, -74.0060], 16);

L.geoJSON(nyc).addTo(nycMap);

// adds some fill color to the map
L.geoJSON(nyc, {
    style: function(feature) {
        return {
            color: "blue",
            fillColor: "gold",
            fillOpacity: 0.5
        };
    }
}).addTo(nycMap);

//adds popup info to each neighborhood
L.geoJSON(nyc, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.borough + "</h3> <hr> <h3>" + feature.properties.neighborhood + "</h3>");
    }
}).addTo(nycMap);


// add polygon around Graduate Center
const gradCenter = [[ 40.74901313612799, -73.9840074278618 ], [ 40.748427923950395, -73.98255903499376], [ 40.747932115158804, -73.9829774596001 ], [ 40.7484888837925, -73.98430783527147 ]];

const polygradCenter = L.polygon(gradCenter, {color: 'red', weight: 2}).addTo(nycMap);

$("#pan-to-flatbush").click(function() {
    // find flatbush neighborhood property in the dataset
    let flatbush = nyc.features.find(function(feature) {
        return feature.properties.neighborhood === "Flatbush";
    });
    console.log(flatbush);
    // find the coordinates of flatbush property
    let coordinates = nyc.features.find(function(feature) {
        return feature.properties.neighborhood === "Flatbush";
    }).geometry.coordinates;
    console.log(coordinates);
    nycMap.panTo(new L.LatLng(coordinates[0][0][1], coordinates[0][0][0]));
});

$("#pan-to-lowerEastSide").click(function() {
    let lowerEastSide = nyc.features.find(function(feature) {
        return feature.properties.neighborhood === "Lower East Side";
    });
    console.log(lowerEastSide);
    // find the coordinates of flatbush property
    let coordinates = nyc.features.find(function(feature) {
        return feature.properties.neighborhood === "Lower East Side";
    }).geometry.coordinates;
    console.log(coordinates);
    nycMap.panTo(new L.LatLng(coordinates[0][0][1], coordinates[0][0][0]));
});


// get a list of all the neighborhoods in the dataset
let neighborhoods = nyc.features.map(function(feature) {
    return feature.properties.neighborhood;
}).filter(function(neighborhood) {
    return neighborhood !== "";
}).sort();
console.log(neighborhoods);

// display all the neighborhoods in the neighborhoods div
neighborhoods.forEach(function(neighborhood) {
    $("#neighborhoods").append("<a href ='#'><li>" + neighborhood + "</li></a>");
    // display in columns
    if (neighborhoods.indexOf(neighborhood) % 4 === 0) {
        $("#neighborhoods").append("<br>");
    }
});

// if the neighborhood is clicked, find the neighborhood on the map and pan to it
$("#neighborhoods").on("click", "li", function() {
    let neighborhoodText = $(this).text(); // get the text of the neighborhood
    let coordinates = nyc.features.find(function(feature) {
        return feature.properties.neighborhood === neighborhoodText; //check if the text matches the neighborhood in the dataset
    }).geometry.coordinates; // get the coordinates of the neighborhood
    nycMap.panTo(new L.LatLng(coordinates[0][0][1], coordinates[0][0][0]));
    // zoom in
    nycMap.setZoom(16);
    // add a marker to the neighborhood polygon
    L.marker(new L.LatLng(coordinates[0][0][1], coordinates[0][0][0])).addTo(nycMap);
    // add a popup to the marker
    L.marker(new L.LatLng(coordinates[0][0][1], coordinates[0][0][0])).bindPopup("<h3>" + neighborhoodText + "</h3>").addTo(nycMap);
});


