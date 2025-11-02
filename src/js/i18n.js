// ============= INTERNATIONALIZATION (i18n) =============

class I18n {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.translations = {};
    this.isLoaded = false;
    this.loadingPromises = new Map();
  }
  
  async init() {
    try {
      await this.loadTranslations();
      this.isLoaded = true;
      this.updateUI();
    } catch (error) {
      console.error('Failed to initialize i18n:', error);
      throw error;
    }
  }
  
  async loadTranslations() {
    const languages = ['ua', 'ru', 'en'];
    const loadPromises = [];
    
    for (const lang of languages) {
      if (this.loadingPromises.has(lang)) {
        loadPromises.push(this.loadingPromises.get(lang));
        continue;
      }
      
      const promise = this.loadLanguage(lang);
      this.loadingPromises.set(lang, promise);
      loadPromises.push(promise);
    }
    
    await Promise.all(loadPromises);
  }
  
  async loadLanguage(lang) {
    try {
      const response = await fetch(`src/locales/${lang}.json`, {
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.translations[lang] = data;
      
      console.log(`✓ Loaded translations for ${lang}`);
      return data;
    } catch (error) {
      console.error(`Failed to load ${lang}.json:`, error.message);
      throw error;
    }
  }
  
  detectLanguage() {
    const saved = localStorage.getItem('language');
    if (saved && ['ua', 'ru', 'en'].includes(saved)) {
      return saved;
    }
    
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('uk')) return 'ua';
    if (browserLang.startsWith('ru')) return 'ru';
    
    return 'en';
  }
  
  async setLanguage(lang) {
    if (!['ua', 'ru', 'en'].includes(lang)) {
      console.error(`Invalid language: ${lang}`);
      return;
    }
    
    if (!this.translations[lang] || Object.keys(this.translations[lang]).length === 0) {
      try {
        await this.loadLanguage(lang);
      } catch (error) {
        console.error(`Failed to load language ${lang}:`, error);
        throw error;
      }
    }
    
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    this.updateUI();
  }
  
  t(key, defaultValue = '') {
    if (!this.translations[this.currentLang]) {
      console.warn(`No translations for language: ${this.currentLang}`);
      return defaultValue || key;
    }
    
    const translation = this.translations[this.currentLang][key];
    
    if (!translation) {
      if (this.currentLang !== 'en' && this.translations['en']?.[key]) {
        return this.translations['en'][key];
      }
      
      console.warn(`Translation missing for key: ${key} in language: ${this.currentLang}`);
      return defaultValue || key;
    }
    
    return translation;
  }
  
  getCurrentLanguage() {
    return this.currentLang;
  }
  
  updateUI() {
    if (!this.isLoaded) return;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.hasAttribute('placeholder')) {
          el.placeholder = translation;
        } else {
          el.value = translation;
        }
      } else if (el.tagName === 'OPTION') {
        el.textContent = translation;
      } else {
        el.textContent = translation;
      }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });
    
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { 
        lang: this.currentLang,
        translations: this.translations[this.currentLang]
      } 
    }));
  }
  
  getAllTranslations() {
    return this.translations[this.currentLang] || {};
  }
  
  isLanguageLoaded(lang) {
    return this.translations[lang] && Object.keys(this.translations[lang]).length > 0;
  }
}

// Створюємо глобальний екземпляр
const i18n = new I18n();

// Експорт для використання в інших файлах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { i18n, I18n };
}
