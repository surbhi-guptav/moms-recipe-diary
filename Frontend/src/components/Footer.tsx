import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-parchment border-t border-golden mt-20 animate-fade-in">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-ink">

        <div>
          <h3 className="text-2xl font-serif font-bold mb-2">
            Mom’s Recipe Diary
          </h3>
          <p className="text-sm opacity-80">
            Preserving her recipes, preserving our memories.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-clay transition-colors">Home</Link></li>
            <li><Link to="/recipes" className="hover:text-clay transition-colors">Recipes</Link></li>
            <li><Link to="/add" className="hover:text-clay transition-colors">Add Recipe</Link></li>
            <li><Link to="/about" className="hover:text-clay transition-colors">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Credits</h4>
          <p className="text-sm">
            Made with ❤️ by <span className="font-medium">Surbhi</span><br />
            Inspired by my mom’s handwritten diary.
          </p>
        </div>

      </div>

      <div className="text-center py-4 text-xs text-ink opacity-60 border-t border-golden">
        © {new Date().getFullYear()} Mom’s Recipe Diary. All rights reserved.
      </div>
    </footer>
  );
}
