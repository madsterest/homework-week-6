var form = document.querySelector("form");
var userInput = document.getElementById("city-input");
var cityInput = [];
var cityListEl = document.querySelector(".city-list");
var dailyEl = document.querySelector(".jumbotron");
var cityNameDisplay = document.querySelector(".city-name-display");
var mainTemp = document.querySelector(".temp");
var mainWind = document.querySelector(".wind");
var mainHumid = document.querySelector(".humidity");
var mainUv = document.querySelector(".uv");

cityListEl.addEventListener("click", function (event) {
  event.stopPropagation();
  dailyEl.classList.remove("collapse");
  var cityName = event.target.innerHTML;
  cityNameDisplay.innerHTML = cityName + moment().format("(DD/MM/YYYY)");
  getLocation(cityName);
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  dailyEl.classList.remove("collapse");
  var cityName = userInput.value.trim();
  cityNameDisplay.innerHTML = cityName + moment().format("(DD/MM/YYYY)");
  cityInput.push(cityName);
  generateListDisplay();
  getLocation(cityName);
});

function generateListDisplay() {
  cityListEl.innerHTML = "";
  for (var i = 0; i < cityInput.length; i++) {
    var newEl = document.createElement("BUTTON");
    newEl.textContent = cityInput[i];
    newEl.setAttribute("class", "list-group-item list-group-item-action");
    cityListEl.appendChild(newEl);
  }
}
var getLocation = function (cityName) {
  var requestURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=9a2fde410db91e614e3f43f15460cd9b";
  fetch(requestURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        var long = data[0].lon;
        var lat = data[0].lat;
        var city = data[0].name;
        getWeather(lat, long, city);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};
var getWeather = function (lat, long, city) {
  var weatherURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    long +
    "&units=metric&appid=9a2fde410db91e614e3f43f15460cd9b";

  fetch(weatherURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data.current.temp);
        mainTemp.textContent = data.current.temp;
        mainWind.textContent = data.current.wind_speed;
        mainHumid.textContent = data.current.humidity;
        mainUv.textContent = data.current.uvi;

        console.log(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};
