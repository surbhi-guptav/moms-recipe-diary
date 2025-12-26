import Recipe from "../models/Recipe.js";
import mongoose from "mongoose";

export const createRecipe = async (req, res)=>{

    try{
        const recipe = await Recipe.create(
            {
                ...req.body,
                createdBy: req.user
            }
        );

        res.status(201).json(recipe);
    }
    catch(err){
        res.status(500).json(
            {
                message:err.message
            }
        );
    }
}

export const getRecipes = async(req, res)=>{
    try {
        console.log("Getting Recipes - Query params:", req.query);
        const { search, category } = req.query;
        let filter = {};

        if (search && search.trim() !== "") {
            const searchTerm = search.trim();
            
            // Check for multiple ingredients (comma-separated)
            if (searchTerm.includes(",")) {
                // Ingredient Search Mode (AND logic)
                const ingredientArray = searchTerm.split(",").map(i => new RegExp(i.trim(), "i"));
                filter.ingredients = { $all: ingredientArray };
                console.log("Applied ingredient list filter:", ingredientArray);
            } else {
                // General Search Mode (Title OR Ingredient)
                const searchRegex = { $regex: searchTerm, $options: "i" };
                filter.$or = [
                    { title: searchRegex },
                    { ingredients: searchRegex }
                ];
                console.log("Applied smart search for:", searchTerm);
            }
        }

        // Add category filter
        if (category && category !== "All") {
            filter.category = category;
            console.log("Applied category filter for:", category);
        }

        console.log("Final filter object:", JSON.stringify(filter, null, 2));
        const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
        console.log("Found recipes:", recipes.length);
        res.json(recipes);
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

export const getMyRecipes = async(req, res)=>{
    try {
        console.log("Getting My Recipes - req.user:", req.user);
        console.log("Query params:", req.query);
        const { search, category } = req.query;
        let filter = {
            createdBy: new mongoose.Types.ObjectId(req.user)
        };

        if (search && search.trim() !== "") {
            const searchTerm = search.trim();
            
            // Check for multiple ingredients (comma-separated)
            if (searchTerm.includes(",")) {
                // Ingredient Search Mode (AND logic)
                const ingredientArray = searchTerm.split(",").map(i => new RegExp(i.trim(), "i"));
                filter.ingredients = { $all: ingredientArray };
                console.log("Applied ingredient list filter for MyRecipes:", ingredientArray);
            } else {
                // General Search Mode (Title OR Ingredient)
                const searchRegex = { $regex: searchTerm, $options: "i" };
                // Need to use $and to combine with createdBy filter safely (though createdBy is at top level, $or for search fields)
                // Actually filter object keys are ANDed by default.
                // But $or needs to be scoped to just the search fields.
                filter.$or = [
                    { title: searchRegex },
                    { ingredients: searchRegex }
                ];
                console.log("Applied smart search for MyRecipes:", searchTerm);
            }
        }

        // Add category filter
        if (category && category !== "All") {
            filter.category = category;
            console.log("Applied category filter for MyRecipes:", category);
        }

        console.log("Final filter object:", JSON.stringify(filter, null, 2));
        const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
        console.log("Found recipes:", recipes.length);
        res.json(recipes);
    } catch(err) {
        console.error("Error in getMyRecipes:", err);
        res.status(500).json({
            message: err.message
        });
    }
}

export const getRecipeById = async (req, res)=>{
    try {
        const recipe = await Recipe.findById(req.params.id).populate("comments.user", "name");
        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }
        res.json(recipe);
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

export const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        // Check ownership
        if (recipe.createdBy.toString() !== req.user.toString()) {
            return res.status(403).json({
                message: "You can only edit your own recipes"
            });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedRecipe);
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

export const deleteRecipe = async (req, res) =>{
    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        // Check ownership
        if (recipe.createdBy.toString() !== req.user.toString()) {
            return res.status(403).json({
                message: "You can only delete your own recipes"
            });
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.json({
            message: "Recipe deleted successfully"
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

export const toggleLike = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const userId = req.user.toString();
        const isLiked = recipe.likes.some(id => id.toString() === userId);

        if (isLiked) {
             // Unlike
            recipe.likes = recipe.likes.filter(id => id.toString() !== userId);
        } else {
            // Like
            recipe.likes.push(userId);
        }

        await recipe.save();
        res.json(recipe);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

export const addComment = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
             return res.status(404).json({ message: "Recipe not found" });
        }

        const newComment = {
            user: req.user,
            text: req.body.text
        };

        recipe.comments.push(newComment);

        await recipe.save();
        
        // Populate user details for immediate display
        await recipe.populate("comments.user", "name");

        res.json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

export const getRecipesCanCook = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "Please provide a list of ingredients." });
    }

    const userIngredients = ingredients.map(i => i.toLowerCase().trim());

    console.log("Cooking with:", userIngredients);

    const recipes = await Recipe.find();

    const validRecipes = recipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());

      return userIngredients.every(userIng =>
        recipeIngredients.some(recipeIng => recipeIng.includes(userIng))
      );
    });

    console.log(`Found ${validRecipes.length} valid recipes.`);

    res.json(validRecipes);
  } catch (err) {
    console.error("Error in getRecipesCanCook:", err);
    res.status(500).json({ message: "Error finding recipes" });
  }
};
