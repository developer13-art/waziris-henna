import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext()

const initialState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.product_id === action.payload.product_id
      )
      
      let newItems
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product_id === action.payload.product_id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        newItems = [...state.items, action.payload]
      }
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        (item) => item.product_id !== action.payload
      )
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map((item) =>
        item.product_id === action.payload.product_id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    }
    
    case 'CLEAR_CART':
      return initialState
    
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    const savedCart = localStorage.getItem('waziris_cart')
    return savedCart ? JSON.parse(savedCart) : initialState
  })

  useEffect(() => {
    localStorage.setItem('waziris_cart', JSON.stringify(state))
  }, [state])

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product_id: product.id,
        name: product.name,
        price: product.sale_price || product.price,
        image_url: product.image_url,
        quantity,
      },
    })
    toast.success(`${product.name} added to cart!`)
  }

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
    toast.info('Item removed from cart')
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { product_id: productId, quantity },
    })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export default CartContext