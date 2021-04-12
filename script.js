var form = document.querySelector("form");
var userInput = document.getElementById("city-input");
var cityInput = [];
var cityListEl = document.querySelector(".city-list");
var dailyEl = document.querySelector(".jumbotron");
var cityNameDisplay = document.querySelector(".city-name-display");
var mainTemp = document.querySelector(".temp");
var mainIcon = document.querySelector(".icon");
var mainWind = document.querySelector(".wind");
var mainHumid = document.querySelector(".humidity");
var mainUv = document.querySelector(".uv");
var cardEl = document.querySelectorAll(".card");
var cardTitleEl = document.querySelectorAll(".card-title");
var cardBodyEl = document.querySelectorAll(".card-text");
var weatherForecastTitle = document.querySelector(".forecast-title");
var weatherForecast = document.querySelector(".forecast");

//Retrieves the saved cities from local storage and saves it to the cityInput array. If there are none saved, the array is empty. It then generates the display
function init() {
  var savedCityInput = JSON.parse(localStorage.getItem("city-list"));
  if (savedCityInput !== null) {
    cityInput = savedCityInput;
    generateListDisplay();
  }
}
//Added event listener for the cities list. Targets the city button that triggered the event and uses its name to find the location of the city.
cityListEl.addEventListener("click", function (event) {
  dailyEl.classList.remove("collapse");
  weatherForecast.classList.remove("collapse");
  weatherForecastTitle.classList.remove("collapse");
  var cityName = event.target.innerHTML;
  getLocation(cityName);
});

//Event listener for the form. Will be triggered by both the submit button and pressing enter. If nothing is inputed, the function will not run. Otherwise, the city name will be pushed to the cityName array and saved to local storage. It will then be rendered and the location used.
form.addEventListener("submit", function (event) {
  event.preventDefault();
  var cityName = userInput.value.trim();
  if (cityName === "") {
    return;
  } else {
    dailyEl.classList.remove("collapse");
    weatherForecast.classList.remove("collapse");
    weatherForecastTitle.classList.remove("collapse");
    cityInput.push(cityName);
    localStorage.setItem("city-list", JSON.stringify(cityInput));
    generateListDisplay();
    getLocation(cityName);
  }
});
//The list Element is set to an empty string so it renders each time the function is called. The cityInput array is looped through and a new button element created for each.
function generateListDisplay() {
  cityListEl.innerHTML = "";
  for (var i = 0; i < cityInput.length; i++) {
    var newEl = document.createElement("BUTTON");
    newEl.textContent = cityInput[i];
    newEl.setAttribute("class", "list-group-item list-group-item-action");
    cityListEl.appendChild(newEl);
  }
}
//The location name is used to fetch the latitude and longitude of the location.This is then used by the get Weather function.
var getLocation = function (cityName) {
  var requestURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=9a2fde410db91e614e3f43f15460cd9b";
  fetch(requestURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var long = data[0].lon;
        var lat = data[0].lat;
        getWeather(lat, long, cityName);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};
//The latitude and longitude is used to get the information for a specific location. The weather data is fetched and used to dispay the current weather. Depending on the value of the uvi, a different colour is set to show its severity.
//Each card is then looped through to display the weather data for the 5-day forecast. The weather icon number is used to set the source for the image.
var getWeather = function (lat, long, cityName) {
  var weatherURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    long +
    "&units=metric&appid=9a2fde410db91e614e3f43f15460cd9b";

  fetch(weatherURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var currentDate = data.current.dt;
        cityNameDisplay.innerHTML =
          cityName + moment(currentDate, "X").format(" (DD/MM/YYYY)");
        mainIcon.src =
          "http://openweathermap.org/img/wn/" +
          data.daily[0].weather[0].icon +
          "@2x.png";
        mainTemp.textContent = data.current.temp + "ºC";
        mainWind.textContent = data.current.wind_speed + " km/h";
        mainHumid.textContent = data.current.humidity + " %";
        mainUv.textContent = data.current.uvi;
        if (data.current.uvi <= 3) {
          mainUv.setAttribute("class", "px-3 bg-success");
        } else if (data.current.uvi <= 7 && data.current.uvi >= 4) {
          mainUv.setAttribute("class", "px-3 bg-warning");
        } else {
          mainUv.setAttribute("class", "px-3 bg-danger");
        }

        for (var i = 0; i < cardEl.length; i++) {
          cardBodyEl[i].innerHTML = "";
          var date = data.daily[i + 1].dt;
          cardTitleEl[i].innerHTML = moment(date, "X").format("DD/MM/YYYY");
          var icon = document.createElement("img");
          var temp = document.createElement("p");
          var wind = document.createElement("p");
          var humidity = document.createElement("p");
          icon.src =
            "http://openweathermap.org/img/wn/" +
            data.daily[i + 1].weather[0].icon +
            "@2x.png";
          temp.innerHTML = "Temp: " + data.daily[i + 1].temp.day + "ºC";
          wind.innerHTML = "Wind: " + data.daily[i + 1].wind_speed + " km/h";
          humidity.innerHTML = "Humidity " + data.daily[i + 1].humidity + " %";
          cardBodyEl[i].appendChild(icon);
          cardBodyEl[i].appendChild(temp);
          cardBodyEl[i].appendChild(wind);
          cardBodyEl[i].appendChild(humidity);
        }
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};
init();
