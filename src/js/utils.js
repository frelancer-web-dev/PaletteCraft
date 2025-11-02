// ============= VALIDATION UTILITIES =============

function isValidHexColor(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

function validateImageFile(file) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, GIF or WebP image.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File is too large. Maximum size is 10MB.');
  }
  
  return true;
}

// ============= COLOR CONVERSION UTILITIES =============

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToHSL(hex) {
  if (!isValidHexColor(hex)) {
    console.warn(`Invalid hex color: ${hex}`);
    return { h: 0, s: 0, l: 0 };
  }
  
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hexToRGB(hex) {
  if (!isValidHexColor(hex)) {
    console.warn(`Invalid hex color: ${hex}`);
    return { r: 0, g: 0, b: 0 };
  }
  
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

function getTextColor(hex) {
  const rgb = hexToRGB(hex);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

function colorDistance(hex1, hex2) {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  
  return Math.sqrt(
    Math.pow(r2 - r1, 2) +
    Math.pow(g2 - g1, 2) +
    Math.pow(b2 - b1, 2)
  );
}

// ============= COLOR ANALYSIS =============

function getRelativeLuminance(hex) {
  const rgb = hexToRGB(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function checkWCAG(ratio) {
  return {
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5
  };
}

function getColorTemperature(hue) {
  if (hue >= 0 && hue < 60) return { type: 'warm', label: '🔥 Теплий' };
  if (hue >= 60 && hue < 150) return { type: 'neutral', label: '🌿 Нейтральний' };
  if (hue >= 150 && hue < 260) return { type: 'cool', label: '❄️ Холодний' };
  return { type: 'warm', label: '🔥 Теплий' };
}

function analyzePaletteData(colors) {
  const contrastPairs = [];
  
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const ratio = getContrastRatio(colors[i].hex, colors[j].hex);
      const wcag = checkWCAG(ratio);
      
      contrastPairs.push({
        color1: colors[i].hex,
        color2: colors[j].hex,
        ratio: ratio,
        wcag: wcag
      });
    }
  }
  
  return {
    contrastPairs: contrastPairs.sort((a, b) => b.ratio - a.ratio)
  };
}

// ============= PALETTE GENERATION FUNCTIONS =============

function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateMonochrome(count = 5) {
  const baseHue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 30);
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    const lightness = 20 + (60 / (count - 1)) * i;
    colors.push(hslToHex(baseHue, saturation, Math.round(lightness)));
  }
  return colors;
}

function generateAnalogous(count = 5) {
  const baseHue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 30);
  const lightness = 50 + Math.floor(Math.random() * 20);
  
  const colors = [];
  const spread = 60;
  const step = spread / (count - 1);
  
  for (let i = 0; i < count; i++) {
    const hue = (baseHue - spread / 2 + step * i + 360) % 360;
    const l = lightness - 10 + (20 / (count - 1)) * i;
    colors.push(hslToHex(Math.round(hue), saturation, Math.round(l)));
  }
  return colors;
}

function generateComplementary(count = 5) {
  const baseHue = Math.floor(Math.random() * 360);
  const complementHue = (baseHue + 180) % 360;
  const saturation = 60 + Math.floor(Math.random() * 30);
  
  const colors = [];
  const half = Math.floor(count / 2);
  
  for (let i = 0; i < half; i++) {
    const l = 40 + (40 / (half + 1)) * (i + 1);
    colors.push(hslToHex(baseHue, saturation, Math.round(l)));
  }
  
  if (count % 2 === 1) {
    colors.push(hslToHex((baseHue + complementHue) / 2, saturation - 20, 50));
  }
  
  for (let i = 0; i < count - half - (count % 2); i++) {
    const l = 40 + (40 / (count - half)) * (i + 1);
    colors.push(hslToHex(complementHue, saturation, Math.round(l)));
  }
  
  return colors;
}

function generateTriadic(count = 5) {
  const baseHue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 30);
  const lightness = 50;
  
  const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
  const colors = [];
  
  for (let i = 0; i < count; i++) {
    const hueIndex = i % hues.length;
    const l = lightness - 10 + (30 / count) * i;
    const s = saturation - (10 / count) * i;
    colors.push(hslToHex(hues[hueIndex], Math.round(s), Math.round(l)));
  }
  
  return colors;
}

function generateTetradic(count = 5) {
  const baseHue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 30);
  const lightness = 50;
  
  const hues = [
    baseHue,
    (baseHue + 90) % 360,
    (baseHue + 180) % 360,
    (baseHue + 270) % 360
  ];
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hueIndex = i % hues.length;
    const l = lightness - 5 + (20 / count) * i;
    colors.push(hslToHex(hues[hueIndex], saturation, Math.round(l)));
  }
  
  return colors;
}

function generateSplitComplementary(count = 5) {
  const baseHue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 25);
  const lightness = 50;
  
  const hues = [
    baseHue,
    (baseHue + 150) % 360,
    (baseHue + 210) % 360
  ];
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hueIndex = i % hues.length;
    const l = lightness - 10 + (30 / count) * i;
    colors.push(hslToHex(hues[hueIndex], saturation, Math.round(l)));
  }
  
  return colors;
}

function generateSquare(count = 5) {
  const baseHue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 25);
  const lightness = 50;
  
  const hues = [
    baseHue,
    (baseHue + 90) % 360,
    (baseHue + 180) % 360,
    (baseHue + 270) % 360
  ];
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hueIndex = i % hues.length;
    const l = lightness - 5 + (25 / count) * i;
    colors.push(hslToHex(hues[hueIndex], saturation, Math.round(l)));
  }
  
  return colors;
}

function generatePastel(count = 5) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 25 + Math.floor(Math.random() * 35);
    const lightness = 75 + Math.floor(Math.random() * 15);
    colors.push(hslToHex(hue, saturation, lightness));
  }
  return colors;
}

function generateDark(count = 5) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 40 + Math.floor(Math.random() * 40);
    const lightness = 15 + Math.floor(Math.random() * 25);
    colors.push(hslToHex(hue, saturation, lightness));
  }
  return colors;
}

function generateNeon(count = 5) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 85 + Math.floor(Math.random() * 15);
    const lightness = 50 + Math.floor(Math.random() * 20);
    colors.push(hslToHex(hue, saturation, lightness));
  }
  return colors;
}

function generateEarth(count = 5) {
  const earthHues = [20, 30, 35, 40, 25, 28, 32, 60, 80, 90, 0, 10, 15];
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = earthHues[Math.floor(Math.random() * earthHues.length)];
    const saturation = 30 + Math.floor(Math.random() * 40);
    const lightness = 35 + Math.floor(Math.random() * 35);
    colors.push(hslToHex(hue, saturation, lightness));
  }
  return colors;
}

function generateGradient(count = 5) {
  const startHue = Math.floor(Math.random() * 360);
  const endHue = (startHue + 60 + Math.floor(Math.random() * 120)) % 360;
  const saturation = 70 + Math.floor(Math.random() * 20);
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const hue = Math.round(startHue + (endHue - startHue) * t);
    const lightness = 40 + Math.round(20 * Math.sin(t * Math.PI));
    colors.push(hslToHex(hue, saturation, lightness));
  }
  return colors;
}

// ============= IMAGE PROCESSING (з валідацією) =============

function generateFromImage(imageFile, count = 5) {
  return new Promise((resolve, reject) => {
    try {
      // Валідація файлу
      validateImageFile(imageFile);
    } catch (error) {
      reject(error);
      return;
    }
    
    const reader = new FileReader();
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Оптимізація: обмежуємо розмір для обробки
          const maxSize = 150;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = Math.floor(img.width * scale);
          canvas.height = Math.floor(img.height * scale);
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          const colorMap = {};
          const step = 4 * 4; // Пропускаємо кожен 4-й піксель для швидкості
          
          for (let i = 0; i < pixels.length; i += step) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Пропускаємо прозорі пікселі
            if (a < 125) continue;
            
            // Пропускаємо надто темні та надто світлі кольори
            const brightness = (r + g + b) / 3;
            if (brightness < 20 || brightness > 235) continue;
            
            const hex = rgbToHex(r, g, b);
            colorMap[hex] = (colorMap[hex] || 0) + 1;
          }
          
          const sortedColors = Object.entries(colorMap)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
          
          if (sortedColors.length === 0) {
            reject(new Error('No colors found in image'));
            return;
          }
          
          const palette = selectDiverseColors(sortedColors, count);
          resolve(palette);
        } catch (error) {
          reject(new Error('Failed to process image: ' + error.message));
        }
      };
      
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(imageFile);
  });
}

function selectDiverseColors(colors, count) {
  if (colors.length <= count) {
    const result = [...colors];
    while (result.length < count) {
      result.push(generateRandomColor());
    }
    return result;
  }
  
  const selected = [colors[0]];
  const minDistance = 50; // Мінімальна відстань між кольорами
  
  while (selected.length < count && colors.length > 0) {
    let maxDistance = 0;
    let bestColor = null;
    
    for (const color of colors) {
      if (selected.includes(color)) continue;
      
      const minDist = Math.min(...selected.map(s => colorDistance(color, s)));
      
      if (minDist > maxDistance && minDist >= minDistance) {
        maxDistance = minDist;
        bestColor = color;
      }
    }
    
    if (bestColor) {
      selected.push(bestColor);
    } else {
      // Якщо не знайшли з мінімальною відстанню, беремо наступний доступний
      const nextColor = colors.find(c => !selected.includes(c));
      if (nextColor) selected.push(nextColor);
      else break;
    }
  }
  
  // Заповнюємо випадковими, якщо не вистачає
  while (selected.length < count) {
    selected.push(generateRandomColor());
  }
  
  return selected;
}

// ============= COLOR BLINDNESS SIMULATION =============

function simulateColorBlindness(hex, type) {
  if (!isValidHexColor(hex)) {
    console.warn(`Invalid hex for colorblindness simulation: ${hex}`);
    return hex;
  }
  
  const rgb = hexToRGB(hex);
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;
  
  if (type === 'normal') {
    return hex;
  }
  
  let newR, newG, newB;
  
  switch(type) {
    case 'protanopia':
      newR = 0.567 * r + 0.433 * g;
      newG = 0.558 * r + 0.442 * g;
      newB = 0.242 * g + 0.758 * b;
      break;
      
    case 'deuteranopia':
      newR = 0.625 * r + 0.375 * g;
      newG = 0.7 * r + 0.3 * g;
      newB = 0.3 * g + 0.7 * b;
      break;
      
    case 'tritanopia':
      newR = 0.95 * r + 0.05 * g;
      newG = 0.433 * g + 0.567 * b;
      newB = 0.475 * g + 0.525 * b;
      break;
      
    case 'achromatopsia':
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      newR = newG = newB = gray;
      break;
      
    default:
      return hex;
  }
  
  return rgbToHex(
    Math.round(newR * 255),
    Math.round(newG * 255),
    Math.round(newB * 255)
  );
}

// ============= URL COLOR EXTRACTION (з валідацією) =============

function generateColorPaletteFromUrl(url) {
  // Валідація URL
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL format');
  }
  
  // Генерація на основі хешу URL
  const hash = simpleHash(url);
  const colors = [];
  
  for (let i = 0; i < 5; i++) {
    const hue = ((hash + i * 73) % 360);
    const saturation = 50 + ((hash + i * 37) % 40);
    const lightness = 40 + ((hash + i * 53) % 30);
    colors.push(hslToHex(hue, saturation, lightness));
  }
  
  return colors;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ============= QR CODE GENERATION =============

function generateQRMatrix(text) {
  const size = 25;
  const matrix = Array(size).fill(null).map(() => Array(size).fill(false));
  
  const hash = simpleHash(text);
  let random = hash;
  
  const next = () => {
    random = (random * 1103515245 + 12345) & 0x7fffffff;
    return random / 0x7fffffff;
  };
  
  // Додаємо шаблони позиціонування (3 кути)
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      matrix[i][j] = true;
      matrix[i][size - 1 - j] = true;
      matrix[size - 1 - i][j] = true;
    }
  }
  
  // Заповнюємо центр
  for (let i = 8; i < size - 8; i++) {
    for (let j = 8; j < size - 8; j++) {
      matrix[i][j] = next() > 0.5;
    }
  }
  
  return matrix;
}

// ============= TREND PALETTES =============

function getTrendPalettes() {
  return {
    palettesOfDay: [
      {
        name: 'Сонячний ранок',
        colors: ['#FFD93D', '#FF8A00', '#FF6B6B', '#FFE66D', '#FFA62B'],
        desc: 'Тепла та енергійна палітра для оптимістичних проєктів'
      },
      {
        name: 'Океанський бриз',
        colors: ['#006994', '#0496A6', '#13C4A3', '#7CEBC4', '#A8E6CF'],
        desc: 'Свіжа та спокійна палітра, натхненна морем'
      },
      {
        name: 'Лавандові мрії',
        colors: ['#9B5DE5', '#C77DFF', '#E0AAFF', '#F7C8E0', '#FBAED2'],
        desc: 'М\'яка та романтична палітра з пастельними відтінками'
      },
      {
        name: 'Осінній листопад',
        colors: ['#8B4513', '#CD853F', '#DAA520', '#F4A460', '#D2691E'],
        desc: 'Тепла осіння палітра із земляними тонами'
      },
      {
        name: 'Нічне місто',
        colors: ['#1A1A2E', '#16213E', '#0F3460', '#533483', '#E94560'],
        desc: 'Темна та стильна палітра для сучасних інтерфейсів'
      },
      {
        name: 'Весняний сад',
        colors: ['#90EE90', '#98D8C8', '#6BCB77', '#4D96A9', '#52796F'],
        desc: 'Свіжа зелена палітра, що нагадує про весну'
      },
      {
        name: 'Закат пустелі',
        colors: ['#E63946', '#F77F00', '#FCBF49', '#EAE2B7', '#D62828'],
        desc: 'Яскрава та контрастна палітра пустельного заходу'
      }
    ],
    popular: [
      {
        name: 'Viva Magenta 2023',
        colors: ['#BB2649', '#E94560', '#FF6B9D', '#C9184A', '#A4133C'],
        desc: 'Колір року Pantone 2023 - сміливий та яскравий'
      },
      {
        name: 'Cyber Punk',
        colors: ['#00F5FF', '#FF10F0', '#711C91', '#EA00D9', '#0ABDC6'],
        desc: 'Неонові кольори для футуристичних дизайнів'
      },
      {
        name: 'Mint Fresh',
        colors: ['#B8E6B8', '#7FD8BE', '#5FB4A2', '#347B98', '#1A535C'],
        desc: 'Освіжаюча м\'ятна палітра'
      },
      {
        name: 'Warm Coffee',
        colors: ['#6F4E37', '#8B4513', '#A0522D', '#D2691E', '#F4A460'],
        desc: 'Затишна кавова палітра'
      },
      {
        name: 'Digital Blue',
        colors: ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
        desc: 'Професійна синя палітра для бізнесу'
      },
      {
        name: 'Sunset Gradient',
        colors: ['#FD297B', '#FF5864', '#FF655B', '#FF7A59', '#FF8A5B'],
        desc: 'Градієнт заходу сонця'
      }
    ],
    classic: [
      {
        name: 'Material Design',
        colors: ['#F44336', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0'],
        desc: 'Класична палітра Material Design від Google'
      },
      {
        name: 'Flat UI',
        colors: ['#3498DB', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6'],
        desc: 'Популярна палітра Flat UI'
      },
      {
        name: 'Monochrome',
        colors: ['#000000', '#404040', '#808080', '#BFBFBF', '#FFFFFF'],
        desc: 'Універсальна чорно-біла палітра'
      },
      {
        name: 'Vintage',
        colors: ['#8B7355', '#C19A6B', '#D2B48C', '#F5DEB3', '#FFE4B5'],
        desc: 'Вінтажна бежева палітра'
      },
      {
        name: 'Rainbow',
        colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF'],
        desc: 'Класична веселкова палітра'
      },
      {
        name: 'Nordic',
        colors: ['#2E3440', '#3B4252', '#434C5E', '#4C566A', '#D8DEE9'],
        desc: 'Скандинавська темна палітра'
      }
    ]
  };
}

// ============= EXPORT FORMATS =============

function getExportContent(colors, format) {
  const colorsList = colors.map(c => c.hex);
  
  switch(format) {
    case 'css':
      return `:root {\n${colorsList.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
    
    case 'scss':
      return colorsList.map((c, i) => `$color-${i + 1}: ${c};`).join('\n');
    
    case 'json':
      return JSON.stringify({
        palette: colorsList,
        metadata: {
          generated: new Date().toISOString(),
          count: colorsList.length,
          version: '1.0'
        }
      }, null, 2);
    
    case 'tailwind':
      const tailwindColors = colorsList.reduce((acc, c, i) => {
        acc[`color-${i + 1}`] = c;
        return acc;
      }, {});
      return `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(tailwindColors, null, 8).replace(/\n/g, '\n      ')}\n    }\n  }\n}`;
    
    case 'svg':
      const swatchSize = 100;
      const svgContent = `<svg width="${swatchSize * colorsList.length}" height="${swatchSize}" xmlns="http://www.w3.org/2000/svg">
  ${colorsList.map((c, i) => `<rect x="${i * swatchSize}" y="0" width="${swatchSize}" height="${swatchSize}" fill="${c}"/>`).join('\n  ')}
</svg>`;
      return svgContent;
    
    default:
      return '';
  }
}

// ============= DEBOUNCE UTILITY =============

function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============= LOCAL STORAGE UTILITIES =============

function safeLocalStorage() {
  const storage = {
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.error('LocalStorage error:', e);
        return false;
      }
    },
    getItem: (key) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('LocalStorage error:', e);
        return null;
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error('LocalStorage error:', e);
        return false;
      }
    }
  };
  
  return storage;
}

// ============= PERFORMANCE UTILITIES =============

function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
