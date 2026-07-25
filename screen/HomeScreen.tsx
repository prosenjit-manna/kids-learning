import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import homeData from '../data/home.json';

type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type SettingsNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Category {
  title: string;
  image: string;
  color: string;
}

function CategoryCard({ item }: { item: Category }) {
  const navigation = useNavigation<HomeScreenNavProp>();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.color }]}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('CategoryDetails', { category: item.title })
      }>
      <Text style={styles.cardEmoji}>{getCategoryEmoji(item.title)}</Text>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
}

function getCategoryEmoji(title: string): string {
  const map: Record<string, string> = {
    Alphabets: '🔤',
    Numbers: '🔢',
    Colors: '🎨',
    Fruits: '🍎',
    Vegetables: '🥦',
    Animals: '🐾',
    Toys: '🧸',
  };
  return map[title] ?? '📚';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SettingsNavProp>();

  return (
    <View style={styles.container}>
      <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
        <Text style={styles.header}>Let's Learn! 🌟</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={homeData as Category[]}
        keyExtractor={item => item.title}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <CategoryCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  headerWrapper: {
    backgroundColor: '#FFFBF0',
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#333',
    paddingVertical: 14,
    letterSpacing: 0.5,
  },
  settingsBtn: {
    position: 'absolute',
    right: 16,
    bottom: 10,
  },
  settingsIcon: {
    fontSize: 26,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 20,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
