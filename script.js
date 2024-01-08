const input = document.querySelector(".searchbar");
const btn = document.querySelector(".btn");
const locationBtn = document.querySelector(".locationBtn");
const weatherImg = document.querySelector(".icon");
const cityName = document.querySelector(".city-name")
const temp = document.querySelector(".temp_")
const feelslike = document.querySelector(".feelsLike");
const humidityData = document.querySelector(".humidityData");
const PreData = document.querySelector(".PreData");
const windData = document.querySelector(".windData");
const messege = document.querySelector(".messege");
const dates = document.querySelector(".dates");
const country = document.querySelector(".country");
const boxes = document.querySelectorAll(".box");
var api_data = {};




const key = "1c5f2edc6a0c4083a64155925240601"
var lat;var lon;var url;

function updateBox2(box,data){    
    let img = data.day.condition.icon.slice(35,42);
    let maxTemp = data.day.maxtemp_c;
    let minTemp = data.day.mintemp_c;
    let dateDetail = new Date(data.date);
    let day = weekdayCollect[dateDetail.getDay()];
    let month = monthCollect[dateDetail.getMonth()];
    let date = dateDetail.getDate();

    box.innerHTML = `<p>${day}</p><img src='res/icons/${img}.png' alt=''><p>${maxTemp}°,${minTemp}°</p><p>${date} ${month}</p>`
}

function UpdateBox1(data){
    for(let i = 0; i<boxes.length; i++){
        updateBox2(boxes[i],data.forecast.forecastday[i]);
    }
}
const weekdayCollect = {
    0:"Sun", 1:"Mon", 2:"Tues",3:"Wed",4:"Thus",5:"Fri",6:"Sat"
}
const monthCollect = {
    0:"Jan", 1:"Feb", 2:"Mar",3:"Apr",4:"May",5:"Jun",6:"Jul", 7:"Aug", 8:"Sep", 9:"Oct", 10:"Nov",11:"Dec"
}

function displayDate(time_stamp){
    const dateDetail = new Date(time_stamp.slice(0,10));
    console.log(dateDetail.getSeconds());
    var day = dateDetail.getDay();
    var month = dateDetail.getMonth();
    var date = dateDetail.getDate();
    var time = time_stamp.slice((time_stamp.length-5),time_stamp.length);
    var allDetail = `${weekdayCollect[day]}, ${date} ${monthCollect[month]}, ${time}`;
    dates.innerText = allDetail;
}


function updateDetails(data){
    console.log(data.forecast.forecastday[0].day.daily_chance_of_rain);
        temp.innerText = data.current.temp_c;
        cityName.innerText = data.location.name;
        weatherImg.innerHTML = `<img src='res/icons/${data.current.condition.icon.slice(35,42)}.png'alt=''>`;
        console.log(`<img src='res/icons/${data.current.condition.icon.slice(35,42)}.png'alt=''>`);
        messege.innerText = data.current.condition.text;
        feelslike.innerText = data.current.feelslike_c;
        humidityData.innerText = data.current.humidity;
        PreData.innerText = data.forecast.forecastday[0].day.daily_chance_of_rain;
        windData.innerText = data.current.wind_kph;
        country.innerText = data.location.country;
        displayDate(data.location.localtime);
        UpdateBox1(data);
}

function getWeather(url_){
    const weather = fetch(url_);
    weather.then((response)=>{
        return response.json();
    }).then((data)=>{
        updateDetails(data);
        console.log(data);
        api_data = data;
    }).catch((error)=>{
        console.log(error);
    })
}


function getLatlon(){
    navigator.geolocation.getCurrentPosition((location)=>{
        console.log(location);
        lat = location.coords.latitude;
        lon = location.coords.longitude;
        url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${lon}&days=14`
        getWeather(url);
    },
    ()=>{

    }
    )
}

btn.addEventListener("click",()=>{
    url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${input.value}&days=14`
    console.log(url);
    getWeather(url);
})

locationBtn.addEventListener("click",async ()=>{
    getLatlon();
})
window.addEventListener("DOMContentLoaded",async ()=>{
    getLatlon();
})

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      btn.click();
    }
});



boxes.forEach((box,index) => {
    box.addEventListener("click",()=>{
        updateForecast(box,index);
    })
});

function updateForecast(box,index){
    let data = api_data.forecast.forecastday[index];
    temp.innerText = data.day.avgtemp_c;
}

