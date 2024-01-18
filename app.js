// app.js
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Initialize the FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialize the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    }
});

map.addControl(drawControl);

// Event listeners to track created and edited layers
map.on('draw:created', function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
});

map.on('draw:edited', function (event) {
    var layers = event.layers;
    layers.eachLayer(function (layer) {
        // Do something with the edited layers
    });
});
