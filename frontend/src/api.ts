import type { DetectionEvent, StatusInfo } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function getStatus(): Promise<StatusInfo> {
  const res = await fetch(`${BASE_URL}/status`);
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
}

export async function getEvents(): Promise<DetectionEvent[]> {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function startProcessing(): Promise<void> {
  const res = await fetch(`${BASE_URL}/start`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start');
}

export async function stopProcessing(): Promise<void> {
  const res = await fetch(`${BASE_URL}/stop`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to stop');
}

export function getLatestFrameUrl(): string {
  return `${BASE_URL}/frame/latest?ts=${Date.now()}`;
}

export async function setSource(source: 'camera' | 'video'): Promise<void> {
  const res = await fetch(`${BASE_URL}/config?source=${source}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to set source');
}

export async function uploadVideo(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Failed to upload video');
}