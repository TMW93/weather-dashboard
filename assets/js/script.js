const formEl = document.getElementById(`search-form`);
const inputEl = document.getElementById(`city-input`);
const submitEl = document.getElementById(`submit-button`);
const cardContainerEl = document.getElementById(`card-container`);
const maxDays = 5;

function capitaliseLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function saveCity(city) {
  localStorage.setItem(`cities`, JSON.stringify(city));
}

function createCards(city) {
  let name = city.city.name;
  let dateUnix = dayjs.unix(city.list[0].dt);
  let date = dayjs(dateUnix).format(`DD/MM/YYYY`);
  let temp = city.list[0].main.temp;
  let humidity = city.list[0].main.humidity;
  let wind = city.list[0].wind.speed;
  // console.log(name);
  // console.log(date);
  // console.log(temp);
  // console.log(humidity);
  // console.log(wind);

  let cardBodyEl = document.createElement(`div`);

  let cityNameEl = document.createElement(`span`);
  cityNameEl.textContent = name + date;
  cardBodyEl.appendChild(cityNameEl);

  let cityTempEl = document.createElement(`span`);
  cityTempEl.textContent = `Temperature: ` + temp;
  cardBodyEl.appendChild(cityTempEl);

  let cityWindEl = document.createElement(`span`);
  cityWindEl.textContent = `Wind: ` + wind;
  cardBodyEl.appendChild(cityWindEl);

  let cityHumidityEl = document.createElement(`span`); 
  cityHumidityEl.textContent = `Humidity: ` + humidity;
  cardBodyEl.appendChild(cityHumidityEl);

  cardContainerEl.appendChild(cardBodyEl);

}

function getInfo(city) {
  const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=d9f7ae52bdcbdea7747b2ed5150396ce`;
  fetch(apiUrl)
    .then(function(response) {
      if(response.ok) {
        response.json().then(function(data) {
          console.log(data);
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
      saveCity(city);
    }
    inputEl.value = ``;
    let cityInfo = getInfo(city);
    console.log(cityInfo);
  } else {
    alert(`enter something`);
  }

})