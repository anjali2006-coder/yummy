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
    <div className="page flex flex-col py-2">
      <div className="flex gap-5 items-center justify-center mb-4">
      <h1>Find a recipe</h1>

      <form onSubmit={handleSubmit} className="search-form flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by dish name, e.g. pasta..."
          className="w-[400px] bg-zinc-700 p-2 rounded-lg"
        />
        <button type="submit" className=" bg-orange-700 rounded-lg p-2">Search</button>
      </form>
</div>
      {categories.length > 0 && (
        <div className="category-pills bg-orange-700 p-2 flex justify-evenly text-lg text-black mb-4">
          {categories.slice(0, 10).map((cat) => (
            <button
              key={cat.idCategory}
              className={`pill ${activeCategory === cat.strCategory ? "active" : ""} `}
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
        <div className="meal-grid flex flex-wrap justify-evenly gap-4">
          {meals.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}