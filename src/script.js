function displayWeather(currentWeather, forecast, searchedCityName) {
  const cityName = searchedCityName || 'Unknown City';

  const currentWeatherHtml = `
      <h2>${cityName}</h2>
      <p>${currentWeather ? currentWeather.weather[0].description : 'N/A'}</p>
      <p>Temperature: ${currentWeather ? Math.round(currentWeather.main.temp) + '°C' : 'N/A'}</p>
      <p>Humidity: ${currentWeather ? currentWeather.main.humidity + '%' : 'N/A'}</p>
      <p>Wind Speed: ${currentWeather ? Math.round(currentWeather.wind.speed * 3.6) + ' km/h' : 'N/A'}</p>
      <img src="${currentWeather ? 'http://openweathermap.org/img/wn/' + currentWeather.weather[0].icon + '.png' : ''}" alt="Weather Icon">
  `;

  let forecastHtml = '';
  forecast.forEach(day => {
      const date = new Date(day.dt * 1000);
      const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short' });
      forecastHtml += `
          <div class="forecast-item">
              <p>${formattedDate}</p>
              <p>${Math.round(day.main.temp_max)}°C / ${Math.round(day.main.temp_min)}°C</p>
              <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
          </div>
      `;
  });

  document.getElementById("current-weather").innerHTML = currentWeatherHtml;
  document.getElementById("forecast").innerHTML = forecastHtml;
}

function search(city) {
    const apiKey = "c119ffef35b7245a5e03b6e5724ae961"; 
    const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(currentWeatherApiUrl)
      .then(currentWeatherResponse => {
          const currentWeather = currentWeatherResponse.data;
          const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
          return axios.get(forecastApiUrl)
              .then(forecastResponse => {
                  const forecast = forecastResponse.data.list.slice(0, 5); 
                  displayWeather(currentWeather, forecast, city);
              })
              .catch(error => {
                  console.error("Error fetching forecast data:", error);
                  displayWeather(currentWeather, [], city);
              });
      })
      .catch(error => {
          console.error("Error fetching current weather data:", error);
          displayWeather(null, [], city);
      });
}

function handleSubmit(event) {
  event.preventDefault();
  const cityInputElement = document.getElementById("city-input");
  const cityName = cityInputElement.value;
  search(cityName);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  form.addEventListener("submit", handleSubmit);

  
  search("Paris");
});
