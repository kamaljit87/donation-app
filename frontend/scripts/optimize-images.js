const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '../public/images/gallery');
const files = fs.readdirSync(galleryDir);
const jpgFiles = files.filter(f => f.endsWith('.JPG') || f.endsWith('.jpg'));

console.log(`Found ${jpgFiles.length} images in gallery`);
console.log('Images are ready for lazy loading optimization');

// Create an image manifest for the gallery
const manifest = jpgFiles.map((file, index) => ({
  id: index + 1,
  filename: file,
  path: `/images/gallery/${file}`,
  alt: `Srila Prabhupada Annakshetra Prasadam Distribution ${index + 1}`
}));

fs.writeFileSync(
  path.join(__dirname, '../src/data/gallery-manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('Gallery manifest created successfully');
