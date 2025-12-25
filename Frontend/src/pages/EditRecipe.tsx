import { useState, FormEvent, useEffect, useCallback } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { fetchRecipeById, updateRecipe } from '../lib/api';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState("Mom's Special");
  const [imageUrl, setImageUrl] = useState('');
  const [memoryStory, setMemoryStory] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ["Mom's Special", 'Traditional', 'Festival', 'Daily'];

  const loadRecipe = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const recipe = await fetchRecipeById(id);
      setTitle(recipe.title);
      setCategory(recipe.category);
      setImageUrl(recipe.imageUrl || '');
      setMemoryStory(recipe.memoryNote || '');
      setIngredients(recipe.ingredients || ['']);
      setSteps(recipe.steps || ['']);
    } catch (error) {
      console.error('Error loading recipe:', error);
      setErrors({ load: 'Failed to load recipe for editing' });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRecipe();
  }, [loadRecipe]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Recipe name is required';
    }

    // Validate ingredients
    const validIngredients = ingredients.filter((i) => i.trim() !== '');
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'At least 1 ingredient is required';
    }

    // Validate steps
    const validSteps = steps.filter((s) => s.trim() !== '');
    if (validSteps.length === 0) {
      newErrors.steps = 'At least 1 step is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateRecipe(id, {
        title,
        category,
        ingredients: ingredients.filter((i) => i.trim() !== ''),
        steps: steps.filter((s) => s.trim() !== ''),
        memoryNote: memoryStory,
        imageUrl: imageUrl || undefined
      });

      setErrors({});
      navigate(-1); // Go back after success
    } catch (error) {
      console.error('Error updating recipe:', error);
      setErrors({ submit: 'Failed to update recipe. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-parchment flex items-center justify-center">
        <p className="text-2xl font-serif text-ink">Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-parchment">
      <div className="container mx-auto px-6 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-clay hover:opacity-80 mb-8 font-medium transition-smooth"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="text-center mb-12 animate-fade-slide">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-ink">
            Edit Recipe
          </h1>
          <p className="text-xl text-ink text-opacity-80">
            Update your recipe details
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="paper-texture rounded-3xl p-8 md:p-12 shadow-xl"
        >
          <div className="space-y-8">
            {/* General Error Message */}
            {(errors.submit || errors.load) && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-lg">
                {errors.submit || errors.load}
              </div>
            )}

            <div>
              <label className="block text-lg font-serif font-semibold mb-2 text-ink">
                Recipe Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                className={`w-full px-4 py-3 bg-transparent border-b-2 focus:outline-none text-xl transition-smooth ${
                  errors.title ? 'border-red-500 focus:border-red-600' : 'border-golden focus:border-clay'
                }`}
                placeholder="Enter the recipe name..."
              />
              {errors.title && <p className="text-red-600 text-sm mt-2">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-serif font-semibold mb-2 text-ink">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-paper border-2 border-golden rounded-lg focus:border-clay focus:outline-none transition-smooth"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-serif font-semibold mb-2 text-ink">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-golden focus:border-clay focus:outline-none transition-smooth"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-serif font-semibold text-ink">
                  Ingredients *
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center gap-2 text-clay hover:text-opacity-80 transition-smooth"
                >
                  <Plus size={20} />
                  Add Ingredient
                </button>
              </div>
              {errors.ingredients && (
                <p className="text-red-600 text-sm mb-3 font-semibold">{errors.ingredients}</p>
              )}
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => {
                        updateIngredient(index, e.target.value);
                        if (errors.ingredients) setErrors({ ...errors, ingredients: '' });
                      }}
                      className={`flex-1 px-4 py-2 bg-transparent border-b-2 focus:outline-none transition-smooth ${
                        errors.ingredients ? 'border-red-400 focus:border-red-600' : 'border-golden focus:border-clay'
                      }`}
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-lavender hover:text-opacity-80 transition-smooth"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-serif font-semibold text-ink">
                  Steps *
                </label>
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center gap-2 text-clay hover:text-opacity-80 transition-smooth"
                >
                  <Plus size={20} />
                  Add Step
                </button>
              </div>
              {errors.steps && (
                <p className="text-red-600 text-sm mb-3 font-semibold">{errors.steps}</p>
              )}
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-clay text-parchment rounded-full flex items-center justify-center font-semibold mt-1">
                      {index + 1}
                    </span>
                    <textarea
                      value={step}
                      onChange={(e) => {
                        updateStep(index, e.target.value);
                        if (errors.steps) setErrors({ ...errors, steps: '' });
                      }}
                      rows={2}
                      className={`flex-1 px-4 py-2 bg-transparent border-b-2 focus:outline-none transition-smooth resize-none ${
                        errors.steps ? 'border-red-400 focus:border-red-600' : 'border-golden focus:border-clay'
                      }`}
                      placeholder={`Step ${index + 1}`}
                    />
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-lavender hover:text-opacity-80 transition-smooth mt-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-serif font-semibold mb-2 text-ink">
                Memory Story
              </label>
              <textarea
                value={memoryStory}
                onChange={(e) => setMemoryStory(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-transparent border-2 border-golden rounded-lg focus:border-clay focus:outline-none handwritten text-xl transition-smooth resize-none"
                placeholder="Share the story behind this recipe... Who taught it to you? What memories does it bring back?"
              />
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-12 py-3 bg-gray-300 text-ink rounded-full font-semibold hover:opacity-80 transition-smooth"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" className="px-12">
                {isSubmitting ? 'Updating Recipe...' : 'Update Recipe'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
