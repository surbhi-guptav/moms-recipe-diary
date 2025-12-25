import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DiaryPage, { DiaryPageData } from './DiaryPage';
import { Recipe } from '../lib/api';

// Simple Dust Particle Component
const DustParticles = () => {
    // Generate random positions for dust
    const particles = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                    style={{ top: p.top, left: p.left }}
                    animate={{ y: [-20, 20], opacity: [0, 0.4, 0] }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

// Bookmark Component
const BookmarkRibbon = () => (
    <motion.div 
        className="absolute -top-2 right-8 w-6 h-24 bg-red-800 shadow-md z-10 origin-top"
        style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
            background: 'linear-gradient(to right, #8B0000, #A52A2A, #800000)'
        }}
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
);

interface DiaryBookProps {
  recipes: Recipe[];
}

export default function DiaryBook({ recipes }: DiaryBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [targetPage, setTargetPage] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  
  const shouldReduceMotion = useReducedMotion();

  // Construct pages array
  const pages: DiaryPageData[] = [
    { type: 'front-cover' },
    { type: 'index', recipes: recipes },
    ...recipes.map((r, i) => ({ 
        type: 'recipe', 
        data: r, 
        pageNumber: i + 1, 
        totalPages: recipes.length 
    } as DiaryPageData)),
    { type: 'end' },
    { type: 'back-cover' }
  ];

  // Auto-open book effect
  useEffect(() => {
     const timer = setTimeout(() => {
        if (currentPage === 0) {
            setDirection(1);
            setCurrentPage(1);
        }
     }, 2000); 
     return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            paginate(1);
        } else if (e.key === 'ArrowLeft') {
            paginate(-1);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, targetPage]); // Re-bind when page changes to ensure latest state capture? Or use ref / functional update? Using basic logic for now.

  // Rapid flipping effect
  useEffect(() => {
    if (targetPage !== null && currentPage !== targetPage) {
        const diff = targetPage - currentPage;
        const nextStep = diff > 0 ? 1 : -1;
        
        const timer = setTimeout(() => {
            setDirection(nextStep);
            setCurrentPage(prev => prev + nextStep);
        }, 450); 

        return () => clearTimeout(timer);
    } else if (targetPage === currentPage) {
        setTargetPage(null); 
    }
  }, [currentPage, targetPage]);

  const paginate = (newDirection: number) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 0 && newPage < pages.length) {
      setTargetPage(null); 
      setDirection(newDirection);
      setCurrentPage(newPage);
      
      // Placeholder: play sound
      // playFlipSound(); 
    }
  };

  const jumpToPage = (index: number) => {
      setTargetPage(index);
  }

  const isFastFlipping = targetPage !== null;

  // Organic, slow easing for page flip
  const bookTransition = {
      duration: isFastFlipping ? 0.3 : (shouldReduceMotion ? 0 : 0.8),
      ease: [0.4, 0, 0.2, 1] 
  };

  // Content settling animation
  const contentVariants: any = {
      hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15, filter: shouldReduceMotion ? 'none' : 'blur(2px)' },
      visible: { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)',
          transition: { 
              delay: isFastFlipping ? 0.1 : 0.3, 
              duration: isFastFlipping ? 0.2 : 0.5,
              ease: "easeOut" 
          }
      }
  };

  const variants: any = {
    enter: (direction: number) => ({
      rotateY: shouldReduceMotion ? 0 : (direction > 0 ? 90 : -90),
      opacity: shouldReduceMotion ? 0 : 0,
      scale: 0.95,
      boxShadow: direction > 0 ? "-20px 0 50px rgba(0,0,0,0.5)" : "20px 0 50px rgba(0,0,0,0.5)"
    }),
    center: {
      zIndex: 1,
      rotateY: 0,
      opacity: 1,
      scale: 1,
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
      transition: bookTransition
    },
    exit: (direction: number) => ({
      zIndex: 0,
      rotateY: shouldReduceMotion ? 0 : (direction < 0 ? 90 : -90),
      opacity: 0,
      scale: 0.95,
      boxShadow: direction < 0 ? "-20px 0 50px rgba(0,0,0,0.5)" : "20px 0 50px rgba(0,0,0,0.5)",
      transition: bookTransition
    })
  };

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ 
            opacity: 1, 
            scale: [1, 1.002, 1], // Breathing animation
            y: 0 
        }}
        transition={{ 
            opacity: { duration: 1.2 },
            y: { duration: 1.2 },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" } // Breathing cycle
        }}
        className="flex flex-col items-center justify-center min-h-[80vh] py-20 group relative rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" 
        style={{
            background: `
                radial-gradient(circle at center, #5D4037 0%, #3E2723 60%, #1a100c 100%),
                url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")
            `,
            backgroundBlendMode: 'overlay'
        }}
    >
      {/* Floating Particles in background area */}
      <DustParticles />

      {/* Book Container with Navigation Overlay */}
      <div className="relative w-full max-w-lg aspect-[2/3] perspective-1500 mx-auto transform-style-3d z-10">
        
        {/* Bookmark Overlay - Visible on inner pages */}
        {currentPage > 0 && currentPage < pages.length - 1 && <BookmarkRibbon />}

        {/* Previous Button (Left Overlay) */}
        <div className="absolute top-1/2 -left-28 md:-left-32 transform -translate-y-1/2 z-30">
             <button
                onClick={() => paginate(-1)}
                disabled={currentPage === 0}
                className={`
                    p-4 rounded-full bg-[#3E2723] text-[#FAF3E0] shadow-2xl border border-[#EAC696]/20
                    transition-all duration-500 ease-out
                    opacity-0 translate-x-8
                    group-hover:opacity-100 group-hover:translate-x-0
                    hover:scale-110 active:scale-95
                    disabled:opacity-0 disabled:cursor-not-allowed
                    flex items-center justify-center
                    backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-[#EAC696]
                `}
                style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E")`
                }}
            >
                <ChevronLeft size={32} />
            </button>
        </div>

        {/* Next Button (Right Overlay) */}
        <div className="absolute top-1/2 -right-28 md:-right-32 transform -translate-y-1/2 z-30">
             <button
                onClick={() => paginate(1)}
                disabled={currentPage === pages.length - 1}
                className={`
                    p-4 rounded-full bg-[#3E2723] text-[#FAF3E0] shadow-2xl border border-[#EAC696]/20
                    transition-all duration-500 ease-out
                    opacity-0 -translate-x-8
                    group-hover:opacity-100 group-hover:translate-x-0
                    hover:scale-110 active:scale-95
                    disabled:opacity-0 disabled:cursor-not-allowed
                    flex items-center justify-center
                    backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-[#EAC696]
                `}
                style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E")`
                }}
            >
                <ChevronRight size={32} />
            </button>
        </div>

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 rounded-r-lg shadow-2xl overflow-hidden border-l-8 border-[#5D4037] origin-left bg-[#FAF3E0]"
            style={{ 
                backgroundColor: (pages[currentPage].type === 'front-cover' || pages[currentPage].type === 'back-cover') 
                    ? '#5D4037' 
                    : '#FAF3E0',
                backgroundImage: (pages[currentPage].type === 'front-cover' || pages[currentPage].type === 'back-cover')
                    ? `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`
                    : `linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 5%), url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`
            }}
          >
            {/* Inner Content Wrapper for Settling Animation */}
            <motion.div 
               variants={contentVariants}
               initial="hidden"
               animate="visible"
               className={`h-full w-full ${pages[currentPage].type === 'front-cover' || pages[currentPage].type === 'back-cover' ? 'p-0' : 'p-8 md:p-12'}`}
            >
                <DiaryPage page={pages[currentPage]} onNavigate={jumpToPage} />
            </motion.div>
            
            {/* Page fold effect (spine shadow) */}
            {(pages[currentPage].type !== 'front-cover' && pages[currentPage].type !== 'back-cover') && (
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
            )}
             {/* Page edge effect */}
            {(pages[currentPage].type !== 'front-cover' && pages[currentPage].type !== 'back-cover') && (
                <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Page Number Indicator */}
      <div className="mt-10 font-serif text-ink opacity-40 text-sm tracking-widest uppercase">
            {currentPage === 0 ? "Front Cover" : currentPage === pages.length - 1 ? "Back Cover" : `Page ${currentPage} of ${pages.length - 2}`}
      </div>
      
      {/* Sound Toggle (Optional - Visual Only for now) */}
      <div className="absolute bottom-4 right-4 text-xs text-ink opacity-30 hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1">
         <span>🔊</span> Sound On
      </div>

    </motion.div>
  );
}
