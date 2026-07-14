import type { DetectionEvent } from '../types';

interface VideoPanelProps {
  frameUrl: string | null;
  detections: DetectionEvent[];
  frameWidth: number;
  frameHeight: number;
}

const severityColor: Record<string, string> = {
  low: '#6fca2b',
  medium: '#d9a300',
  high: '#e0433f',
};

export default function VideoPanel({
  frameUrl,
  detections,
  frameWidth,
  frameHeight,
}: VideoPanelProps) {
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

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${frameWidth} ${frameHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {detections.map((d) => (
          <g key={d.id}>
            <rect
              x={d.bbox.x}
              y={d.bbox.y}
              width={d.bbox.width}
              height={d.bbox.height}
              fill="none"
              stroke={severityColor[d.severity] ?? '#6fca2b'}
              strokeWidth={3}
              rx={4}
            />
            <text
              x={d.bbox.x}
              y={d.bbox.y > 20 ? d.bbox.y - 6 : d.bbox.y + 16}
              fill={severityColor[d.severity] ?? '#6fca2b'}
              fontSize="16"
              fontWeight="600"
            >
              {`${d.object_class} ${(d.confidence * 100).toFixed(0)}%`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}