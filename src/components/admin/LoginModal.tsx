import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LoginModalProps {
  onLogin: (username: string, password: string) => void;
  onClose: () => void;
  error?: string;
}

function LoginModal({ onLogin, onClose, error }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-full max-w-md relative text-gray-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition text-gray-600 dark:text-gray-400"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-6">Connexion Administrateur</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 dark:focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 dark:focus:border-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;