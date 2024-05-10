const ulElement = document.querySelector('ul');
let city;
const formElement = document.getElementById('input_form');
const API_Key = "52dac76407cc883132a49dead4a87d53";
let queryUrl;
const resultBody = document.getElementById('resultContainer');


function initCity(){
    city = localStorage.getItem('city');
    queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},USA&units=imperial&appid=${API_Key}`;
    console.log(city);
}


function handleListQuery(event){
    event.preventDefault();
    resultBody.innerHTML = "";
    localStorage.setItem('city', event.target.textContent);
    initCity();
    displayResults();
}


function handleFormQuery(event){
    event.preventDefault();
    resultBody.innerHTML = "";
    localStorage.setItem('city', document.getElementById('cityInput').value);
    initCity();
    displayResults();
}


function displayResults(){
    fetch(queryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {

      console.log(data);

      if (!data) {
        console.log('No results found!');
        resultBody.textContent = "No results found! Try a different city or check your input!"
      } else {
        const row1 = document.createElement('div');
        row1.setAttribute('class', 'row-12 row-md-12 row-lg-12 m-3 border border-dark');
        const title1 = document.createElement('b');
        title1.setAttribute('class', 'm-2 fs-1');
        let weather;
        console.log(data.list[0].weather[0].main);
        if(data.list[0].weather[0].main === "Clear"){
            weather = "🌞";
        }
        else if(data.list[0].weather[0].main === "Clouds"){
            weather = "⛅";
        }
        else{
            weather = "🌧"
        }
        title1.textContent= `${city}(${data.list[0].dt_txt.slice(0, 10)}) ${weather}`;
        const description = document.createElement('h4');
        description.setAttribute('class', 'mx-3 my-5 lh-lg');
        description.setAttribute('style', 'white-space: pre;')
        description.textContent = `Temp: ${data.list[0].main.temp}°F\n`;
        description.textContent += `Wind: ${data.list[0].wind.speed}MPH\n`;
        description.textContent += `Humidity: ${data.list[0].main.humidity}%`;
        row1.appendChild(title1);
        row1.appendChild(description);
        const row2 = document.createElement('div');
        row2.setAttribute('class', 'row');
        const title2 = document.createElement('b');
        title2.setAttribute('class', 'm-2 fs-1');
        title2.textContent= `5-Day Forecast:`;
        row2.appendChild(title2);
        for(let i = 7; i<data.list.length; i+=8){
          if(data.list[i].weather[0].main === "Clear"){
            weather = "🌞";
        }
        else if(data.list[i].weather[0].main === "Clouds"){
            weather = "⛅";
        }
        else{
            weather = "🌧"
        }
          row2.innerHTML+=`
          <div class= "col">
          <div class="card" data-bs-theme="dark">
          <div class="card-body">
            <h2 class="card-title">${data.list[i].dt_txt.slice(0, 10)}${weather}</h2>
            <p class="card-text" style="white-space: pre;">Temp: ${data.list[i].main.temp}°F\nWind: ${data.list[i].wind.speed}MPH\nHumidity: ${data.list[0].main.humidity}%</p>
          </div>
        </div>
        </div>
        `
        }
        resultBody.appendChild(row1);
        resultBody.appendChild(row2);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}



ulElement.addEventListener('click', handleListQuery);
formElement.addEventListener('submit', handleFormQuery);