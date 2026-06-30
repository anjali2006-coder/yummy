import { createContext, useContext, useState, useEffect } from "react";

// 1. Create the context
const FavoritesContext = createContext(null);

// 2. Custom hook for easy consumption anywhere in the tree
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}

// 3. Provider component — wraps the app, holds the shared state
export function FavoritesProvider({ children }) {
  // Lazy initializer: only reads localStorage once, on first render
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("recipe-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Whenever favorites changes, persist it
  useEffect(() => {
    localStorage.setItem("recipe-favorites", JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(meal) {
    setFavorites((prev) => {
      if (prev.some((m) => m.idMeal === meal.idMeal)) return prev; // no duplicates
      return [...prev, meal];
    });
  }

  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((m) => m.idMeal !== id));
  }

  function isFavorite(id) {
    return favorites.some((m) => m.idMeal === id);
  }

  function toggleFavorite(meal) {
    isFavorite(meal.idMeal) ? removeFavorite(meal.idMeal) : addFavorite(meal);
  }

  // Everything below the Provider can call useFavorites() to access this
  const value = { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}