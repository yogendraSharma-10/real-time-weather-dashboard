const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import application-specific configurations
const config = require('./config/config');

// Import utility for fetching weather data
const weatherApi = require('./utils/weatherApi');

// Initialize the Express application
const app = express();
const PORT = config.PORT;

// --- Middleware Setup ---

// 1. Security Middleware: Helmet helps secure Express apps by setting various HTTP headers.
app.use(helmet());

// 2. CORS Middleware: Enable Cross-Origin Resource Sharing.
//    Configured to allow requests only from the specified client origin.
//    In a production environment, ensure config.CLIENT_ORIGIN is correctly set.
const corsOptions = {
    origin: config.CLIENT_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204 // For preflight requests
};
app.use(cors(corsOptions));

// 3. JSON Body Parser: Parses incoming requests with JSON payloads.
app.use(express.json());

// 4. Rate Limiting Middleware: Protect against brute-force attacks and abuse.
//    Limits each IP to `max` requests per `windowMs` duration.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all API routes
app.use('/api/', apiLimiter);

// --- Routes ---

/**
 * @route GET /health
 * @description Health check endpoint for monitoring purposes.
 *              Could be extended to check connectivity to external services (e.g., Weather API).
 *              In a microservice architecture, this might report status of other services
 *              like the URL Shortener, E-commerce Catalog, or AI Content Assistant.
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Weather Dashboard Backend Proxy is running',
        timestamp: new Date().toISOString(),
        // Example of cross-service context:
        // "connected_services": {
        //     "url_shortener": "http://localhost:3001/health",
        //     "ecommerce_catalog": "http://localhost:3002/health",
        //     "ai_assistant": "http://localhost:3003/health"
        // }
    });
});

/**
 * @route GET /api/weather/current
 * @description Fetches current weather conditions for a given city.
 * @queryParam {string} city - The name of the city (e.g., "London", "New York").
 * @returns {object} JSON object containing current weather data.
 */
app.get('/api/weather/current', async (req, res, next) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'City query parameter is required.' });
    }

    try {
        const weatherData = await weatherApi.getCurrentWeather(city);
        res.status(200).json(weatherData);
    } catch (error) {
        // Pass the error to the error handling middleware
        next(error);
    }
});

/**
 * @route GET /api/weather/forecast
 * @description Fetches weather forecast for a given city.
 * @queryParam {string} city - The name of the city (e.g., "London", "New York").
 * @returns {object} JSON object containing weather forecast data.
 */
app.get('/api/weather/forecast', async (req, res, next) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'City query parameter is required.' });
    }

    try {
        const forecastData = await weatherApi.getWeatherForecast(city);
        res.status(200).json(forecastData);
    } catch (error) {
        // Pass the error to the error handling middleware
        next(error);
    }
});

// --- Error Handling Middleware ---
/**
 * Global error handler to catch all unhandled errors.
 * This prevents sensitive error details from being sent to the client in production.
 */
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    console.error(err.stack); // Log the stack trace for debugging

    // Determine status code based on error type, default to 500
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'An unexpected error occurred on the server.';

    // Send a generic error response to the client
    res.status(statusCode).json({
        error: errorMessage,
        // In development, you might include stack: err.stack
        // In production, avoid sending stack traces to clients
    });
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Weather Dashboard Backend Proxy listening on port ${PORT}`);
    console.log(`CORS origin allowed: ${config.CLIENT_ORIGIN}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});