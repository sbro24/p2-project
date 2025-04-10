'use strict'

const calcForecastBtn = document.getElementById("calcForecastBtn");

calcForecastBtn.addEventListener("click", function () {
    fetchForecast();
});

function fetchForecast () {
    fetch('/api/calcForecast');
};