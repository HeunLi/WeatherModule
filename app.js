var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add drawing controls
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  }
});

map.addControl(drawControl);

map.on('draw:created', function (e) {
  var layer = e.layer;
  drawnItems.addLayer(layer);

  var latlng = layer.getBounds().getCenter(); // Get the center of the drawn area
  var latitude = latlng.lat;
  var longitude = latlng.lng;

  // Fetch 5-day weather forecast from OpenWeatherMap API
  var openWeatherMapAPIKey = '4bbc8c0707f55312541a493a5b8068ac';
  var forecastAPIUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + openWeatherMapAPIKey;

  fetch(forecastAPIUrl)
    .then(response => response.json())
    .then(data => {
      // Extract relevant forecast information
      var forecastList = data.list;

      // Display the 5-day weather forecast in sentence format
      var forecastDisplay = document.getElementById('forecast-display');
      forecastDisplay.innerHTML = ''; // Clear previous content

      for (var i = 0; i < forecastList.length; i++) {
        var forecastTime = new Date(forecastList[i].dt * 1000);
        var forecastConditions = forecastList[i].weather[0].description;
        var sentence = 'On ' + forecastTime.toLocaleDateString() + ' at ' + forecastTime.toLocaleTimeString() + ', the weather will be ' + forecastConditions + '.';

        // Append forecast sentence to the box
        forecastDisplay.innerHTML += '<p>' + sentence + '</p>';
      }
    })
    .catch(error => console.error('Error fetching weather forecast data:', error));
});