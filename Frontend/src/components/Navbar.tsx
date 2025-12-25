import { useState, useEffect } from "react";
import { BookHeart, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

interface NavLink {
  name: string;
  path: string;
}

export default function Navbar({ isAuthenticated, onLogout }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const publicLinks: NavLink[] = [
    { name: "Home", path: "/" },
    { name: "Recipes", path: "/recipes" },
    { name: "What Can I Cook?", path: "/what-can-i-cook" },
    { name: "About", path: "/about" }
  ];

  const authenticatedLinks: NavLink[] = [
    { name: "Home", path: "/" },
    { name: "Recipes", path: "/recipes" },
    { name: "My Recipes", path: "/my-recipes" },
    { name: "What Can I Cook?", path: "/what-can-i-cook" },
    { name: "About", path: "/about" }
  ];

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 w-full z-50 ${isScrolled ? "bg-parchment shadow" : "bg-transparent"}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <BookHeart className="text-clay" size={32} />
          <span className="text-2xl font-serif font-bold">Mom's Recipe Diary</span>
        </button>

        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <button key={link.path} onClick={() => navigate(link.path)}>{link.name}</button>
          ))}
          {!isAuthenticated && (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/register")}>Register</button>
            </>
          )}
          {isAuthenticated && (
            <>
              <button onClick={() => navigate("/add")}>Add Recipe</button>
              <button onClick={handleLogout}><LogOut size={18} /></button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
