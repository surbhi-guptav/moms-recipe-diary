import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChefHat, X, Loader2 } from 'lucide-react';
import { fetchCanCook, Recipe } from '../lib/api';
import RecipeCard from '../components/RecipeCard';

export default function WhatCanICook() {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient();
    }
  };

  const addIngredient = () => {
    const trimmed = input.trim().replace(/,/g, '');
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInput('');
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) return;
    
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await fetchCanCook(ingredients);
      setRecipes(data);
    } catch (error) {
      console.error("Failed to find recipes:", error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 container mx-auto">
      <div className="text-center mb-12 animate-fade-slide">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-ink">
            What Can I Cook Today?
        </h1>
        <p className="text-xl text-ink text-opacity-80 max-w-2xl mx-auto">
            Tell us what's in your pantry, and we'll find the perfect recipe.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-16">
        <div className="bg-paper p-6 rounded-2xl shadow-lg border border-golden/30 relative">
             <div className="flex items-center gap-2 mb-4 bg-white p-2 rounded-lg border border-gray-200 focus-within:border-clay transition-colors shadow-inner">
                <ChefHat className="text-clay opacity-70" size={24} />
                <input
                    className="flex-1 bg-transparent border-none outline-none text-lg text-ink placeholder:text-gray-400 font-serif"
                    placeholder="Type an ingredient and press Enter (e.g. Tomato, Onion)"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button 
                    onClick={addIngredient}
                    className="bg-golden/20 hover:bg-golden/40 text-ink rounded-full p-2 transition-colors"
                >
                    <PlusIcon />
                </button>
             </div>

             {/* Ingredient Chips */}
             <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
                <AnimatePresence>
                    {ingredients.map(ing => (
                        <motion.span
                            key={ing}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="inline-flex items-center gap-1 bg-clay text-parchment px-3 py-1 rounded-full text-sm shadow-sm"
                        >
                            {ing}
                            <button onClick={() => removeIngredient(ing)} className="hover:text-red-300">
                                <X size={14} />
                            </button>
                        </motion.span>
                    ))}
                    {ingredients.length === 0 && (
                        <span className="text-gray-400 italic text-sm py-1">No ingredients added yet...</span>
                    )}
                </AnimatePresence>
             </div>

             <button 
                onClick={handleSearch}
                disabled={ingredients.length === 0 || isLoading}
                className="w-full bg-clay text-parchment font-bold py-3 rounded-xl shadow-md hover:bg-clay/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
             >
                {isLoading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                Find Recipes
             </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="animate-fade-slide-up">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-60">
                <Loader2 size={48} className="animate-spin text-clay mb-4" />
                <p className="font-serif text-lg">Rumaging through the recipe book...</p>
            </div>
        ) : hasSearched ? (
            recipes.length > 0 ? (
                <div>
                   <h2 className="text-2xl font-serif text-ink mb-8 border-b border-golden/30 pb-2 inline-block">
                        Recipes you can cook ({recipes.length})
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map(r => (
                        <RecipeCard 
                            key={r._id} 
                            id={r._id}
                            title={r.title}
                            description={r.memoryNote || 'A delicious family recipe'}
                            category={r.category}
                            imageUrl={r.imageUrl || ''}
                            likes={r.likes}
                        />
                    ))}
                  </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white/50 rounded-xl border border-dashed border-gray-300">
                     <div className="text-6xl mb-4">🍽️</div>
                     <h3 className="text-2xl font-serif text-ink mb-2">No matching recipes found</h3>
                     <p className="text-ink text-opacity-60 max-w-md mx-auto">
                        We couldn't find any recipes that strictly use <b>only</b> (or a subset of) the ingredients you listed. 
                        Try adding more common ingredients like 'Salt', 'Oil', or 'Water' if your recipes list them!
                     </p>
                </div>
            )
        ) : null}
      </div>
    </div>
  );
}

function PlusIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
