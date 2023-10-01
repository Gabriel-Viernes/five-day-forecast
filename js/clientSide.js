
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
        $('#searchContain').append(`<span class = "disappear" style = 'position: absolute;font-family: "Traveling-Typewriter"; font-size: 1em; padding-left:1em;'> City not found! Please try again </span>`)
        setTimeout(() => {
            $('.disappear').remove()
        },2000);
        return null;
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
        $('#searchContain').append(`<span class = "disappear" style = "font-family:Traveling-Typewriter; font-size: 1.5em; padding-left:1em; position:absolute;"> Press enter to search </span>`)
        setTimeout(() => {
            $(".disappear").remove()
        },1500)
    }    
}

async function displayResults(e) {
    if (e.code === 'Enter') {
        let weatherData = await getWeather();
        console.log(weatherData)
        inputEl.value = '';
        if(weatherData != null) {
            $('#header').attr(`class`, `moveUp`)
            currentWeatherDisp(weatherData);
            forecastWeatherDisp(weatherData)

        }

    }
}

function currentWeatherDisp(data) {
    $('#currentWeather').removeClass('d-none')
    $('#currentWeather').append(`
    <h2>Today in ${data[0].city}, ${dayjs(data[0].date * 1000).format('MMMM DD, YYYY')}</h2>
    <img src='https://openweathermap.org/img/wn/${data[0].icon}@2x.png' style = 'background: grey; border-radius:100%;max-width:15%'></img>
    <p>Current temperature is ${data[0].currTemp}&deg</p>
    <p>Low: ${data[0].minTemp}&deg</p>
    <p>High: ${data[0].maxTemp}&deg</p>
    <p>Humidity: ${data[0].humidity}%</p>
    <p>Wind Speed: ${data[0].windspd} mph</p>
    `)
}

function forecastWeatherDisp (data) {
    $('#forecastWeather').removeClass('d-none');
    // skips currentWeather, which will always be first
    for (let i = 1; i < data.length; i++) {
        $('#forecastWeather').append(`
        <div class = 'row m-1 d-flex'>
        <img src = 'https://openweathermap.org/img/wn/${data[i].icon}.png' style = 'background: grey; border-radius:100%;max-width:15%'></img>
            <div class = 'col-8'>
                <h3 class='m-0'>${dayjs(data[i].date * 1000).format('MM/DD')}, ${data[i].weatherDesc}</h3>
                <p class='m-0'>Low:${data[i].minTemp}&deg|High:${data[i].maxTemp}&deg</p>
                <p class='m-0'>Hum:${data[i].humidity}%|Wind:${data[i].windspd}mph</p>              
            </div>
        </div>
        `)
    }
}
inputEl.addEventListener('keydown', searchInstruct);
inputEl.addEventListener('keydown', displayResults);
