const APIKey = `d9f7ae52bdcbdea7747b2ed5150396ce`;
const formEl = document.getElementById(`search-form`);
const inputEl = document.getElementById(`city-input`);
const submitEl = document.getElementById(`submit-button`);
const cardContainer = document.getElementById(`card-container`);
const cardContainerMainEl = document.getElementById(`card-container-today`);
const cardContainerFiveDayEl = document.getElementById(`card-container-five-day`);
const savedCitiesEl = document.getElementById(`saved-cities`);
const cityBtnEl = document.getElementsByClassName(`city-button`);
const clearBtnEl = document.getElementById(`clear-button`);

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
  cityButton.classList = `city-button d-block p-1 mb-3 w-100 btn btn-secondary`;
  cityButton.setAttribute(`type`, `button`);
  savedCitiesEl.appendChild(cityButton);
}

function createCards(city) {

  let cardEl = document.createElement(`div`);
  cardEl.classList = `card-deck`;

  let cardCreated = 0;
  let previousDate = '';
  let name = city.city.name;

  for(let i = 0; i < city.list.length; i++) {
    let dateUnix = dayjs.unix(city.list[i].dt);
    let currentDate = dayjs(dateUnix).format(`DD/MM/YYYY`);

    let temp = city.list[i].main.temp;
    let humidity = city.list[i].main.humidity;
    let wind = city.list[i].wind.speed;
    let icon =  city.list[i].weather[0].icon;
    //changing the icons to a day icon
    let iconNew = icon.slice(0, 2);

    //checking if the date is not the same
    if(currentDate !== previousDate) {
      //create only up to cardlimit (6) cards
      if(cardCreated < cardLimit) {
        //creating a weather card

        let cardBodyEl = document.createElement(`div`);
        cardBodyEl.classList = `card w-75`;
    
        let cityNameEl = document.createElement(`div`);
        cityNameEl.textContent = name + ` (` + currentDate + `)`;
        cityNameEl.classList = `card-header`;
        cityNameEl.setAttribute(`style`, `font-size: 20px`);
        cardBodyEl.appendChild(cityNameEl);


        let tempIconEl = document.createElement(`img`);
        let iconURL = `https://openweathermap.org/img/wn/${iconNew}d@2x.png`;
        tempIconEl.setAttribute(`src`, iconURL);
        tempIconEl.setAttribute(`width`, `192px`);
        tempIconEl.setAttribute(`height` , `200px`);
        tempIconEl.classList = `mx-auto`;
        cardBodyEl.appendChild(tempIconEl);
      
        let listEl = document.createElement(`ul`);
        listEl.classList = `list-group list-group-flush`;
        cardBodyEl.appendChild(listEl);

        let cityTempEl = document.createElement(`li`);
        cityTempEl.textContent = `Temperature: ` + temp + `°C`;
        cityTempEl.classList = `list-group-item`;
        listEl.appendChild(cityTempEl);
      
        let cityWindEl = document.createElement(`li`);
        cityWindEl.textContent = `Wind: ` + wind + `KPH`;
        cityWindEl.classList = `list-group-item`;
        listEl.appendChild(cityWindEl);
      
        let cityHumidityEl = document.createElement(`li`); 
        cityHumidityEl.textContent = `Humidity: ` + humidity + `%`;
        cityHumidityEl.classList = `list-group-item`;
        listEl.appendChild(cityHumidityEl);
      
        if(i === 0) {
          cardContainerMainEl.appendChild(cardBodyEl);
          let fiveDayTitle = document.createElement(`h3`);
          fiveDayTitle.textContent = `5 Day Forecast:`;
          fiveDayTitle.classList = `p-3 mt-5`;
          cardContainerFiveDayEl.appendChild(fiveDayTitle);
        } else {
          cardEl.appendChild(cardBodyEl);
          cardContainerFiveDayEl.appendChild(cardEl);
        }

        //created cards counter
        cardCreated++;
      }

      //set the current date to the previous date variable
      previousDate = currentDate;
    }
  }
}

function getInfo(city) {
  let found = 0;

  const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;
  
  fetch(apiUrl)
    .then(function(response) {
      if(response.ok) {
        response.json().then(function(data) {
          // console.log(data);

          //save city name
          for(let i = 0; i < cities.length; i++) {
            if(city === cities[i]) {
              found = 1;
            } 
          }

          if(found === 0) {
            cities.push(data.city.name);
            saveCity(cities);
            createButtons(city);
          }

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

function clearCards() {

  if(cardContainerMainEl.hasChildNodes) {
    if(cardContainerMainEl.childNodes.length > 0) {
      for(let i = 0; i < cardContainerMainEl.childNodes.length; i++) {
        cardContainerMainEl.children[i].remove();
      }
    }
  }


  if(cardContainerFiveDayEl.hasChildNodes) {
    if(cardContainerFiveDayEl.childNodes.length > 0) {
      let length = cardContainerFiveDayEl.childNodes.length;
      for(let i = 0; i < length; i++) {
        cardContainerFiveDayEl.firstElementChild.remove();
      }
    }
  }

}

function clearData() {
  cities = [];
  saveCity(cities);
  location.reload();
}


$(document).ready(function() {
  // console.log(`document ready`);

  if(cities != null) {
    for(let i = 0; i < cities.length; i++) {
      createButtons(cities[i]);
      cityBtnEl[i].addEventListener(`click`, function(event) {
        // console.log(event.target.textContent);
        clearCards();
        getInfo(event.target.textContent);
      });
    }
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
      clearCards();
      getInfo(city);
    } else {
      alert(`enter something`);
    }
  });

  clearBtnEl.addEventListener(`click`, function(event) {
    clearData();
  });

});
