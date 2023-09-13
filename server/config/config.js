require('dotenv').config(); // Load environment variables from .env file

/**
 * @file server/config/config.js
 * @description Centralized configuration for the Real-time Weather Dashboard backend.
 *              Manages environment variables, API keys, and other service settings.
 */

const config = {
    // --- Server Configuration ---
    /**
     * The port on which the Node.js server will listen.
     * Defaults to 3001 to avoid conflicts with common frontend development servers (e.g., React's 3000).
     * @type {number}
     */
    PORT: parseInt(process.env.PORT, 10) || 3001,

    /**
     * The current environment of the application (e.g., 'development', 'production', 'test').
     * Used for conditional logic, logging, and error handling.
     * @type {string}
     */
    NODE_ENV: process.env.NODE_ENV || 'development',

    // --- Third-Party Weather API Configuration ---
    /**
     * The base URL for the external weather API.
     * Example: OpenWeatherMap API base URL.
     * @type {string}
     */
    WEATHER_API_BASE_URL: process.env.WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5',

    /**
     * The API key required for authenticating requests to the external weather service.
     * This should be kept secret and loaded from environment variables.
     * @type {string}
     */
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,

    /**
     * The units for weather data (e.g., 'metric' for Celsius, 'imperial' for Fahrenheit).
     * @type {string}
     */
    WEATHER_API_UNITS: process.env.WEATHER_API_UNITS || 'metric',

    /**
     * The default city to display weather for if no specific city is requested.
     * @type {string}
     */
    DEFAULT_CITY: process.env.DEFAULT_CITY || 'London',

    // --- Cross-Project Microservice Integration (Simulated) ---
    // These configurations simulate an interconnected architecture, where this service
    // might interact with or reference other services in the ecosystem.
    // In a real-world scenario, these URLs would point to deployed services or
    // be resolved via a service discovery mechanism.

    /**
     * API endpoint for the Personal Blog Platform service.
     * @type {string}
     */
    BLOG_SERVICE_API_URL: process.env.BLOG_SERVICE_API_URL || 'http://localhost:3002/api/blog',

    /**
     * API endpoint for the Custom URL Shortener service.
     * @type {string}
     */
    URL_SHORTENER_SERVICE_API_URL: process.env.URL_SHORTENER_SERVICE_API_URL || 'http://localhost:3003/api/shorten',

    /**
     * API endpoint for the Interactive E-commerce Product Catalog service.
     * @type {string}
     */
    ECOMMERCE_SERVICE_API_URL: process.env.ECOMMERCE_SERVICE_API_URL || 'http://localhost:3004/api/products',

    /**
     * API endpoint for the AI-Powered Content Assistant service.
     * @type {string}
     */
    AI_ASSISTANT_SERVICE_API_URL: process.env.AI_ASSISTANT_SERVICE_API_URL || 'http://localhost:3005/api/ai',
};

// --- Configuration Validation ---
// Perform checks for critical environment variables.
// In a production environment, it's often better to throw an error and prevent the
// application from starting if essential configurations are missing.
if (!config.WEATHER_API_KEY) {
    console.error('CRITICAL ERROR: WEATHER_API_KEY is not set in environment variables.');
    console.error('Please ensure a .env file exists with WEATHER_API_KEY or it is set in your deployment environment.');
    // For development, we might just warn, but for production, it's safer to exit.
    if (config.NODE_ENV === 'production') {
        process.exit(1); // Exit the process with a failure code
    }
}

module.exports = config;