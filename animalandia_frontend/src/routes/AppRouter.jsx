import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Páginas públicas
import Home from "../pages/public/Home.jsx";
import Login from "../pages/public/Login.jsx";
import Register from "../pages/public/Register.jsx";
import Catalog from "../pages/public/Catalog.jsx";
import ProductDetail from "../pages/public/ProductDetail.jsx";
import Contact from "../pages/public/Contact.jsx";
import NotFound from "../pages/public/NotFound.jsx";
// Páginas privadas
import Profile from "../pages/private/Profile.jsx";
import Orders from "../pages/private/Orders.jsx";
import Cart from "../pages/private/Cart.jsx";
import Checkout from "../pages/private/Checkout.jsx";
import ThankYou from "../pages/private/ThankYou.jsx";
import MyPublications from "../pages/private/MyPublicaions.jsx";
import CreatePublications from "../pages/private/CreatePublication.jsx";
// Administración
import Dashboard from "../pages/admin/Dashboard.jsx";
import ManageOrders from "../pages/admin/ManageOrders.jsx";
import ManageProducts from "../pages/admin/ManageProducts.jsx";
import ManageUsers from "..//pages/admin/ManageUsers.jsx";
// Componentes
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export default function AppRouter() {
    return (
        <Routes>
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/productdeatil" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />

            {/* Privadas */}
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
            <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
            <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
            <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
            <Route path="/thankyou" element={<ProtectedRoute><ThankYou/></ProtectedRoute>}/>

            {/* Vendedor */}
            <Route path="/my-publications" element={<ProtectedRoute role="seller"><MyPublications/></ProtectedRoute>}/>
            <Route path="/create-publications" element={<ProtectedRoute role="seller"><CreatePublications/></ProtectedRoute>}/>

            {/* Administracion */}
            <Route path="/dashboard" element={<ProtectedRoute role="admin"><Dashboard/></ProtectedRoute>}/>
            <Route path="/manage-orders" element={<ProtectedRoute role="admin"><ManageOrders/></ProtectedRoute>}/>
            <Route path="/manage-products" element={<ProtectedRoute role="admin"><ManageProducts/></ProtectedRoute>}/>
            <Route path="/manage-users" element={<ProtectedRoute role="admin"><ManageUsers/></ProtectedRoute>}/>

            {/* Error */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

