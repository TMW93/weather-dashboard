const APIKey = `d9f7ae52bdcbdea7747b2ed5150396ce`;
const formEl = document.getElementById(`search-form`);
const inputEl = document.getElementById(`city-input`);
const submitEl = document.getElementById(`submit-button`);
const cardContainer = document.getElementById(`card-container`);
const cardContainerMainEl = document.getElementById(`card-container-today`);
const cardContainerFiveDayEl = document.getElementById(`card-container-five-day`);
const savedCities = document.getElementById(`saved-cities`);
const cardLimit = 6;

let cities = JSON.parse(localStorage.getItem(`cities`));
if(cities === null) {
  cities = [];
}

function capitaliseLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function saveCity(city) {
  localStorage.setItem(`cities`, JSON.stringify(city));
}

function createButtons(cities) {
  let cityButton = document.createElement(`button`);
  cityButton.textContent = cities;
  cityButton.classList = `d-block p-2`;
  savedCities.appendChild(cityButton);
  // console.log(cityButton.textContent);
}

function createCards(city) {
  let cardCreated = 0;
  let previousDate = '';
  let name = city.city.name;

  for(let i = 0; i < city.list.length; i++) {
    let dateUnix = dayjs.unix(city.list[i].dt);
    let currentDate = dayjs(dateUnix).format(`DD/MM/YYYY`);

    let temp = city.list[i].main.temp;
    let humidity = city.list[i].main.humidity;
    let wind = city.list[i].wind.speed;

    //checking if the date is not the same
    if(currentDate !== previousDate) {
      //create only up to cardlimit (6) cards
      if(cardCreated < cardLimit) {
        //creating a weather card
        let cardBodyEl = document.createElement(`div`);
        cardBodyEl.classList = `flex-column justify-space-between align-center`;
    
        let cityNameEl = document.createElement(`span`);
        cityNameEl.textContent = name + ` (` + currentDate + `)`;
        cityNameEl.classList = `d-block p-2`;
        cardBodyEl.appendChild(cityNameEl);
      
        let cityTempEl = document.createElement(`span`);
        cityTempEl.textContent = `Temperature: ` + temp;
        cityTempEl.classList = `d-block p-2`;
        cardBodyEl.appendChild(cityTempEl);
      
        let cityWindEl = document.createElement(`span`);
        cityWindEl.textContent = `Wind: ` + wind;
        cityWindEl.classList = `d-block p-2`;
        cardBodyEl.appendChild(cityWindEl);
      
        let cityHumidityEl = document.createElement(`span`); 
        cityHumidityEl.textContent = `Humidity: ` + humidity;
        cityHumidityEl.classList = `d-block p-2`;
        cardBodyEl.appendChild(cityHumidityEl);
      
        if(i === 0) {
          cardContainerMainEl.appendChild(cardBodyEl);
          let fiveDayTitle = document.createElement(`h3`);
          fiveDayTitle.textContent = `5 Day Forecast`;
          cardContainerFiveDayEl.appendChild(fiveDayTitle);
        } else {
          cardBodyEl.classList = `d-inline-block`;
          cardContainerFiveDayEl.appendChild(cardBodyEl);
        }

        //created cards counter
        cardCreated++;
      }

      //set the current date to the previous date variable
      previousDate = currentDate;

      // console.log(`This is previous date: ${previousDate}`);
      // console.log(`This is current date: ${currentDate}`);
      // if(previousDate === currentDate) {
      //   console.log(`it matches`);
    }
  }
}

function getInfo(city) {
  const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;
  fetch(apiUrl)
    .then(function(response) {
      if(response.ok) {
        response.json().then(function(data) {
          //save city name
          cities.push(data.city.name);
          saveCity(cities);
          createCards(data);
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
    .catch(function(error) {
      alert(`Unable to connect to API`);
    });
}



formEl.addEventListener(`submit`, function(event) {
  event.preventDefault();

  if(inputEl.value) {
    let city = inputEl.value;
    //API is case sensitive, so checking if input starts with an uppercase
    if(city[0] === city[0].toLowerCase()) {
      city = capitaliseLetter(city);
    }
    inputEl.value = ``;
    getInfo(city);
    createButtons(city);
  } else {
    alert(`enter something`);
  }

});

$(document).ready(function() {
  console.log(`document ready`);

  if(cities != null) {
    for(let i = 0; i < cities.length; i++) {
      createButtons(cities[i]);
    }
  }
});
