import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'kids-learning-settings' });

// ─── Keys ─────────────────────────────────────────────────────────────────────
export const SETTINGS_KEYS = {
  TTS_SPEED: 'tts_speed',
  READ_INFO_ENABLED: 'read_info_enabled',
} as const;

// ─── Defaults ─────────────────────────────────────────────────────────────────
export const DEFAULTS = {
  TTS_SPEED: 0.85, // range: 0.5 (slow) → 1.5 (fast), default mid-slow for kids
  READ_INFO_ENABLED: true,
} as const;

// ─── Typed helpers ────────────────────────────────────────────────────────────
export function getTtsSpeed(): number {
  const val = storage.getNumber(SETTINGS_KEYS.TTS_SPEED);
  return val !== undefined ? val : DEFAULTS.TTS_SPEED;
}

export function setTtsSpeed(speed: number): void {
  storage.set(SETTINGS_KEYS.TTS_SPEED, speed);
}

export function getReadInfoEnabled(): boolean {
  const val = storage.getBoolean(SETTINGS_KEYS.READ_INFO_ENABLED);
  return val !== undefined ? val : DEFAULTS.READ_INFO_ENABLED;
}

export function setReadInfoEnabled(enabled: boolean): void {
  storage.set(SETTINGS_KEYS.READ_INFO_ENABLED, enabled);
}
