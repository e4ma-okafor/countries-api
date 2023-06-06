const themeSwitch = document.getElementById('theme-switch');
const body = document.querySelector('body');
const icon = document.querySelector('.bi');
const modeText = document.querySelector('.theme');
let screenMode;
const backBtn = document.querySelector(".back-btn");
const theCountry = document.getElementById("the-country")
const countryURL = new URLSearchParams(window.location.search);
const countryCode = countryURL.get('theCountry');
let allCountries = [];
let countryArray = [];

window.onload = () => {
    if (localStorage.getItem('screenMode') === 'dark') {
        dark.classList.remove('hide');
        light.classList.add('hide');
        body.classList.add('dark-mode');
    }
}

themeSwitch.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        icon.setAttribute('class', 'bi bi-brightness-high-fill');
        modeText.textContent = 'Light mode';        
    } else {
        icon.setAttribute('class', 'bi bi-moon-fill');
        modeText.textContent = 'Dark mode';
    }
})

const fetchCountries = () => {
    theCountry.innerHTML = '';
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            allCountries = data.map(item => {
                return [item.cca3, item.name.common];
            })
            data = data.filter(item => item.cca3 === countryCode);            
            document.title = `${data[0].name.common} - Countries of the world`

            const counBorders = arr => {
                let newArr = [], coun = '';
                if (arr != undefined) {
                    for (let item of arr) {
                        coun = allCountries.filter(a => a[0] === item)
                        newArr.push(coun[0][1])
                    }
                }
                return newArr;
            }

            countryArray = data.map(item => {
                const language = lang => {
                    let arr = Object.entries(lang), newArr = [];
                    for (let item of arr) {
                        newArr.push(item[1])
                    }
                    return newArr.join(', ');
                }

                const currency = cur => {
                    let arr = Object.entries(cur), newArr = [];
                    for (let item of arr) {
                        newArr.push(item[1].name)
                    }
                    return newArr.join(', ');
                }

                return {
                    'commonName': item.name.common,
                    'nativeName': Object.entries(item.name.nativeName)[0][1].common,
                    'population': item.population.toLocaleString(),
                    'region': item.region,
                    'subRegion': item.subregion || 'nil',
                    'continent': String(item.continents),
                    'capital': String(item.capital || 'nil') ,
                    'tld': String(item.tld),
                    'currencies': currency(item.currencies),
                    'languages': language(item.languages),
                    'borders': counBorders(item.borders),
                    'bordersShort': item.borders,
                    'flag': item.flags.png
                }
            });   
            displayCountry(countryArray);
        })
        .catch(err => {
            console.log(err)
            let errorMessage = `
                                    <div class="text-center">
                                        <h2 class="fw-bolder fs-1">404</h2>
                                        <p class="mt-5 fs-4">Cannot display country now due to
                                            <br/><span>${err.toString()}</spam>
                                        </p>
                                    </div>
                                `
            theCountry.style.display = 'flex';            
            theCountry.style.justifyContent = 'center';                  
            theCountry.innerHTML = errorMessage;
        })
}
fetchCountries();

const displayCountry = arr => {
    let countryCard;
    const borderBtn = () => {
        let bDBtn = ``;
        if (arr[0].borders != undefined) {
            for (let i = 0; i < arr[0].borders.length; i++) {
                bDBtn +=    `<a href="country.html?country=${arr[0].bordersShort[i]}" class="text-decoration-none w-auto h-auto p-0 m-0">
                                <button class="bc rounded m-0 py-1 px-3">
                                    <p class="fs-small fw-600 opacity-9 m-0 p-0">${arr[0].borders[i]}</p>
                                </button>
                            </a>`
            }
        }
        return bDBtn;
    }

    countryCard = `
                    <div class="left-section">
                        <img src="${arr[0].flag}" alt="Flag of ${arr[0].commonName}" class="img-fluid">
                    </div>
                    <div class="right-section">
                        <h1>${arr[0].commonName}</h1>
                        <div class="countryInfo">
                            <div class="countryInfo1">
                                <p class="fw-600 fs-small mb-2">Native Name: <span class="native_name fw-300 opacity-9">${arr[0].nativeName}</span></p>
                                <p class="fw-600 fs-small mb-2">Population: <span class="population fw-300 opacity-9">${arr[0].population}</span></p>
                                <p class="fw-600 fs-small mb-2">Region: <span class="region fw-300 opacity-9">${arr[0].region}</span></p>                                
                                <p class="fw-600 fs-small mb-3">Capital: <span class="capital fw-300 opacity-9">${arr[0].capital}</span></p>
                            </div>
                            <div class="countryInfo2">
                                <p class="fw-600 fs-small mb-2">Top Level Domain: <span class="tld fw-300 opacity-9">${arr[0].tld}</span></p>
                                <p class="fw-600 fs-small mb-2">Currencies: <span class="currencies fw-300 opacity-9">${arr[0].currencies}</span></p>
                                <p class="fw-600 fs-small mb-2">Sub-Region: <span class="sub-region fw-300 opacity-9">${arr[0].subRegion}</span></p>
                                <p class="fw-600 fs-small mb-2">Languages: <span class="languages fw-300 opacity-9">${arr[0].languages}</span></p>
                            </div>
                            <div class="borders mt-4 mt-lg-5 mb-5 mb-lg-0">
                                <p class="fw-600 m-0 mt-1 mb-lg-0">Border Countries: </p>
                                <div id="bcs" class="border-countries d-flex flex-wrap ms-0 ms-lg-0">
                                    ${borderBtn()}
                                </div>
                            </div>
                        </div>
                    </div>     
                `
    theCountry.innerHTML = countryCard;    
}

