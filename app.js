
// Variables
const weatherApiKey = '944f0cd89c74283f7ec25d9c3eaae5c1';

//Query selectors
const tempP = document.querySelector(".temprature");
const locationDiv = document.querySelector(".location");
const bgDiv  = document.querySelector('.hero::before');

var map = L.map('map').setView([26.8432, 75.5365], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([26.8432, 75.5365]).addTo(map);
getWeather(26.8432, 75.5365);

map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // console.log(`Map clicked at: ${lat}, ${lng}`);

    // Move the marker to the clicked location
    marker.setLatLng([lat, lng])
        .setPopupContent(`Getting weather for ${lat.toFixed(2)}, ${lng.toFixed(2)}...`)
        .openPopup();

    // Fetch the weather for the new coordinates
    getWeather(lat, lng);
});

async function getWeather(lat, lon) {
    const weatherInfoDiv = document.getElementById('weather-info');

    // Construct the API URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log('Weather data received:', data);

        // Update marker popup
        marker.setPopupContent(`<strong>${data.name}</strong><br>${data.weather[0].description}`)
              .openPopup();
        
        displayWeather(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfoDiv.innerHTML = `<p>Error loading weather data. Please try again.</p>`;
    }

    
}

function displayWeather(data) {
    const weatherInfoDiv = document.getElementById('weather-info');

    // Check for valid data
    if (!data || !data.main) {
        weatherInfoDiv.innerHTML = `<p>Could not retrieve weather data.</p>`;
        return;
    }

    // Extract the data we want
    const locationName = data.name;
    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;
    const description = data.weather[0].description;
    const weather = data.weather[0].main;
    const icon = data.weather[0].icon;

    tempP.innerHTML = `${Math.round(temperature)}°`;
    locationDiv.innerHTML = `${locationName}`

    document.querySelector('.extra-info')
    .innerHTML = `
    <p>feels like: ${feelsLike}</p>
    <p>${description}</p>
    `

    const time = icon.slice(-1)
    setBg(weather,time)

    document.querySelector('.time-icon').innerHTML = `${time}`=='d' ? '<p>☀️</p>' : '<p>🌙</p>'
}

function setBg(weather,time){
  console.log(weather)
  document.querySelector('.hero').className = `hero ${weather.toLowerCase()}-${time}`;

}