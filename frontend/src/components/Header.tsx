import ThemeToggle from './ThemeToggle';
import { Eye } from '@phosphor-icons/react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-surface-dark">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500 text-white">
          <Eye size={22} weight="bold" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white leading-tight">
            CV-модуль САТК
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Lichee Module 4A
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}