import { BookOpen, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import Button from "../components/Button";
import InfoCard from "../components/InfoCard";
import RecipeCard from "../components/RecipeCard";
import { Recipe } from "../lib/api";

interface LandingPageProps {
  featuredRecipes: Recipe[];
}

export default function LandingPage({
  featuredRecipes
}: LandingPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-parchment"
      >
        <div className="container mx-auto px-6 py-32 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left animate-fade-slide">
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-ink leading-tight">
                Preserving <span className="text-clay">Her</span> Recipes.
                <br />
                Preserving <span className="text-golden">Our</span> Memories.
              </h1>
              <p className="text-xl md:text-2xl text-ink text-opacity-80 mb-12 max-w-2xl mx-auto lg:mx-0">
                A digital sanctuary for family recipes and the precious stories behind them.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Button variant="primary" onClick={() => navigate("/recipes")}>
                  Explore Recipes
                </Button>
                <Button variant="secondary" onClick={() => navigate("/add")}>
                  Add a Memory
                </Button>
              </div>
            </div>

            {/* Hero Animation */}
            <div className="flex-1 flex justify-center items-center relative min-h-[500px]">
               {/* Decorative background elements */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
               <div className="absolute top-0 right-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
               <div className="absolute -bottom-8 right-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
               
               <motion.div
                  animate={{ 
                    rotate: 360, 
                    y: [0, -20, 0] 
                  }}
                  transition={{ 
                    rotate: { duration: 35, repeat: Infinity, ease: "linear" },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }
                  }}
                  className="relative z-10 w-80 h-80 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]"
               >
                 <img 
                    src="/hero-plate.png" 
                    alt="Traditional Thali" 
                    className="w-full h-full object-contain drop-shadow-2xl rounded-full"
                 />
               </motion.div>

               {/* Floating Memory Badges */}
               <motion.div 
                 animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                 className="absolute top-20 right-10 md:right-0 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-serif text-ink hidden md:block"
               >
                 ✨ Mom's Curry
               </motion.div>
               
               <motion.div 
                 animate={{ y: [0, 15, 0], opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                 className="absolute bottom-32 left-0 lg:-left-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-serif text-ink hidden md:block"
               >
                 🌶️ Secret Spice
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-parchment">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoCard icon={<BookOpen size={48} />} title="Add Recipe" description="Write it down." />
          <InfoCard icon={<Heart size={48} />} title="Read Memories" description="Feel the warmth." />
          <InfoCard icon={<Sparkles size={48} />} title="Preserve Traditions" description="Pass it on." />
        </div>
      </section>

      {featuredRecipes.length > 0 && (
        <section className="py-20 bg-golden bg-opacity-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-serif font-bold text-center mb-12 text-ink">
              Featured Recipes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRecipes.slice(0, 3).map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  id={recipe._id}
                  title={recipe.title}
                  description={recipe.memoryNote || ""}
                  category={recipe.category}
                  imageUrl=""
                  likes={recipe.likes}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
