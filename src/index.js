// Get current day
let currentDate = new Date();
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let dayIndex = currentDate.getDay();
let currentDay = days[dayIndex];
document.querySelector("#day").innerHTML = `${currentDay},`;

//Get current date
function formatDate() {
  let currentDOM = currentDate.getDate(); //day of month
  let currentYear = currentDate.getFullYear();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "Decemeber",
  ];
  let monthIndex = currentDate.getMonth();
  let currentMonth = months[monthIndex];

  return `${currentDOM}th ${currentMonth} ${currentYear}`;
}

let dateElement = document.querySelector("#date");
dateElement.innerHTML = formatDate();

//Get current time
function formatTime() {
  let currentHour = currentDate.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }

  let currentMinute = currentDate.getMinutes();
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }
  return `${currentHour}:${currentMinute}`;
}
let timeElement = document.querySelector("#time");
timeElement.innerHTML = formatTime();

//Get forecast using City name
function searchCity(city) {
  let apiKey = "7bf3ba8d3f15df7b82b1c7bfba361d28";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(getSearchTemp);
}
//Get search location
function submitCountry(country) {
  country.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}

//Get temperature at search location
function getSearchTemp(response) {
  let cityUpdate = document.querySelector("#city-name");
  let weatherDescriptionElement = document.querySelector("#weather-description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let temperatureElement = document.querySelector("#temperature");
  let weatherIconElement = document.querySelector("#weather-icon");

  celsiusTemp = response.data.main.temp;
  clickCelsius.classList.add("active");
  clickFahrenheit.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  cityUpdate.innerHTML = `${response.data.name}`;
  weatherDescriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windSpeedElement.innerHTML = `${Math.round(response.data.wind.speed * 3.6)}km/h`;
  weatherIconElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  weatherIconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}
//Display daily forecast temperatures
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class = "row">`;
  forecast.forEach(function (forecastDay, index) {
    if (0 < index && index < 7) {
      forecastCelsiusMin = forecastDay.temp.min;
      forecastCelsiusMax = forecastDay.temp.max;
      forecastHTML =
        forecastHTML +
        ` <div class="col-2 daily-forecast">
            <div class="weather-forecast-preview">
              <div class="forecast-day">${formatDay(forecastDay.dt)}</div>
              <image class="icon" src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" >
              <div class="forecast-temperature">
                <span class="forecast-temperature-max" id ="forecast-temperature-max">${Math.round(
                  forecastCelsiusMax
                )}</span><span>°</span
                ><span class="forecast-temperature-min" id="forecast-temperature-min">${Math.round(
                  forecastCelsiusMin
                )}</span><span class="forecast-temperature-min-unit">°</span>
              </div>
            </div>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Forecast days
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
//Get coordinates for forecast
function getForecast(coordinates) {
  let apiKey = "7bf3ba8d3f15df7b82b1c7bfba361d28";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,alerts,hourly,minutely&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}
//Toggle between celsius and fahrenheit link
function displayCelsiusTemp(celsius) {
  celsius.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  clickCelsius.classList.add("active");
  clickFahrenheit.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemp);

  let tempMaxElements = document.querySelectorAll("#forecast-temperature-max");
  let tempMinElements = document.querySelectorAll("#forecast-temperature-min");
  for (let i = 0; i < 6; i++) {
    maxCelsius = Math.round((Number(tempMaxElements[i].innerHTML) - 32) * (5 / 9));
    let maxCelsiusElement = document.querySelectorAll("#forecast-temperature-max");
    maxCelsiusElement[i].innerHTML = maxCelsius;

    minCelsius = Math.round((Number(tempMinElements[i].innerHTML) - 32) * (5 / 9));
    let minCelsiusElement = document.querySelectorAll("#forecast-temperature-min");
    minCelsiusElement[i].innerHTML = minCelsius;
  }
}

let clickCelsius = document.querySelector("#celsius-link");
clickCelsius.addEventListener("click", displayCelsiusTemp);

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  clickCelsius.classList.remove("active");
  clickFahrenheit.classList.add("active");
  temperatureElement.innerHTML = Math.round(celsiusTemp * (9 / 5) + 32);

  let tempMaxElements = document.querySelectorAll("#forecast-temperature-max");
  let tempMinElements = document.querySelectorAll("#forecast-temperature-min");
  for (let i = 0; i < 6; i++) {
    maxFahrenheit = Math.round(Number(tempMaxElements[i].innerHTML) * (9 / 5) + 32);
    let maxFahrenheitElement = document.querySelectorAll("#forecast-temperature-max");
    maxFahrenheitElement[i].innerHTML = maxFahrenheit;

    minFahrenheit = Math.round(Number(tempMinElements[i].innerHTML) * (9 / 5) + 32);
    let mixFahrenheitElement = document.querySelectorAll("#forecast-temperature-min");
    mixFahrenheitElement[i].innerHTML = minFahrenheit;
  }
}
let clickFahrenheit = document.querySelector("#fahrenheit-link");
clickFahrenheit.addEventListener("click", displayFahrenheitTemp);
//

let celsiusTemp = null;

let searchCountry = document.querySelector("#search-form");
searchCountry.addEventListener("submit", submitCountry);

searchCity("Kiel");
