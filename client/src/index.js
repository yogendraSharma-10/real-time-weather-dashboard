import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import App from './App';
import './styles/App.css'; // Global styles for the application

/**
 * The main entry point for the React client-side application.
 * This file is responsible for rendering the root App component into the DOM.
 */

// Find the root DOM element where the React application will be mounted.
// This element is typically defined in public/index.html.
const rootElement = document.getElementById('root');

// Ensure the root element exists before attempting to render.
if (rootElement) {
  // Create a React root using ReactDOM.createRoot for concurrent mode features in React 18+.
  const root = ReactDOM.createRoot(rootElement);

  // Render the main App component into the root.
  // React.StrictMode is a tool for highlighting potential problems in an application.
  // It activates additional checks and warnings for its descendants.
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Log an error if the root element is not found, which would prevent the app from loading.
  console.error('Failed to find the root element. Make sure an element with id="root" exists in index.html.');
}