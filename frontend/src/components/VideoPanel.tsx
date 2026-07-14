interface VideoPanelProps {
  frameUrl: string | null;
}

export default function VideoPanel({ frameUrl }: VideoPanelProps) {
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      {frameUrl ? (
        <img
          src={frameUrl}
          alt="Видеопоток"
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-neutral-400 text-sm">
          Нет активного видеопотока
        </div>
      )}
    </div>
  );
}