import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};

export default ThemeToggle;