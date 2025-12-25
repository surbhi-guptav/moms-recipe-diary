import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toggleLike } from '../lib/api';

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
  likes?: string[];
}

export default function RecipeCard({
  id,
  title,
  description,
  category,
  imageUrl,
  onEdit,
  onDelete,
  isOwner = false,
  likes = []
}: RecipeCardProps) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  
  const [isLiked, setIsLiked] = useState(likes.includes(userId || ""));
  const [likeCount, setLikeCount] = useState(likes.length);

  // Sync state with props
  useEffect(() => {
    setIsLiked(likes.includes(userId || ""));
    setLikeCount(likes.length);
  }, [likes, userId]);

  const categoryColors: Record<string, string> = {
    "Mom's Special": 'bg-clay text-parchment',
    Traditional: 'bg-lavender text-parchment',
    Festival: 'bg-golden text-ink',
    Daily: 'bg-ink text-parchment'
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return;

    // Optimistic update
    const previousLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
        await toggleLike(id);
    } catch (error) {
        // Revert on error
        console.error("Failed to toggle like", error);
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
    }
  };

  return (
    <div
      onClick={() => navigate(`/recipes/${id}`)}
      className="group bg-paper rounded-2xl overflow-hidden shadow-md hover-lift hover-glow transition-smooth cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={title}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
        />
        <div
          className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium ${
            categoryColors[category] || categoryColors['Daily']
          }`}
        >
          {category}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-2xl font-serif font-semibold text-ink flex-1">
            {title}
          </h3>
          <div className="flex items-center gap-2">
             <button
                onClick={handleLikeClick}
                className="group/heart relative flex items-center gap-1 text-ink hover:text-red-500 transition-colors"
             >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <AnimatePresence>
                    {isLiked && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                            animate={{
                              scale: [0, 1, 0],
                              x: [0, (Math.random() - 0.5) * 60],
                              y: [0, (Math.random() - 0.5) * 60],
                              opacity: [1, 0]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute w-2 h-2 bg-red-500 rounded-full"
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </div>
                
                <Heart 
                    size={20} 
                    className={`relative z-10 transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 group-hover/heart:scale-110'}`} 
                />
                <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>{likeCount}</span>
             </button>

            {isOwner && (onEdit || onDelete) && (
                <div className="flex gap-2 ml-2 border-l pl-2 border-gray-300">
                {onEdit && (
                    <button
                        onClick={handleEditClick}
                        className="text-clay hover:opacity-70 transition-smooth p-1"
                        title="Edit recipe"
                    >
                        <Edit size={20} />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={handleDeleteClick}
                        className="text-red-500 hover:opacity-70 transition-smooth p-1"
                        title="Delete recipe"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
                </div>
            )}
          </div>
        </div>
        <p className="text-ink text-opacity-80 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
