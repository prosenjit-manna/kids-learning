import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { useTTS } from '../hooks/useTTS';
import { usePexelsImage } from '../hooks/usePexelsImage';
import { localImageMap } from '../images/localImageMap';

// ─── Data imports ────────────────────────────────────────────────────────────
import alphabetsData from '../data/alphabets.json';
import numbersData from '../data/numbers.json';
import colorsData from '../data/colors.json';
import fruitsData from '../data/fruits.json';
import vegetablesData from '../data/vegetables.json';
import animalsData from '../data/animals.json';
import toysData from '../data/toys.json';

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = NativeStackScreenProps<RootStackParamList, 'CategoryDetails'>;

interface CardItem {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  fact: string;
  color: string;
  /** Path key into localImageMap, e.g. "animals/lion.png" */
  localImage?: string;
}

// ─── Data normaliser ─────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Alphabets: '#FF6B6B',
  Numbers: '#FFD93D',
  Colors: '#6BCB77',
  Fruits: '#FF922B',
  Vegetables: '#74C0FC',
  Animals: '#DA77F2',
  Toys: '#F06595',
};

function normaliseData(category: string): CardItem[] {
  const baseColor = CATEGORY_COLORS[category] ?? '#888';

  switch (category) {
    case 'Alphabets':
      return (alphabetsData as any[]).map((d, i) => ({
        id: String(i),
        emoji: d.emoji,
        title: `${d.letter}  —  ${d.word}`,
        subtitle: d.letter,
        fact: d.fact,
        color: baseColor,
        localImage: d.localImage,
      }));

    case 'Numbers':
      return (numbersData as any[]).map((d, i) => ({
        id: String(i),
        emoji: d.emoji,
        title: `${d.number}  —  ${d.word}`,
        subtitle: d.number,
        fact: d.fact,
        color: baseColor,
        localImage: d.localImage,
      }));

    case 'Colors':
      return (colorsData as any[]).map((d, i) => ({
        id: String(i),
        emoji: d.emoji,
        title: d.name,
        subtitle: d.hex,
        fact: d.fact,
        color: d.hex,
        localImage: d.localImage,
      }));

    case 'Fruits':
      return (fruitsData as any[]).map((d, i) => ({
        id: String(i),
        emoji: d.emoji,
        title: d.name,
        subtitle: '',
        fact: d.fact,
        color: d.color,
        localImage: d.localImage,
      }));

    case 'Vegetables':
      return (vegetablesData as any[]).map((d, i) => ({
        id: String(i),
        emoji: d.emoji,
        title: d.name,
        subtitle: '',
        fact: d.fact,
        color: d.color,
        localImage: d.localImage,
      }));

    case 'Animals':
      return (animalsData as any[]).map((d, i) => ({
        id: String(i),
        emoji: d.emoji,
        title: d.name,
        subtitle: '',
        fact: d.fact,
        color: d.color,
        localImage: d.localImage,
      }));

    case 'Toys':
      return (toysData as any[]).map((d, i) => ({
        id: String(i),
        emoji: d.emoji,
        title: d.name,
        subtitle: '',
        fact: d.fact,
        color: d.color,
        localImage: d.localImage,
      }));

    default:
      return [];
  }
}

// ─── Card component ───────────────────────────────────────────────────────────
function SwipeCard({
  item,
  cardWidth,
  cardHeight,
  onTap,
}: Readonly<{
  item: CardItem;
  cardWidth: number;
  cardHeight: number;
  onTap: () => void;
}>) {
  // Resolve local image from the map (undefined when not registered)
  const localSource = item.localImage ? localImageMap[item.localImage] : undefined;

  // Only fetch from Pexels when no local image is available
  const searchQuery = `${item.title.replace(/\s*—\s*.*/g, '').trim()} for kids`;
  const photoUrl = usePexelsImage(localSource ? '' : searchQuery);

  return (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      {/* Tappable colour top — replays speech */}
      <TouchableOpacity
        style={[styles.cardTop, { backgroundColor: item.color }]}
        activeOpacity={0.8}
        onPress={onTap}>
        {localSource ? (
          <Image
            source={localSource}
            style={styles.cardPhoto}
            resizeMode="cover"
          />
        ) : photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={styles.cardPhoto}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
        )}
        <Text style={styles.tapHint}>tap to hear</Text>
      </TouchableOpacity>

      {/* Dark bottom — fixed content area, always readable */}
      <View style={styles.cardBottom}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.subtitle ? (
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        ) : null}
        <View style={styles.divider} />
        <Text style={styles.factLabel}>Did you know?</Text>
        <Text style={styles.factText}>{item.fact}</Text>
      </View>
    </View>
  );
}

// ─── Dot indicator ────────────────────────────────────────────────────────────
function DotIndicator({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function buildSpeechText(item: CardItem): string {
  // Strip the em-dash separator used in Alphabets/Numbers titles
  const clean = item.title.replace(/\s*—\s*/g, ', ');
  const parts = [clean];
  if (item.fact) {
    parts.push(item.fact);
  }
  return parts.join('. ');
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CategoryDetailsScreen({ route, navigation }: Props) {
  const { category } = route.params;
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const items = normaliseData(category);
  const { speak, stop, speakState } = useTTS();

  // Header ~64px + counter ~30px + dots ~48px + nav ~72px + safeArea
  const RESERVED = insets.top + 64 + 30 + 48 + 72 + insets.bottom;
  const CARD_WIDTH = screenWidth - 48;
  const CARD_HEIGHT = screenHeight - RESERVED;

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<CardItem>>(null);

  // Auto-speak whenever the active card changes
  useEffect(() => {
    if (items[activeIndex]) {
      speak(buildSpeechText(items[activeIndex]));
    }
    // stop on unmount
    return () => { stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goNext = () => {
    if (activeIndex < items.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: activeIndex - 1, animated: true });
    }
  };

  const handleReplay = useCallback(() => {
    if (items[activeIndex]) {
      speak(buildSpeechText(items[activeIndex]));
    }
  }, [activeIndex, items, speak]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Counter */}
      <Text style={styles.counter}>
        {activeIndex + 1} / {items.length}
      </Text>

      {/* Swipeable cards */}
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 24}
        snapToAlignment="center"
        decelerationRate="fast"
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
            <SwipeCard
              item={item}
              cardWidth={CARD_WIDTH}
              cardHeight={CARD_HEIGHT}
              onTap={() => speak(buildSpeechText(item))}
            />
          </View>
        )}
      />

      {/* Dot indicator */}
      <DotIndicator total={items.length} activeIndex={activeIndex} />

      {/* Nav row: Prev · Play/Speaking · Next */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, activeIndex === 0 && styles.navBtnDisabled]}
          onPress={goPrev}
          disabled={activeIndex === 0}>
          <Text style={styles.navBtnText}>◀  Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playBtn} onPress={handleReplay}>
          <Text style={styles.playBtnIcon}>
            {speakState === 'speaking' ? '🔊' : '🔈'}
          </Text>
          <Text style={styles.playBtnText}>
            {speakState === 'speaking' ? 'Speaking…' : 'Replay'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, activeIndex === items.length - 1 && styles.navBtnDisabled]}
          onPress={goNext}
          disabled={activeIndex === items.length - 1}>
          <Text style={styles.navBtnText}>Next  ▶</Text>
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
  counter: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    fontWeight: '600',
  },
  flatList: {
    flexGrow: 0,
  },
  flatListContent: {
    paddingHorizontal: 24,
  },
  cardWrapper: {
    marginRight: 24,
  },
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  cardTop: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: {
    position: 'absolute',
    bottom: 10,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.25)',
    letterSpacing: 0.5,
  },
  cardEmoji: {
    fontSize: 120,
  },
  cardPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  cardBottom: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ABABAB',
    textAlign: 'center',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#3A3A3C',
    marginVertical: 16,
  },
  factLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD93D',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  factText: {
    fontSize: 16,
    color: '#E5E5EA',
    fontWeight: '500',
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#555',
    width: 20,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  navBtn: {
    backgroundColor: '#333',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navBtnDisabled: {
    backgroundColor: '#CCC',
  },
  navBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  playBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD93D',
    borderRadius: 40,
    width: 72,
    height: 72,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playBtnIcon: {
    fontSize: 28,
  },
  playBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
    marginTop: 2,
  },
});
