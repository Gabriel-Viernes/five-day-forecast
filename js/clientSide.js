
// API KEY: 3e435c47205fce9efa0e31699f09a538
// CURRENT WEATHER API CALL: https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// 5day/3hr API CALL URL: api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
let searchContain = document.getElementById('searchContain')
let inputEl = document.getElementById(`locationInput`);

function weatherObj(city, date, icon, minTemp, maxTemp, currTemp, humidity, windspd) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.maxTemp = maxTemp;
    this.minTemp = minTemp;
    this.currTemp = currTemp;
    this.humidity = humidity;
    this.windspd = windspd
}

async function getWeather() {
    let currentDay = dayjs().format('D');
    let city = document.getElementById(`locationInput`).value;
    const resCur = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3e435c47205fce9efa0e31699f09a538&units=imperial`)
    let dataCur= await resCur.json();
    const resFore = await fetch(`https://api.openweathermap.org/data/2.5/forecast/?q=${city}&cnt=5&appid=3e435c47205fce9efa0e31699f09a538&units=imperial`)
    let dataFore = await resFore.json();
    let currentData = new weatherObj(
        dataCur.name,
        dayjs().format('MMMM DD, YYYY'),
        dataCur.weather.icon,
        dataCur.main.temp_min,
        dataCur.main.temp_max,
        dataCur.main.temp,
        dataCur.main.humidity,
        dataCur.wind.speed
    )
    console.log(currentData);


}

function searchInstruct(e) {
    if (searchContain.lastChild.textContent === "Press enter to search") {
    } else {
        let userInstruct = document.createElement('p');
        userInstruct.textContent = "Press enter to search"
        userInstruct.setAttribute('style', 'font-family: "Traveling-Typewriter"; font-size: 2em')
        searchContain.append(userInstruct);
    }    
}

function displayResults(e) {
    if (e.code === 'Enter') {
        searchContain.removeChild(searchContain.lastChild)
        let weatherData = getWeather();
        inputEl.value = '';


    }
}

function currentWeather(data) {
    // needs:
    // city name
    // data
    // icon 
    // current temp
    // humidity
    // wind speed
}
inputEl.addEventListener('keydown', searchInstruct);
inputEl.addEventListener('keydown', displayResults)
