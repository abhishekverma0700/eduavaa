import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Note } from "@/types";

interface CartItem extends Note {
  category: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (note: Note, category: string) => boolean;
  removeFromCart: (r2Path: string) => void;
  clearCart: () => void;
  isInCart: (r2Path: string) => boolean;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => false,
  removeFromCart: () => {},
  clearCart: () => {},
  isInCart: () => false,
  cartTotal: 0,
  cartCount: 0,
});

const CART_STORAGE_KEY = "eduava_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      // Validate parsed data is an array
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      // Only save if cart is valid array
      if (Array.isArray(cart)) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (note: Note, category: string): boolean => {
    try {
      // Safety checks
      if (!note || !note.r2Path || !category) return false;
      
      // Ensure cart is an array
      const safeCart = Array.isArray(cart) ? cart : [];
      
      // Prevent duplicates
      if (safeCart.some((item) => item.r2Path === note.r2Path)) {
        return false;
      }

      const cartItem: CartItem = { ...note, category };
      setCart((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return [...safePrev, cartItem];
      });
      return true;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return false;
    }
  };

  const removeFromCart = (r2Path: string) => {
    try {
      if (!r2Path) return;
      setCart((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.filter((item) => item && item.r2Path !== r2Path);
      });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const clearCart = () => {
    try {
      setCart([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const isInCart = (r2Path: string): boolean => {
    try {
      if (!r2Path) return false;
      const safeCart = Array.isArray(cart) ? cart : [];
      return safeCart.some((item) => item && item.r2Path === r2Path);
    } catch (error) {
      console.error("Failed to check cart:", error);
      return false;
    }
  };

  // Safe calculations with defensive checks
  const safeCart = Array.isArray(cart) ? cart : [];
  const cartTotal = safeCart.reduce((sum, item) => {
    if (!item || typeof item.price !== 'number') return sum;
    return sum + item.price;
  }, 0);
  const cartCount = safeCart.length;

  return (
    <CartContext.Provider
      value={{
        cart: safeCart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  
  // Return safe defaults instead of throwing
  if (!context) {
    console.warn("useCart called outside CartProvider - returning safe defaults");
    return {
      cart: [],
      addToCart: () => false,
      removeFromCart: () => {},
      clearCart: () => {},
      isInCart: () => false,
      cartTotal: 0,
      cartCount: 0,
    };
  }
  
  return context;
};
