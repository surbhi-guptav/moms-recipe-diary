import { useState, FormEvent } from 'react';
import API from '../lib/api';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await API.post('/auth/register', { name, email, password });
      onRegisterSuccess();
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment">
      <form onSubmit={handleSubmit} className="bg-paper p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-serif mb-6 text-center text-ink">Register</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded-lg"
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 border rounded-lg"
        />

        <button className="w-full bg-clay text-parchment py-3 rounded-full">
          Register
        </button>
      </form>
    </div>
  );
}
