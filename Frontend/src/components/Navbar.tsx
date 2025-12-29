import { useState, useEffect } from "react";
import { BookHeart, LogOut, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
    <>
      <nav 
        className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? "bg-parchment/95 backdrop-blur-sm shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 relative z-[1001]">
            <BookHeart className="text-clay" size={32} />
            <span className="text-xl md:text-2xl font-serif font-bold text-ink">Mom's Recipe Diary</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <button 
                key={link.path} 
                onClick={() => navigate(link.path)}
                className={`text-ink hover:text-clay font-medium transition-colors ${
                  location.pathname === link.path ? "text-clay font-bold" : ""
                }`}
              >
                {link.name}
              </button>
            ))}
            
            <div className="h-6 w-px bg-golden/50 mx-2"></div>

            {!isAuthenticated && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-ink hover:text-clay font-medium transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 bg-clay text-parchment rounded-full hover:bg-opacity-90 transition-all font-medium shadow-sm"
                >
                  Register
                </button>
              </div>
            )}
            {isAuthenticated && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate("/add")}
                  className="px-5 py-2 bg-clay text-parchment rounded-full hover:bg-opacity-90 transition-all font-medium shadow-sm"
                >
                  Add Recipe
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-ink hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-ink z-[1001]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] bg-parchment pt-24 px-6 md:hidden flex flex-col items-center gap-8"
          >
            <div className="flex flex-col items-center gap-6 w-full max-w-xs">
              {links.map((link) => (
                <button 
                  key={link.path} 
                  onClick={() => navigate(link.path)}
                  className={`text-2xl font-serif w-full text-center py-2 border-b border-golden/20 ${
                    location.pathname === link.path ? "text-clay font-bold" : "text-ink"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => navigate("/login")}
                    className="w-full py-3 text-lg font-bold border-2 border-clay text-clay rounded-full"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate("/register")}
                    className="w-full py-3 text-lg font-bold bg-clay text-parchment rounded-full shadow-md"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate("/add")}
                    className="w-full py-3 text-lg font-bold bg-clay text-parchment rounded-full shadow-md mb-2"
                  >
                    Add Recipe
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 text-red-600 font-medium py-2"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </>
              )}
            </div>
            
            {/* Background decoration for menu */}
             <div 
                className="absolute inset-0 pointer-events-none opacity-[0.05] z-[-1]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
              />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
