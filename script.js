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

cityListEl.addEventListener("click", function (event) {
  event.stopPropagation();
  dailyEl.classList.remove("collapse");
  var cityName = event.target.innerHTML;
  getLocation(cityName);
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  var cityName = userInput.value.trim();
  if (cityName === "") {
    return;
  } else {
    dailyEl.classList.remove("collapse");
    cityInput.push(cityName);
    generateListDisplay();
    getLocation(cityName);
  }
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
        getWeather(lat, long, cityName);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};
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
        mainWind.textContent = data.current.wind_speed + " KPH";
        mainHumid.textContent = data.current.humidity + " %";
        mainUv.textContent = data.current.uvi;

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
          wind.innerHTML = "Wind: " + data.daily[i + 1].wind_speed + " KPH";
          humidity.innerHTML = "Humidity " + data.daily[i + 1].humidity + " %";
          cardBodyEl[i].appendChild(icon);
          cardBodyEl[i].appendChild(temp);
          cardBodyEl[i].appendChild(wind);
          cardBodyEl[i].appendChild(humidity);
        }

        console.log(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};
