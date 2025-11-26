import React from "react";
import ReactDOM from "react-dom/client";
import "axentix/dist/axentix.min.css";
import "axentix/dist/axentix.min.js";
import './index.css';
import App from './App.jsx'

// Axentix está disponible globalmente en window
window.Axentix?.init && window.Axentix.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
