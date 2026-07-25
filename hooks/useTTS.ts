import { useCallback, useEffect, useRef, useState } from 'react';
import Speech from '@mhpdev/react-native-speech';
import { getTtsSpeed } from '../storage/settings';

export type SpeakState = 'idle' | 'speaking';

export function useTTS() {
  const [speakState, setSpeakState] = useState<SpeakState>('idle');
  const configured = useRef(false);

  useEffect(() => {
    if (!configured.current) {
      Speech.configure({
        pitch: 1.1,
        language: 'en-US',
      });
      configured.current = true;
    }

    const subStart   = Speech.onStart(()   => setSpeakState('speaking'));
    const subFinish  = Speech.onFinish(()  => setSpeakState('idle'));
    const subStopped = Speech.onStopped(() => setSpeakState('idle'));

    return () => {
      subStart.remove();
      subFinish.remove();
      subStopped.remove();
      Speech.stop();
    };
  }, []);

  const speak = useCallback((text: string) => {
    Speech.stop();
    // Read speed fresh from storage each time so settings changes
    // apply immediately without needing to restart the screen
    Speech.speak(text, { rate: getTtsSpeed() });
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
  }, []);

  return { speak, stop, speakState };
}
