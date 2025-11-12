export interface ExtractedColors {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
}

export function extractColorsFromImage(imageUrl: string): Promise<ExtractedColors> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(getDefaultColors());
        return;
      }

      // Scale down for performance
      const scaleFactor = 0.1;
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Color buckets
      const colorCounts: { [key: string]: number } = {};
      
      // Sample every 4th pixel for performance
      for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        // Skip transparent and very dark/light pixels
        if (a < 128 || (r + g + b) < 50 || (r + g + b) > 650) continue;
        
        // Reduce color space to find dominant colors
        const rBucket = Math.round(r / 32) * 32;
        const gBucket = Math.round(g / 32) * 32;
        const bBucket = Math.round(b / 32) * 32;
        
        const key = `${rBucket},${gBucket},${bBucket}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }
      
      // Sort by frequency
      const sortedColors = Object.entries(colorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([color]) => color.split(',').map(Number));
      
      if (sortedColors.length === 0) {
        resolve(getDefaultColors());
        return;
      }
      
      // Pick the most vibrant colors
      const vibrantColors = sortedColors
        .map(([r, g, b]) => {
          const saturation = getSaturation(r, g, b);
          return { r, g, b, saturation };
        })
        .sort((a, b) => b.saturation - a.saturation);
      
      // Generate color scheme
      const primary = vibrantColors[0] || vibrantColors[0];
      const secondary = vibrantColors[1] || adjustColor(primary, -30);
      const accent = vibrantColors[2] || adjustColor(primary, 60);
      
      resolve({
        primary: rgbToHex(primary.r, primary.g, primary.b),
        secondary: rgbToHex(secondary.r, secondary.g, secondary.b),
        accent: rgbToHex(accent.r, accent.g, accent.b),
        light: rgbToHex(
          Math.min(255, primary.r + 100),
          Math.min(255, primary.g + 100),
          Math.min(255, primary.b + 100)
        ),
      });
    };
    
    img.onerror = () => {
      resolve(getDefaultColors());
    };
    
    img.src = imageUrl;
  });
}

function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  if (max === 0) return 0;
  return (delta / max) * 100;
}

function adjustColor(color: { r: number; g: number; b: number }, hueShift: number): { r: number; g: number; b: number; saturation: number } {
  // Simple hue shift approximation
  const r = Math.max(0, Math.min(255, color.r + hueShift));
  const g = Math.max(0, Math.min(255, color.g + hueShift / 2));
  const b = Math.max(0, Math.min(255, color.b - hueShift / 2));
  
  return { r, g, b, saturation: getSaturation(r, g, b) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function getDefaultColors(): ExtractedColors {
  return {
    primary: '#6366f1', // indigo
    secondary: '#a855f7', // purple
    accent: '#ec4899', // pink
    light: '#e0e7ff', // indigo-light
  };
}
