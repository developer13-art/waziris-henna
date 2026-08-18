import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-toastify'

const FavoritesContext = createContext()

const initialState = {
  designIds: [],
  designs: [],
}

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const designId = action.payload.id
      const isFavorite = state.designIds.includes(designId)
      
      let newDesignIds
      let newDesigns
      
      if (isFavorite) {
        newDesignIds = state.designIds.filter((id) => id !== designId)
        newDesigns = state.designs.filter((design) => design.id !== designId)
      } else {
        newDesignIds = [...state.designIds, designId]
        newDesigns = [...state.designs, action.payload]
      }
      
      return {
        designIds: newDesignIds,
        designs: newDesigns,
      }
    }
    
    case 'SET_FAVORITES': {
      return {
        designIds: action.payload.map((design) => design.id),
        designs: action.payload,
      }
    }
    
    case 'CLEAR_FAVORITES':
      return initialState
    
    default:
      return state
  }
}

export function FavoritesProvider({ children }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState, () => {
    const savedFavorites = localStorage.getItem('waziris_favorites')
    return savedFavorites ? JSON.parse(savedFavorites) : initialState
  })

  useEffect(() => {
    localStorage.setItem('waziris_favorites', JSON.stringify(state))
  }, [state])

  const toggleFavorite = (design) => {
    const isFavorite = state.designIds.includes(design.id)
    dispatch({ type: 'TOGGLE_FAVORITE', payload: design })
    
    if (isFavorite) {
      toast.info('Design removed from favorites')
    } else {
      toast.success('Design saved to favorites!')
    }
  }

  const isFavorite = (designId) => state.designIds.includes(designId)

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' })
  }

  return (
    <FavoritesContext.Provider
      value={{
        ...state,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}

export default FavoritesContext