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
        const title = document.createElement('h1');
        title.setAttribute('class', 'm-2 fs-1');
        let weather;
        if(data.list[0].weather.main === "Rain"){
            weather = "🌧";
        }
        else{
            weather = "🌞"
        }
        title.textContent= `${city}(${data.list[0].dt_txt.slice(0, 10)}) ${weather}`;
        const description = document.createElement('h4');
        description.setAttribute('class', 'mx-3 my-5 lh-lg');
        description.setAttribute('style', 'white-space: pre;')
        description.textContent = `Temp: ${data.list[0].main.temp}°F\n`;
        description.textContent += `Wind: ${data.list[0].wind.speed}MPH\n`;
        description.textContent += `Humidity: ${data.list[0].main.humidity}%`;
        row1.appendChild(title);
        row1.appendChild(description);
        const row2 = document.createElement('div');
        resultBody.appendChild(row1);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}



var myObj = 1273185387;
    myDate = new Date(1000*myObj);

console.log(myDate.toString());
console.log(myDate.toLocaleString());
console.log(myDate.toUTCString());


ulElement.addEventListener('click', handleListQuery);
formElement.addEventListener('submit', handleFormQuery);