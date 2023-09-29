
// API KEY: 3e435c47205fce9efa0e31699f09a538
// CURRENT WEATHER API CALL: https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// 5day/3hr API CALL URL: api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
let searchContain = document.getElementById('searchContain')
let inputEl = document.getElementById(`locationInput`);

function weatherObj(city, date, icon, weatherDesc, minTemp, maxTemp, currTemp, humidity, windspd) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.weatherDesc = weatherDesc;
    this.maxTemp = maxTemp;
    this.minTemp = minTemp;
    this.currTemp = currTemp;
    this.humidity = humidity;
    this.windspd = windspd
}

async function getWeather() {
    let dataset = [];
    let currentDay = dayjs().format('D');
    let city = document.getElementById(`locationInput`).value;
    const resCur = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3e435c47205fce9efa0e31699f09a538&units=imperial`)
    if(resCur.ok === false) {
        let notFound = document.createElement('p');
        notFound.textContent = "City not found! Please try again"
        notFound.setAttribute('style', 'font-family: "Traveling-Typewriter"; font-size: 2em')
        notFound.setAttribute('class', 'disappear')
        searchContain.append(notFound)
        setTimeout(() => {
            notFound.remove()
        },2000);
        return;
    }
    let dataCur= await resCur.json();
    const resFore = await fetch(`https://api.openweathermap.org/data/2.5/forecast/?q=${city}&appid=3e435c47205fce9efa0e31699f09a538&units=imperial`)
    let dataFore = await resFore.json();

    let currentData = new weatherObj(
        dataCur.name,
        dataCur.dt,
        dataCur.weather[0].icon,
        dataCur.weather[0].description,
        dataCur.main.temp_min,
        dataCur.main.temp_max,
        dataCur.main.temp,
        dataCur.main.humidity,
        dataCur.wind.speed
    )
    dataset.push(currentData);
    for (let i = 1; i < dataFore.cnt; i++) {
        if(currentDay == dayjs(dataFore.list[i].dt * 1000).format('DD')) {
        } else {
            currentDay = dayjs(dataFore.list[i].dt * 1000).format('DD')
            let buffer = new weatherObj(
                "",
                dataFore.list[i].dt,
                dataFore.list[i].weather[0].icon,
                dataFore.list[i].weather[0].description,
                dataFore.list[i].main.temp_min,
                dataFore.list[i].main.temp_max,
                dataFore.list[i].main.temp,
                dataFore.list[i].main.humidity,
                dataFore.list[i].wind.speed
            )
            dataset.push(buffer)
        }
    }

    return dataset;
}

function searchInstruct(e) {
    if (searchContain.lastChild.textContent === " Press enter to search ") {
    } else {
        $('#searchContain').append(`<p class = "disappear" style = "font-family:Traveling-Typewriter; font-size: 2em"> Press enter to search </p>`)
        setTimeout(() => {
            $(".disappear").remove()
        },1500)
    }    
}

function displayResults(e) {
    if (e.code === 'Enter') {
        let weatherData = getWeather();
        inputEl.value = '';
        // currentWeatherDisp(weatherData[0]);
        $('#header').attr(`class`, `moveUp`)


    }
}

function currentWeatherDisp(data) {
    let curWeaDiv = document.getElementById('currentWeather');
    let curWeaTime = dayjs(data.dt).format('MMMM DD, YYYY')
}
inputEl.addEventListener('keydown', searchInstruct);
inputEl.addEventListener('keydown', displayResults)
