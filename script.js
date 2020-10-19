// Global variable declarations

$(document).ready(function () {
  function updateTime() {
    var realTime = moment().format("MMMM Do YYYY, h:mm:ss a");

    $("#currentDay").text("Today is: " + realTime);
  }
  setInterval(updateTime, 1000);

  var cityList = [];
  var cityname;

  // local storage functions

  // This function displays the city entered by the user into the DOM
  function pastCity() {
    $("#cityList").empty();
    $("#cityInput").val("");

    for (i = 0; i < cityList.length; i++) {
      var cityHistory = $("<a>");
      cityHistory.addClass(
        "list-group-item list-group-item-action list-group-item-danger  city"
      );
      cityHistory.attr("data-name", cityList[i]);
      cityHistory.text(cityList[i]);
      $("#cityList").prepend(cityHistory);
    }
  }

  // This function pulls the city list array from local storage
  function pastCityList() {
    var recentCity = JSON.parse(localStorage.getItem("cities"));
    console.log("recentCity:", recentCity);

    pastCity();
  }



  // This function runs the Open Weather API AJAX call and displays the current city, weather, and 5 day forecast to the DOM
  async function displayWeather() {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityname +
      "&units=imperial&appid=d3b85d453bf90d469c82e650a0a3da26";

    var response = await $.ajax({
      url: queryURL,
      method: "GET",
    });
    console.log(response);

    var currentWeatherDiv = $(
      "<div class='card-body bg-info text-white pt-0' id='currentWeather'>"
    );
    var currentHeader = $(
      "<h5 class='card-header border-secondary pl-0 font-weight-bold'>"
    ).text("Current Forecast");
    currentWeatherDiv.append(currentHeader);
    var getCurrentCity = response.name;
    var date = new Date();
    var val =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    var getCurrentWeatherIcon = response.weather[0].icon;
    var displayCurrentWeatherIcon = $(
      "<img src = http://openweathermap.org/img/wn/" +
        getCurrentWeatherIcon +
        "@2x.png />"
    );
    var currentCityEl = $("<h3 class = 'card-body'>").text(
      getCurrentCity + " (" + val + ")"
    );
    currentCityEl.append(displayCurrentWeatherIcon);
    currentWeatherDiv.append(currentCityEl);
    var getTemp = response.main.temp.toFixed(1);
    var tempEl = $("<p class='card-text'>").text(
      "Temperature: " + getTemp + "° F"
    );
    currentWeatherDiv.append(tempEl);
    var getHumidity = response.main.humidity;
    var humidityEl = $("<p class='card-text'>").text(
      "Humidity: " + getHumidity + "%"
    );
    currentWeatherDiv.append(humidityEl);
    var getWindSpeed = response.wind.speed.toFixed(1);
    var windSpeedEl = $("<p class='card-text'>").text(
      "Wind Speed: " + getWindSpeed + " mph"
    );
    currentWeatherDiv.append(windSpeedEl);
    var getLong = response.coord.lon;
    var getLat = response.coord.lat;

    var uvURL =
      "https://api.openweathermap.org/data/2.5/uvi?appid=d3b85d453bf90d469c82e650a0a3da26&lat=" +
      getLat +
      "&lon=" +
      getLong;
    var uvResponse = await $.ajax({
      url: uvURL,
      method: "GET",
    });

    // getting UV Index info and setting color class according to value
    var getUVIndex = uvResponse.value;
    var uvNumber = $("<span class='text-white'>");
    if (getUVIndex >= 0 && getUVIndex <= 3.99) {
      uvNumber.addClass("low");
    } else if (getUVIndex >= 4 && getUVIndex <= 7.99) {
      uvNumber.addClass("moderate");
    } else if (getUVIndex >= 8) {
      uvNumber.addClass("high");
    }
    uvNumber.text(getUVIndex);
    var uvIndexEl = $("<p class='card-text'>").text("UV Index: ");
    uvNumber.appendTo(uvIndexEl);
    currentWeatherDiv.append(uvIndexEl);
    $("#weatherContainer").html(currentWeatherDiv);
  }

  // This function pull the current city into local storage to display the current weather forecast on reload
  function allWeather() {
    var savedWeather = JSON.parse(localStorage.getItem("currentCity"));
    console.log("savedWeather:", savedWeather);

    displayWeather();
    displayFiveDayForecast();
  }

  // This function saves the city array to local storage
  function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(cityList));
  }

  // This function saves the currently display city to local storage
  function storeCurrentCity() {
    localStorage.setItem("currentCity", JSON.stringify(cityname));
  }

  // Click event handler for city search button
  $("#citySearch").on("click", function (event) {
    event.preventDefault();

    cityname = $("#cityInput").val().trim();
    if (cityname === "") {
      alert("Please enter a city to look up");
    } else if (cityList.length >= 5) {
      cityList.shift();
      cityList.push(cityname);
    } else {
      cityList.push(cityname);
    }
    storeCurrentCity();
    storeCityArray();
    pastCity();
    displayWeather();
    
  });
  function clear() {
    $("#cityList").empty();
    $("#weatherContainer").empty();
    localStorage.clear();
  }
  $("#clearAll").on("click", clear);

  
  

  // This function is used to pass the city in the history list to the displayWeather function
  function historyDisplayWeather() {
    cityname = $(this).attr("data-name");
    displayWeather();
    
    console.log(cityname);
  }

  pastCityList();
  allWeather();

  $(document).on("click", ".city", historyDisplayWeather);
});
