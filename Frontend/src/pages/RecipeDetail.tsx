import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRecipeById, toggleLike, addComment, Recipe } from "../lib/api";
import { ArrowLeft, Edit, Trash2, Heart, ChefHat } from "lucide-react";
import CookingSession from "../components/CookingSession";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comment, setComment] = useState("");
  const [isCooking, setIsCooking] = useState(false);
  
  const userId = localStorage.getItem("userId");
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    if (id) fetchRecipeById(id).then(setRecipe);
  }, [id]);

  if (!recipe) return <div className="mt-32 text-center text-xl text-ink">Loading...</div>;

  const categoryColors: Record<string, string> = {
    "Mom's Special": 'bg-clay text-parchment',
    Traditional: 'bg-lavender text-parchment',
    Festival: 'bg-golden text-ink',
    Daily: 'bg-ink text-parchment'
  };

  const imageUrl = recipe.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';

  // Placeholder actions since we removed props
  const onEdit = undefined; 
  const onDelete = undefined;
  const isOwner = false;

  const handleLike = async () => {
    if (!id || !isAuthenticated) return;
    try {
        const updated = await toggleLike(id);
        setRecipe({...recipe, likes: updated.likes});
    } catch (err) {
        console.error("Failed to like recipe:", err);
    }
  };

  const handleComment = async () => {
    if (!id || !comment.trim()) return;
    try {
        const updated = await addComment(id, comment);
        setRecipe({...recipe, comments: updated.comments});
        setComment("");
    } catch (err) {
        console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-parchment">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/recipes")}
            className="flex items-center gap-2 text-clay hover:opacity-80 text-lg font-medium transition-smooth"
          >
            <ArrowLeft size={22} /> Back to Recipes
          </button>
          
          {isOwner && (onEdit || onDelete) && (
            <div className="flex gap-3">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 bg-clay text-parchment px-6 py-3 rounded-full font-semibold hover:opacity-80 transition-smooth"
                >
                  <Edit size={20} />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-80 transition-smooth"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Image and Ingredients */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Image */}
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src={imageUrl}
                alt={recipe.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Ingredients Section */}
            <div className="paper-texture bg-paper rounded-2xl p-8 shadow-md">
              <h2 className="text-2xl font-serif font-bold mb-6 text-ink">
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 text-lg text-ink"
                  >
                    <span className="text-clay font-bold text-xl mt-1">•</span>
                    <span className="leading-relaxed">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Title and Instructions */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Title Section */}
            <div>
              <div className="flex items-center justify-between">
                <span
                    className={`inline-block mb-4 px-5 py-2 ${
                    categoryColors[recipe.category] || categoryColors['Daily']
                    } rounded-full text-sm font-semibold`}
                >
                    {recipe.category}
                </span>

                {/* Like Button */}
                <button onClick={handleLike} className="flex items-center gap-2 text-clay hover:opacity-80 transition-smooth border border-clay px-4 py-2 rounded-full">
                    <Heart 
                        className={recipe.likes?.some(id => id.toString() === userId) ? "fill-current text-red-500" : ""} 
                        size={24} 
                    />
                    <span className="font-semibold">{recipe.likes?.length || 0}</span>
                </button>
              </div>

              <h1 className="text-5xl md:text-6xl font-serif font-bold text-ink">
                {recipe.title}
              </h1>
            </div>

            {/* Instructions Section */}
            <div className="paper-texture bg-paper rounded-2xl p-8 shadow-md">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold text-ink">
                    Instructions
                </h2>
                <button
                    onClick={() => setIsCooking(true)}
                    className="flex items-center gap-2 bg-clay text-white px-5 py-2 rounded-full font-semibold hover:opacity-90 transition-smooth shadow-md hover:shadow-lg"
                >
                    <ChefHat size={20} /> Start Cooking
                </button>
              </div>
              <div className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clay text-parchment font-bold text-lg">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-grow pt-1">
                      <p className="text-lg text-ink leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Memory Section - Full Width at Bottom */}
        {recipe.memoryNote && (
          <div className="mt-12 paper-texture bg-paper rounded-2xl p-8 lg:p-12 shadow-md">
            <h2 className="text-3xl font-serif font-bold mb-6 text-ink">
              Memory
            </h2>
            <p className="italic text-lg text-ink leading-relaxed">
              "{recipe.memoryNote}"
            </p>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-12 paper-texture bg-paper rounded-2xl p-8 lg:p-12 shadow-md">
            <h2 className="text-2xl font-serif font-bold mb-6 text-ink">Family Memories & Comments</h2>
            
            <div className="space-y-6 mb-8">
                {recipe.comments?.length === 0 ? (
                    <p className="text-ink text-opacity-60 italic">No memories shared yet. Be the first!</p>
                ) : (
                    recipe.comments?.map((c, i) => (
                        <div key={i} className="border-l-4 border-clay pl-4 py-2">
                             <p className="text-ink text-lg italic mb-2">"{c.text}"</p>
                             <p className="text-sm text-ink text-opacity-60">
                                — {typeof c.user === 'object' ? c.user.name : "Family Member"}
                             </p>
                        </div>
                    ))
                )}
            </div>

            {isAuthenticated ? (
                <div className="flex gap-4 items-start">
                    <textarea 
                        value={comment} 
                        onChange={e => setComment(e.target.value)} 
                        className="flex-1 p-4 bg-transparent border-2 border-golden rounded-lg focus:border-clay focus:outline-none transition-smooth resize-none"
                        placeholder="Share a memory or comment..."
                        rows={3}
                    />
                    <button onClick={handleComment} className="bg-clay text-parchment px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-smooth whitespace-nowrap">
                        Post Memory
                    </button>
                </div>
            ) : (
                <div className="text-center p-6 bg-golden bg-opacity-20 rounded-lg">
                    <p className="text-ink">Please <button onClick={() => navigate("/login")} className="text-clay font-bold hover:underline">login</button> to share your memories.</p>
                </div>
            )}
        </div>

      </div>

      {isCooking && recipe && (
        <CookingSession 
            steps={recipe.steps} 
            onExit={() => setIsCooking(false)} 
        />
      )}
    </div>
  );
}
