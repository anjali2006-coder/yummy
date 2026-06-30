import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function MealCard({ meal }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(meal.idMeal);

  return (
    <div className="meal-card">
      <Link to={`/recipe/${meal.idMeal}`} className="meal-card-link">
        <img src={meal.strMealThumb} alt={meal.strMeal} />
        <h3>{meal.strMeal}</h3>
      </Link>
      <button
        className={`fav-btn ${favorited ? "favorited" : ""}`}
        onClick={() => toggleFavorite(meal)}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        {favorited ? "★ Saved" : "☆ Save"}
      </button>
    </div>
  );
}