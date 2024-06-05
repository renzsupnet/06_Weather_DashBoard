// Initialize document elements that we need access to
const ulElement = document.querySelector('ul');
let city;
const formElement = document.getElementById('input_form');
const API_Key = "52dac76407cc883132a49dead4a87d53";
let queryUrl;
const prevCitiesList = document.getElementById('prevCities');
const resultBody = document.getElementById('resultContainer');

// Initialize value of city according to localStorage
function initCity(){
    city = localStorage.getItem('city');
    queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},USA&units=imperial&appid=${API_Key}`;
    console.log(city);
}

// Resets results and then redisplays new city query according to the city list item that was pressed
function handleListQuery(event){
    event.preventDefault();
    resultBody.innerHTML = "";
    localStorage.setItem('city', event.target.textContent);
    document.getElementById('cityInput').value = event.target.textContent;
    initCity();
    displayResults();
}

// Resets results and then redisplays new city query according to the user input on the text field
function handleFormQuery(event){
    event.preventDefault();
    resultBody.innerHTML = "";
    city = document.getElementById('cityInput').value;
    document.getElementById('cityInput').setAttribute('placeholder', "");
    localStorage.setItem('city', city);
    let temp = [city];
    if(!localStorage.getItem('prevCities')){
      localStorage.setItem('prevCities', JSON.stringify(temp));;
    }
    else{
      const prevCities = JSON.parse(localStorage.getItem('prevCities'));
      if(!prevCities.includes(city)){
        console.log(prevCities);
        // Limit prevCities to 8 in order to prevent overpopulation of list element
        if(prevCities.length === 8){
          prevCities.pop();
        }
        prevCities.push(city);
        localStorage.setItem('prevCities', JSON.stringify(prevCities));
    }
  }
    initCity();
    displayResults();
}

// Uses fetch to access the OpenWeather api
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
      // If nothing is found
      if (!data) {
        console.log('No results found!');
        resultBody.textContent = "No results found! Try a different city or check your input!"
      } 
      
      // Creates 2 rows, 1 for current weather and the other row for 5 day forecast cards
      else {
        const row1 = document.createElement('div');
        row1.setAttribute('class', 'row-12 row-md-12 row-lg-12 m-3 border border-dark');
        const title1 = document.createElement('b');
        title1.setAttribute('class', 'm-2 fs-1');
        let weather;
        console.log(data.list[0].weather[0].main);

      // Checks status of weather forecast and display appropriate emoji to reflect it accurately
        if(data.list[0].weather[0].main === "Clear"){
            weather = "🌞";
        }
        else if(data.list[0].weather[0].main === "Clouds"){
            weather = "⛅";
        }
        else{
            weather = "🌧"
        }

        // String manipulation to get the date from the api
        title1.textContent= `${city}(${data.list[0].dt_txt.slice(0, 10)}) ${weather}`;
        const description = document.createElement('h4');

        // Stylized using Bootstrap 5
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

        // Loop to create the 5-day forecast cards with an increment of 8 for i since the forecast is every 3 hours
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

          // Card stylized according to BootStrap 5
          row2.innerHTML+=`
          <div class= "col">
          <div class="card" data-bs-theme="dark">
          <div class="card-body">
            <h2 class="card-title">${data.list[i].dt_txt.slice(0, 10)}${weather}</h2>
            <h5 class="card-text" style="white-space: pre;">Temp: ${data.list[i].main.temp}°F\nWind: ${data.list[i].wind.speed}MPH\nHumidity: ${data.list[0].main.humidity}%</h5>
          </div>
        </div>
        </div>
        `
        }

        // Append the rows to the parent element in order to display the results
        resultBody.appendChild(row1);
        resultBody.appendChild(row2);
        // Update prevCities
        displayPrevCities();

      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function displayPrevCities(){
          //Create previous cities list
          const prevCitiesItems = JSON.parse(localStorage.getItem('prevCities'));
          let listItem;
          //Make sure past cities list is reverted to an empty html element to avoid duplication
          prevCitiesList.innerHTML = "";
          for(prevCity of prevCitiesItems){
            listItem = document.createElement('li');
            listItem.setAttribute('class', 'list-group-item list-group-item-dark my-3');
            listItem.setAttribute('type', 'button');
            listItem.innerHTML = `<b>${prevCity}</b>`;
            prevCitiesList.appendChild(listItem);
          }
}


// Attaches Event Listeners
ulElement.addEventListener('click', handleListQuery);
formElement.addEventListener('submit', handleFormQuery);

window.addEventListener('load', (event) => {
  // Check localStorage onload if previous cities have been already been searched before and if so display the previous cities list element
  if(localStorage.getItem('prevCities')){
    displayPrevCities();
  }
  // Reset input value field and re-initialize placeholder whenever the site reloads to prevent  input field from persistently displaying last input value
  document.getElementById('cityInput').value = "";
  document.getElementById('cityInput').setAttribute('placeholder', "Type city here");
});