import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

function onSearch(e) {
  const inputValue = e.target.value.trim();
  if (!inputValue) {
    cleanCountryList();
    cleanCountryInfo();
    return;
  }

  fetchCountries(inputValue)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        cleanCountryList();
        cleanCountryInfo();
        return;
      }

      if (data.length > 2 && data.length < 10) {
        createCountryList(data);
        cleanCountryInfo();
        return;
      }

      if (data.length === 1) {
        createCountryInfo(data);
        cleanCountryList();
        return;
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      cleanCountryList();
      cleanCountryInfo();
    });
}

function createCountryList(data) {
  refs.countryList.innerHTML = createMarkupCountryList(data);
}

function createCountryInfo(data) {
  refs.countryInfo.innerHTML = createMarkupCountryInfo(data);
}

function cleanCountryList() {
  refs.countryList.innerHTML = '';
}

function cleanCountryInfo() {
  refs.countryInfo.innerHTML = '';
}

function createMarkupCountryList(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li>
          <img src="${flags.svg}" alt="flag" width="60px"/>
          <h2>${name.common}</h2>
        </li>`
    )
    .join('');
}

function createMarkupCountryInfo(data) {
  return data
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<div class="info-h">
          <img src="${flags.svg}" alt="flag" width="80px"/>
          <h2>${name.common}</h2>
        </div>
        <div>
          <p><b>Capital:</b> ${capital}</p>
          <p><b>Population:</b> ${population}</p>
          <p><b>Languages:</b> ${Object.values(languages)}</p>
        </div>`
    )
    .join('');
}

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
