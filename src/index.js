import './css/styles.css';

import API from './fetchCountries';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryWraper: document.querySelector('.country-info'),
};

console.log(refs);

refs.countryInput.addEventListener(
  'input',
  debounce(onFetchCountries, DEBOUNCE_DELAY)
);

function onFetchCountries(event) {
  event.preventDefault();
  const formInput = event.target;

  const searchQuery = formInput.value.trim();
  // console.log(searchQuery);

  if (searchQuery === '') {
    return clearCountry();
    //  message
  }

  API.fetchCountries(searchQuery)
    .then(value => {
      console.log(value);
      if (value.length >= 2 && value.length <= 10) {
        clearCountry();
        renderCountryList(value);
        return;
      } else if (value.length === 1) {
        clearCountry();
        renderCountryInfo(value);

        return;
      } else {
        showInfo();
      }
    })
    .catch(showError);
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li>
          <img src = "${flags.svg}" alt="${name.common}">
            <p>${name.common}</p>
          </li>
      `;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markup = country
    .map(({ name, flags, capital, population, languages }) => {
      return `
  <img src = "${flags.svg}" alt="${name.common}">
      <p>${name.common}</p>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${Object.values(languages)}</p>`;
    })
    .join('');
  refs.countryWraper.innerHTML = markup;
}

function clearCountry() {
  refs.countryList.innerHTML = '';
  refs.countryWraper.innerHTML = '';
}

function showError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function showInfo() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
