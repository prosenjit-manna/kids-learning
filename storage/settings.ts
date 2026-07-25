import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'kids-learning-settings' });

// ─── Keys ─────────────────────────────────────────────────────────────────────
export const SETTINGS_KEYS = {
  TTS_SPEED: 'tts_speed',
} as const;

// ─── Defaults ─────────────────────────────────────────────────────────────────
export const DEFAULTS = {
  TTS_SPEED: 0.85, // range: 0.5 (slow) → 1.5 (fast), default mid-slow for kids
} as const;

// ─── Typed helpers ────────────────────────────────────────────────────────────
export function getTtsSpeed(): number {
  const val = storage.getNumber(SETTINGS_KEYS.TTS_SPEED);
  return val !== undefined ? val : DEFAULTS.TTS_SPEED;
}

export function setTtsSpeed(speed: number): void {
  storage.set(SETTINGS_KEYS.TTS_SPEED, speed);
}
