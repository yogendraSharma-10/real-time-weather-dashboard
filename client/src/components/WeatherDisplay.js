import React from 'react';
import PropTypes from 'prop-types'; // For prop type validation
import '../styles/App.css'; // Assuming global styles or specific component styles are here

/**
 * WeatherDisplay Component
 *
 * Displays the current weather conditions for a given city.
 * It receives weather data as props and renders it in a user-friendly format.
 * Handles cases where no weather data is available (e.g., initial state, search error).
 */
const WeatherDisplay = ({ weatherData, isLoading, error }) => {
  // --- Helper Functions ---

  /**
   * Formats a temperature value with a Celsius degree symbol.
   * @param {number} temp - The temperature value.
   * @returns {string} Formatted temperature string.
   */
  const formatTemperature = (temp) => {
    return temp ? `${Math.round(temp)}°C` : 'N/A';
  };

  /**
   * Capitalizes the first letter of each word in a string.
   * @param {string} str - The input string.
   * @returns {string} Capitalized string.
   */
  const capitalizeWords = (str) => {
    if (!str) return '';
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // --- Conditional Rendering Logic ---

  if (isLoading) {
    return (
      <div className="weather-display-container loading">
        <p>Fetching weather data...</p>
        <div className="spinner"></div> {/* Simple loading spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-display-container error">
        <p>Error: {error}</p>
        <p>Please try searching for a different city or check your internet connection.</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-display-container initial-state">
        <p>Enter a city name above to get real-time weather updates.</p>
      </div>
    );
  }

  // --- Render Weather Data ---
  const {
    city,
    country,
    temperature,
    feelsLike,
    minTemp,
    maxTemp,
    description,
    icon,
    humidity,
    windSpeed,
    // Assuming forecast data might be present but not fully rendered in this component for simplicity
    // forecast,
  } = weatherData;

  // Construct the URL for the weather icon
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : '';

  return (
    <div className="weather-display-container">
      <div className="weather-card">
        <h2 className="city-name">{city}, {country}</h2>

        <div className="current-weather-overview">
          {iconUrl && <img src={iconUrl} alt={description} className="weather-icon" />}
          <p className="temperature">{formatTemperature(temperature)}</p>
        </div>

        <p className="description">{capitalizeWords(description)}</p>

        <div className="weather-details">
          <div className="detail-item">
            <span>Feels like:</span>
            <span>{formatTemperature(feelsLike)}</span>
          </div>
          <div className="detail-item">
            <span>Min Temp:</span>
            <span>{formatTemperature(minTemp)}</span>
          </div>
          <div className="detail-item">
            <span>Max Temp:</span>
            <span>{formatTemperature(maxTemp)}</span>
          </div>
          <div className="detail-item">
            <span>Humidity:</span>
            <span>{humidity}%</span>
          </div>
          <div className="detail-item">
            <span>Wind Speed:</span>
            <span>{windSpeed ? `${windSpeed.toFixed(1)} m/s` : 'N/A'}</span>
          </div>
        </div>

        {/* Placeholder for future forecast integration or other interconnected services */}
        {/* <div className="forecast-section">
          <h3>Daily Forecast (Coming Soon)</h3>
          <p>Detailed forecasts could be fetched from a dedicated forecast service.</p>
        </div> */}
      </div>
    </div>
  );
};

// --- Prop Type Validation ---
WeatherDisplay.propTypes = {
  weatherData: PropTypes.shape({
    city: PropTypes.string,
    country: PropTypes.string,
    temperature: PropTypes.number,
    feelsLike: PropTypes.number,
    minTemp: PropTypes.number,
    maxTemp: PropTypes.number,
    description: PropTypes.string,
    icon: PropTypes.string,
    humidity: PropTypes.number,
    windSpeed: PropTypes.number,
    // forecast: PropTypes.array, // If forecast data is passed
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

// --- Default Props ---
WeatherDisplay.defaultProps = {
  weatherData: null,
  isLoading: false,
  error: null,
};

export default WeatherDisplay;