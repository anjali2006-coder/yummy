import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import MealCard from "../components/MealCard";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="page">
      <h1>Your favorites</h1>

      {favorites.length === 0 ? (
        <p className="status">
          No favorites yet.{" "}
          <Link to="/" className="back-link">
            Go find some recipes
          </Link>
          .
        </p>
      ) : (
        <div className="meal-grid">
          {favorites.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}