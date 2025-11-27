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
          <div className="app-wrapper">
            {/* Navbar */}
            <Navbar/>

            {/* Rutas */}
            <main className="main-content flex-grow-1 p-0">
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
