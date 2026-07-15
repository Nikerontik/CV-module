import { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import VideoPanel from './components/VideoPanel';
import ControlsBar from './components/ControlsBar';
import EventsList from './components/EventsList';
import StatusMetrics from './components/StatusMetrics';
import type { DetectionEvent, StatusInfo } from './types';
import { getStatus, getEvents, startProcessing, stopProcessing, getLatestFrameUrl } from './api';
import SourceSelector from './components/SourceSelector';

function App() {
  const [threshold, setThreshold] = useState(0.5);
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [status, setStatus] = useState<StatusInfo | null>(null);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [statusData, eventsData] = await Promise.all([getStatus(), getEvents()]);
      setStatus(statusData);
      setEvents(eventsData);
      if (statusData.state === 'running') {
  setFrameUrl(getLatestFrameUrl());
} else {
  setFrameUrl(null);
}
    } catch {
      setStatus((prev) => (prev ? { ...prev, state: 'error' } : { state: 'error', source: '', fps: 0, latency_ms: 0 }));
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleStart = async () => {
    await startProcessing();
    refresh();
  };

  const handleStop = async () => {
    await stopProcessing();
    refresh();
  };

  return (
    <div className="min-h-[100dvh] bg-neutral-50 dark:bg-surface-dark transition-colors">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <StatusMetrics status={status} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <SourceSelector disabled={status?.state === 'running'} />
            <VideoPanel frameUrl={frameUrl} />
            <ControlsBar
              running={status?.state === 'running'}
              onStart={handleStart}
              onStop={handleStop}
              threshold={threshold}
              onThresholdChange={setThreshold}
            />
          </div>

          <EventsList events={events} />
        </div>
      </main>
    </div>
  );
}

export default App;