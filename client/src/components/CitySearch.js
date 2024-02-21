import React, { useState } from 'react';
import PropTypes from 'prop-types'; // For prop type validation

/**
 * @typedef {object} CitySearchProps
 * @property {(city: string) => void} onSearch - Callback function to be called when a city is searched.
 */

/**
 * CitySearch component allows users to input a city name and trigger a search.
 * It manages its own input state and calls the `onSearch` prop with the entered city.
 *
 * @param {CitySearchProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered CitySearch component.
 */
const CitySearch = ({ onSearch }) => {
  // State to hold the current value of the city input field
  const [city, setCity] = useState('');

  /**
   * Handles changes to the input field.
   * Updates the `city` state with the current value of the input.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input.
   */
  const handleChange = (event) => {
    setCity(event.target.value);
  };

  /**
   * Handles the form submission.
   * Prevents the default form submission behavior, calls the `onSearch` prop
   * with the current city value (after trimming whitespace), and then clears the input field.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission (page reload)
    const trimmedCity = city.trim();
    if (trimmedCity) {
      onSearch(trimmedCity); // Call the parent's search handler
      setCity(''); // Clear the input field after search
    }
  };

  return (
    <div className="city-search-container">
      <form onSubmit={handleSubmit} className="city-search-form">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={handleChange}
          className="city-search-input"
          aria-label="City name input"
        />
        <button type="submit" className="city-search-button">
          Search Weather
        </button>
      </form>
    </div>
  );
};

// Prop type validation for better development experience and error checking
CitySearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default CitySearch;