# Hero Image Optimization Guide

## Current Status
- ✅ `hero_bg.JPG` is present but may be large (3-8 MB typical)
- ⚠️ No optimized versions created yet

## Quick Fix (5 minutes)

### Option 1: TinyPNG (Easiest, No Install)
1. Go to https://tinypng.com/
2. Upload `hero_bg.JPG`
3. Download the compressed version
4. Replace the original file
5. **Expected**: 60-80% size reduction with no visible quality loss

### Option 2: Squoosh (Best Control)
1. Go to https://squoosh.app/
2. Upload `hero_bg.JPG`
3. Choose settings:
   - **Format**: MozJPEG
   - **Quality**: 85
   - **Resize**: Max 1920px width
4. Download and replace

## Better Solution (20 minutes) - Responsive Images

Create multiple sizes so mobile users don't download huge desktop images:

### Using ImageMagick (Command Line)
```bash
# Install ImageMagick first: https://imagemagick.org/

# Generate responsive JPEG sizes
magick hero_bg.JPG -resize 320x -quality 85 hero_bg_320w.jpg
magick hero_bg.JPG -resize 768x -quality 85 hero_bg_768w.jpg  
magick hero_bg.JPG -resize 1024x -quality 85 hero_bg_1024w.jpg
magick hero_bg.JPG -resize 1920x -quality 85 hero_bg_1920w.jpg

# Generate WebP versions (better compression)
magick hero_bg.JPG -resize 320x -quality 80 hero_bg_320w.webp
magick hero_bg.JPG -resize 768x -quality 80 hero_bg_768w.webp
magick hero_bg.JPG -resize 1024x -quality 80 hero_bg_1024w.webp
magick hero_bg.JPG -resize 1920x -quality 80 hero_bg_1920w.webp
```

### Using Node.js Sharp (Automated)
```bash
npm install --save-dev sharp
```

Create `optimize-hero.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs');

const inputFile = 'src/assets/images/hero/hero_bg.JPG';
const outputDir = 'src/assets/images/hero';

const sizes = [320, 768, 1024, 1920];

async function optimize() {
  for (const width of sizes) {
    // JPEG
    await sharp(inputFile)
      .resize(width)
      .jpeg({ quality: 85, progressive: true })
      .toFile(`${outputDir}/hero_bg_${width}w.jpg`);
    
    console.log(`✓ Generated hero_bg_${width}w.jpg`);
    
    // WebP
    await sharp(inputFile)
      .resize(width)
      .webp({ quality: 80 })
      .toFile(`${outputDir}/hero_bg_${width}w.webp`);
    
    console.log(`✓ Generated hero_bg_${width}w.webp`);
  }
  
  console.log('\\n✅ All images optimized!');
}

optimize().catch(console.error);
```

Run: `node optimize-hero.js`

## Update HTML After Creating Responsive Images

Replace the `<picture>` tag in `hero-section.html`:

```html
<picture class="hero-image" aria-hidden="true">
  <!-- WebP format (best compression, ~50% smaller) -->
  <source 
    srcset="
      /assets/images/hero/hero_bg_320w.webp 320w,
      /assets/images/hero/hero_bg_768w.webp 768w,
      /assets/images/hero/hero_bg_1024w.webp 1024w,
      /assets/images/hero/hero_bg_1920w.webp 1920w
    "
    sizes="100vw"
    type="image/webp">
  
  <!-- JPEG fallback (for older browsers) -->
  <source
    srcset="
      /assets/images/hero/hero_bg_320w.jpg 320w,
      /assets/images/hero/hero_bg_768w.jpg 768w,
      /assets/images/hero/hero_bg_1024w.jpg 1024w,
      /assets/images/hero/hero_bg_1920w.jpg 1920w
    "
    sizes="100vw"
    type="image/jpeg">
  
  <img 
    src="/assets/images/hero/hero_bg_1024w.jpg" 
    alt=""
    loading="eager"
    fetchpriority="high"
    (load)="onImageLoad($event)"
    decoding="async">
</picture>
```

## Expected File Sizes

| Size | JPEG (~85 quality) | WebP (~80 quality) | Use Case |
|------|-------------------|-------------------|----------|
| 320w | ~50-100 KB | ~30-60 KB | Small phones |
| 768w | ~150-300 KB | ~100-200 KB | Tablets |
| 1024w | ~300-500 KB | ~200-350 KB | Laptops |
| 1920w | ~600-1000 KB | ~400-700 KB | Large displays |

**Original hero_bg.JPG**: Likely 3-8 MB
**Optimized versions**: Mobile users load 30-60 KB instead of 3-8 MB = **99% reduction**

## Current Implementation

For now, the app has:
- ✅ Gradient background fallback (visible during load)
- ✅ Fade-in transition when image loads
- ✅ Async decoding to not block rendering
- ⚠️ Single large image (needs optimization)

## Next Steps

1. **Immediate**: Compress hero_bg.JPG with TinyPNG/Squoosh
2. **Soon**: Generate responsive variants with Sharp
3. **Then**: Update HTML to use srcset
