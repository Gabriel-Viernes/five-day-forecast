
// API KEY: 3e435c47205fce9efa0e31699f09a538
// API CALL URL: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
async function getWeather() {
    let city = `Houston`;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=3e435c47205fce9efa0e31699f09a538&units=imperial`)
    let data = await res.json();
    console.log(data);
}
getWeather();