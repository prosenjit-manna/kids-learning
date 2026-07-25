#!/usr/bin/env node

/**
 * Image optimisation script.
 *
 * - Recursively scans the images/ folder for .jpg / .jpeg / .png / .webp files.
 * - Skips any image that already has a companion "<filename>.optimized" marker
 *   file written by a previous run.
 * - Optimises in-place using sharp and writes the marker file so the image is
 *   never processed twice.
 *
 * Usage:  npm run optimize:images
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const sharp = require('sharp');

// ─── Configuration ────────────────────────────────────────────────────────────

const IMAGES_DIR = path.resolve(__dirname, '..', 'images');

const JPEG_OPTIONS = { quality: 60, mozjpeg: true };
const PNG_OPTIONS  = { compressionLevel: 9, adaptiveFiltering: true };
const WEBP_OPTIONS = { quality: 60 };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Walk a directory tree and collect all image files whose extension matches.
 *
 * @param {string}   dir
 * @param {string[]} extensions  e.g. ['.jpg', '.png']
 * @returns {string[]}
 */
function collectFiles(dir, extensions) {
  const results = [];

  function walk(current) {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      console.warn(`[warn] Cannot read directory: ${current}`);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.isFile() &&
        extensions.includes(path.extname(entry.name).toLowerCase())
      ) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results;
}

/**
 * Path of the marker file for a given image path.
 *
 * @param {string} imagePath
 * @returns {string}
 */
function markerPath(imagePath) {
  return imagePath + '.optimized';
}

/**
 * Returns true when the companion marker file exists for this image.
 *
 * @param {string} imagePath
 * @returns {boolean}
 */
function isAlreadyOptimised(imagePath) {
  return fs.existsSync(markerPath(imagePath));
}

/**
 * Write the companion marker file that records when and how the image was
 * optimised so future runs can detect and skip it.
 *
 * @param {string} imagePath
 * @param {object} info
 */
function writeMarker(imagePath, info) {
  fs.writeFileSync(
    markerPath(imagePath),
    JSON.stringify({ optimizedAt: new Date().toISOString(), ...info }, null, 2),
    'utf8',
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const files = collectFiles(IMAGES_DIR, ['.jpg', '.jpeg', '.png', '.webp']);

  console.log(`\n🔍  Found ${files.length} image(s) in ${IMAGES_DIR}\n`);

  let optimised = 0;
  let skipped   = 0;
  let failed    = 0;

  for (const filePath of files) {
    const relativePath = path.relative(process.cwd(), filePath);

    try {
      if (isAlreadyOptimised(filePath)) {
        console.log(`  ⏭  skip     ${relativePath}`);
        skipped++;
        continue;
      }

      const originalSize = fs.statSync(filePath).size;
      const ext          = path.extname(filePath).toLowerCase();
      const pipeline     = sharp(filePath);

      if (ext === '.png') {
        pipeline.png(PNG_OPTIONS);
      } else if (ext === '.webp') {
        pipeline.webp(WEBP_OPTIONS);
      } else {
        // .jpg / .jpeg
        pipeline.jpeg(JPEG_OPTIONS);
      }

      // Write to a temp file first, then atomically replace the original.
      const tmpPath = filePath + '.tmp';
      await pipeline.toFile(tmpPath);
      fs.renameSync(tmpPath, filePath);

      const newSize = fs.statSync(filePath).size;
      const saving  = originalSize > 0
        ? `${Math.round((1 - newSize / originalSize) * 100)}% smaller`
        : 'done';

      writeMarker(filePath, {
        originalSize,
        newSize,
        saving,
        format: ext.replace('.', ''),
      });

      console.log(`  ✅ optimised ${relativePath}  (${saving})`);
      optimised++;
    } catch (err) {
      console.error(`  ❌ failed    ${relativePath}: ${err.message}`);
      failed++;
    }
  }

  console.log(
    `\n✨  Done — optimised: ${optimised}, skipped: ${skipped}, failed: ${failed}\n`,
  );

  if (failed > 0) {
    process.exit(1);
  }
}

main();
