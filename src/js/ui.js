// ============= UI STATE =============

const UI = {
  // DOM елементи
  paletteEl: null,
  notificationEl: null,
  modeSelect: null,
  imageInput: null,
  uploadBtn: null,
  themeToggle: null,
  colorCountSelect: null,
  
  // History elements
  undoBtn: null,
  redoBtn: null,
  historyPanel: null,
  historyList: null,
  closeHistory: null,
  
  // Color Picker Modal
  colorPickerModal: null,
  closeModal: null,
  cancelBtn: null,
  applyBtn: null,
  colorPreview: null,
  hexInput: null,
  hueSlider: null,
  satSlider: null,
  lightSlider: null,
  hueValue: null,
  satValue: null,
  lightValue: null,
  rgbValue: null,
  hslValue: null,
  
  // Save Palette Modal
  savePaletteModal: null,
  closeSaveModal: null,
  cancelSaveBtn: null,
  confirmSaveBtn: null,
  paletteName: null,
  paletteTags: null,
  savePreviewColors: null,
  
  // Analysis Modal
  analysisModal: null,
  closeAnalysisModal: null,
  closeAnalysisBtn: null,
  analysisContent: null,
  
  // Preview Modal
  previewModal: null,
  closePreviewModal: null,
  closePreviewBtn: null,
  previewContent: null,
  
  // Share Modal
  shareModal: null,
  closeShareModal: null,
  closeShareBtn: null,
  shareLink: null,
  copyShareLink: null,
  sharePreviewColors: null,
  qrCode: null,
  downloadQR: null,
  
  // URL Extract Modal
  urlExtractModal: null,
  closeUrlModal: null,
  closeUrlExtractBtn: null,
  websiteUrl: null,
  extractUrlBtn: null,
  
  // Accessibility Modal
  accessibilityModal: null,
  closeAccessibilityModal: null,
  closeAccessibilityBtn: null,
  colorBlindType: null,
  accessibilityContent: null,
  
  // Trends Modal
  trendsModal: null,
  closeTrendsModal: null,
  closeTrendsBtn: null,
  trendsContent: null,
  
  // Export Modal
  exportModal: null,
  closeExportModal: null,
  closeExportBtn: null,
  copyExportBtn: null,
  downloadExportBtn: null,
  exportCode: null,
  tabBtns: null,
  
  // Saved palettes
  savedSection: null,
  savedPalettesEl: null,
  searchPalettes: null,
  sortPalettes: null,
  
  // State
  editingColorIndex: null,
  currentExportFormat: 'css',
  
  init() {
    // Main elements
    this.paletteEl = document.getElementById('palette');
    this.notificationEl = document.getElementById('notification');
    this.modeSelect = document.getElementById('modeSelect');
    this.imageInput = document.getElementById('imageInput');
    this.uploadBtn = document.getElementById('uploadBtn');
    this.themeToggle = document.getElementById('themeToggle');
    this.colorCountSelect = document.getElementById('colorCount');
    
    // History
    this.undoBtn = document.getElementById('undoBtn');
    this.redoBtn = document.getElementById('redoBtn');
    this.historyPanel = document.getElementById('historyPanel');
    this.historyList = document.getElementById('historyList');
    this.closeHistory = document.getElementById('closeHistory');
    
    // Color Picker
    this.colorPickerModal = document.getElementById('colorPickerModal');
    this.closeModal = document.getElementById('closeModal');
    this.cancelBtn = document.getElementById('cancelBtn');
    this.applyBtn = document.getElementById('applyBtn');
    this.colorPreview = document.getElementById('colorPreview');
    this.hexInput = document.getElementById('hexInput');
    this.hueSlider = document.getElementById('hueSlider');
    this.satSlider = document.getElementById('satSlider');
    this.lightSlider = document.getElementById('lightSlider');
    this.hueValue = document.getElementById('hueValue');
    this.satValue = document.getElementById('satValue');
    this.lightValue = document.getElementById('lightValue');
    this.rgbValue = document.getElementById('rgbValue');
    this.hslValue = document.getElementById('hslValue');
    
    // Save Palette Modal
    this.savePaletteModal = document.getElementById('savePaletteModal');
    this.closeSaveModal = document.getElementById('closeSaveModal');
    this.cancelSaveBtn = document.getElementById('cancelSaveBtn');
    this.confirmSaveBtn = document.getElementById('confirmSaveBtn');
    this.paletteName = document.getElementById('paletteName');
    this.paletteTags = document.getElementById('paletteTags');
    this.savePreviewColors = document.getElementById('savePreviewColors');
    
    // Analysis Modal
    this.analysisModal = document.getElementById('analysisModal');
    this.closeAnalysisModal = document.getElementById('closeAnalysisModal');
    this.closeAnalysisBtn = document.getElementById('closeAnalysisBtn');
    this.analysisContent = document.getElementById('analysisContent');
    
    // Preview Modal
    this.previewModal = document.getElementById('previewModal');
    this.closePreviewModal = document.getElementById('closePreviewModal');
    this.closePreviewBtn = document.getElementById('closePreviewBtn');
    this.previewContent = document.getElementById('previewContent');
    
    // Share Modal
    this.shareModal = document.getElementById('shareModal');
    this.closeShareModal = document.getElementById('closeShareModal');
    this.closeShareBtn = document.getElementById('closeShareBtn');
    this.shareLink = document.getElementById('shareLink');
    this.copyShareLink = document.getElementById('copyShareLink');
    this.sharePreviewColors = document.getElementById('sharePreviewColors');
    this.qrCode = document.getElementById('qrCode');
    this.downloadQR = document.getElementById('downloadQR');
    
    // URL Extract Modal
    this.urlExtractModal = document.getElementById('urlExtractModal');
    this.closeUrlModal = document.getElementById('closeUrlModal');
    this.closeUrlExtractBtn = document.getElementById('closeUrlExtractBtn');
    this.websiteUrl = document.getElementById('websiteUrl');
    this.extractUrlBtn = document.getElementById('extractUrlBtn');
    
    // Accessibility Modal
    this.accessibilityModal = document.getElementById('accessibilityModal');
    this.closeAccessibilityModal = document.getElementById('closeAccessibilityModal');
    this.closeAccessibilityBtn = document.getElementById('closeAccessibilityBtn');
    this.colorBlindType = document.getElementById('colorBlindType');
    this.accessibilityContent = document.getElementById('accessibilityContent');
    
    // Trends Modal
    this.trendsModal = document.getElementById('trendsModal');
    this.closeTrendsModal = document.getElementById('closeTrendsModal');
    this.closeTrendsBtn = document.getElementById('closeTrendsBtn');
    this.trendsContent = document.getElementById('trendsContent');
    
    // Export Modal
    this.exportModal = document.getElementById('exportModal');
    this.closeExportModal = document.getElementById('closeExportModal');
    this.closeExportBtn = document.getElementById('closeExportBtn');
    this.copyExportBtn = document.getElementById('copyExportBtn');
    this.downloadExportBtn = document.getElementById('downloadExportBtn');
    this.exportCode = document.getElementById('exportCode');
    this.tabBtns = document.querySelectorAll('.tab-btn');
    
    // Saved palettes
    this.savedSection = document.getElementById('savedSection');
    this.savedPalettesEl = document.getElementById('savedPalettes');
    this.searchPalettes = document.getElementById('searchPalettes');
    this.sortPalettes = document.getElementById('sortPalettes');
  }
};

// ============= RENDER FUNCTIONS =============

function renderPalette(colors) {
  UI.paletteEl.innerHTML = '';
  colors.forEach((color, index) => {
    const card = document.createElement('div');
    card.className = `color-card ${color.locked ? 'locked' : ''}`;
    card.style.backgroundColor = color.hex;
    card.style.transition = 'background-color 0.5s ease';
    
    const textColor = getTextColor(color.hex);
    
    card.innerHTML = `
      <div class="hex-code" style="color: ${textColor}">${color.hex}</div>
      <div class="color-actions">
        <button class="icon-btn" data-action="edit" data-index="${index}" style="color: ${textColor}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="icon-btn" data-action="copy" data-index="${index}" style="color: ${textColor}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
        <button class="icon-btn" data-action="lock" data-index="${index}" style="color: ${textColor}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${color.locked 
              ? '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>'
              : '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>'
            }
          </svg>
        </button>
      </div>
    `;
    
    UI.paletteEl.appendChild(card);
  });
}

function renderHistoryList(history, currentIndex) {
  UI.historyList.innerHTML = '';
  
  const modeNames = {
    'random': i18n.t('modeRandom'),
    'monochrome': i18n.t('modeMonochrome'),
    'analogous': i18n.t('modeAnalogous'),
    'complementary': i18n.t('modeComplementary'),
    'triadic': i18n.t('modeTriadic'),
    'tetradic': i18n.t('modeTetradic'),
    'split-complementary': i18n.t('modeSplitComplementary'),
    'square': i18n.t('modeSquare'),
    'pastel': i18n.t('modePastel'),
    'dark': i18n.t('modeDark'),
    'neon': i18n.t('modeNeon'),
    'earth': i18n.t('modeEarth'),
    'gradient': i18n.t('modeGradient'),
    'image': i18n.t('modeImage'),
    'manual': 'Manual',
    'url-extract': 'URL',
    'url': 'URL',
    'trend': 'Trend'
  };
  
  history.forEach((state, index) => {
    const item = document.createElement('div');
    item.className = `history-item ${index === currentIndex ? 'active' : ''}`;
    item.dataset.index = index;
    
    item.innerHTML = `
      <div class="history-colors">
        ${state.colors.map(c => `<div class="history-color" style="background-color: ${c.hex}"></div>`).join('')}
      </div>
      <div class="history-mode">${modeNames[state.mode] || state.mode}</div>
    `;
    
    UI.historyList.appendChild(item);
  });
}

function renderSavedPalettes(palettes) {
  if (palettes.length === 0) {
    UI.savedSection.style.display = 'none';
    return;
  }
  
  UI.savedSection.style.display = 'block';
  UI.savedPalettesEl.innerHTML = '';
  
  palettes.forEach((palette, idx) => {
    const paletteDiv = document.createElement('div');
    paletteDiv.className = 'saved-palette';
    paletteDiv.dataset.index = idx;
    
    paletteDiv.innerHTML = `
      <div class="saved-palette-header">
        <div>
          <div class="saved-palette-name">${palette.name}</div>
          ${palette.tags && palette.tags.length > 0 ? `
            <div class="saved-palette-tags">
              ${palette.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <button class="delete-palette" data-index="${idx}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <div class="saved-colors">
        ${palette.colors.map(color => 
          `<div class="saved-color" style="background-color: ${color}"></div>`
        ).join('')}
      </div>
      <div class="saved-date">${palette.date}</div>
    `;
    
    UI.savedPalettesEl.appendChild(paletteDiv);
  });
}

function updateHistoryButtons(canUndo, canRedo) {
  UI.undoBtn.disabled = !canUndo;
  UI.redoBtn.disabled = !canRedo;
}

// ============= NOTIFICATION =============

function showNotification(message) {
  UI.notificationEl.textContent = message;
  UI.notificationEl.classList.add('show');
  setTimeout(() => {
    UI.notificationEl.classList.remove('show');
  }, 2000);
}

// ============= CLIPBOARD =============

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  showNotification(`${i18n.t('copied')} ${text}`);
}

// ============= COLOR PICKER MODAL =============

function openColorPicker(index, colors) {
  UI.editingColorIndex = index;
  const color = colors[index];
  const hsl = hexToHSL(color.hex);
  
  UI.hexInput.value = color.hex;
  UI.hueSlider.value = hsl.h;
  UI.satSlider.value = hsl.s;
  UI.lightSlider.value = hsl.l;
  
  updateColorPreview();
  UI.colorPickerModal.classList.add('show');
}

function updateColorPreview() {
  const h = parseInt(UI.hueSlider.value);
  const s = parseInt(UI.satSlider.value);
  const l = parseInt(UI.lightSlider.value);
  const hex = hslToHex(h, s, l);
  const rgb = hexToRGB(hex);
  
  UI.colorPreview.style.backgroundColor = hex;
  UI.hexInput.value = hex;
  UI.hueValue.textContent = h;
  UI.satValue.textContent = s + '%';
  UI.lightValue.textContent = l + '%';
  UI.rgbValue.textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  UI.hslValue.textContent = `${h}°, ${s}%, ${l}%`;
}

function closeColorPicker() {
  UI.colorPickerModal.classList.remove('show');
  UI.editingColorIndex = null;
}

function getEditedColor() {
  return UI.hexInput.value;
}

function getEditingColorIndex() {
  return UI.editingColorIndex;
}

// ============= SAVE PALETTE MODAL =============

function openSavePaletteModal() {
  if (!AppState.colors || AppState.colors.length === 0) {
    showNotification(i18n.t('createPaletteFirst'));
    return;
  }
  
  UI.savePreviewColors.innerHTML = AppState.colors.map(c => 
    `<div class="saved-color" style="background-color: ${c.hex}"></div>`
  ).join('');
  UI.savePaletteModal.classList.add('show');
}

function closeSavePaletteModal() {
  UI.savePaletteModal.classList.remove('show');
}

// ============= ANALYSIS MODAL =============

function openAnalysisModal(colors) {
  const analysis = analyzePaletteData(colors);
  
  UI.analysisContent.innerHTML = `
    <div class="analysis-section">
      <h4>${i18n.t('colorInfo')}</h4>
      <div class="color-info-grid">
        ${colors.map((c, i) => {
          const rgb = hexToRGB(c.hex);
          const hsl = hexToHSL(c.hex);
          const temp = getColorTemperature(hsl.h);
          const tempLabel = temp.type === 'warm' ? i18n.t('tempWarm') : 
                           temp.type === 'cool' ? i18n.t('tempCool') : 
                           i18n.t('tempNeutral');
          return `
            <div class="color-info-card">
              <div class="color-info-swatch" style="background-color: ${c.hex}"></div>
              <div class="color-info-details">
                <div><strong>HEX:</strong> <span>${c.hex}</span></div>
                <div><strong>RGB:</strong> <span>${rgb.r}, ${rgb.g}, ${rgb.b}</span></div>
                <div><strong>HSL:</strong> <span>${hsl.h}°, ${hsl.s}%, ${hsl.l}%</span></div>
                <span class="temperature-indicator temp-${temp.type}">${tempLabel}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
    
    <div class="analysis-section">
      <h4>${i18n.t('contrastTitle')}</h4>
      <div class="contrast-matrix">
        ${analysis.contrastPairs.map(pair => `
          <div class="contrast-pair">
            <div class="contrast-colors">
              <div class="contrast-swatch" style="background-color: ${pair.color1}"></div>
              <div class="contrast-swatch" style="background-color: ${pair.color2}"></div>
            </div>
            <div class="contrast-info">
              <div class="contrast-ratio">${pair.ratio.toFixed(2)}:1</div>
              <div class="contrast-badges">
                ${pair.wcag.aa ? '<span class="badge badge-success">AA ✓</span>' : '<span class="badge badge-error">AA ✗</span>'}
                ${pair.wcag.aaa ? '<span class="badge badge-success">AAA ✓</span>' : '<span class="badge badge-warning">AAA ✗</span>'}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-secondary);">
        <strong>AA:</strong> ${i18n.t('contrastAA')}<br>
        <strong>AAA:</strong> ${i18n.t('contrastAAA')}
      </p>
    </div>
  `;
  
  UI.analysisModal.classList.add('show');
}

function closeAnalysisModal() {
  UI.analysisModal.classList.remove('show');
}

// ============= PREVIEW MODAL =============

function openPreviewModal(colors) {
  const previewHTML = `
    <div class="preview-section">
      <h4>${i18n.t('buttonsSection')}</h4>
      <div class="preview-buttons">
        ${colors.map((c, i) => `
          <button class="preview-btn" style="background-color: ${c.hex}; color: ${getTextColor(c.hex)}">
            ${i18n.t('buttonLabel')} ${i + 1}
          </button>
        `).join('')}
      </div>
    </div>
    
    <div class="preview-section">
      <h4>${i18n.t('cardsSection')}</h4>
      <div class="preview-cards">
        ${colors.map((c, i) => `
          <div class="preview-card" style="background-color: ${c.hex}; color: ${getTextColor(c.hex)}">
            <h5>${i18n.t('cardLabel')} ${i + 1}</h5>
            <p>${i18n.t('cardText')}</p>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="preview-section">
      <h4>${i18n.t('inputsSection')}</h4>
      <div class="preview-inputs">
        ${colors.map((c, i) => `
          <div class="preview-input-group">
            <label style="color: var(--text-primary)">${i18n.t('inputLabel')} ${i + 1}</label>
            <input type="text" class="preview-input" placeholder="${i18n.t('inputPlaceholder')}" 
                   style="border-color: ${c.hex}; background: var(--bg-secondary); color: var(--text-primary)">
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="preview-section">
      <h4>${i18n.t('textSection')}</h4>
      <div class="preview-text-samples">
        ${colors.map((c, i) => `
          <div class="text-sample" style="background-color: ${c.hex}; color: ${getTextColor(c.hex)}">
            <h5>${i18n.t('headingOnColor')} ${i + 1}</h5>
            <p>${i18n.t('textSample')}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  UI.previewContent.innerHTML = previewHTML;
  UI.previewModal.classList.add('show');
}

function closePreviewModal() {
  UI.previewModal.classList.remove('show');
}

// ============= SHARE MODAL =============

function openShareModal(shareUrl, colors) {
  UI.shareLink.value = shareUrl;
  UI.sharePreviewColors.innerHTML = colors.map(c => 
    `<div class="saved-color" style="background-color: ${c.hex}"></div>`
  ).join('');
  
  generateQRCode(shareUrl);
  UI.shareModal.classList.add('show');
}

function closeShareModal() {
  UI.shareModal.classList.remove('show');
}

function copyShareLink() {
  const link = UI.shareLink.value;
  copyToClipboard(link);
}

function generateQRCode(text) {
  UI.qrCode.innerHTML = '';
  
  const size = 200;
  const qr = generateQRMatrix(text);
  const cellSize = size / qr.length;
  
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);
  
  ctx.fillStyle = '#000000';
  for (let i = 0; i < qr.length; i++) {
    for (let j = 0; j < qr[i].length; j++) {
      if (qr[i][j]) {
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }
  
  UI.qrCode.appendChild(canvas);
}

function downloadQRCode() {
  const canvas = UI.qrCode.querySelector('canvas');
  if (canvas) {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette-qr-code.png';
    a.click();
    showNotification(i18n.t('qrDownloaded'));
  }
}

// ============= URL EXTRACT MODAL =============

function openUrlExtractModal() {
  UI.urlExtractModal.classList.add('show');
}

function closeUrlExtractModal() {
  UI.urlExtractModal.classList.remove('show');
  UI.websiteUrl.value = '';
}

// ============= ACCESSIBILITY MODAL =============

function openAccessibilityModal(colors) {
  updateAccessibilityView(colors, 'normal');
  UI.accessibilityModal.classList.add('show');
}

function closeAccessibilityModal() {
  UI.accessibilityModal.classList.remove('show');
}

function updateAccessibilityView(colors, type) {
  const simulatedColors = colors.map(c => simulateColorBlindness(c.hex, type));
  
  const typeNames = {
    'normal': i18n.t('normalVision'),
    'protanopia': i18n.t('protanopia'),
    'deuteranopia': i18n.t('deuteranopia'),
    'tritanopia': i18n.t('tritanopia'),
    'achromatopsia': i18n.t('achromatopsia')
  };
  
  const descriptions = {
    'normal': i18n.t('normalVisionDesc'),
    'protanopia': i18n.t('protanopiaDesc'),
    'deuteranopia': i18n.t('deuteranopiaDesc'),
    'tritanopia': i18n.t('tritanopiaDesc'),
    'achromatopsia': i18n.t('achromatopsiaDesc')
  };
  
  UI.accessibilityContent.innerHTML = `
    <div class="colorblind-comparison">
      <div class="colorblind-view">
        <h4>${i18n.t('originalPalette')}</h4>
        <div class="colorblind-palette">
          ${colors.map(c => `<div class="colorblind-swatch" style="background-color: ${c.hex}"></div>`).join('')}
        </div>
      </div>
      <div class="colorblind-view">
        <h4>${typeNames[type]}</h4>
        <div class="colorblind-palette">
          ${simulatedColors.map(hex => `<div class="colorblind-swatch" style="background-color: ${hex}"></div>`).join('')}
        </div>
        <p class="colorblind-info">${descriptions[type]}</p>
      </div>
    </div>
  `;
}

// ============= TRENDS MODAL =============

function openTrendsModal() {
  renderTrendsContent();
  UI.trendsModal.classList.add('show');
}

function closeTrendsModal() {
  UI.trendsModal.classList.remove('show');
}

function renderTrendsContent() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const paletteOfDay = getTrendPalettes().palettesOfDay[dayOfYear % getTrendPalettes().palettesOfDay.length];
  
  UI.trendsContent.innerHTML = `
    <div class="trends-section">
      <h4>${i18n.t('paletteOfDay')}</h4>
      <div class="trend-palettes">
        <div class="trend-palette" onclick="loadTrendPalette(['${paletteOfDay.colors.join("','")}'])">
          <div class="trend-palette-name">${paletteOfDay.name}</div>
          <div class="trend-palette-colors">
            ${paletteOfDay.colors.map(c => `<div class="trend-palette-color" style="background-color: ${c}"></div>`).join('')}
          </div>
          <div class="trend-palette-desc">${paletteOfDay.desc}</div>
        </div>
      </div>
    </div>
    
    <div class="trends-section">
      <h4>${i18n.t('popularPalettes')}</h4>
      <div class="trend-palettes">
        ${getTrendPalettes().popular.map(p => `
          <div class="trend-palette" onclick="loadTrendPalette(['${p.colors.join("','")}'])">
            <div class="trend-palette-name">${p.name}</div>
            <div class="trend-palette-colors">
              ${p.colors.map(c => `<div class="trend-palette-color" style="background-color: ${c}"></div>`).join('')}
            </div>
            <div class="trend-palette-desc">${p.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="trends-section">
      <h4>${i18n.t('classicPalettes')}</h4>
      <div class="trend-palettes">
        ${getTrendPalettes().classic.map(p => `
          <div class="trend-palette" onclick="loadTrendPalette(['${p.colors.join("','")}'])">
            <div class="trend-palette-name">${p.name}</div>
            <div class="trend-palette-colors">
              ${p.colors.map(c => `<div class="trend-palette-color" style="background-color: ${c}"></div>`).join('')}
            </div>
            <div class="trend-palette-desc">${p.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============= EXPORT MODAL =============

function openExportModal(colors) {
  updateExportContent(colors, UI.currentExportFormat);
  UI.exportModal.classList.add('show');
}

function updateExportContent(colors, format) {
  UI.currentExportFormat = format;
  UI.exportCode.textContent = getExportContent(colors, format);
  
  UI.tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.format === format);
  });
}

function closeExportModal() {
  UI.exportModal.classList.remove('show');
}

function copyExport() {
  const content = UI.exportCode.textContent;
  copyToClipboard(content);
}

function downloadExport(colors) {
  const content = getExportContent(colors, UI.currentExportFormat);
  const extensions = {
    css: 'css',
    scss: 'scss',
    json: 'json',
    tailwind: 'js',
    svg: 'svg'
  };
  
  const mimeTypes = {
    css: 'text/css',
    scss: 'text/plain',
    json: 'application/json',
    tailwind: 'text/javascript',
    svg: 'image/svg+xml'
  };
  
  const ext = extensions[UI.currentExportFormat];
  const mime = mimeTypes[UI.currentExportFormat];
  
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `palette.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification(i18n.t('fileDownloaded'));
}

// ============= HISTORY PANEL =============

function openHistoryPanel() {
  UI.historyPanel.classList.add('show');
}

function closeHistoryPanel() {
  UI.historyPanel.classList.remove('show');
}

function toggleHistoryPanel() {
  UI.historyPanel.classList.toggle('show');
}

// ============= MODE SELECT =============

function updateUploadButton(mode) {
  if (mode === 'image') {
    UI.uploadBtn.style.display = 'flex';
  } else {
    UI.uploadBtn.style.display = 'none';
  }
}
