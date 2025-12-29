import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../lib/api';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user?.id || res.data.user?._id);

      onLoginSuccess();
      navigate('/my-recipes'); // 👈 redirect after login
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment p-4">
      <form onSubmit={handleSubmit} className="bg-paper p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-golden/20">
        <h1 className="text-3xl font-serif mb-6 text-center text-ink">Login</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded-lg bg-parchment focus:ring-2 focus:ring-clay focus:border-transparent outline-none transition-all"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 border rounded-lg bg-parchment focus:ring-2 focus:ring-clay focus:border-transparent outline-none transition-all"
        />

        <button className="w-full bg-clay text-parchment py-3 rounded-full font-bold hover:bg-opacity-90 transition-all transform hover:scale-[1.02]">
          Login
        </button>

        <p className="mt-4 text-center text-ink opacity-70">
          Don't have an account? <Link to="/register" className="text-clay font-bold hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}
