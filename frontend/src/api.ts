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