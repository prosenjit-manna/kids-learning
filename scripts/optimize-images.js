#!/usr/bin/env node

/**
 * Image optimisation script.
 *
 * - Recursively scans the images/ folder for .jpg / .jpeg / .png / .webp files.
 * - Skips any image whose EXIF / XMP metadata already contains the
 *   "optimized:kidslearning" marker written by a previous run.
 * - Optimises in-place using sharp and embeds the marker so the file is
 *   never processed twice.
 *
 * Usage:  npm run optimize:images
 */

'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ─── Configuration ──────────────────────────────────────────────────────────

const IMAGES_DIR = path.resolve(__dirname, '..', 'images');

/** Marker embedded in the image description to detect already-optimised files. */
const OPTIMISED_MARKER = 'optimized:kidslearning';

const JPEG_OPTIONS = { quality: 80, mozjpeg: true };
const PNG_OPTIONS  = { compressionLevel: 9, adaptiveFiltering: true };
const WEBP_OPTIONS = { quality: 80 };

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Walk a directory tree and yield all files whose extension matches the
 * provided set (lower-cased).
 *
 * @param {string}   dir
 * @param {string[]} extensions – e.g. ['.jpg', '.png']
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
      } else if (entry.isFile() && extensions.includes(path.extname(entry.name).toLowerCase())) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results;
}

/**
 * Returns true when the image metadata already contains the optimised marker.
 *
 * @param {import('sharp').Metadata} metadata
 * @returns {boolean}
 */
function isAlreadyOptimised(metadata) {
  const comment = (metadata.exif
    ? metadata.exif.toString('utf8')
    : '') + (metadata.xmp ? metadata.xmp.toString('utf8') : '');

  return comment.includes(OPTIMISED_MARKER);
}

/**
 * Build a minimal XMP packet containing the optimised marker so future runs
 * can detect and skip this file.
 *
 * @returns {Buffer}
 */
function buildXmpMarker() {
  const xmp =
    '<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>' +
    '<x:xmpmeta xmlns:x="adobe:ns:meta/">' +
    '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
    '<rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/">' +
    `<dc:description><rdf:Alt><rdf:li xml:lang="x-default">${OPTIMISED_MARKER}</rdf:li></rdf:Alt></dc:description>` +
    '</rdf:Description>' +
    '</rdf:RDF>' +
    '</x:xmpmeta>' +
    '<?xpacket end="w"?>';

  return Buffer.from(xmp, 'utf8');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const files = collectFiles(IMAGES_DIR, ['.jpg', '.jpeg', '.png', '.webp']);

  console.log(`\n🔍  Found ${files.length} image(s) in ${IMAGES_DIR}\n`);

  let optimised = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of files) {
    const relativePath = path.relative(process.cwd(), filePath);

    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      if (isAlreadyOptimised(metadata)) {
        console.log(`  ⏭  skip    ${relativePath}`);
        skipped++;
        continue;
      }

      const xmpBuffer = buildXmpMarker();
      const ext = path.extname(filePath).toLowerCase();

      const pipeline = sharp(filePath).withMetadata({ xmp: xmpBuffer });

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

      const originalSize = metadata.size ?? 0;
      const newSize      = fs.statSync(filePath).size;
      const saving       = originalSize > 0
        ? `${Math.round((1 - newSize / originalSize) * 100)}% smaller`
        : 'done';

      console.log(`  ✅ optimise ${relativePath}  (${saving})`);
      optimised++;
    } catch (err) {
      console.error(`  ❌ failed   ${relativePath}: ${err.message}`);
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
