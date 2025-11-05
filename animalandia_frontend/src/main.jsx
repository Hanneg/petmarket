import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Importa Axentix
import 'axentix/dist/axentix.min.js';
import Axentix from "axentix";

// Inicializa Axentix si quieres usar componentes JS
Axentix.init();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
