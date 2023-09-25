import React, { useState, useEffect, useCallback } from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import CitySearch from './components/CitySearch';
import './styles/App.css';

/**
 * Main application component for the Real-time Weather Dashboard.
 * Manages city search, weather data fetching, and displays results.
 * This component acts as the orchestrator for the client-side application,
 * interacting with the backend proxy to retrieve weather information.
 */
function App() {
  // State to store the weather data fetched from the backend.
  const [weatherData, setWeatherData] = useState(null);
  // State to store the currently selected or searched city.
  // 'London' is set as a default city for initial load.
  const [city, setCity] = useState('London');
  // State to manage loading status during API calls, providing user feedback.
  const [loading, setLoading] = useState(false);
  // State to store any error messages encountered during API calls, for display.
  const [error, setError] = useState(null);

  /**
   * Fetches weather data for the specified city from the backend proxy.
   * This function is memoized using `useCallback` to prevent unnecessary re-creations
   * and potential re-renders of child components that depend on it.
   *
   * @param {string} cityName - The name of the city for which to fetch weather data.
   */
  const fetchWeatherData = useCallback(async (cityName) => {
    // Prevent fetching if the city name is empty or null.
    if (!cityName) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);    // Set loading to true before starting the fetch.
    setError(null);      // Clear any previous errors.
    setWeatherData(null); // Clear previous weather data while new data is loading.

    try {
      // The backend proxy is expected to be served from the same origin as the React app
      // (e.g., via a proxy setup in `package.json` or a reverse proxy in production).
      // Using a relative path ensures it works correctly in both development and production.
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);

      // Check if the HTTP response was successful.
      if (!response.ok) {
        // Attempt to parse error message from the backend if available.
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data); // Update state with the fetched weather data.
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      // Provide a user-friendly error message.
      setError(`Could not retrieve weather for "${cityName}". Please try again. Details: ${err.message}`);
    } finally {
      setLoading(false); // Always set loading to false once the fetch operation completes.
    }
  }, []); // Dependencies are empty because state setters are stable and `cityName` is an argument.

  /**
   * `useEffect` hook to trigger weather data fetching whenever the `city` state changes.
   * This ensures that when a user searches for a new city, the data is automatically updated.
   * The `fetchWeatherData` function is included in the dependency array because it's a `useCallback`
   * function, ensuring React correctly manages its execution.
   */
  useEffect(() => {
    fetchWeatherData(city);
  }, [city, fetchWeatherData]);

  /**
   * Handler function for when a new city is submitted via the CitySearch component.
   * Updates the `city` state, which in turn triggers the `useEffect` to fetch new data.
   *
   * @param {string} newCity - The city name entered by the user.
   */
  const handleCitySearch = (newCity) => {
    // Only update the city if it's different from the current city to avoid unnecessary fetches.
    if (newCity && newCity.trim() !== '' && newCity.trim().toLowerCase() !== city.toLowerCase()) {
      setCity(newCity.trim());
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-time Weather Dashboard</h1>
        <p className="App-subtitle">Powered by a custom Node.js backend proxy</p>
      </header>

      <main className="App-main">
        {/* CitySearch component allows users to input a city name. */}
        {/* `initialCity` prop ensures the input field displays the current city. */}
        <CitySearch onSearch={handleCitySearch} initialCity={city} />

        {/* Conditional rendering based on loading, error, and data states */}
        {loading && <p className="status-message loading">Loading weather data...</p>}

        {error && <p className="status-message error">{error}</p>}

        {/* Display WeatherDisplay component only when data is available and not loading/error */}
        {!loading && !error && weatherData && (
          <WeatherDisplay weather={weatherData} />
        )}

        {/* Message for when no data is loaded yet (e.g., initial state before default city fetch completes) */}
        {!loading && !error && !weatherData && (
          <p className="status-message no-data">Enter a city to see the current weather conditions.</p>
        )}
      </main>

      <footer className="App-footer">
        <p>&copy; {new Date().getFullYear()} Real-time Weather Dashboard.</p>
        {/* Cross-project context: Mentioning its place within a larger system. */}
        <p>Part of the Microservices Ecosystem. Explore our other services:
          {/* These links are illustrative and would point to actual deployed services or local dev ports. */}
          <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer"> Blog Platform</a>,
          <a href="http://localhost:3002" target="_blank" rel="noopener noreferrer"> E-commerce Catalog</a>,
          <a href="http://localhost:3003" target="_blank" rel="noopener noreferrer"> URL Shortener</a>.
        </p>
      </footer>
    </div>
  );
}

export default App;