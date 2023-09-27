'use strict'
//Buttons
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");
// Containers
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
// Display Fields
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");
const desc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windspeed = document.querySelector("[data-windspeed]");
const humidity = document.querySelector("[data-humidity]");
const cloudiness = document.querySelector("[data-cloudiness]");

// WORKING
// Starting Conditions
let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add('current-tab');
getfromSessionStorage();

const switchTab = function (newTab) {
    if (newTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = newTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first for coordinates, if we have saved them there.
            getfromSessionStorage();
        }
    }
}
// Render The JSON File
function renderWeatherInfo(weatherInfo) {

    console.log(weatherInfo);
    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        alert("An error occured")
        console.log("Error is: ", e);
    }
}

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (e) {
        loadingScreen.classList.remove("active");
        alert("An error occured")
        console.log("Error is: ", e);
    }
}

// GETTING USER COORDINATES
function getfromSessionStorage() {
    const localCoords = sessionStorage.getItem("user-coordinates");
    if (!localCoords) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoords);
        fetchUserWeatherInfo(coordinates);
    }
    console.log(sessionStorage);
}

function showPosition(position) {
    console.log(position);
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("No geolocation support available");
    }
}

// EVENT LISTENERS
userTab.addEventListener("click", () => {
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
});

grantAccessButton.addEventListener("click", getLocation);
