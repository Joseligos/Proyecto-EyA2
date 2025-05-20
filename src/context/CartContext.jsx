import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Import the auth context

const CartContext = createContext(undefined);

const initialState = {
  items: [],
  totalItems: 0,
};

function cartReducer(state, action) {
  let newState;
  
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };

        newState = {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
        };
      } else {
        const newItem = { ...action.payload, quantity: 1 };

        newState = {
          ...state,
          items: [...state.items, newItem], 
          totalItems: state.totalItems + 1,
        };
      }
      return newState;
    }

    case "REMOVE_ITEM": {
      const filteredItems = state.items.filter((item) => item.id !== action.payload.id);
      const removedItem = state.items.find((item) => item.id === action.payload.id);
      const removedQuantity = removedItem ? removedItem.quantity : 0;

      newState = {
        ...state,
        items: filteredItems,
        totalItems: state.totalItems - removedQuantity,
      };
      return newState;
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id } });
      }

      const itemIndex = state.items.findIndex((item) => item.id === id);

      if (itemIndex === -1) {
        return state;
      }

      const oldQuantity = state.items[itemIndex].quantity;
      const quantityDiff = quantity - oldQuantity;

      const updatedItems = [...state.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity,
      };

      newState = {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
      };
      return newState;
    }

    case "LOAD_CART": {
      return action.payload;
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth(); 
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const savedCart = localStorage.getItem(`cart_${userId}`);
      
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: "LOAD_CART", payload: parsedCart });
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error);
        }
      }
    } else {
      const anonymousCart = localStorage.getItem("cart_anonymous");
      
      if (anonymousCart) {
        try {
          const parsedCart = JSON.parse(anonymousCart);
          dispatch({ type: "LOAD_CART", payload: parsedCart });
        } catch (error) {
          console.error("Error parsing anonymous cart from localStorage:", error);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(state));
    } else {
      localStorage.setItem("cart_anonymous", JSON.stringify(state));
    }
  }, [state, user]);

  const addItem = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}