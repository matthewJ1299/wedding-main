import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/globals.css';
import './styles/index.css';
// Import App directly from pages to avoid potential issues with the re-export
import App from './pages/App';
import reportWebVitals from './reportWebVitals';

// Get the root element
const container = document.getElementById('root');
const root = createRoot(container);

// Apply background color to the entire document
document.documentElement.style.backgroundColor = 'var(--page-bg, #ffffff)';
document.body.style.backgroundColor = 'var(--page-bg, #ffffff)';

// Render the app
root.render(
  <React.StrictMode>
    <Router>
      <div style={{ backgroundColor: 'var(--page-bg, #ffffff)', minHeight: '100vh' }}>
        <App />
      </div>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();