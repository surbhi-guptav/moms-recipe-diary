import express from "express"
import {createRecipe, getRecipes, getMyRecipes, getRecipeById, updateRecipe, deleteRecipe, toggleLike, addComment, getRecipesCanCook} from "../controllers/recipeController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes - no authentication required
router.get("/", getRecipes);
router.post("/can-cook", getRecipesCanCook);

// Protected routes - authentication required (must come BEFORE /:id)
router.get("/mine", auth, getMyRecipes);

// Public route for single recipe
router.get("/:id", getRecipeById);

// Protected modification routes
router.post("/", auth, createRecipe);
router.put("/:id", auth, updateRecipe);
router.delete("/:id", auth, deleteRecipe);
router.post("/:id/like", auth, toggleLike);
router.post("/:id/comment", auth, addComment);

export default router;