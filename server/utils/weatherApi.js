const axios = require('axios');
const config = require('../config/config'); // Assuming config.js exports an object with API keys

// Destructure API key and base URL from config
const WEATHER_API_KEY = config.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = config.WEATHER_API_BASE_URL;

/**
 * Fetches current weather data for a given city from the third-party weather API.
 *
 * @param {string} city - The name of the city for which to fetch weather data.
 * @returns {Promise<object>} A promise that resolves to the current weather data object.
 * @throws {Error} Throws an error if the city name is missing, the API request fails,
 *                 or the city is not found by the API.
 */
async function getCurrentWeather(city) {
    if (!city) {
        throw new Error('City name is required to fetch current weather.');
    }

    try {
        const response = await axios.get(`${WEATHER_API_BASE_URL}/weather`, {
            params: {
                q: city,
                appid: WEATHER_API_KEY,
                units: 'metric' // Use 'metric' for Celsius, 'imperial' for Fahrenheit
            }
        });
        return response.data;
    } catch (error) {
        console.error(`[WeatherAPI] Error fetching current weather for ${city}:`, error.message);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 404) {
                throw new Error(`City not found: ${city}. Please check the city name.`);
            }
            // Generic API error with status and message from the external service
            throw new Error(`Weather API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from weather API. Please check your internet connection or the API server status.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Error setting up weather API request: ${error.message}`);
        }
    }
}

/**
 * Fetches 5-day weather forecast data (3-hour interval) for a given city from the third-party weather API.
 *
 * @param {string} city - The name of the city for which to fetch forecast data.
 * @returns {Promise<object>} A promise that resolves to the forecast data object.
 * @throws {Error} Throws an error if the city name is missing, the API request fails,
 *                 or the city is not found by the API.
 */
async function getForecast(city) {
    if (!city) {
        throw new Error('City name is required to fetch forecast.');
    }

    try {
        const response = await axios.get(`${WEATHER_API_BASE_URL}/forecast`, {
            params: {
                q: city,
                appid: WEATHER_API_KEY,
                units: 'metric', // Use 'metric' for Celsius, 'imperial' for Fahrenheit
                cnt: 40 // Number of data points to return. OpenWeatherMap provides 8 data points per day (3-hour interval), so 40 for 5 days.
            }
        });
        return response.data;
    } catch (error) {
        console.error(`[WeatherAPI] Error fetching forecast for ${city}:`, error.message);
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error(`City not found: ${city}. Please check the city name.`);
            }
            throw new Error(`Weather API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
            throw new Error('No response received from weather API. Please check your internet connection or the API server status.');
        } else {
            throw new Error(`Error setting up weather API request: ${error.message}`);
        }
    }
}

// Export the functions to be used by other modules (e.g., server/index.js)
module.exports = {
    getCurrentWeather,
    getForecast
};