import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';

// Create a root container and render the App component
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);


