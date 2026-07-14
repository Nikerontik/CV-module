import { Play, Stop } from '@phosphor-icons/react';

interface ControlsBarProps {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
  threshold: number;
  onThresholdChange: (value: number) => void;
}

export default function ControlsBar({
  running,
  onStart,
  onStop,
  threshold,
  onThresholdChange,
}: ControlsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-neutral-200 dark:border-neutral-800">
      <button
        onClick={onStart}
        disabled={running}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-600 active:scale-95 transition-all"
      >
        <Play size={20} weight="bold" />
        Старт
      </button>

      <button
        onClick={onStop}
        disabled={!running}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-300 dark:hover:bg-neutral-600 active:scale-95 transition-all"
      >
        <Stop size={20} weight="bold" />
        Стоп
      </button>

      <div className="flex items-center gap-3 ml-auto min-w-[220px]">
        <label className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
          Порог confidence: {threshold.toFixed(2)}
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={threshold}
          onChange={(e) => onThresholdChange(Number(e.target.value))}
          className="w-full accent-brand-500"
        />
      </div>
    </div>
  );
}