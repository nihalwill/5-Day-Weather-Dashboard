$(document).ready(function () {
  function updateTime() {
    var realTime = moment().format("MMMM Do YYYY, h:mm:ss a");

    $("#currentDay").text("Today is: " + realTime);
  }
  setInterval(updateTime, 1000);

  var cityList = [];
  var cityname;

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
  });

  function clear() {
    $("#cityList").empty();
    $("#weatherContainer").empty();
    localStorage.clear();
  }
  $("#clearAll").on("click", clear);
});
