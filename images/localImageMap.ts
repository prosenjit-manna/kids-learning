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

  // ─── Animal images ─────────────────────────────────────────────────────────
  'animals/bear.jpg':        require('./animals/bear.jpg'),
  'animals/bison.jpg':       require('./animals/bison.jpg'),
  'animals/buffalo.jpg':     require('./animals/buffalo.jpg'),
  'animals/butterfly.jpg':   require('./animals/butterfly.jpg'),
  'animals/camel.jpg':       require('./animals/camel.jpg'),
  'animals/cat.jpg':         require('./animals/cat.jpg'),
  'animals/chameleon.jpg':   require('./animals/chameleon.jpg'),
  'animals/cheetah.jpg':     require('./animals/cheetah.jpg'),
  'animals/chicken.jpg':     require('./animals/chicken.jpg'),
  'animals/chimpanzee.jpg':  require('./animals/chimpanzee.jpg'),
  'animals/chinkara.jpg':    require('./animals/chinkara.jpg'),
  'animals/cobra.jpg':       require('./animals/cobra.jpg'),
  'animals/cow.jpg':         require('./animals/cow.jpg'),
  'animals/crocodile.jpg':   require('./animals/crocodile.jpg'),
  'animals/deer.jpg':        require('./animals/deer.jpg'),
  'animals/dog.jpg':         require('./animals/dog.jpg'),
  'animals/dolphin.jpg':     require('./animals/dolphin.jpg'),
  'animals/donkey.jpg':      require('./animals/donkey.jpg'),
  'animals/duck.jpg':        require('./animals/duck.jpg'),
  'animals/eel.jpg':         require('./animals/eel.jpg'),
  'animals/elephant.jpg':    require('./animals/elephant.jpg'),
  'animals/fox.jpg':         require('./animals/fox.jpg'),
  'animals/frog.jpg':        require('./animals/frog.jpg'),
  'animals/gharial.jpg':     require('./animals/gharial.jpg'),
  'animals/giraffe.jpg':     require('./animals/giraffe.jpg'),
  'animals/goat.jpg':        require('./animals/goat.jpg'),
  'animals/gorilla.jpg':     require('./animals/gorilla.jpg'),
  'animals/hamster.jpg':     require('./animals/hamster.jpg'),
  'animals/hippopotamus.jpg':require('./animals/hippopotamus.jpg'),
  'animals/horse.jpg':       require('./animals/horse.jpg'),
  'animals/hyena.jpg':       require('./animals/hyena.jpg'),
  'animals/jaguar.jpg':      require('./animals/jaguar.jpg'),
  'animals/kangaroo.jpg':    require('./animals/kangaroo.jpg'),
  'animals/koala.jpg':       require('./animals/koala.jpg'),
  'animals/lion.jpg':        require('./animals/lion.jpg'),
  'animals/llama.jpg':       require('./animals/llama.jpg'),
  'animals/monkey.jpg':      require('./animals/monkey.jpg'),
  'animals/octopus.jpg':     require('./animals/octopus.jpg'),
  'animals/panda.jpg':       require('./animals/panda.jpg'),
  'animals/penguin.jpg':     require('./animals/penguin.jpg'),
  'animals/pig.jpg':         require('./animals/pig.jpg'),
  'animals/rabbit.jpg':      require('./animals/rabbit.jpg'),
  'animals/red-panda.jpg':   require('./animals/red-panda.jpg'),
  'animals/rhinoceros.jpg':  require('./animals/rhinoceros.jpg'),
  'animals/seal.jpg':        require('./animals/seal.jpg'),
  'animals/shark.jpg':       require('./animals/shark.jpg'),
  'animals/sheep.jpg':       require('./animals/sheep.jpg'),
  'animals/sloth.jpg':       require('./animals/sloth.jpg'),
  'animals/snow-leopard.jpg':require('./animals/snow-leopard.jpg'),
  'animals/tiger.jpg':       require('./animals/tiger.jpg'),
  'animals/turtle.jpg':      require('./animals/turtle.jpg'),
  'animals/whale.jpg':       require('./animals/whale.jpg'),
  'animals/yak.jpg':         require('./animals/yak.jpg'),
  'animals/zebra.jpg':       require('./animals/zebra.jpg'),
};
