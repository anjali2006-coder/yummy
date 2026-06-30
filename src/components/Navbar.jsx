import { NavLink } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { Soup } from "lucide-react" ;

export default function Navbar() {
  const { favorites } = useFavorites(); // reading shared state, no prop drilling

  return (
    <nav className="p-2 flex justify-evenly items-center">
      <NavLink to="/" className=" flex gap-3 brand font-bold text-3xl">
        <Soup size={34} color="#F97316" />
        <h1 className="text-orange-500">Recipe Finder </h1> 
      </NavLink>
      <div className="nav-links flex gap-6 text-[20px]">
        <NavLink to="/" end className="hover:text-orange-500">
          Home
        </NavLink>
        <NavLink to="/favorites" className="hover:text-orange-500">
          Favorites {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
        </NavLink>
      </div>
    </nav>
  );
}