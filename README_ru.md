# 🎨 PaletteCraft — Professional Color Palette Generator

**PaletteCraft** is a powerful tool for creating, analyzing, and managing color palettes with support for multiple generation algorithms, accessibility checks, and export to various formats.

![PaletteCraft Demo](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Key Features

### 🎨 Palette Generation
- **14+ generation modes**: random, monochrome, analogous, complementary, triadic, tetradic, split-complementary, square, pastel, dark, neon, earth tones, gradient
- **From image**: upload a photo and get a palette from dominant colors
- **From URL**: extract colors from websites
- **Color locking**: freeze selected colors while regenerating others

### 🔍 Analysis and Accessibility
- **WCAG compliance**: automatic contrast checking (AA, AAA)
- **Color blindness simulation**: protanopia, deuteranopia, tritanopia, achromatopsia
- **Color analysis**: RGB, HSL, temperature, brightness
- **UI preview**: buttons, cards, inputs, text

### 💾 Management
- **History**: complete history with Undo/Redo (Ctrl+Z/Y)
- **Save palettes**: save palettes with names and tags
- **Search and sort**: quick search among saved palettes
- **Export**: CSS, SCSS, JSON, Tailwind, SVG

### 🌐 Additional Features
- **Share**: generate links and QR codes
- **Multi-language**: Ukrainian, Russian, English
- **Themes**: dark and light interface themes
- **Trends**: collection of popular and classic palettes
- **Keyboard shortcuts**: Space, Ctrl+S, Ctrl+E, and more

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/frelancer-web-dev/palettecraft.git

# Navigate to directory
cd palettecraft

# Open index.html in browser
# Or use a local server
python -m http.server 8000
# or
npx serve
```

### Project Structure

```
palettecraft/
├── index.html              # Main page
├── src/
│   ├── css/
│   │   ├── main.css       # Main styles
│   │   └── modals.css     # Modal window styles
│   ├── js/
│   │   ├── main.js        # Main logic
│   │   ├── ui.js          # UI components
│   │   ├── utils.js       # Utilities and algorithms
│   │   └── i18n.js        # Internationalization
│   ├── locales/
│   │   ├── ua.json        # Ukrainian language
│   │   ├── ru.json        # Russian language
│   │   └── en.json        # English language
│   └── images/
│       └── favicon.png    # Site icon
└── README.md
```

## 🎯 Usage

### Basic Generation
1. Select number of colors (3-7)
2. Choose generation mode
3. Click "New Palette" or press `Space`

### Working with Colors
- **Click on color** — copy HEX
- **Pencil icon** — edit color
- **Copy icon** — copy HEX
- **Lock icon** — lock/unlock

### Keyboard Shortcuts
- `Space` — generate new palette
- `Ctrl+Z` — undo
- `Ctrl+Y` — redo
- `Ctrl+S` — save palette
- `Ctrl+E` — export
- `Esc` — close modal window

## 🛠️ Technologies

- **Vanilla JavaScript** — no dependencies
- **CSS3** — with CSS variables for themes
- **HTML5** — semantic markup
- **Canvas API** — image processing
- **LocalStorage** — data persistence

## 📦 Features

### Color Generation Algorithms
```javascript
// Monochrome palette
generateMonochrome(5)

// Complementary
generateComplementary(5)

// From image
generateFromImage(imageFile, 5)

// Gradient
generateGradient(5)
```

### Contrast Analysis
```javascript
// Calculate contrast
const ratio = getContrastRatio('#FFFFFF', '#000000')
// 21:1

// Check WCAG
const wcag = checkWCAG(ratio)
// { aa: true, aaa: true, aaLarge: true, aaaLarge: true }
```

### Export
```javascript
// CSS format
:root {
  --color-1: #3498DB;
  --color-2: #E74C3C;
  --color-3: #2ECC71;
}

// Tailwind format
module.exports = {
  theme: {
    extend: {
      colors: {
        'color-1': '#3498DB',
        'color-2': '#E74C3C'
      }
    }
  }
}
```

## 🌍 Localization

Add a new language by creating a file in `src/locales/`:

```json
{
  "appTitle": "PaletteCraft",
  "appSubtitle": "Create beautiful color combinations",
  "newPalette": "New Palette",
  "save": "Save"
}
```

## 🎨 Customization

### Changing Theme
Edit CSS variables in `src/css/main.css`:

```css
:root {
  --bg-primary: #0f172a;
  --text-primary: #f1f5f9;
  --accent-blue: #3b82f6;
}

body.light-theme {
  --bg-primary: #ffffff;
  --text-primary: #0f172a;
}
```

### Adding New Trend Palettes
Edit the `getTrendPalettes()` function in `src/js/utils.js`

## 🤔 FAQ

**Q: Is internet required for operation?**  
A: No, the app works completely offline after loading.

**Q: Where are palettes stored?**  
A: In your browser's localStorage.

**Q: Can it be used for commercial projects?**  
A: Yes, the MIT license allows any use.

**Q: How to export to Figma/Adobe?**  
A: Use export to JSON or SVG format.

## 🐛 Known Limitations

- Maximum 100 saved palettes
- Image size limited to 10MB
- History stores up to 20 recent actions

## 🔄 Updates

### v1.0.0 (2025-01-XX)
- ✨ Initial release
- 🎨 14 generation modes
- 🔍 WCAG analysis
- 💾 Save system
- 🌐 3 interface languages
- 🌓 Dark/light theme

## 📄 License

**MIT License**

Copyright (c) 2025 Mykola

Permission is hereby granted, free of charge, to use, modify, and distribute this software, provided that this copyright notice is retained.

## 👤 Author

**Mykola** — Frontend Developer & Designer

- 🐙 GitHub: [@frelancer-web-dev](https://github.com/frelancer-web-dev)
- 💼 Upwork: [Profile](https://www.upwork.com/freelancers/~01dec1110f4bac0e7d)
- 💬 Telegram: [@privatefanat_dep](https://t.me/privatefanat_dep)

## 🤝 AI Co-Author

Developed with support from **Jarvis AI Coder** — AI assistant for web development

---

## 📞 Support

If you have questions or suggestions:
- Create an [Issue](https://github.com/frelancer-web-dev/ai-portfolio-landing/issues)
- Message me on [Telegram](https://t.me/privatefanat_dep)

---

⭐ If this project was helpful, give it a star on GitHub!
