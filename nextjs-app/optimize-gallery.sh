#!/bin/bash

# Image Optimization Script for Gallery
# Optimizes all gallery images to reduce file size

echo "Gallery Image Optimizer"
echo "======================"

GALLERY_DIR="public/images/gallery"

if [ ! -d "$GALLERY_DIR" ]; then
  echo "Error: Gallery directory not found at $GALLERY_DIR"
  exit 1
fi

# Count images
TOTAL=$(find "$GALLERY_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | wc -l)
echo "Found $TOTAL images to optimize"
echo ""

# Check if imagemagick is installed
if ! command -v convert &> /dev/null; then
  echo "ImageMagick not found. Installing..."
  sudo apt-get update && sudo apt-get install -y imagemagick
fi

echo "Optimizing images..."
echo "This will:"
echo "  - Resize to max 1920x1080"
echo "  - Reduce quality to 85%"
echo "  - Convert to progressive JPEG"
echo ""

COUNT=0
for img in "$GALLERY_DIR"/*.JPG "$GALLERY_DIR"/*.jpg "$GALLERY_DIR"/*.png; do
  if [ -f "$img" ]; then
    COUNT=$((COUNT+1))
    echo "[$COUNT/$TOTAL] Optimizing: $(basename "$img")"
    
    # Create backup
    cp "$img" "$img.backup"
    
    # Optimize
    convert "$img" \
      -resize '1920x1080>' \
      -quality 85 \
      -interlace Plane \
      "$img"
    
    # Show size reduction
    BEFORE=$(du -h "$img.backup" | cut -f1)
    AFTER=$(du -h "$img" | cut -f1)
    echo "  Size: $BEFORE → $AFTER"
  fi
done

echo ""
echo "Optimization complete!"
echo ""
echo "Before: $(du -sh "$GALLERY_DIR".backup 2>/dev/null | cut -f1 || echo 'N/A')"
echo "After:  $(du -sh "$GALLERY_DIR" | cut -f1)"
echo ""
echo "Backups saved with .backup extension"
echo "If satisfied, remove backups with: rm $GALLERY_DIR/*.backup"
