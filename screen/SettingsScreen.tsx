import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import {
  getTtsSpeed,
  setTtsSpeed,
  DEFAULTS,
  getReadInfoEnabled,
  setReadInfoEnabled,
} from '../storage/settings';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const MIN_SPEED = 0.5;
const MAX_SPEED = 1.5;
const STEP = 0.05;

function speedLabel(value: number): string {
  if (value <= 0.6) return '🐢 Very Slow';
  if (value <= 0.85) return '🚶 Slow';
  if (value <= 1.05) return '🏃 Normal';
  if (value <= 1.25) return '🚴 Fast';
  return '🚀 Very Fast';
}

// ─── Screen ──────────────────────────────────────────────────────────────────────
export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [speed, setSpeed] = useState<number>(getTtsSpeed());
  const [readInfoEnabled, setReadInfoEnabledState] = useState<boolean>(getReadInfoEnabled());

  const handleChange = (value: number) => {
    const rounded = Math.round(value / STEP) * STEP;
    setSpeed(rounded);
    setTtsSpeed(rounded);
  };

  const handleReset = () => {
    setSpeed(DEFAULTS.TTS_SPEED);
    setTtsSpeed(DEFAULTS.TTS_SPEED);
    setReadInfoEnabledState(DEFAULTS.READ_INFO_ENABLED);
    setReadInfoEnabled(DEFAULTS.READ_INFO_ENABLED);
  };

  const handleReadInfoToggle = (value: boolean) => {
    setReadInfoEnabledState(value);
    setReadInfoEnabled(value);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.content}>
        {/* TTS speed section */}
        <Text style={styles.sectionTitle}>🔊  Text to Speech Speed</Text>
        <Text style={styles.sectionSubtitle}>
          Controls how fast the app reads words aloud
        </Text>

        <View style={styles.card}>
          {/* Current speed badge */}
          <View style={styles.badgeRow}>
            <Text style={styles.badgeLabel}>{speedLabel(speed)}</Text>
            <Text style={styles.badgeValue}>{speed.toFixed(2)}x</Text>
          </View>

          {/* Slider */}
          <Slider
            style={styles.slider}
            minimumValue={MIN_SPEED}
            maximumValue={MAX_SPEED}
            step={STEP}
            value={speed}
            onValueChange={handleChange}
            minimumTrackTintColor="#FF922B"
            maximumTrackTintColor="#E5E5EA"
            thumbTintColor="#FF922B"
          />

          {/* Range labels */}
          <View style={styles.rangeRow}>
            <Text style={styles.rangeText}>🐢 0.5x</Text>
            <Text style={styles.rangeText}>🚀 1.5x</Text>
          </View>
        </View>

        {/* Read Info section */}
        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>📖  Read Info</Text>
        <Text style={styles.sectionSubtitle}>
          When enabled, the app reads the full description aloud; when off, only the title is spoken
        </Text>

        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {readInfoEnabled ? '✅ Read title & info' : '🔤 Read title only'}
            </Text>
            <Switch
              value={readInfoEnabled}
              onValueChange={handleReadInfoToggle}
              trackColor={{ false: '#E5E5EA', true: '#FF922B' }}
              thumbColor={readInfoEnabled ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetBtnText}>Reset to Default</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBF0',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    alignItems: 'center',
  },
  backText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badgeLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF922B',
  },
  badgeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeText: {
    fontSize: 12,
    color: '#888',
  },
  sectionSpacing: {
    marginTop: 32,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 12,
  },
  resetBtn: {
    marginTop: 28,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#CCC',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
});
