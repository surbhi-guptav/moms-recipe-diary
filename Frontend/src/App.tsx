import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import LandingPage from "./pages/LandingPage";
import RecipesGallery from "./pages/RecipesGallery";
import RecipeDetail from "./pages/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
import MyRecipes from "./pages/MyRecipes";
import EditRecipe from "./pages/EditRecipe";
import About from "./pages/About";
import Login from "./pages/login";
import WhatCanICook from "./pages/WhatCanICook";

import Register from "./pages/Register";
import { useEffect, useState } from "react";
import { fetchRecipes, Recipe } from "./lib/api";

function App() {
  const location = useLocation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    fetchRecipes().then(setRecipes);
  }, []);

  return (
    <div className="min-h-screen bg-parchment font-sans text-ink relative">
      <div 
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      <div className="min-h-screen flex flex-col relative z-10">
        <Navbar isAuthenticated={isAuthenticated} onLogout={() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }} />

        <main className="flex-grow">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><LandingPage featuredRecipes={recipes} /></PageTransition>} />
              <Route path="/recipes" element={<PageTransition><RecipesGallery recipes={recipes} /></PageTransition>} />
              <Route path="/what-can-i-cook" element={<PageTransition><WhatCanICook /></PageTransition>} />
              <Route path="/recipes/:id" element={<PageTransition><RecipeDetail /></PageTransition>} />

              <Route path="/my-recipes" element={isAuthenticated ? <PageTransition><MyRecipes /></PageTransition> : <Navigate to="/login" />} />
              <Route path="/add" element={isAuthenticated ? <PageTransition><AddRecipe /></PageTransition> : <Navigate to="/login" />} />
              <Route path="/recipes/:id/edit" element={isAuthenticated ? <PageTransition><EditRecipe /></PageTransition> : <Navigate to="/login" />} />
              
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login onLoginSuccess={() => setIsAuthenticated(true)} /></PageTransition>} />
              <Route path="/register" element={<PageTransition><Register onRegisterSuccess={() => window.location.href = "/login"} /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;
