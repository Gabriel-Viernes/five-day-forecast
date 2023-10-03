
// API KEY: 3e435c47205fce9efa0e31699f09a538
// CURRENT WEATHER API CALL: https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// 5day/3hr API CALL URL: api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
let searchContain = document.getElementById('searchContain')
let inputEl = document.getElementById(`locationInput`);

// obj used to transfer data from api to local functions
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

// pulls data from the openweathermap and creates and array of weatherObj to used in local functions
async function getWeather(city) {
    let dataset = [];
    let currentDay = dayjs().format('DD');
    const resCur = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3e435c47205fce9efa0e31699f09a538&units=imperial`)
    if(resCur.ok === false) {
        $('#searchContain').append(`<p id = 'cityWarning' class = "disappear" style = 'position: absolute;font-family: "Traveling-Typewriter"; font-size: 1.5em; text-align:center; width: 100%;'> City not found! Please try again </p>`)
        setTimeout(() => {
            $('#cityWarning').remove()
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
    for (let i = 0; i < dataFore.cnt; i++) {
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

// tells the user to press enter to search
function searchInstruct(e) {
    if (searchContain.lastChild.textContent === " Press enter to search ") {
    } else if (e.code != 'Enter') {
        $('#searchContain').append(`<p id = 'enterRemind' class = "disappear" style = "font-family:Traveling-Typewriter; font-size: 1.5em; position:absolute; margin:0; padding: 0; text-align:center; width: 100%"> Press enter to search </p>`)
        setTimeout(() => {
            $("#enterRemind").remove()
        },1500)
    }    
}

// differentiates between input from input box and user clicking on a previous search
async function displayResults(e) {
    console.log(e.which)
    if ((e.code === 'Enter')) {
        let city = inputEl.value;
        let weatherData = await getWeather(city);
        inputEl.value = '';
        if(weatherData != null) {
            $('#header').attr(`class`, `moveUp`)
            currentWeatherDisp(weatherData);
            forecastWeatherDisp(weatherData)
        }
    } else if (e.which === 1) {
        let city = this.textContent;
        let weatherData = await getWeather(city);
        inputEl.value = '';
        if(weatherData != null) {
            $('#header').attr(`class`, `moveUp`)
            currentWeatherDisp(weatherData);
            forecastWeatherDisp(weatherData)
        }
    }
}

// appends current weather data and previous searches to HTML
function currentWeatherDisp(data) {
    let temp = JSON.parse(localStorage.getItem('searches'));
    $('#currentWeather').removeClass('d-none')
    $('#currentWeather').empty();
    $('#currentWeather').append(`
    <h2>Today in ${data[0].city}, ${dayjs(data[0].date * 1000).format('MMMM DD, YYYY')}</h2>
    <img src='https://openweathermap.org/img/wn/${data[0].icon}@2x.png' style = 'background: grey; border-radius:100%;max-width:15%; padding:0;'></img>
    <p>Current temperature is ${data[0].currTemp}&degF</p>
    <p>Low: ${data[0].minTemp}&degF</p>
    <p>High: ${data[0].maxTemp}&degF</p>
    <p>Humidity: ${data[0].humidity}%</p>
    <p>Wind Speed: ${data[0].windspd} mph</p>
    <div id = 'previousSearch'>
        <h5>Previous searches:</h5>
        <ul id = 'previousSearchList'></ul>
    </div>
    `)
    for (let i = 0; i < temp.length; i++) {
        $('#previousSearchList').append(`<li class = 'searchItem'>${temp[i]}</li>`)
    }
    $('.searchItem').on('click', displayResults);
}

//appends forecast data to HTML
function forecastWeatherDisp (data) {
    $('#forecastWeather').removeClass('d-none');
    // skips currentWeather, which will always be first
    $('#forecastWeather').empty()
    for (let i = 1; i < data.length; i++) {
        $('#forecastWeather').append(`
        <div class = 'm-1 forecastCard'>
            <div style=>
                <h3 class='m-0'>${dayjs(data[i].date * 1000).format('MM/DD')}, ${data[i].weatherDesc}</h3>
                <p class='m-0'>Low: ${data[i].minTemp}&degF | High: ${data[i].maxTemp}&degF</p>
                <p class='m-0'>Hum: ${data[i].humidity}% | Wind:${data[i].windspd}mph</p>              
            </div>
            <img src = 'https://openweathermap.org/img/wn/${data[i].icon}@2x.png' style = 'background: grey; border-radius:100%; object-fit:contain'></img>
        </div>
        `)
    }
}

// checks localStorage if previous searches exist and creates an array to contain them if there are none
function storeSearchCheck (e) {
    if (e.code === 'Enter') {
        if (localStorage.getItem("searches") == null) {
            let searches = ['placeholder'];
            storeSearchModify(searches);
        } else {
            let searches = JSON.parse(localStorage.getItem('searches'));    
            storeSearchModify(searches);    
        }
    }

}

// adds previous searches to an array, up to a max of 5, then puts it in localStorage
function storeSearchModify (input) {
    if (input[0] === 'placeholder') {
        input.push($('#locationInput').val());
        input.shift();
        localStorage.setItem('searches', JSON.stringify(input))
    } else if (input.length > 4) {
        input.push($('#locationInput').val());
        input.shift();
        localStorage.setItem('searches', JSON.stringify(input))
    } else {
        input.push($('#locationInput').val());
        localStorage.setItem('searches', JSON.stringify(input))
    }
}
inputEl.addEventListener('keydown', searchInstruct);
inputEl.addEventListener('keydown', displayResults);
inputEl.addEventListener('keydown', storeSearchCheck);
