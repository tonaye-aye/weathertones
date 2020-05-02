// loading overlay
const loadingOverlay = document.querySelector(".loading");

// menu variables
const menuLinks = document.querySelectorAll(".menu button");
const menuSection = document.querySelector(".menu");
const menuIcon = document.querySelector(".menu-icon");

// create containers for weather elements
const weatherDescription = document.querySelector(".weather-description");
const weatherTemp = document.querySelector(".weather-temp");
const weatherTimezone = document.querySelector(".weather-timezone");
const weatherIcon = document.querySelector("i");

// body
const body = document.querySelector("body");
const section = document.querySelector(".section");

const closeMenu = () => {
  if (menuSection.classList.contains("slide-in")) {
    section.classList.remove("blur");
    menuSection.classList.remove("slide-in");
    menuSection.classList.add("slide-out");
    menuIcon.classList.remove("menu-open");
    menuIcon.classList.add("menu-close");
  }
};

// menu slider
const menuSlider = () => {
  menuIcon.addEventListener("click", () => {
    if (menuSection.classList.contains("slide-in")) {
      closeMenu();
    } else {
      section.classList.add("blur");
      menuSection.className = "menu slide-in";
      menuSection.classList.remove("slide-out");
      menuSection.classList.add("slide-in");
      menuIcon.classList.remove("menu-close");
      menuIcon.classList.add("menu-open");
    }
  });
  section.addEventListener("click", () => {
    closeMenu();
  });
};

// menu navigation
const menuNavigation = () => {
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // update active status
      menuLinks.forEach((item) => {
        item.classList.remove("active");
      });
      link.classList.add("active");

      // pull out the city name - no spaces and lower case
      let city = link.innerHTML.replace(/\s/g, "").toLowerCase();

      // change background image
      body.className = city;

      // choose coordinates
      if (city === "home") {
        currentLocation();
      } else if (city === "tokyo") {
        fetchWeather("35.652832", "139.839478");
      } else if (city === "newyork") {
        fetchWeather("40.73061", "-73.935242");
      } else if (city === "paris") {
        fetchWeather("48.864716", "2.349014");
      } else if (city === "honolulu") {
        fetchWeather("19.741755", "-155.844437");
      } else if (city === "cairo") {
        fetchWeather("30.033333", "31.233334");
      }
    });
  });
};

// fetch weather api from stored variable
const fetchWeather = (lat, long) => {
  // const proxy = `https://cors-anywhere.herokuapp.com/`;
  const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=e17314e6afcc0ae0490ce91a19429b42&units=metric`;

  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // log API data
      console.log(data);

      // set DOM elements from api
      const { timezone } = data;
      const { temp } = data.current;
      const { id, main, description, icon } = data.current.weather[0];

      weatherTemp.textContent = Math.floor(temp);
      weatherDescription.textContent = description;

      let cutTimezone = data.timezone.split("/").pop();
      weatherTimezone.textContent = cutTimezone.replace(/_/g, " ");
      //weatherTimezone.textContent = data.timezone.split("/").pop();

      // create fresh icons
      const iconId = id;
      console.log(iconId);
      if (icon.includes("n")) {
        iconClass = `owf-${iconId}-n`;
        weatherIcon.className = `owf owf-3x ${iconClass}`;
      } else {
        iconClass = `owf-${iconId}-d`;
        weatherIcon.className = `owf owf-3x ${iconClass}`;
      }
    })
    .then(() => {
      console.log("end");
      loadingOverlay.classList.add("end-load");
    });
};

// get coordinates and store api
const currentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // declare coordinate variables
      let long;
      let lat;
      // assign longitude & latitude coordinates
      long = position.coords.longitude;
      lat = position.coords.latitude;

      fetchWeather(lat, long);
      body.className = "home";
    });
  }
};

// app
const app = () => {
  window.addEventListener("load", () => {
    console.log("I love Ashley the most <3");
    currentLocation();
    menuSlider();
    menuNavigation();
  });
};

app();
