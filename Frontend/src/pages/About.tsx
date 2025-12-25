import { Heart, BookHeart, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12 animate-fade-slide">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-ink">
            About Mom's Recipe Diary
          </h1>
          <p className="text-2xl text-ink text-opacity-80 leading-relaxed">
            A labor of love dedicated to preserving culinary heritage
          </p>
        </div>

        <div className="space-y-12">
          <div className="bg-paper rounded-3xl p-8 md:p-12 shadow-lg animate-fade-slide">
            <div className="flex items-center gap-4 mb-6">
              <Heart className="text-clay" size={40} />
              <h2 className="text-3xl font-serif font-semibold text-ink">
                Our Story
              </h2>
            </div>
            <p className="text-lg text-ink text-opacity-80 leading-relaxed mb-4">
              Every family has those special recipes that bring everyone together. The
              ones that remind you of Sunday dinners, festival celebrations, and the
              warmth of home. But too often, these precious recipes fade with time,
              written on aging recipe cards or passed down through fragmented memories.
            </p>
            <p className="text-lg text-ink text-opacity-80 leading-relaxed">
              Mom's Recipe Diary was created to preserve these culinary treasures and the
              stories behind them. More than just ingredients and instructions, each
              recipe carries memories, love, and tradition that deserve to be cherished
              for generations.
            </p>
          </div>

          <div className="bg-paper rounded-3xl p-8 md:p-12 shadow-lg animate-fade-slide">
            <div className="flex items-center gap-4 mb-6">
              <BookHeart className="text-clay" size={40} />
              <h2 className="text-3xl font-serif font-semibold text-ink">
                Our Mission
              </h2>
            </div>
            <p className="text-lg text-ink text-opacity-80 leading-relaxed">
              We believe that recipes are more than just cooking instructions. They're
              stories, memories, and connections across generations. Our mission is to
              provide a beautiful, intuitive space where you can preserve your family's
              culinary heritage with the care and respect it deserves.
            </p>
          </div>

          <div className="bg-paper rounded-3xl p-8 md:p-12 shadow-lg animate-fade-slide">
            <div className="flex items-center gap-4 mb-6">
              <Users className="text-clay" size={40} />
              <h2 className="text-3xl font-serif font-semibold text-ink">
                Join Our Community
              </h2>
            </div>
            <p className="text-lg text-ink text-opacity-80 leading-relaxed">
              Start preserving your family recipes today. Share the dishes that define
              your heritage, document the stories that make them special, and create a
              lasting legacy for future generations to cherish and continue.
            </p>
          </div>

          <div className="paper-texture rounded-3xl p-8 md:p-12 shadow-lg">
            <blockquote className="handwritten text-3xl text-ink text-center leading-relaxed">
              "The fondest memories are made when gathered around the table."
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
