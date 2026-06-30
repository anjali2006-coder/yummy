import { useState, useEffect } from "react";
import MealCard from "../components/MealCard";
import {
  searchMealsByName,
  filterMealsByCategory,
  getCategories,
} from "../api/mealApi";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null); // null = no category filter
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load the category list once, on mount
  useEffect(() => {
    getCategories()
      .then((cats) => setCategories(cats))
      .catch(() => {
        /* category list failing isn't critical, fail silently */
      });
  }, []);

  // Default view: show a popular search ("chicken") so the page isn't empty
  useEffect(() => {
    runSearch("chicken");
  }, []);

  async function runSearch(term) {
    setLoading(true);
    setError(null);
    setActiveCategory(null);
    try {
      const results = await searchMealsByName(term);
      setMeals(results);
      if (results.length === 0) setError(`No recipes found for "${term}"`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function runCategoryFilter(category) {
    setLoading(true);
    setError(null);
    setActiveCategory(category);
    setQuery("");
    try {
      const results = await filterMealsByCategory(category);
      setMeals(results);
      if (results.length === 0) setError(`No recipes found in "${category}"`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) runSearch(query.trim());
  }

  return (
    <div className="page">
      <h1>Find a recipe</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by dish name, e.g. pasta..."
        />
        <button type="submit">Search</button>
      </form>

      {categories.length > 0 && (
        <div className="category-pills">
          {categories.slice(0, 10).map((cat) => (
            <button
              key={cat.idCategory}
              className={`pill ${activeCategory === cat.strCategory ? "active" : ""}`}
              onClick={() => runCategoryFilter(cat.strCategory)}
            >
              {cat.strCategory}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="status">Loading recipes...</p>}
      {error && !loading && <p className="status error">{error}</p>}

      {!loading && !error && (
        <div className="meal-grid">
          {meals.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}