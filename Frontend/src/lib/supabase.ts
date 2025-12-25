import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  memory_story: string;
  prep_time: string;
  cook_time: string;
  servings: string;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  id: string;
  recipe_id: string;
  ingredient: string;
  order_index: number;
  created_at: string;
}

export interface Step {
  id: string;
  recipe_id: string;
  step_description: string;
  order_index: number;
  created_at: string;
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return data || [];
}

export async function fetchRecipeById(id: string): Promise<{
  recipe: Recipe | null;
  ingredients: Ingredient[];
  steps: Step[];
}> {
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (recipeError) {
    console.error('Error fetching recipe:', recipeError);
    return { recipe: null, ingredients: [], steps: [] };
  }

  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('*')
    .eq('recipe_id', id)
    .order('order_index', { ascending: true });

  if (ingredientsError) {
    console.error('Error fetching ingredients:', ingredientsError);
  }

  const { data: steps, error: stepsError } = await supabase
    .from('steps')
    .select('*')
    .eq('recipe_id', id)
    .order('order_index', { ascending: true });

  if (stepsError) {
    console.error('Error fetching steps:', stepsError);
  }

  return {
    recipe: recipe || null,
    ingredients: ingredients || [],
    steps: steps || []
  };
}

export async function addRecipe(recipeData: {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  memoryStory: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  steps: string[];
}): Promise<boolean> {
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert([
      {
        title: recipeData.title,
        description: recipeData.description,
        category: recipeData.category,
        image_url: recipeData.imageUrl,
        memory_story: recipeData.memoryStory,
        prep_time: recipeData.prepTime,
        cook_time: recipeData.cookTime,
        servings: recipeData.servings
      }
    ])
    .select()
    .single();

  if (recipeError || !recipe) {
    console.error('Error creating recipe:', recipeError);
    return false;
  }

  const ingredientsToInsert = recipeData.ingredients.map((ingredient, index) => ({
    recipe_id: recipe.id,
    ingredient,
    order_index: index + 1
  }));

  const { error: ingredientsError } = await supabase
    .from('ingredients')
    .insert(ingredientsToInsert);

  if (ingredientsError) {
    console.error('Error adding ingredients:', ingredientsError);
  }

  const stepsToInsert = recipeData.steps.map((step, index) => ({
    recipe_id: recipe.id,
    step_description: step,
    order_index: index + 1
  }));

  const { error: stepsError } = await supabase.from('steps').insert(stepsToInsert);

  if (stepsError) {
    console.error('Error adding steps:', stepsError);
  }

  return true;
}
