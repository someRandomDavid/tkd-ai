# Trainer Images

This directory contains profile photos for trainers/instructors.

## Image Requirements

- **Format**: JPEG (primary) + WebP (optimized)
- **Dimensions**: 300x300px (square aspect ratio)
- **File Size**: <50KB per image (optimized for web)
- **Naming**: Use trainer ID from trainers.json (e.g., `meister-kim.jpg`, `meister-kim.webp`)

## Placeholder Images

Currently using `placeholder-instructor.jpg` and `placeholder-instructor.webp` as temporary images.

Replace with actual trainer photos as they become available.

## Adding New Trainer Photos

1. Crop/resize image to 300x300px
2. Save as JPEG (<50KB): `trainer-id.jpg`
3. Convert to WebP for better compression: `trainer-id.webp`
4. Update trainer's `photoUrl` and `photoWebP` in `trainers.json`
