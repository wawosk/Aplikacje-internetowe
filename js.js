const apiKey = '58c49e1789365e3f87b70ba5f60e74ee';

async function fetchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        updateResult('<p style="color: red;">Proszę wpisać nazwę miasta!</p>');
        return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pl&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pl&units=metric`;

    try {
        const currentWeather = await getWeatherUsingXHR(currentWeatherUrl);
        displayCurrentWeather(currentWeather, city);

        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error('Nie znaleziono prognozy 5-dniowej!');
        }
        const forecast = await forecastResponse.json();
        displayForecast(forecast);
        console.log(forecast);
    } catch (error) {
        console.error('Błąd:', error);
        updateResult('<p style="color: red;">Wystąpił błąd podczas pobierania danych pogodowych.</p>');
    }
}

function getWeatherUsingXHR(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            resolve(JSON.parse(xhr.responseText));
            console.log(xhr.responseText);
        };
        xhr.send();
    });
}

function displayCurrentWeather(data, city) {
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const pressure = data.main.pressure;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    updateResult(`
        <div class="weather-card">
            <h2>Pogoda w ${city}</h2>
            <img src="${iconUrl}" alt="Ikona pogody">
            <div class="weather-info">
                <p><strong>Temperatura:</strong> ${temp}°C</p>
                <p><strong>Opis:</strong> ${description}</p>
                <p><strong>Wilgotność:</strong> ${humidity}%</p>
                <p><strong>Prędkość wiatru:</strong> ${windSpeed} m/s</p>
                <p><strong>Ciśnienie:</strong> ${pressure} hPa</p>
            </div>
        </div>
    `);
}

function displayForecast(data) {
    const forecastItems = data.list.filter((item, index) => index % 8 === 0);
    const forecastHtml = forecastItems.map(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
        const temp = item.main.temp;
        const description = item.weather[0].description;
        const icon = item.weather[0].icon;

        return `
            <div class="forecast-item">
                <div class="forecast-info">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Ikona pogody">
                    <div>
                        <p><strong>${date}</strong></p>
                        <p>${description}</p>
                        <p><strong>Temp:</strong> ${temp}°C</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    updateResult(`
        <div class="forecast-card">
            <h2>Prognoza 5-dniowa</h2>
            <div class="forecast-container">
                ${forecastHtml}
            </div>
        </div>
    `, true);
}

function updateResult(content, append = false) {
    const weatherResult = document.getElementById('weatherResult');
    if (append) {
        weatherResult.innerHTML += content;
    } else {
        weatherResult.innerHTML = content;
    }
}
