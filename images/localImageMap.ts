/**
 * images/localImageMap.ts
 *
 * Central registry of all local images used in the app.
 * React Native requires static `require()` paths at build time, so every
 * image must be listed here explicitly.
 *
 * Key format: the same string stored in the JSON data's `localImage` field
 * (relative to the `images/` directory, e.g. "home/alphabets.png").
 *
 * Usage:
 *   import { localImageMap } from '../images/localImageMap';
 *   const source = localImageMap['home/alphabets.png'];  // ImageSourcePropType | undefined
 */

import { ImageSourcePropType } from 'react-native';

// ─── Home category cards ───────────────────────────────────────────────────────
// Uncomment / add entries as you drop image files into the images/ folders.
// Example:
// 'home/alphabets.png': require('./home/alphabets.png'),

// ─── Alphabet items ────────────────────────────────────────────────────────────
// 'alphabets/apple.png': require('./alphabets/apple.png'),

// ─── Add further entries below as local images are added to the project ────────

export const localImageMap: Record<string, ImageSourcePropType> = {
  // home images
  // 'home/alphabets.png': require('./home/alphabets.png'),
  // 'home/numbers.png':   require('./home/numbers.png'),
  // 'home/colors.png':    require('./home/colors.png'),
  // 'home/fruits.png':    require('./home/fruits.png'),
  // 'home/vegetables.png':require('./home/vegetables.png'),
  // 'home/animals.png':   require('./home/animals.png'),
  // 'home/toys.png':      require('./home/toys.png'),

  // alphabets images (add per-item as files are available)
  // 'alphabets/apple.png':    require('./alphabets/apple.png'),
  // 'alphabets/ball.png':     require('./alphabets/ball.png'),
  // ... etc.

  'animals/lion.jpg':     require('./animals/lion.jpg'),
  'animals/elephant.jpg':     require('./animals/elephant.jpg'),
  'animals/penguin.jpg':     require('./animals/penguin.jpg'),
  'animals/giraffe.jpg':     require('./animals/giraffe.jpg'),
  
  
};
