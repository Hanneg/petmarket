import { createContext, useContext, useState, useMemo } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    // Agregar al carrito
    const addToCart = (product, qty = 1) => {
        setCartItems((prev) => {
            // Si ya existe, solo aumenta cantidad
            const exists = cartItems.find((item) => item.id === product.id);

            if (exists) {
                return prev.map(() => 
                    item.id === product.id
                        ? {...item, quantity: item.quantity + qty}
                        : item
                );
            }
            return [...prev, {...product, quantity: qty}];
        });
    };

    // Actualizar cantidad desde el carrito
    const updateQuantity = (productId, qty) => {
        if (qty < 1) return;

        setCartItems((prev) => 
            prev.map((item) => 
                item.id === productId ? {...item, quantity: qty} : item
            )
        );
    };

    // Eliminar un producto del carrito
    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    }

    // Vaciar el carrito
    const clearCart = () => {
        setCartItems([]);
    }

    const total = useMemo(
        () => 
            cartItems.reduce(
                (acc, item) => acc + item.price * (item.quantity || 1), 
                0
            ),
        [cartItems]
    );

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, total}}>
            { children }
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext);