const formEl = document.getElementById(`search-form`);
const inputEl = document.getElementById(`city-input`);
const submitEl = document.getElementById(`submit-button`);

formEl.addEventListener(`submit`, function(event) {
  event.preventDefault();
  if(inputEl.value) {
    console.log(inputEl.value);
  } else {
    alert(`enter something`);
  }

});