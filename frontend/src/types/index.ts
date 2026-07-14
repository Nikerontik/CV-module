export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectionEvent {
  id: string;
  timestamp: string;
  event_type: string;
  object_class: string;
  confidence: number;
  bbox: BBox;
  frame_path?: string;
  camera_id?: string;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'seen';
}

export interface StatusInfo {
  state: 'running' | 'stopped' | 'error';
  source: string;
  fps: number;
  latency_ms: number;
}