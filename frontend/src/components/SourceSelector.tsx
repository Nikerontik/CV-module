import { useRef, useState } from 'react';
import { Camera, FileVideo, UploadSimple } from '@phosphor-icons/react';
import { setSource, uploadVideo } from '../api';

interface SourceSelectorProps {
  disabled: boolean;
}

export default function SourceSelector({ disabled }: SourceSelectorProps) {
  const [mode, setMode] = useState<'camera' | 'video'>('camera');
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleModeChange = async (newMode: 'camera' | 'video') => {
    setMode(newMode);
    await setSource(newMode);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFileName(file.name);
    try {
      await uploadVideo(file);
      await setSource('video');
      setMode('video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-neutral-200 dark:border-neutral-800">
      <button
        onClick={() => handleModeChange('camera')}
        disabled={disabled}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-base transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
          mode === 'camera'
            ? 'bg-brand-500 text-white'
            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-white'
        }`}
      >
        <Camera size={20} weight="bold" />
        Камера
      </button>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-base transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
          mode === 'video'
            ? 'bg-brand-500 text-white'
            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-white'
        }`}
      >
        {uploading ? <UploadSimple size={20} weight="bold" className="animate-spin" /> : <FileVideo size={20} weight="bold" />}
        {uploading ? 'Загрузка...' : 'Видеофайл'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4"
        className="hidden"
        onChange={handleFileChange}
      />

      {fileName && (
        <span className="text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
          {fileName}
        </span>
      )}
    </div>
  );
}