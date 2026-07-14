import type { StatusInfo } from '../types';
import { Gauge, Clock, Pulse } from '@phosphor-icons/react';
interface StatusMetricsProps {
  status: StatusInfo | null;
}

const stateLabel: Record<string, string> = {
  running: 'Работает',
  stopped: 'Остановлено',
  error: 'Ошибка',
};

const stateColor: Record<string, string> = {
  running: 'text-brand-600 dark:text-brand-400',
  stopped: 'text-neutral-500 dark:text-neutral-400',
  error: 'text-red-600 dark:text-red-400',
};

export default function StatusMetrics({ status }: StatusMetricsProps) {
  const state = status?.state ?? 'stopped';

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-neutral-200 dark:border-neutral-800">
        <Pulse size={24} weight="bold" className={stateColor[state]} />
        <span className={`text-sm font-semibold ${stateColor[state]}`}>
          {stateLabel[state]}
        </span>
        <span className="text-xs text-neutral-400">Статус</span>
      </div>

      <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-neutral-200 dark:border-neutral-800">
        <Gauge size={24} weight="bold" className="text-brand-600 dark:text-brand-400" />
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
          {status ? status.fps.toFixed(1) : '—'}
        </span>
        <span className="text-xs text-neutral-400">FPS</span>
      </div>

      <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-neutral-200 dark:border-neutral-800">
        <Clock size={24} weight="bold" className="text-brand-600 dark:text-brand-400" />
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
          {status ? `${status.latency_ms.toFixed(0)} мс` : '—'}
        </span>
        <span className="text-xs text-neutral-400">Latency</span>
      </div>
    </div>
  );
}