// Global variable declarations

$(document).ready(function () {
  console.log("all sections linked")
  function updateTime() {
    var realTime = moment().format("MMMM Do YYYY, h:mm:ss a");

    $("#currentDay").text("Today is: " + realTime);
  }
  setInterval(updateTime, 1000);

  var cityList = [];
  var cityname;


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

  function pastCityList() {
    var recentCity = JSON.parse(localStorage.getItem("cities"));
    console.log("recentCity:", recentCity);

    pastCity();
  }



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

  function allWeather() {
    var savedWeather = JSON.parse(localStorage.getItem("currentCity"));
    console.log("savedWeather:", savedWeather);

    displayWeather();
    displayFiveDayForecast();
  }

  function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(cityList));
  }

  function storeCurrentCity() {
    localStorage.setItem("currentCity", JSON.stringify(cityname));
  }


  async function displayFiveDayForecast() {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityname +
      "&units=imperial&appid=d3b85d453bf90d469c82e650a0a3da26";
  
    var response = await $.ajax({
      url: queryURL,
      method: "GET",
    });
    var forecastBox = $(
      "<div  class = 'bg-warning text-white' id='fiveDayForecast'>"
    );
    var forecastHeader = $(
      "<h5 class='card-header border-secondary font-weight-bold'>"
    ).text("5 Day Forecast");
    forecastBox.append(forecastHeader);
    var cardDeck = $("<div  class='card-deck'>");
    forecastBox.append(cardDeck);
  
    console.log(response);
    for (i = 0; i < 5; i++) {
      var forecastCard = $("<div class='card mb-3 mt-3'>");
      var cardBody = $("<div class='card-body bg-dark text-white'>");
      var date = new Date();
      var val =
        date.getMonth() +
        1 +
        "/" +
        (date.getDate() + i + 1) +
        "/" +
        date.getFullYear();
      var forecastDate = $("<h5 class='card-title'>").text(val);
  
      cardBody.append(forecastDate);
      var getCurrentWeatherIcon = response.list[i].weather[0].icon;
      console.log(getCurrentWeatherIcon);
      var displayWeatherIcon = $(
        "<img src = http://openweathermap.org/img/wn/" +
          getCurrentWeatherIcon +
          ".png />"
      );
      cardBody.append(displayWeatherIcon);
      var getTemp = response.list[i].main.temp;
      var tempEl = $("<p class='card-text'>").text("Temp: " + getTemp + "° F");
      cardBody.append(tempEl);
      var getHumidity = response.list[i].main.humidity;
      var humidityEl = $("<p class='card-text'>").text(
        "Humidity: " + getHumidity + "%"
      );
      cardBody.append(humidityEl);
      forecastCard.append(cardBody);
      cardDeck.append(forecastCard);
    }
    $("#fiveDay").html(forecastBox);
  }

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
    displayFiveDayForecast();

    
  });
  function clear() {
    $("#cityList").empty();
    $("#weatherContainer").empty();
    localStorage.clear();
  }
  $("#clearAll").on("click", clear);

  
  

  function historyDisplayWeather() {
    cityname = $(this).attr("data-name");
    displayWeather();
    displayFiveDayForecast();

    
    console.log(cityname);
  }

  pastCityList();
  allWeather();

  $(document).on("click", ".city", historyDisplayWeather);
});
