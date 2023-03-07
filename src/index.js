import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryInfo = document.querySelector('#country-info');
const abortController = new AbortController();

searchBox.addEventListener('input', debounce(event => {
    const searchTerm = event.target.value.trim();

    if (searchTerm.length === 0) {
        countryInfo.innerHTML = '';
        return;
    }

    fetch(`https://restcountries.com/v2/name/${searchTerm}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                throw new Error('Country not found');
            } else if (data.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            } else {
                showCountryInfo(data[0]);
            }
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                Notiflix.Notify.warning('Something went wrong. Please try again later.');
            } else {
                Notiflix.Notify.failure('Oops, there is no country with that name.');
            }
        });
}, DEBOUNCE_DELAY));

function showCountryInfo(country) {
    const languageList = country.languages.map(lang => lang.name).join(', ');

    const countryCard = `
    <div class="country-card">
      <img src="${country.flag}" alt="Flag of ${country.name}" class="country-card__flag" style="max-width: 80px; padding-top: 15px;">
      <h2 class="country-card__title" display: flex>${country.name}</h2>
      <p class="country-card__text"><strong>Population:</strong> ${country.population}</p>
      <p class="country-card__text"><strong>Region:</strong> ${country.region}</p>
      <p class="country-card__text"><strong>Capital:</strong> ${country.capital}</p>
      <p class="country-card__text"><strong>Languages:</strong> ${languageList}</p>
    </div >
    `;

    countryInfo.innerHTML = countryCard;
}

//estilo del input
searchBox.style.fontSize = '30px';