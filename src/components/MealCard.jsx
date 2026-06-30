import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { Heart } from 'lucide-react';

export default function MealCard({ meal }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(meal.idMeal);

  return (
    <div className="meal-card flex flex-col bg-zinc-600 p-4">
      <Link to={`/recipe/${meal.idMeal}`} className="meal-card-link h-[500px]">
        <img className="object-center aspect-[16/10]" src={meal.strMealThumb} alt={meal.strMeal} />
        <h3 className="text-xl font-bold text-orange-400 text-center">{meal.strMeal}</h3>
      </Link>
      <button
        className={`fav-btn ${favorited ? "favorited" : ""} text-lg text-red-600 text-right `}
        onClick={() => toggleFavorite(meal)}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        {favorited ? " Saved" : <Heart size={26} strokeWidth={3.5} absoluteStrokeWidth />}
      </button>
    </div>
  );
}