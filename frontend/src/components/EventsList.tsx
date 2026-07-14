import type { DetectionEvent } from '../types';
import { Warning, WarningOctagon, Info } from '@phosphor-icons/react';

interface EventsListProps {
  events: DetectionEvent[];
}

const severityConfig: Record<
  string,
  { icon: typeof Info; color: string; bg: string }
> = {
  low: { icon: Info, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-50 dark:bg-neutral-800' },
  medium: { icon: Warning, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-neutral-800' },
  high: { icon: WarningOctagon, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-neutral-800' },
};

function formatTime(ts: string) {
  const date = new Date(ts);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function EventsList({ events }: EventsListProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="font-semibold text-neutral-900 dark:text-white">
          Журнал событий
        </h2>
      </div>

      {events.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-neutral-400">
          Событий пока нет. Запустите обработку, чтобы увидеть детекции.
        </div>
      ) : (
        <div className="max-h-[420px] overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
          {events.map((event) => {
            const cfg = severityConfig[event.severity] ?? severityConfig.low;
            const Icon = cfg.icon;
            return (
              <div key={event.id} className={`flex items-center gap-3 px-4 py-3 ${cfg.bg}`}>
                <Icon size={22} weight="bold" className={cfg.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {event.object_class}
                    <span className="text-neutral-400 dark:text-neutral-500"> · {(event.confidence * 100).toFixed(0)}%</span>
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {event.event_type}
                  </p>
                </div>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
                  {formatTime(event.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}