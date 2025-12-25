import { useState, useEffect } from 'react';
import { Search, Plus, BookOpen, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import DiaryBook from '../components/DiaryBook';
import { fetchMyRecipes, deleteRecipe, Recipe } from '../lib/api';

export default function MyRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalRecipes, setTotalRecipes] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // View Mode State
  const [viewMode, setViewMode] = useState<'grid' | 'diary'>('grid');

  const categories = ['All', "Mom's Special", 'Traditional', 'Festival', 'Daily'];

  // Load total recipes count on mount
  useEffect(() => {
    const loadTotalRecipes = async () => {
      try {
        const data = await fetchMyRecipes();
        setTotalRecipes(data?.length || 0);
      } catch (err) {
        console.error('Failed to load recipe count:', err);
      }
    };
    loadTotalRecipes();
  }, []);

  // Debounce search query - wait for user to finish typing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 800); // Wait for user to finish typing

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    loadMyRecipes();
  }, [debouncedSearchQuery, selectedCategory]);

  const loadMyRecipes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await fetchMyRecipes(debouncedSearchQuery, selectedCategory);
      console.log('My Recipes Data:', data);
      setRecipes(data || []);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to load your recipes';
      console.error('My Recipes Error:', err);
      console.error('Error Details:', errorMsg);
      setError(errorMsg);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRecipe(id);
      setRecipes(recipes.filter((r) => r._id !== id));
      setDeleteConfirm(null);
    } catch (err: unknown) {
      console.error('Delete error:', err);
      alert('Failed to delete recipe');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/recipes/${id}/edit`);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-parchment">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-slide relative">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-ink">
            My Recipes
          </h1>
          <p className="text-xl text-ink text-opacity-80 max-w-2xl mx-auto mb-8">
            Recipes you've shared with the family
          </p>

          {/* View Toggle */}
          <div className="inline-flex bg-paper rounded-full p-1 shadow-inner border border-golden/30">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-clay text-parchment shadow-md' 
                  : 'text-ink opacity-60 hover:opacity-100'
              }`}
            >
              <Grid size={18} />
              Card Mode
            </button>
            <button
              onClick={() => setViewMode('diary')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'diary' 
                  ? 'bg-clay text-parchment shadow-md' 
                  : 'text-ink opacity-60 hover:opacity-100'
              }`}
            >
              <BookOpen size={18} />
              Diary Mode
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-2xl font-serif text-ink text-opacity-60">
              Loading your recipes...
            </p>
          </div>
        ) : totalRecipes === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-serif text-ink text-opacity-60 mb-6">
              You haven't created any recipes yet.
            </p>
            <button
              onClick={() => navigate('/add')}
              className="inline-flex items-center gap-2 bg-clay text-parchment px-8 py-3 rounded-full font-semibold hover:opacity-80 transition-smooth"
            >
              <Plus size={20} />
              Create Your First Recipe
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-serif text-ink text-opacity-60 mb-6">
              No recipes found matching "{debouncedSearchQuery || selectedCategory}".
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="inline-flex items-center gap-2 bg-clay text-parchment px-8 py-3 rounded-full font-semibold hover:opacity-80 transition-smooth"
              >
                Clear Search & Filters
              </button>
              <button
                onClick={() => navigate('/add')}
                className="inline-flex items-center gap-2 bg-golden text-ink px-8 py-3 rounded-full font-semibold hover:opacity-80 transition-smooth"
              >
                <Plus size={20} />
                Add New Recipe
              </button>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
                <div className="mb-12 space-y-6 animate-fade-slide">
                <div className="relative max-w-2xl mx-auto">
                    <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ink text-opacity-50"
                    size={24}
                    />
                    <input
                    type="text"
                    placeholder="Search your recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-full bg-paper border-2 border-golden border-opacity-30 focus:border-clay focus:outline-none text-lg transition-smooth"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-3">
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
            )}

            {recipes.length > 0 ? (
              viewMode === 'diary' ? (
                <DiaryBook recipes={recipes} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipe) => (
                    <div key={recipe._id} className="relative">
                        <RecipeCard
                        id={recipe._id}
                        title={recipe.title}
                        description={recipe.memoryNote || 'A delicious family recipe'}
                        category={recipe.category}
                        imageUrl={recipe.imageUrl || ''}
                        onEdit={handleEdit}
                        onDelete={() => setDeleteConfirm(recipe._id)}
                        isOwner={true}
                        likes={recipe.likes}
                        />
                        
                        {/* Delete Confirmation Modal */}
                        {deleteConfirm === recipe._id && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center z-50">
                            <div className="bg-parchment p-6 rounded-lg shadow-xl max-w-sm">
                            <p className="text-lg font-serif mb-6 text-ink">
                                Are you sure you want to delete this recipe?
                            </p>
                            <div className="flex gap-4">
                                <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-ink rounded-lg hover:opacity-80 transition-smooth"
                                >
                                Cancel
                                </button>
                                <button
                                onClick={() => handleDelete(recipe._id)}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-80 transition-smooth"
                                >
                                Delete
                                </button>
                            </div>
                            </div>
                        </div>
                        )}
                    </div>
                    ))}
                </div>
              )
            ) : (
              <div className="text-center py-20">
                <p className="text-2xl font-serif text-ink text-opacity-60">
                  No recipes match your search.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
