import React from 'react';
import { Recipe } from '../lib/api';

export type PageType = 'front-cover' | 'index' | 'recipe' | 'end' | 'back-cover';

export interface DiaryPageData {
  type: PageType;
  data?: Recipe;
  pageNumber?: number;
  totalPages?: number;
  recipes?: Recipe[];
}

interface DiaryPageProps {
  page: DiaryPageData;
  onNavigate?: (index: number) => void;
}

export default function DiaryPage({ page, onNavigate }: DiaryPageProps) {
  // Front Cover
  if (page.type === 'front-cover') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center border-4 border-yellow-600/30 rounded-r-lg"
           style={{
             backgroundColor: '#5D4037', // Leather brown
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
             boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
           }}
      >
        <div className="border-2 border-yellow-500/50 p-8 m-4 rounded">
            <h1 className="font-serif text-4xl md:text-5xl text-yellow-100 mb-4 drop-shadow-md" style={{ fontFamily: 'Cinzel, serif' }}>
            Mom's<br/>Diary
            </h1>
            <div className="w-16 h-1 bg-yellow-500/50 mx-auto my-4 rounded-full"></div>
            <p className="text-yellow-100/60 font-serif text-sm italic">
            Est. 2025
            </p>
        </div>
      </div>
    );
  }

  // Back Cover
  if (page.type === 'back-cover') {
     return (
        <div className="h-full w-full flex flex-col items-center justify-center text-center border-4 border-yellow-600/30 rounded-r-lg"
             style={{
               backgroundColor: '#5D4037',
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
               boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
             }}
        >
          <div className="text-yellow-100/30 font-serif text-xs">
              Handcrafted Memories
          </div>
        </div>
      );
  }

  if (page.type === 'index') {
    return (
      <div className="h-full flex flex-col relative px-4 py-2">
        {/* Aging Vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(139,69,19,0.15)] rounded-r-lg" />
        
        {/* Decorative Border */}
        <div className="absolute inset-4 border-2 border-golden/30 rounded-sm pointer-events-none z-0" 
             style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 0l10 10L0 20M20 0l-10 10 10 10' stroke='%23d4af37' stroke-opacity='0.2' fill='none'/%3E%3C/svg%3E")`,
                 maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
             }}
        />

        <h2 className="font-serif text-3xl mb-6 text-center text-ink border-b-2 border-golden pb-2 relative z-10 mx-6 mt-4">Recipe Index</h2>
        <ul className="flex-1 overflow-y-auto space-y-4 pr-4 pl-4 custom-scrollbar relative z-10">
          {page.recipes?.map((r, i) => (
            <li 
              key={r._id} 
              className="flex justify-between items-baseline border-b border-dotted border-gray-400 pb-1 cursor-pointer hover:text-clay transition-colors group"
              onClick={() => onNavigate && onNavigate(i + 2)} 
            >
              <span className="font-serif text-lg group-hover:translate-x-1 transition-transform">{r.title}</span>
              <span className="text-sm font-mono opacity-60">p. {i + 1}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-center text-xs text-ink opacity-50 font-serif relative z-10 pb-4">
           Table of Contents
        </div>
      </div>
    );
  }

  if (page.type === 'recipe' && page.data) {
    const r = page.data;
    return (
      <div className="h-full flex flex-col relative px-2">
        {/* Aging Vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(139,69,19,0.1)] rounded-r-lg" />

        {/* Decorative Corner Borders (Indian/Arabic inspired corners) */}
        <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-golden opacity-40 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-golden opacity-40 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-golden opacity-40 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-golden opacity-40 rounded-br-lg pointer-events-none" />
        
        {/* Inner Border Pattern */}
        <div className="absolute inset-4 border border-golden/20 pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col h-full pt-6 px-6 pb-8">
            <h2 className="font-serif text-3xl mb-2 text-ink text-center leading-tight">{r.title}</h2>
            
            <div className="text-sm text-clay font-medium mb-4 flex justify-center items-center gap-2">
                <span className="px-3 py-0.5 border-y border-clay/30 text-xs tracking-widest uppercase">{r.category}</span>
            </div>
            
            {/* Recipe Image - Centered and framed */}
            {r.imageUrl && (
                <div className="relative w-full h-40 mb-6 shrink-0 rotate-1 shadow-md border-4 border-white bg-white mx-auto transform hover:rotate-0 transition-transform duration-500 max-w-[80%]">
                    <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover sepia-[0.3]" />
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none"></div>
                </div>
            )}
            
            <p className="italic text-ink opacity-80 mb-6 font-serif border-l-2 border-golden pl-6 pr-2 ml-2 leading-relaxed">
              "{r.memoryNote || "A cherished family recipe, passed down with love."}"
            </p>

            <div className="flex-1 overflow-y-auto pr-3 pl-2 custom-scrollbar space-y-8">
                {/* Ingredients */}
                <div>
                    <h3 className="font-serif text-xl font-bold mb-3 text-center text-[#8B4513] border-b border-[#8B4513]/20 pb-1 mx-10">Ingredients</h3>
                    <ul className="space-y-2 text-sm font-serif leading-7 pl-4 list-disc list-outside marker:text-[#8B4513]/50">
                        {r.ingredients && r.ingredients.length > 0 ? (
                            r.ingredients.map((ing, idx) => (
                                <li key={idx} className="text-gray-800">{ing}</li>
                            ))
                        ) : (
                            <li className="text-gray-500 italic">No ingredients listed for this memory.</li>
                        )}
                    </ul>
                </div>

                {/* Steps */}
                <div>
                    <h3 className="font-serif text-xl font-bold mb-3 text-center text-[#8B4513] border-b border-[#8B4513]/20 pb-1 mx-10">Method</h3>
                    <ol className="list-decimal list-outside space-y-3 text-sm font-serif leading-7 pl-8 text-gray-800 marker:text-[#8B4513]/70">
                         {r.steps && r.steps.length > 0 ? (
                            r.steps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                            ))
                         ) : (
                            <li className="text-gray-500 italic">No instructions recorded.</li>
                         )}
                    </ol>
                </div>
            </div>

            {/* Page Footer */}
            <div className="flex justify-between text-xs font-mono text-ink opacity-40 pt-4 mt-2 border-t border-golden/30">
                <span>Ref: {r._id.slice(-4)}</span>
                <span>Page {page.pageNumber}</span>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center text-center relative">
       {/* Aging Vignette */}
       <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(139,69,19,0.15)] rounded-r-lg" />
       
      <div className="mb-6 opacity-30 relative z-10">
        <svg  width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
        </svg>
      </div>
      <p className="font-serif text-xl text-ink opacity-80 italic max-w-xs mx-auto mb-2 relative z-10">
        — End of this chapter, but not the story —
      </p>
      <div className="w-12 h-0.5 bg-ink opacity-20 mx-auto rounded-full relative z-10"></div>
    </div>
  );
}

// Helper var for mock data (temporary until Recipe interface has ingredients/steps)
const pageNumber = 0; 
