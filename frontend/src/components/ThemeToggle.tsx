import { useEffect, useState } from 'react';
import { Sun, Moon } from '@phosphor-icons/react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      aria-label="Переключить тему"
      className="flex items-center justify-center w-11 h-11 rounded-xl border border-brand-200 dark:border-surface-darkCard bg-white dark:bg-surface-darkCard text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-neutral-700 transition-colors active:scale-95"
    >
      {dark ? <Sun size={22} weight="bold" /> : <Moon size={22} weight="bold" />}
    </button>
  );
}