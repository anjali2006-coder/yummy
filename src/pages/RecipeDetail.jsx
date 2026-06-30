import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMealById, extractIngredients } from "../api/mealApi";
import { useFavorites } from "../context/FavoritesContext";

export default function RecipeDetail() {
  const { id } = useParams(); // grabs the :id from the route /recipe/:id
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Re-fetch whenever the id in the URL changes (e.g. navigating between recipes)
  useEffect(() => {
    let cancelled = false; // guard against setting state after unmount

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMealById(id);
        if (!cancelled) {
          if (!data) throw new Error("Recipe not found");
          setMeal(data);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="status">Loading recipe...</p>;
  if (error) return <p className="status error">{error}</p>;
  if (!meal) return null;

  const ingredients = extractIngredients(meal);
  const favorited = isFavorite(meal.idMeal);

  return (
    <div className="page recipe-detail">
      <Link to="/" className="back-link">
        ← Back to search
      </Link>

      <div className="recipe-header">
        <img src={meal.strMealThumb} alt={meal.strMeal} />
        <div>
          <h1>{meal.strMeal}</h1>
          <p className="meta">
            {meal.strCategory} • {meal.strArea}
          </p>
          <button
            className={`fav-btn large ${favorited ? "favorited" : ""}`}
            onClick={() => toggleFavorite(meal)}
          >
            {favorited ? "★ Saved to favorites" : "☆ Save to favorites"}
          </button>
        </div>
      </div>

      <div className="recipe-body">
        <div className="ingredients">
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map((ing, i) => (
              <li key={i}>
                <strong>{ing.measure}</strong> {ing.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions">
          <h2>Instructions</h2>
          <p>{meal.strInstructions}</p>
        </div>
      </div>

      {meal.strYoutube && (
        <a
          href={meal.strYoutube}
          target="_blank"
          rel="noreferrer"
          className="youtube-link"
        >
          ▶ Watch video tutorial
        </a>
      )}
    </div>
  );
}