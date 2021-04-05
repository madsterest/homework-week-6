var form = document.querySelector("form");
var userInput = document.getElementById("city-input");
var cityInput = [];
var cityListEl = document.querySelector(".city-list");

form.addEventListener("submit", function (event) {
  console.log(form);
  event.preventDefault();
  var cityName = userInput.value;

  var requestURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=9a2fde410db91e614e3f43f15460cd9b";
  cityInput.push(cityName);

  for (var i = 0; i < cityInput.length; i++) {
    var newEl = document.createElement("p");
    newEl.textContent = cityInput[i];
    newEl.setAttribute("class", "list-group-item");
    cityListEl.appendChild(newEl);
  }
});
