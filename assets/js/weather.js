
// OpenWeatherMap API URL and API key       
// This calls the API, just update the url to have your key's name.
async function fetchKey() {
const url = 'https://yorkieportunus.herokuapp.com/store/weatherkey'
const response = await fetch(url);
const key = await response.json();
return key;
}
    // Call this wherever you need your key.
    fetchKey().then((key) => {
        secretKey = key.apiKey;
});  


// Get elements from the DOM
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#city');
const searchHistory = document.querySelector('#search-history');

document.querySelector(`#forecast-title`).style.display = 'none';

// Function to get lat and lon values
async function getGeoCode(cityName) {
    fetchKey().then((key) => {
        secretKey = key.apiKey;
});
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${secretKey}`);
    const jsonData = await response.json();
    const coord = {
        lat: jsonData.city.coord.lat,
        lon: jsonData.city.coord.lon
    }
    return coord;
}

// Function to get current weather
async function getCurrentWeather(lat, lon) {
    fetchKey().then((key) => {
        secretKey = key.apiKey;
});
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${secretKey}`);
    const weather = await response.json();
    return weather;
}

// Function to display current weather
function displayCurrentWeatherData(weather) {
    const currentWeatherEl = document.querySelector('.current-weather-display');
    let date = dayjs.unix(weather.dt).format(`M/D/YYYY`)
    const currentWeatherHtml = `
        <div class="current-weather">
            <h2 class="location">${weather.name} (${date}) <img src="http://openweathermap.org/img/w/${weather.weather[0].icon}.png"></h2>
            <div class="temperature">Temp: ${Math.round(weather.main.temp)}°F</div>
            <div class="wind">Wind: ${weather.wind.speed}</div>
            <div class="humidity">Humidity: ${weather.main.humidity}</div>
        </div>
    `;
    currentWeatherEl.innerHTML = currentWeatherHtml;
}

// Function to get 5 day forecast
async function getFiveDayForecast(lat, lon) {
    fetchKey().then((key) => {
        secretKey = key.apiKey;
});
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${secretKey}&units=imperial`)
    const forecast = await response.json()
    console.log(forecast);
    return forecast
}

// Function to parse forecast data
function parseForecast(forecastData) {
    const forecastEl = document.querySelector('.forecast-cards');
    let forecastHtml = '';
    let dateArray = [];
    const currentDate = new Date(); // Get the current date
    for (const forecast of forecastData.list) {
        // Skip the current day's forecast
        const forecastDate = new Date(forecast.dt * 1000); // Convert forecast dt (in seconds) to milliseconds
        if (forecastDate.getDate() === currentDate.getDate()) {
            continue;
        }

        let date = dayjs.unix(forecast.dt).format(`M/D/YYYY`)
        if (!dateArray.includes(date)) {
            dateArray.push(date);
            forecastHtml += `
                <div class="card card text-bg-primary" style="width: 10rem;">
                    <h4>${date}</h4>
                    <div class="card-body">
                        <div class="card-text">
                            <img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png">
                            <p>Temp: ${Math.round(forecast.main.temp)}°F</p>
                            <p>Wind: ${forecast.wind.speed}</p>
                            <p>Humidity: ${forecast.main.humidity}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    document.querySelector(`#forecast-title`).style.display = 'block';
    forecastEl.innerHTML = forecastHtml;
}

// Function to save search history
function saveSearchHistory(cityName) {
    let searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistoryArray.includes(cityName)) {
        searchHistoryArray.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));
    }
}

// Function to display search history
function displaySearchHistory() {
    let searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory')) || [];
    let searchHistoryHtml = '';
    for (const city of searchHistoryArray) {
        searchHistoryHtml += `
        <div class="d-grid gap-2">
        <button type="button" class="btn btn-secondary">${city}</button>
        </div>`;
    }
    searchHistory.innerHTML = searchHistoryHtml;
}

// Function to get weather data when a city is clicked from the search history
async function getWeatherDataFromHistory(e) {
    const cityName = e.target.textContent;
    const coord = await getGeoCode(cityName); // Call the getGeoCode function and wait for the response
    const weather = await getCurrentWeather(coord.lat, coord.lon);
    displayCurrentWeatherData(weather);
    // Call the getFiveDayForecast function to get forecast array
    const forecastArray = await getFiveDayForecast(coord.lat, coord.lon);
    // Call the parseForecast function to get unique dates from the forecast array
    parseForecast(forecastArray);
}

// Event listener for search history
searchHistory.addEventListener('click', getWeatherDataFromHistory);

// Call the displaySearchHistory function to display search history
displaySearchHistory();

// Event listener for search form
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cityName = searchInput.value;
    const coord = await getGeoCode(cityName); // Call the getGeoCode function and wait for the response
    const weather = await getCurrentWeather(coord.lat, coord.lon);
    displayCurrentWeatherData(weather);
    // Call the getFiveDayForecast function to get forecast array
    const forecastArray = await getFiveDayForecast(coord.lat, coord.lon);
    // Call the parseForecast function to get unique dates from the forecast array
    parseForecast(forecastArray);
    saveSearchHistory(cityName);
    // Call the displaySearchHistory function to display search history
    displaySearchHistory();
    searchInput.value = '';
});


































































