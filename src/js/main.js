// ============= APPLICATION STATE (модульний паттерн) =============

const AppState = {
  colors: [],
  savedPalettes: [],
  history: [],
  historyIndex: -1,
  colorCount: 5,
  currentTheme: 'dark',
  MAX_HISTORY: 20,
  MAX_SAVED_PALETTES: 100
};

// Safe localStorage wrapper
const storage = safeLocalStorage();

// ============= THEME MANAGEMENT =============
  function initTheme() {
    const savedTheme = storage.getItem('theme') || 'dark';
    AppState.currentTheme = savedTheme;
    applyTheme(savedTheme);
  }
  
  function applyTheme(theme) {
    const body = document.body;
    if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
    
    // Оновлюємо іконку в кнопці
    updateThemeIcon(theme);
  }
  
  function updateThemeIcon(theme) {
    const themeBtn = UI.themeToggle;
    if (!themeBtn) return;
    
    const icon = theme === 'light' 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
    
    themeBtn.innerHTML = icon;
  }

function toggleTheme() {
  AppState.currentTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
  storage.setItem('theme', AppState.currentTheme);
  applyTheme(AppState.currentTheme);
  
  const themeText = AppState.currentTheme === 'light' 
    ? i18n.t('themeLight') 
    : i18n.t('themeDark');
  showNotification(`${i18n.t('themeChanged')} ${themeText}`);
}
// ============= LANGUAGE MANAGEMENT =============

function initLanguage() {
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    langSelect.value = i18n.getCurrentLanguage();
  }
}

async function changeLanguage(lang) {
  try {
    await i18n.setLanguage(lang);
    updateModeSelectTranslations();
    if (AppState.savedPalettes.length > 0) {
      renderSavedPalettes(AppState.savedPalettes);
    }
    if (AppState.history.length > 0) {
      renderHistoryList(AppState.history, AppState.historyIndex);
    }
  } catch (error) {
    console.error('Failed to change language:', error);
    showNotification(i18n.t('translationError'));
  }
}

function updateModeSelectTranslations() {
  const modeSelect = UI.modeSelect;
  if (!modeSelect) return;
  
  const currentValue = modeSelect.value;
  
  Array.from(modeSelect.options).forEach(option => {
    const key = option.getAttribute('data-i18n');
    if (key) {
      option.textContent = i18n.t(key);
    }
  });
  
  modeSelect.value = currentValue;
}

// ============= HISTORY MANAGEMENT =============

function saveToHistory(mode = 'manual') {
  const state = {
    colors: JSON.parse(JSON.stringify(AppState.colors)),
    mode: mode,
    timestamp: Date.now()
  };
  
  AppState.history = AppState.history.slice(0, AppState.historyIndex + 1);
  AppState.history.push(state);
  
  if (AppState.history.length > AppState.MAX_HISTORY) {
    AppState.history.shift();
  } else {
    AppState.historyIndex++;
  }
  
  updateHistoryButtons(AppState.historyIndex > 0, AppState.historyIndex < AppState.history.length - 1);
  renderHistoryList(AppState.history, AppState.historyIndex);
}

function undo() {
  if (AppState.historyIndex > 0) {
    AppState.historyIndex--;
    loadHistoryState(AppState.historyIndex);
    updateHistoryButtons(AppState.historyIndex > 0, AppState.historyIndex < AppState.history.length - 1);
    renderHistoryList(AppState.history, AppState.historyIndex);
  }
}

function redo() {
  if (AppState.historyIndex < AppState.history.length - 1) {
    AppState.historyIndex++;
    loadHistoryState(AppState.historyIndex);
    updateHistoryButtons(AppState.historyIndex > 0, AppState.historyIndex < AppState.history.length - 1);
    renderHistoryList(AppState.history, AppState.historyIndex);
  }
}

function loadHistoryState(index) {
  const state = AppState.history[index];
  AppState.colors = JSON.parse(JSON.stringify(state.colors));
  AppState.colorCount = AppState.colors.length;
  if (UI.copyShareLink) {
    UI.copyShareLink.addEventListener('click', copyShareLink);
  }
  
  if (UI.downloadQR) {
    UI.downloadQR.addEventListener('click', downloadQRCode);
  }
  
  // URL Extract Modal
  if (UI.closeUrlModal) {
    UI.closeUrlModal.addEventListener('click', closeUrlExtractModal);
  }
  
  if (UI.closeUrlExtractBtn) {
    UI.closeUrlExtractBtn.addEventListener('click', closeUrlExtractModal);
  }
  
  if (UI.extractUrlBtn) {
    UI.extractUrlBtn.addEventListener('click', () => {
      const url = UI.websiteUrl ? UI.websiteUrl.value.trim() : '';
      if (url) {
        processUrlExtraction(url);
      } else {
        showNotification(i18n.t('enterUrl'));
      }
    });
  }
  
  // Accessibility Modal
  if (UI.closeAccessibilityModal) {
    UI.closeAccessibilityModal.addEventListener('click', closeAccessibilityModal);
  }
  
  if (UI.closeAccessibilityBtn) {
    UI.closeAccessibilityBtn.addEventListener('click', closeAccessibilityModal);
  }
  
  if (UI.colorBlindType) {
    UI.colorBlindType.addEventListener('change', (e) => {
      updateAccessibilityView(AppState.colors, e.target.value);
    });
  }
  
  // Trends Modal
  if (UI.closeTrendsModal) {
    UI.closeTrendsModal.addEventListener('click', closeTrendsModal);
  }
  
  if (UI.closeTrendsBtn) {
    UI.closeTrendsBtn.addEventListener('click', closeTrendsModal);
  }
  
  // Export Modal events
  if (UI.closeExportModal) {
    UI.closeExportModal.addEventListener('click', closeExportModal);
  }
  
  if (UI.closeExportBtn) {
    UI.closeExportBtn.addEventListener('click', closeExportModal);
  }
  
  if (UI.copyExportBtn) {
    UI.copyExportBtn.addEventListener('click', copyExport);
  }
  
  if (UI.downloadExportBtn) {
    UI.downloadExportBtn.addEventListener('click', () => downloadExport(AppState.colors));
  }
  
  if (UI.tabBtns) {
    UI.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        updateExportContent(AppState.colors, btn.dataset.format);
      });
    });
  }
  
  // Modal backdrop clicks
  const modals = [
    { element: UI.colorPickerModal, closeFunc: closeColorPicker },
    { element: UI.savePaletteModal, closeFunc: closeSavePaletteModal },
    { element: UI.analysisModal, closeFunc: closeAnalysisModal },
    { element: UI.previewModal, closeFunc: closePreviewModal },
    { element: UI.shareModal, closeFunc: closeShareModal },
    { element: UI.urlExtractModal, closeFunc: closeUrlExtractModal },
    { element: UI.accessibilityModal, closeFunc: closeAccessibilityModal },
    { element: UI.trendsModal, closeFunc: closeTrendsModal },
    { element: UI.exportModal, closeFunc: closeExportModal },
    { element: UI.historyPanel, closeFunc: closeHistoryPanel }
  ];
  
  modals.forEach(({ element, closeFunc }) => {
    if (element) {
      element.addEventListener('click', (e) => {
        if (e.target === element) {
          closeFunc();
        }
      });
    }
  });
  
  // Mode select change
  if (UI.modeSelect) {
    UI.modeSelect.addEventListener('change', () => {
      updateUploadButton(UI.modeSelect.value);
    });
  }
  
  // Image upload
  if (UI.uploadBtn) {
    UI.uploadBtn.addEventListener('click', () => {
      if (UI.imageInput) {
        UI.imageInput.click();
      }
    });
  }
  
  if (UI.imageInput) {
    UI.imageInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        await handleImageUpload(file);
        UI.imageInput.value = '';
      }
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Space - generate palette
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      generatePalette();
    }
    
    // Ctrl+Z - undo
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
    
    // Ctrl+Y or Ctrl+Shift+Z - redo
    if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
      e.preventDefault();
      redo();
    }
    
    // Ctrl+S - save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      savePalette();
    }
    
    // Ctrl+E - export
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      openExportModal(AppState.colors);
    }
    
    // Escape - close modals
    if (e.key === 'Escape') {
      const openModals = [
        { element: UI.colorPickerModal, closeFunc: closeColorPicker },
        { element: UI.savePaletteModal, closeFunc: closeSavePaletteModal },
        { element: UI.analysisModal, closeFunc: closeAnalysisModal },
        { element: UI.previewModal, closeFunc: closePreviewModal },
        { element: UI.shareModal, closeFunc: closeShareModal },
        { element: UI.urlExtractModal, closeFunc: closeUrlExtractModal },
        { element: UI.accessibilityModal, closeFunc: closeAccessibilityModal },
        { element: UI.trendsModal, closeFunc: closeTrendsModal },
        { element: UI.exportModal, closeFunc: closeExportModal },
        { element: UI.historyPanel, closeFunc: closeHistoryPanel }
      ];
      
      for (const { element, closeFunc } of openModals) {
        if (element && element.classList.contains('show')) {
          closeFunc();
          break;
        }
      }
    }
  });
}

// ============= INITIALIZATION =============

async function init() {
  try {
    console.log('🎨 Initializing PaletteCraft...');
    
    // Initialize i18n first
    await i18n.init();
    console.log('✓ i18n initialized');
    
    // Then initialize UI and other components
    UI.init();
    console.log('✓ UI initialized');
    
    initTheme();
    console.log('✓ Theme initialized');
    
    initLanguage();
    console.log('✓ Language initialized');
    
    setupEventListeners();
    console.log('✓ Event listeners initialized');
    
    loadPaletteFromUrl();
    console.log('✓ URL palette checked');
    
    // Try to restore last palette
    restoreLastPalette();
    console.log('✓ Last palette restored (if exists)');
    
    if (AppState.colors.length === 0) {
      await generatePalette();
      console.log('✓ Initial palette generated');
    }
    
    loadSavedPalettes();
    console.log('✓ Saved palettes loaded');
    
    console.log('🎉 PaletteCraft ready!');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    // Показуємо базове повідомлення про помилку
    const notification = document.getElementById('notification');
    if (notification) {
      notification.textContent = 'Error initializing app. Please refresh the page.';
      notification.classList.add('show');
      notification.style.background = '#ef4444';
    }
  }
}

// Start the application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle page visibility changes (автозбереження при виході)
document.addEventListener('visibilitychange', () => {
  if (document.hidden && AppState.colors.length > 0) {
    // Автозбереження поточного стану
    storage.setItem('lastPalette', JSON.stringify(AppState.colors));
  }
});

// ============= PALETTE MANAGEMENT =============

async function generatePalette() {
  const mode = UI.modeSelect ? UI.modeSelect.value : 'random';
  let newColors;
  
  try {
    if (mode === 'image') {
      showNotification(i18n.t('selectImage'));
      if (UI.imageInput) {
        UI.imageInput.click();
      }
      return;
    }
    
    switch(mode) {
      case 'monochrome':
        newColors = generateMonochrome(AppState.colorCount);
        break;
      case 'analogous':
        newColors = generateAnalogous(AppState.colorCount);
        break;
      case 'complementary':
        newColors = generateComplementary(AppState.colorCount);
        break;
      case 'triadic':
        newColors = generateTriadic(AppState.colorCount);
        break;
      case 'tetradic':
        newColors = generateTetradic(AppState.colorCount);
        break;
      case 'split-complementary':
        newColors = generateSplitComplementary(AppState.colorCount);
        break;
      case 'square':
        newColors = generateSquare(AppState.colorCount);
        break;
      case 'pastel':
        newColors = generatePastel(AppState.colorCount);
        break;
      case 'dark':
        newColors = generateDark(AppState.colorCount);
        break;
      case 'neon':
        newColors = generateNeon(AppState.colorCount);
        break;
      case 'earth':
        newColors = generateEarth(AppState.colorCount);
        break;
      case 'gradient':
        newColors = generateGradient(AppState.colorCount);
        break;
      default:
        newColors = Array(AppState.colorCount).fill(null).map(() => generateRandomColor());
    }
    
    if (AppState.colors.length === 0 || AppState.colors.length !== AppState.colorCount) {
      AppState.colors = newColors.map((hex, index) => ({
        hex,
        locked: false,
        id: index
      }));
    } else {
      AppState.colors = AppState.colors.map((color, index) => 
        color.locked ? color : { ...color, hex: newColors[index] }
      );
    }
    
    renderPalette(AppState.colors);
    saveToHistory(mode);
  } catch (error) {
    console.error('Error generating palette:', error);
    showNotification(i18n.t('imageError'));
  }
}

function toggleLock(index) {
  if (AppState.colors[index]) {
    AppState.colors[index].locked = !AppState.colors[index].locked;
    renderPalette(AppState.colors);
  }
}

function changeColorCount(count) {
  AppState.colorCount = parseInt(count);
  
  if (AppState.colors.length === 0) {
    generatePalette();
    return;
  }
  
  if (AppState.colorCount > AppState.colors.length) {
    const mode = UI.modeSelect ? UI.modeSelect.value : 'random';
    let additionalColors;
    
    switch(mode) {
      case 'monochrome':
        additionalColors = generateMonochrome(AppState.colorCount);
        break;
      case 'analogous':
        additionalColors = generateAnalogous(AppState.colorCount);
        break;
      default:
        additionalColors = Array(AppState.colorCount).fill(null).map(() => generateRandomColor());
    }
    
    for (let i = AppState.colors.length; i < AppState.colorCount; i++) {
      AppState.colors.push({
        hex: additionalColors[i],
        locked: false,
        id: i
      });
    }
  } else if (AppState.colorCount < AppState.colors.length) {
    AppState.colors = AppState.colors.slice(0, AppState.colorCount);
  }
  
  renderPalette(AppState.colors);
  saveToHistory('manual');
}

// ============= SAVED PALETTES =============

function savePalette() {
  if (AppState.colors.length === 0) {
    showNotification(i18n.t('createPaletteFirst'));
    return;
  }
  
  if (AppState.savedPalettes.length >= AppState.MAX_SAVED_PALETTES) {
    showNotification(`Максимум ${AppState.MAX_SAVED_PALETTES} палітр`);
    return;
  }
  
  openSavePaletteModal();
}

function confirmSavePalette() {
  try {
    const name = sanitizeInput(UI.paletteName.value) || `${i18n.t('savedPalettes')} ${AppState.savedPalettes.length + 1}`;
    const tagsInput = sanitizeInput(UI.paletteTags.value);
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const locale = i18n.getCurrentLanguage() === 'ua' ? 'uk-UA' : 
                   i18n.getCurrentLanguage() === 'ru' ? 'ru-RU' : 'en-US';
    
    const palette = {
      id: Date.now(),
      name: name,
      tags: tags,
      colors: AppState.colors.map(c => c.hex),
      date: new Date().toLocaleString(locale)
    };
    
    AppState.savedPalettes.push(palette);
    storage.setItem('palettes', JSON.stringify(AppState.savedPalettes));
    showNotification(i18n.t('paletteSaved'));
    renderSavedPalettes(AppState.savedPalettes);
    closeSavePaletteModal();
    
    if (UI.paletteName) UI.paletteName.value = '';
    if (UI.paletteTags) UI.paletteTags.value = '';
  } catch (error) {
    console.error('Error saving palette:', error);
    showNotification('Помилка збереження палітри');
  }
}

function loadSavedPalettes() {
  try {
    const saved = storage.getItem('palettes');
    if (saved) {
      AppState.savedPalettes = JSON.parse(saved);
      renderSavedPalettes(AppState.savedPalettes);
    }
  } catch (error) {
    console.error('Error loading saved palettes:', error);
    AppState.savedPalettes = [];
  }
}

function loadPalette(index) {
  const palette = AppState.savedPalettes[index];
  if (!palette) return;
  
  AppState.colors = palette.colors.map((hex, i) => ({
    hex,
    locked: false,
    id: i
  }));
  AppState.colorCount = AppState.colors.length;
  if (UI.colorCountSelect) {
    UI.colorCountSelect.value = AppState.colorCount;
  }
  renderPalette(AppState.colors);
  saveToHistory('manual');
  showNotification(`${i18n.t('paletteLoaded')} ${palette.name}`);
}

function deletePalette(index) {
  const palette = AppState.savedPalettes[index];
  if (!palette) return;
  
  if (confirm(`${i18n.t('deletePaletteConfirm')} "${palette.name}"?`)) {
    AppState.savedPalettes.splice(index, 1);
    storage.setItem('palettes', JSON.stringify(AppState.savedPalettes));
    renderSavedPalettes(AppState.savedPalettes);
    showNotification(i18n.t('paletteDeleted'));
  }
}

// Debounced search function
const debouncedSearchPalettes = debounce((query) => {
  const lowerQuery = query.toLowerCase();
  const filtered = AppState.savedPalettes.filter(palette => 
    palette.name.toLowerCase().includes(lowerQuery) ||
    palette.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
  renderSavedPalettes(filtered);
}, 300);

function searchPalettes(query) {
  debouncedSearchPalettes(query);
}

function sortPalettes(sortType) {
  let sorted = [...AppState.savedPalettes];
  const locale = i18n.getCurrentLanguage() === 'ua' ? 'uk' : i18n.getCurrentLanguage();
  
  switch(sortType) {
    case 'date-desc':
      sorted.sort((a, b) => b.id - a.id);
      break;
    case 'date-asc':
      sorted.sort((a, b) => a.id - b.id);
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name, locale));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name, locale));
      break;
  }
  
  renderSavedPalettes(sorted);
}

// ============= COLOR EDITING =============

function applyColorChange() {
  const index = getEditingColorIndex();
  if (index !== null && AppState.colors[index]) {
    const newColor = getEditedColor();
    if (isValidHexColor(newColor)) {
      AppState.colors[index].hex = newColor;
      renderPalette(AppState.colors);
      saveToHistory('manual');
      closeColorPicker();
    } else {
      showNotification('Невірний формат кольору');
    }
  }
}

// ============= IMAGE UPLOAD =============

async function handleImageUpload(file) {
  if (!file) return;
  
  showNotification(i18n.t('processingImage'));
  
  try {
    const newColors = await generateFromImage(file, AppState.colorCount);
    
    if (AppState.colors.length === 0 || AppState.colors.length !== AppState.colorCount) {
      AppState.colors = newColors.map((hex, index) => ({
        hex,
        locked: false,
        id: index
      }));
    } else {
      AppState.colors = AppState.colors.map((color, index) => 
        color.locked ? color : { ...color, hex: newColors[index] || generateRandomColor() }
      );
    }
    
    renderPalette(AppState.colors);
    saveToHistory('image');
    showNotification(i18n.t('paletteFromImage'));
  } catch (error) {
    console.error('Image upload error:', error);
    showNotification(error.message || i18n.t('imageError'));
  }
}

// ============= PALETTE ANALYSIS =============

function analyzePalette() {
  if (AppState.colors.length === 0) {
    showNotification(i18n.t('createPaletteFirst'));
    return;
  }
  
  try {
    openAnalysisModal(AppState.colors);
  } catch (error) {
    console.error('Analysis error:', error);
    showNotification('Помилка аналізу палітри');
  }
}

// ============= PALETTE PREVIEW =============

function showPreview() {
  if (AppState.colors.length === 0) {
    showNotification(i18n.t('createPaletteFirst'));
    return;
  }
  
  try {
    openPreviewModal(AppState.colors);
  } catch (error) {
    console.error('Preview error:', error);
    showNotification('Помилка попереднього перегляду');
  }
}

// ============= SHARE PALETTE =============

function sharePalette() {
  if (AppState.colors.length === 0) {
    showNotification(i18n.t('createPaletteFirst'));
    return;
  }
  
  try {
    const paletteData = AppState.colors.map(c => c.hex.replace('#', '')).join('-');
    const shareUrl = `${window.location.origin}${window.location.pathname}?palette=${paletteData}`;
    
    openShareModal(shareUrl, AppState.colors);
  } catch (error) {
    console.error('Share error:', error);
    showNotification('Помилка створення посилання');
  }
}

function loadPaletteFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const paletteParam = params.get('palette');
    
    if (paletteParam) {
      const hexColors = paletteParam.split('-').map(c => '#' + c.toUpperCase());
      
      if (hexColors.every(hex => isValidHexColor(hex))) {
        AppState.colors = hexColors.map((hex, i) => ({
          hex,
          locked: false,
          id: i
        }));
        AppState.colorCount = AppState.colors.length;
        if (UI.colorCountSelect) {
          UI.colorCountSelect.value = AppState.colorCount;
        }
        renderPalette(AppState.colors);
        saveToHistory('url');
        showNotification(i18n.t('paletteFromUrl'));
        
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        console.warn('Invalid colors in URL');
      }
    }
  } catch (error) {
    console.error('Error loading palette from URL:', error);
  }
}

// ============= URL COLOR EXTRACTION =============

function extractFromUrl() {
  openUrlExtractModal();
}

async function processUrlExtraction(url) {
  try {
    const sanitizedUrl = sanitizeInput(url);
    
    if (!isValidUrl(sanitizedUrl)) {
      showNotification('Невірний формат URL');
      return;
    }
    
    showNotification(i18n.t('analyzingSite'));
    
    const mockColors = generateColorPaletteFromUrl(sanitizedUrl);
    
    AppState.colors = mockColors.map((hex, index) => ({
      hex,
      locked: false,
      id: index
    }));
    
    AppState.colorCount = AppState.colors.length;
    if (UI.colorCountSelect) {
      UI.colorCountSelect.value = AppState.colorCount;
    }
    renderPalette(AppState.colors);
    saveToHistory('url-extract');
    closeUrlExtractModal();
    showNotification(i18n.t('colorsExtracted'));
  } catch (error) {
    console.error('URL extraction error:', error);
    showNotification(error.message || i18n.t('extractError'));
  }
}

// ============= ACCESSIBILITY CHECK =============

function checkAccessibility() {
  if (AppState.colors.length === 0) {
    showNotification(i18n.t('createPaletteFirst'));
    return;
  }
  
  try {
    openAccessibilityModal(AppState.colors);
  } catch (error) {
    console.error('Accessibility check error:', error);
    showNotification('Помилка перевірки доступності');
  }
}

// ============= TRENDS =============

function showTrends() {
  try {
    openTrendsModal();
  } catch (error) {
    console.error('Trends error:', error);
    showNotification('Помилка завантаження трендів');
  }
}

function loadTrendPalette(paletteColors) {
  try {
    AppState.colors = paletteColors.map((hex, i) => ({
      hex,
      locked: false,
      id: i
    }));
    AppState.colorCount = AppState.colors.length;
    if (UI.colorCountSelect) {
      UI.colorCountSelect.value = AppState.colorCount;
    }
    
    if (UI.paletteEl) {
      UI.paletteEl.classList.add('palette-animating');
      renderPalette(AppState.colors);
      
      setTimeout(() => {
        UI.paletteEl.classList.remove('palette-animating');
      }, 600);
    } else {
      renderPalette(AppState.colors);
    }
    
    saveToHistory('trend');
    closeTrendsModal();
    showNotification(i18n.t('trendPaletteLoaded'));
  } catch (error) {
    console.error('Load trend palette error:', error);
    showNotification('Помилка завантаження палітри');
  }
}

// ============= LAST PALETTE RESTORE =============

function restoreLastPalette() {
  try {
    const lastPalette = storage.getItem('lastPalette');
    if (lastPalette && AppState.colors.length === 0) {
      const colors = JSON.parse(lastPalette);
      if (Array.isArray(colors) && colors.every(c => c.hex && isValidHexColor(c.hex))) {
        AppState.colors = colors;
        AppState.colorCount = colors.length;
        if (UI.colorCountSelect) {
          UI.colorCountSelect.value = AppState.colorCount;
        }
        if (UI.paletteEl) {
          renderPalette(AppState.colors);
        }
      }
    }
  } catch (error) {
    console.error('Error loading last palette:', error);
  }
}

// ============= EVENT LISTENERS =============

function setupEventListeners() {
  // Language selector
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
    });
  }
  
  // Theme toggle
  if (UI.themeToggle) {
    UI.themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Color count selector
  if (UI.colorCountSelect) {
    UI.colorCountSelect.addEventListener('change', (e) => {
      changeColorCount(e.target.value);
    });
  }
  
  // Palette click events
  if (UI.paletteEl) {
    UI.paletteEl.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]');
      if (!action) {
        const card = e.target.closest('.color-card');
        if (card && AppState.colors.length > 0) {
          const index = Array.from(UI.paletteEl.children).indexOf(card);
          if (AppState.colors[index]) {
            copyToClipboard(AppState.colors[index].hex);
          }
        }
        return;
      }
      
      const index = parseInt(action.dataset.index);
      
      if (action.dataset.action === 'edit') {
        openColorPicker(index, AppState.colors);
      } else if (action.dataset.action === 'copy') {
        if (AppState.colors[index]) {
          copyToClipboard(AppState.colors[index].hex);
        }
      } else if (action.dataset.action === 'lock') {
        toggleLock(index);
      }
    });
  }
  
  // Saved palettes
  if (UI.savedPalettesEl) {
    UI.savedPalettesEl.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.delete-palette');
      if (deleteBtn) {
        e.stopPropagation();
        deletePalette(parseInt(deleteBtn.dataset.index));
        return;
      }
      
      const palette = e.target.closest('.saved-palette');
      if (palette) {
        loadPalette(parseInt(palette.dataset.index));
      }
    });
  }
  
  // Search and sort
  if (UI.searchPalettes) {
    UI.searchPalettes.addEventListener('input', (e) => {
      searchPalettes(e.target.value);
    });
  }
  
  if (UI.sortPalettes) {
    UI.sortPalettes.addEventListener('change', (e) => {
      sortPalettes(e.target.value);
    });
  }
  
  // History buttons
  if (UI.undoBtn) {
    UI.undoBtn.addEventListener('click', undo);
  }
  
  if (UI.redoBtn) {
    UI.redoBtn.addEventListener('click', redo);
  }
  
  if (UI.historyList) {
    UI.historyList.addEventListener('click', (e) => {
      const item = e.target.closest('.history-item');
      if (item) {
        AppState.historyIndex = parseInt(item.dataset.index);
        loadHistoryState(AppState.historyIndex);
        updateHistoryButtons(
          AppState.historyIndex > 0,
          AppState.historyIndex < AppState.history.length - 1
        );
        renderHistoryList(AppState.history, AppState.historyIndex);
      }
    });
  }
  
  // Long press on undo to show history
  let undoLongPressTimer;
  if (UI.undoBtn) {
    UI.undoBtn.addEventListener('mousedown', () => {
      undoLongPressTimer = setTimeout(() => {
        openHistoryPanel();
      }, 500);
    });
    
    UI.undoBtn.addEventListener('mouseup', () => {
      clearTimeout(undoLongPressTimer);
    });
    
    UI.undoBtn.addEventListener('mouseleave', () => {
      clearTimeout(undoLongPressTimer);
    });
  }
  
  if (UI.closeHistory) {
    UI.closeHistory.addEventListener('click', closeHistoryPanel);
  }
  
  // Main buttons
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generatePalette);
  }
  
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', savePalette);
  }
  
  const analyzeBtn = document.getElementById('analyzeBtn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', analyzePalette);
  }
  
  const previewBtn = document.getElementById('previewBtn');
  if (previewBtn) {
    previewBtn.addEventListener('click', showPreview);
  }
  
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', sharePalette);
  }
  
  const urlExtractBtn = document.getElementById('urlExtractBtn');
  if (urlExtractBtn) {
    urlExtractBtn.addEventListener('click', extractFromUrl);
  }
  
  const accessibilityBtn = document.getElementById('accessibilityBtn');
  if (accessibilityBtn) {
    accessibilityBtn.addEventListener('click', checkAccessibility);
  }
  
  const trendsBtn = document.getElementById('trendsBtn');
  if (trendsBtn) {
    trendsBtn.addEventListener('click', showTrends);
  }
  
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => openExportModal(AppState.colors));
  }
  
  // Save Palette Modal
  if (UI.closeSaveModal) {
    UI.closeSaveModal.addEventListener('click', closeSavePaletteModal);
  }
  
  if (UI.cancelSaveBtn) {
    UI.cancelSaveBtn.addEventListener('click', closeSavePaletteModal);
  }
  
  if (UI.confirmSaveBtn) {
    UI.confirmSaveBtn.addEventListener('click', confirmSavePalette);
  }
  
  // Color Picker events
  if (UI.closeModal) {
    UI.closeModal.addEventListener('click', closeColorPicker);
  }
  
  if (UI.cancelBtn) {
    UI.cancelBtn.addEventListener('click', closeColorPicker);
  }
  
  if (UI.applyBtn) {
    UI.applyBtn.addEventListener('click', applyColorChange);
  }
  
  if (UI.hueSlider) {
    UI.hueSlider.addEventListener('input', updateColorPreview);
  }
  
  if (UI.satSlider) {
    UI.satSlider.addEventListener('input', updateColorPreview);
  }
  
  if (UI.lightSlider) {
    UI.lightSlider.addEventListener('input', updateColorPreview);
  }
  
  if (UI.hexInput) {
    UI.hexInput.addEventListener('input', (e) => {
      const hex = e.target.value;
      if (isValidHexColor(hex)) {
        const hsl = hexToHSL(hex);
        if (UI.hueSlider) UI.hueSlider.value = hsl.h;
        if (UI.satSlider) UI.satSlider.value = hsl.s;
        if (UI.lightSlider) UI.lightSlider.value = hsl.l;
        updateColorPreview();
      }
    });
  }
  
  // Analysis Modal
  if (UI.closeAnalysisModal) {
    UI.closeAnalysisModal.addEventListener('click', closeAnalysisModal);
  }
  
  if (UI.closeAnalysisBtn) {
    UI.closeAnalysisBtn.addEventListener('click', closeAnalysisModal);
  }
  
  // Preview Modal
  if (UI.closePreviewModal) {
    UI.closePreviewModal.addEventListener('click', closePreviewModal);
  }
  
  if (UI.closePreviewBtn) {
    UI.closePreviewBtn.addEventListener('click', closePreviewModal);
  }
  
  // Share Modal
  if (UI.closeShareModal) {
    UI.closeShareModal.addEventListener('click', closeShareModal);
  }
  
  if (UI.closeShareBtn) {
    UI.closeShareBtn.addEventListener('click', closeShareModal);
  }
  
  if (UI.copyShareLink) {
    UI.copyShareLink.addEventListener('click', copyShareLink);
  }
  
  if (UI.downloadQR) {
    UI.downloadQR.addEventListener('click', downloadQRCode);
  }
  
  // URL Extract Modal
  if (UI.closeUrlModal) {
    UI.closeUrlModal.addEventListener('click', closeUrlExtractModal);
  }
  
  if (UI.closeUrlExtractBtn) {
    UI.closeUrlExtractBtn.addEventListener('click', closeUrlExtractModal);
  }
  
  if (UI.extractUrlBtn) {
    UI.extractUrlBtn.addEventListener('click', () => {
      const url = UI.websiteUrl ? UI.websiteUrl.value.trim() : '';
      if (url) {
        processUrlExtraction(url);
      } else {
        showNotification(i18n.t('enterUrl'));
      }
    });
  }
  
  // Accessibility Modal
  if (UI.closeAccessibilityModal) {
    UI.closeAccessibilityModal.addEventListener('click', closeAccessibilityModal);
  }
  
  if (UI.closeAccessibilityBtn) {
    UI.closeAccessibilityBtn.addEventListener('click', closeAccessibilityModal);
  }
  
  if (UI.colorBlindType) {
    UI.colorBlindType.addEventListener('change', (e) => {
      updateAccessibilityView(AppState.colors, e.target.value);
    });
  }
  
  // Trends Modal
  if (UI.closeTrendsModal) {
    UI.closeTrendsModal.addEventListener('click', closeTrendsModal);
  }
  
  if (UI.closeTrendsBtn) {
    UI.closeTrendsBtn.addEventListener('click', closeTrendsModal);
  }
  
  // Export Modal events
  if (UI.closeExportModal) {
    UI.closeExportModal.addEventListener('click', closeExportModal);
  }
  
  if (UI.closeExportBtn) {
    UI.closeExportBtn.addEventListener('click', closeExportModal);
  }
  
  if (UI.copyExportBtn) {
    UI.copyExportBtn.addEventListener('click', copyExport);
  }
  
  if (UI.downloadExportBtn) {
    UI.downloadExportBtn.addEventListener('click', () => downloadExport(AppState.colors));
  }
  
  if (UI.tabBtns) {
    UI.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        updateExportContent(AppState.colors, btn.dataset.format);
      });
    });
  }
  
  // Modal backdrop clicks
  const modals = [
    { element: UI.colorPickerModal, closeFunc: closeColorPicker },
    { element: UI.savePaletteModal, closeFunc: closeSavePaletteModal },
    { element: UI.analysisModal, closeFunc: closeAnalysisModal },
    { element: UI.previewModal, closeFunc: closePreviewModal },
    { element: UI.shareModal, closeFunc: closeShareModal },
    { element: UI.urlExtractModal, closeFunc: closeUrlExtractModal },
    { element: UI.accessibilityModal, closeFunc: closeAccessibilityModal },
    { element: UI.trendsModal, closeFunc: closeTrendsModal },
    { element: UI.exportModal, closeFunc: closeExportModal },
    { element: UI.historyPanel, closeFunc: closeHistoryPanel }
  ];
  
  modals.forEach(({ element, closeFunc }) => {
    if (element) {
      element.addEventListener('click', (e) => {
        if (e.target === element) {
          closeFunc();
        }
      });
    }
  });
  
  // Mode select change
  if (UI.modeSelect) {
    UI.modeSelect.addEventListener('change', () => {
      updateUploadButton(UI.modeSelect.value);
    });
  }
  
  // Image upload
  if (UI.uploadBtn) {
    UI.uploadBtn.addEventListener('click', () => {
      if (UI.imageInput) {
        UI.imageInput.click();
      }
    });
  }
  
  if (UI.imageInput) {
    UI.imageInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        await handleImageUpload(file);
        UI.imageInput.value = '';
      }
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Space - generate palette
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      generatePalette();
    }
    
    // Ctrl+Z - undo
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
    
    // Ctrl+Y or Ctrl+Shift+Z - redo
    if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
      e.preventDefault();
      redo();
    }
    
    // Ctrl+S - save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      savePalette();
    }
    
    // Ctrl+E - export
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      openExportModal(AppState.colors);
    }
    
    // Escape - close modals
    if (e.key === 'Escape') {
      const openModals = [
        { element: UI.colorPickerModal, closeFunc: closeColorPicker },
        { element: UI.savePaletteModal, closeFunc: closeSavePaletteModal },
        { element: UI.analysisModal, closeFunc: closeAnalysisModal },
        { element: UI.previewModal, closeFunc: closePreviewModal },
        { element: UI.shareModal, closeFunc: closeShareModal },
        { element: UI.urlExtractModal, closeFunc: closeUrlExtractModal },
        { element: UI.accessibilityModal, closeFunc: closeAccessibilityModal },
        { element: UI.trendsModal, closeFunc: closeTrendsModal },
        { element: UI.exportModal, closeFunc: closeExportModal },
        { element: UI.historyPanel, closeFunc: closeHistoryPanel }
      ];
      
      for (const { element, closeFunc } of openModals) {
        if (element && element.classList.contains('show')) {
          closeFunc();
          break;
        }
      }
    }
  });
}

// ============= INITIALIZATION =============

async function init() {
  try {
    console.log('🎨 Initializing PaletteCraft...');
    
    // Initialize i18n first
    await i18n.init();
    console.log('✓ i18n initialized');
    
    // Then initialize UI and other components
    UI.init();
    console.log('✓ UI initialized');
    
    initTheme();
    console.log('✓ Theme initialized');
    
    initLanguage();
    console.log('✓ Language initialized');
    
    setupEventListeners();
    console.log('✓ Event listeners initialized');
    
    loadPaletteFromUrl();
    console.log('✓ URL palette checked');
    
    // Try to restore last palette
    restoreLastPalette();
    console.log('✓ Last palette restored (if exists)');
    
    if (AppState.colors.length === 0) {
      await generatePalette();
      console.log('✓ Initial palette generated');
    }
    
    loadSavedPalettes();
    console.log('✓ Saved palettes loaded');
    
    console.log('🎉 PaletteCraft ready!');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    // Показуємо базове повідомлення про помилку
    const notification = document.getElementById('notification');
    if (notification) {
      notification.textContent = 'Error initializing app. Please refresh the page.';
      notification.classList.add('show');
      notification.style.background = '#ef4444';
    }
  }
}

// Start the application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle page visibility changes (автозбереження при виході)
document.addEventListener('visibilitychange', () => {
  if (document.hidden && AppState.colors.length > 0) {
    // Автозбереження поточного стану
    storage.setItem('lastPalette', JSON.stringify(AppState.colors));
  }
});
