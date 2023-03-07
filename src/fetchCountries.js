export default function fetchCountries(name) {
    const url = `https://restcountries.com/v3.1/name/${name}?fields=name,flags,population,capital,languages`;

    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        });
}