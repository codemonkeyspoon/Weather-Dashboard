
// OpenWeatherMap API URL and API key
const apiKey = 'f4776d0e633dc771f25f1eb31a01852f';

// Get elements from the DOM
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#city');
const currentWeather = document.querySelector('#current-weather');
const forecastWeather = document.querySelector('#forecast');
const searchHistory = document.querySelector('#search-history');

// Function to get lat and lon values
async function fetchGeocodingData(cityName) {
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data[0];
}

// Function to fetch weather data for a given city
async function fetchWeatherData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data)
    return data;
}

// Function to display current weather data
function displayCurrentWeatherData(weatherData) {
    // Get the relevant elements from the DOM
    const locationEl = document.querySelector('.location');
    const temperatureEl = document.querySelector('.temperature');
    const weatherDescriptionEl = document.querySelector('.weather-description');
    const weatherIconEl = document.querySelector('.weather-icon');

    // Extract the relevant information from the weather data
    const location = `${weatherData.name}, ${weatherData.sys.country}`;
    const temperature = `${Math.round(weatherData.main.temp)}°C`;
    const weatherDescription = weatherData.weather[0].description;
    const weatherIcon = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

    // Update the DOM with the weather information
    locationEl.textContent = location;
    temperatureEl.textContent = temperature;
    weatherDescriptionEl.textContent = weatherDescription;
    weatherIconEl.src = weatherIcon;
}

// Function to display 5-day forecast data
async function fetchForecastData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data)
    return data;
}

// Function to display 5-day forecast data
function displayForecastData(forecastData) {
    // Get the relevant element from the DOM
    const forecastEl = document.querySelector('#forecast');

    // Loop through each forecast object and create an HTML element to display it
    let forecastHtml = '';
    for (const forecast of forecastData.list) {
        const date = new Date(forecast.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        const temperature = `${Math.round(forecast.main.temp)}°C`;
        const weatherIcon = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

        const forecastItemHtml = `
        <div class="forecast-item">
          <div class="day-of-week">${dayOfWeek}</div>
          <div class="time">${time}</div>
          <div class="weather-icon"><img src="${weatherIcon}"></div>
          <div class="temperature">${temperature}</div>
        </div>
      `;

        forecastHtml += forecastItemHtml;
    }

    // Update the DOM with the forecast information
    forecastEl.innerHTML = forecastHtml;
}

// Function to add a search history item


// Function to update the search history UI


// Event listener for form submission
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the value of the city input
    const city = event.target.elements.city.value;

    // Fetch the geocoding data for the city
    const geocodingData = await fetchGeocodingData(city);

    // Fetch the current weather data for the city
    const weatherData = await fetchWeatherData(geocodingData.lat, geocodingData.lon);

    // Display the current weather data
    displayCurrentWeatherData(weatherData);

    // Fetch the forecast data for the city
    const forecastData = await fetchForecastData(geocodingData.lat, geocodingData.lon);

    // Display the forecast data
    displayForecastData(forecastData);
});