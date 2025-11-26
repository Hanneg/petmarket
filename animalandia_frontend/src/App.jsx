import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Contextos
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
 
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-wrapper d-flex flex-column min-vh-100">
            {/* Navbar */}
            <Navbar/>

            {/* Rutas */}
            <main className="main-content container flex-grow-1 mt-4 mb-4">
              <AppRouter/>
            </main>

            {/* Footer */}
            <Footer/>

            {/* Notifications */}
            <ToastContainer position="bottom-right" autoClose={3000}/>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
