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
const allData = document.querySelector(".allData")
const loadingScreen = document.getElementById("loadingScreen");
const noDataScreen = document.getElementById("no-Data");
const boxesContainer = document.querySelector(".boxes");
var api_data = {}





const key = "1c5f2edc6a0c4083a64155925240601"
var lat;var lon;var url;

function updateBox_2(data){    
    let img = data.day.condition.icon;
    let maxTemp = data.day.maxtemp_c;
    let minTemp = data.day.mintemp_c;
    let dateDetail = new Date(data.date);
    let day = weekdayCollect[dateDetail.getDay()];
    let month = monthCollect[dateDetail.getMonth()];
    let date = dateDetail.getDate();

    // <div class="box glassItem">
    //     <p>${day}</p>
    //     <img src='${img}' alt=''>
    //     <p>${maxTemp}°,${minTemp}°</p>
    //     <p>${date} ${month}</p>
    // </div>
    var fetch = boxesContainer.innerHTML;
    boxesContainer.innerHTML = `<div class='box glassItem'>
                                    <p>${day}</p>
                                    <img src='${img}' alt=''>
                                    <p>${maxTemp}°,${minTemp}°</p>
                                    <p>${date} ${month}</p>
                                </div>` + fetch;
}

function UpdateBox_1(data){
    boxesContainer.innerHTML = "";
    for(let i = 13; i>=0; i--){
        updateBox_2(data.forecast.forecastday[i]);
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
        weatherImg.innerHTML = `<img src='${data.current.condition.icon}'alt=''>`;
        console.log(data.current.condition.icon);
        messege.innerText = data.current.condition.text;
        feelslike.innerText = data.current.feelslike_c;
        humidityData.innerText = data.current.humidity;
        PreData.innerText = data.forecast.forecastday[0].day.daily_chance_of_rain;
        windData.innerText = data.current.wind_kph;
        country.innerText = data.location.country;
        displayDate(data.location.localtime);
        UpdateBox_1(data);
}

function displayError(){
    noDataScreen.style.display = "flex";
    loadingScreen.style.display = "none";
    noDataScreen.innerHTML = "<p>No data</p><p>There is some problem</p><p>Please enter a valid Location</p>"
}
function getWeather(url_){
    const weather = fetch(url_);
    noDataScreen.style.display = "none";
    loadingScreen.style.display = "flex";
    allData.classList.add("hidden");
    weather.then((response)=>{
        return response.json();
    }).then((data)=>{
        updateDetails(data);
        console.log(data);
        api_data = data;
        updateForecast(0);
        // boxes[0].classList.remove("glassItem")
        loadingScreen.style.display = "none";
        allData.classList.remove("hidden");
    }).catch((error)=>{
        console.log(error);
        console.log("Error");
        allData.classList.add("hidden");
        displayError();
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
        noDataScreen.innerHTML = "<p>No data</p><p>Please Check location Permission</p><p>Or search by the location</p>"
        console.log("Error");
        allData.classList.add("hidden");
        noDataScreen.style.display = "flex";
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
window.addEventListener("load",async ()=>{
    getLatlon();
})

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      btn.click();
    }
});


function updateForeTempData(data){
    let AvgTemp = document.querySelector(".fore-temp_");
    let Fore_icon = document.querySelector(".fore-icon");
    let fore_status = document.querySelector(".fore-sunny");
    let maxTemp = document.querySelector(".fore-maxtemp-text");
    let minTemp = document.querySelector(".fore-mintemp-text");
    AvgTemp.innerText = data.day.avgtemp_c;
    Fore_icon.innerHTML = `<img src=${data.day.condition.icon} alt="icon">`
    fore_status.innerText = data.day.condition.text;
    maxTemp.innerText = data.day.maxtemp_c+" °C";
    minTemp.innerText = data.day.mintemp_c+" °C";
}

function upadateHourTemp(data){
    let fore_temp_graph_boxes = document.querySelector(".fore-temp-graph-boxes");
    fore_temp_graph_boxes.innerHTML = "";
    for(let i = 23; i >=0; i--){
        let hourData = data.hour[i];
        var fetch = fore_temp_graph_boxes.innerHTML;
        var height = (hourData.temp_c - data.day.mintemp_c)*(60/(data.day.maxtemp_c - data.day.mintemp_c))
        fore_temp_graph_boxes.innerHTML = `<div class="fore-temp-graph-box">
                                                <p class="graph-temp-data">${hourData.temp_c}</p>
                                                <div class="graph-stick" style = "height :${height+20}px"></div>
                                                <img src="${hourData.condition.icon}" alt="">
                                                <p>${i}:00</p>
                                                </div>` + fetch;
    }
}

 var boxes = document.querySelectorAll(".box");
    boxes.forEach((box,index) => {
        box.addEventListener("click",()=>{
        updateForecast(index);
        console.log(box);
     })
 });



function updateForecast(index){
    // console.log(boxes[index]);
    var data = api_data.forecast.forecastday[index];
    updateForeTempData(data);
    upadateHourTemp(data);
}

