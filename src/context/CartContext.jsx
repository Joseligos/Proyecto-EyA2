import { createContext, useContext, useReducer } from "react"

// Create context
const CartContext = createContext(undefined)

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
}

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }

        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
        }
      } else {
        // Add new item to the end of the queue
        const newItem = { ...action.payload, quantity: 1 }

        return {
          ...state,
          items: [...state.items, newItem], // Add to end (queue-like behavior)
          totalItems: state.totalItems + 1,
        }
      }
    }

    case "REMOVE_ITEM": {
      const filteredItems = state.items.filter((item) => item.id !== action.payload.id)
      const removedItem = state.items.find((item) => item.id === action.payload.id)
      const removedQuantity = removedItem ? removedItem.quantity : 0

      return {
        ...state,
        items: filteredItems,
        totalItems: state.totalItems - removedQuantity,
      }
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload

      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id } })
      }

      const itemIndex = state.items.findIndex((item) => item.id === id)

      if (itemIndex === -1) {
        return state
      }

      const oldQuantity = state.items[itemIndex].quantity
      const quantityDiff = quantity - oldQuantity

      const updatedItems = [...state.items]
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity,
      }

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
      }
    }

    case "CLEAR_CART":
      return initialState

    default:
      return state
  }
}

// Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } })
  }

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}
