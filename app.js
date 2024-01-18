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

  var latlng = layer.getBounds().getCenter();
  var latitude = latlng.lat;
  var longitude = latlng.lng;

  // Separate API key for better organization
  var openWeatherMapAPIKey = '4bbc8c0707f55312541a493a5b8068ac'; // Replace with your API key
  var forecastAPIUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + openWeatherMapAPIKey;

  var forecastList; // Move the declaration here

  fetch(forecastAPIUrl)
    .then(response => response.json())
    .then(data => {
      forecastList = data.list; // Assign value here

      // Extract relevant forecast information
      var forecastDisplay = document.getElementById('forecast-display');
      forecastDisplay.innerHTML = ''; // Clear previous content

      for (var i = 0; i < forecastList.length; i++) {
        var forecastTime = new Date(forecastList[i].dt * 1000);
        var forecastConditions = forecastList[i].weather[0].description;
        var humidity = forecastList[i].main.humidity;
        var sentence = 'On ' + forecastTime.toLocaleDateString() + ' at ' + forecastTime.toLocaleTimeString() +
          ', the weather will be ' + forecastConditions + ' with humidity of ' + humidity + '%.';
        forecastDisplay.innerHTML += '<p>' + sentence + '</p>';
      }

      // Create arrays to store temperature and humidity data for each day
      var labels = [];
      var temperatures = [];
      var humidityValues = [];

      for (var i = 0; i < forecastList.length; i++) {
        var forecastTime = new Date(forecastList[i].dt * 1000);
        var temperature = forecastList[i].main.temp - 273.15; // Convert temperature from Kelvin to Celsius
        var humidity = forecastList[i].main.humidity;

        // Store temperature and humidity data for each day
        labels.push(forecastTime.toLocaleDateString());
        temperatures.push(temperature);
        humidityValues.push(humidity);
      }

      // Create a canvas element for the line graph
      var ctx = document.getElementById('chart-graph').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Temperature (°C)',
            data: temperatures,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
          }, {
            label: 'Humidity (%)',
            data: humidityValues,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false
          }]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM D' // Format for displaying days
                }
              },
              position: 'bottom',
              ticks: {
                maxRotation: 0, // Disable rotation
                autoSkip: true,
                maxTicksLimit: 10 // Adjust the maximum number of visible ticks
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Temperature (°C) / Humidity (%)'
              },
              ticks: {
                beginAtZero: true
              }
            }]
          },
          tooltips: {
            mode: 'index', // Display multiple tooltips when hovering over one data point
            intersect: false,
            callbacks: {
              title: function (tooltipItem, data) {
                return data.labels[tooltipItem[0].index];
              },
              label: function (tooltipItem, data) {
                var temperature = data.datasets[0].data[tooltipItem.index].toFixed(2);
                var humidity = data.datasets[1].data[tooltipItem.index];
                return 'Temperature: ' + temperature + ' °C, Humidity: ' + humidity + '%';
              }
            }
          }
        }
      });
    })
    .catch(error => {
      console.error('Error fetching weather forecast data:', error);
      // Display an error message to the user in case of API request failure
      var forecastDisplay = document.getElementById('forecast-display');
      forecastDisplay.innerHTML = '<p>Error fetching weather forecast data. Please try again later.</p>';
    });
});
