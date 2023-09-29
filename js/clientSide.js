
// API KEY: 3e435c47205fce9efa0e31699f09a538
// API CALL URL: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
let searchContain = document.getElementById('searchContain')
let inputEl = document.getElementById(`locationInput`);
async function getWeather() {
    let city = document.getElementById(`locationInput`).value;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=3e435c47205fce9efa0e31699f09a538&units=imperial`)
    let data = await res.json();
    console.log(data);
}

function searchInstruct(e) {
    console.log(`searchinstruct added`)
    console.log(e.code);
    if (searchContain.lastChild.textContent === "Press enter to search") {
    } else {
        let userInstruct = document.createElement('p');
        userInstruct.textContent = "Press enter to search"
        userInstruct.setAttribute('style', 'font-family: "Traveling-Typewriter"; font-size: 2em')
        searchContain.append(userInstruct);
    }    
}
inputEl.addEventListener('keydown', searchInstruct);
