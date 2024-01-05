const input = document.querySelector(".searchbar");
const btn = document.querySelector(".btn");
const locationBtn = document.querySelector(".locationBtn");
const weatherImg = document.querySelector(".icon");
const temp = document.querySelector(".temp");
const humidity = document.querySelector(".humidityData");
const windData = document.querySelector(".windData");
const feelslike = document.querySelector(".feelsLike");
const des = document.querySelector("#des");
const hero = document.querySelector("#hero")
const cityName = document.querySelector(".cityName")
const mainBody = document.querySelector(".mainBody")
const noData = document.querySelector(".noData")

var key = `5120054d17d61e3b50da1d4b3737bded`;
var url = ``;
var lat;var lon;
// https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid={API key}&units=metric

const imgCollect = {
    _01d : "clearSun", _01n: "clearMoon", _02d: "cloudDay", _02n: "cloudNight",_03d : "cloudDay", _03n: "cloudNight", _04d:"cloudDay", _04n: "cloudNight",_09d : "rainDay", _09n: "rain", _10d: "rainDay", _10n: "rain",_11d : "",_11n: "thunder", _13d: "snowDay", _13n: "snow",_50d : "clearSun",_50n : "clearMoon",
}
var isclicked = false;
function updateDetails(data){
        if(!isclicked){
            hero.classList.remove("before");
            hero.classList.add("container");
            mainBody.classList.remove("hidden")
            isclicked = true;
        }else{
            isclicked = false;
        }
        temp.innerText = data.main.temp;
        humidity.innerText = data.main.humidity+"%";
        feelslike.innerText = data.main.feels_like;
        windData.innerText = data.wind.speed;
        weatherImg.innerHTML = `<img src="res/animated/${imgCollect["_"+data.weather[0].icon]}.svg" alt=""></img>`
        des.innerText = data.weather[0].description;
        console.log(imgCollect["_"+data.weather[0].icon]);
        cityName.innerText = data.name;
}

function getWeather(url_){
    const weather = fetch(url_);
    weather.then((response)=>{
        return response.json();
    }).then((data)=>{
        updateDetails(data);
        console.log(data);
    }).catch((error)=>{
        notFound(error);
        console.log(error);
    })
}

btn.addEventListener("click",()=>{
    url = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${key}&units=metric`
    console.log(url);
    getWeather(url);
})

locationBtn.addEventListener("click",async ()=>{
    navigator.geolocation.getCurrentPosition((location)=>{
        console.log(location);
        lat = location.coords.latitude;
        lon = location.coords.longitude;
        console.log(lat);
        console.log(lon);
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
        getWeather(url);
    },
    ()=>{

    }
    )
})

input.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Trigger the button element with a click
      btn.click();
    }
  });
