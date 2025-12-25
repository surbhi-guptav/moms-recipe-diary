import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import RecipeCard from '../components/RecipeCard';
import { fetchRecipesWithFilters, Recipe } from '../lib/api';

interface RecipesGalleryProps {
  recipes: Recipe[];
}

export default function RecipesGallery({ recipes: initialRecipes }: RecipesGalleryProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['All', "Mom's Special", 'Traditional', 'Festival', 'Daily'];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 20 }
    }
  };

  // Debounce search query - wait for user to finish typing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 800); 

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Fetch recipes with smart search
  useEffect(() => {
    const loadRecipes = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRecipesWithFilters({
            search: debouncedSearchQuery || undefined,
            category: selectedCategory !== 'All' ? selectedCategory : undefined,
        });
        setRecipes(data);
      } catch (error) {
        console.error('Failed to fetch filtered recipes:', error);
        setRecipes([]); 
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, [debouncedSearchQuery, selectedCategory]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-slide">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-ink">
            Recipe Collection
          </h1>
          <p className="text-xl text-ink text-opacity-80 max-w-2xl mx-auto">
            Explore cherished family recipes passed down through generations
          </p>
        </div>

        <div className="mb-12 space-y-6 animate-fade-slide max-w-2xl mx-auto">
          {/* Smart Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ink text-opacity-50"
              size={24}
            />
            <input
              type="text"
              placeholder="Search by title OR ingredients (e.g. 'chicken' or 'tomato, garlic')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full bg-paper border-2 border-golden border-opacity-30 focus:border-clay focus:outline-none text-lg transition-smooth shadow-sm"
            />
            <p className="text-xs text-ink text-opacity-50 mt-2 ml-4 italic">
                Tip: Use commas to find recipes with specific ingredients (e.g. "tomato, onion").
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-smooth ${
                  selectedCategory === category
                    ? 'bg-clay text-parchment'
                    : 'bg-paper text-ink hover:bg-golden hover:bg-opacity-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-2xl font-serif text-ink text-opacity-60">
              Searching recipes...
            </p>
          </div>
        ) : recipes.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {recipes.map((recipe) => (
              <motion.div key={recipe._id} variants={itemVariants}>
                <RecipeCard
                    id={recipe._id}
                    title={recipe.title}
                    description={recipe.memoryNote || 'A delicious family recipe'}
                    category={recipe.category}
                    imageUrl=""
                    likes={recipe.likes}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl font-serif text-ink text-opacity-60">
              No recipes found. Try a different search path.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
