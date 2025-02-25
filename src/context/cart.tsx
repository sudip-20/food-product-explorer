import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "../services/OpenFoodFactsService";

interface CartItem {
  product: Product;
  count: number;
}

const CartContext = createContext<[CartItem[], React.Dispatch<React.SetStateAction<CartItem[]>>] | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { useCart, CartProvider };