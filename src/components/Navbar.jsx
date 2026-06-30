import { NavLink } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function Navbar() {
  const { favorites } = useFavorites(); // reading shared state, no prop drilling

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        🍳 Recipe Finder
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" end>
          Search
        </NavLink>
        <NavLink to="/favorites">
          Favorites {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
        </NavLink>
      </div>
    </nav>
  );
}