/* Parentfit Settings View Page */
import { store } from '../store.js';
import { modalManager } from '../components/modal.js';
import { t } from '../services/languageService.js';

export const settingsView = {
  async render() {
    const { userName, darkMode, soundEnabled, fontSize, targetWeight, language } = store.state.settings;

    return `
      <div class="view-settings animate-fade-in">
        <div class="mb-3">
          <h1>${t('settings.title')}</h1>
          <p class="text-muted">${t('settings.subtitle')}</p>
        </div>

        <!-- Appearance & Accessibility Card -->
        <div class="card mb-3">
          <h2 style="font-size: 1.25rem;" class="mb-2">${t('settings.displayAccess')}</h2>

          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 style="font-size: 1.1rem; margin-bottom: 0;">${t('settings.darkTheme')}</h3>
              <span class="text-muted" style="font-size: 0.9rem;">${t('settings.darkThemeSub')}</span>
            </div>
            <button id="settings-dark-toggle" class="btn btn-outline" style="width: auto; min-height: 44px; padding: 0.4rem 1.25rem;">
              ${darkMode ? t('settings.onStatus') : t('settings.offStatus')}
            </button>
          </div>

          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 style="font-size: 1.1rem; margin-bottom: 0;">${t('settings.audioBeeps')}</h3>
              <span class="text-muted" style="font-size: 0.9rem;">${t('settings.audioSub')}</span>
            </div>
            <button id="settings-sound-toggle" class="btn btn-outline" style="width: auto; min-height: 44px; padding: 0.4rem 1.25rem;">
              ${soundEnabled ? t('settings.soundOnStatus') : t('settings.soundOffStatus')}
            </button>
          </div>

          <div class="input-group mb-3">
            <label class="input-label" for="settings-text-size">${t('settings.textSizeLabel')}</label>
            <select id="settings-text-size" class="input-field">
              <option value="normal" ${fontSize === 'normal' ? 'selected' : ''}>${t('settings.sizeNormal')}</option>
              <option value="large" ${fontSize === 'large' ? 'selected' : ''}>${t('settings.sizeLarge')}</option>
              <option value="xlarge" ${fontSize === 'xlarge' ? 'selected' : ''}>${t('settings.sizeXLarge')}</option>
            </select>
          </div>

          <!-- Language Selection -->
          <div class="input-group mb-0">
            <label class="input-label">🌐 ${t('settings.languageLabel')}</label>
            <div class="flex gap-2">
              <button id="lang-en-btn" class="btn ${language === 'English' ? 'btn-primary' : 'btn-outline'}" style="flex: 1; min-height: 48px; font-size: 1rem;">
                ${t('settings.languageEnglish')}
              </button>
              <button id="lang-hi-btn" class="btn ${language === 'Hindi' ? 'btn-primary' : 'btn-outline'}" style="flex: 1; min-height: 48px; font-size: 1rem;">
                ${t('settings.languageHindi')}
              </button>
              <button id="lang-ja-btn" class="btn ${language === 'Japanese' ? 'btn-primary' : 'btn-outline'}" style="flex: 1; min-height: 48px; font-size: 1rem;">
                ${t('settings.languageJapanese')}
              </button>
            </div>
          </div>
        </div>

        <!-- User Profile Card -->
        <div class="card mb-3">
          <h2 style="font-size: 1.25rem;" class="mb-2">${t('settings.userProfile')}</h2>

          <div class="input-group mb-2">
            <label class="input-label" for="settings-name">${t('settings.yourName')}</label>
            <input id="settings-name" type="text" class="input-field" value="${userName}" placeholder="e.g. Mom" />
          </div>

          <div class="input-group mb-3">
            <label class="input-label" for="settings-target-weight">${t('settings.targetWeight')}</label>
            <input id="settings-target-weight" type="number" step="0.5" class="input-field" value="${targetWeight}" />
          </div>

          <button id="settings-save-profile-btn" class="btn btn-primary ripple">
            ${t('settings.saveProfileBtn')}
          </button>
        </div>

        <!-- PWA Installation & Data Card -->
        <div class="card mb-3">
          <h2 style="font-size: 1.25rem;" class="mb-2">${t('settings.appStorage')}</h2>

          <div class="mb-3">
            <button id="pwa-install-btn" class="btn btn-secondary" style="display: none; width: 100%;">
              ${t('settings.installPwaBtn')}
            </button>
            <p id="pwa-installed-msg" class="text-muted text-center" style="font-size: 0.95rem;">
              ${t('settings.pwaReadyMsg')}
            </p>
          </div>

          <div class="card" style="background: #FFEBEE; border: 1px solid #FFCDD2; margin-bottom: 0;">
            <h3 style="font-size: 1.1rem; color: #C62828;" class="mb-1">${t('settings.resetDataTitle')}</h3>
            <p style="font-size: 0.9rem; color: #B71C1C;" class="mb-2">${t('settings.resetDataSub')}</p>
            <button id="settings-reset-data-btn" class="btn" style="background: #D32F2F; color: #FFFFFF; min-height: 48px;">
              ${t('settings.resetDataBtn')}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  postRender() {
    const darkToggle = document.getElementById('settings-dark-toggle');
    const soundToggle = document.getElementById('settings-sound-toggle');
    const textSizeSelect = document.getElementById('settings-text-size');
    const langEnBtn = document.getElementById('lang-en-btn');
    const langHiBtn = document.getElementById('lang-hi-btn');
    const langJaBtn = document.getElementById('lang-ja-btn');
    const saveProfileBtn = document.getElementById('settings-save-profile-btn');
    const resetDataBtn = document.getElementById('settings-reset-data-btn');

    if (darkToggle) {
      darkToggle.onclick = () => {
        store.updateSettings({ darkMode: !store.state.settings.darkMode });
      };
    }

    if (soundToggle) {
      soundToggle.onclick = () => {
        store.updateSettings({ soundEnabled: !store.state.settings.soundEnabled });
      };
    }

    if (textSizeSelect) {
      textSizeSelect.onchange = (e) => {
        store.updateSettings({ fontSize: e.target.value });
      };
    }

    if (langEnBtn) {
      langEnBtn.onclick = () => {
        store.updateSettings({ language: 'English' });
      };
    }

    if (langHiBtn) {
      langHiBtn.onclick = () => {
        store.updateSettings({ language: 'Hindi' });
      };
    }

    if (langJaBtn) {
      langJaBtn.onclick = () => {
        store.updateSettings({ language: 'Japanese' });
      };
    }

    if (saveProfileBtn) {
      saveProfileBtn.onclick = () => {
        const nameVal = document.getElementById('settings-name')?.value || 'Mom';
        const targetW = parseFloat(document.getElementById('settings-target-weight')?.value) || 65;
        store.updateSettings({ userName: nameVal, targetWeight: targetW });
        alert(t('settings.profileSavedAlert'));
      };
    }

    if (resetDataBtn) {
      resetDataBtn.onclick = () => {
        modalManager.show({
          title: t('settings.resetModalTitle'),
          bodyHTML: `<p style="color: #C62828;">${t('settings.resetModalBody')}</p>`,
          primaryText: t('settings.resetModalPrimary'),
          onPrimary: () => {
            store.resetAllData();
            window.location.hash = 'home';
          }
        });
      };
    }

    // PWA Install prompt handling
    if (window.deferredPWAInstallPrompt) {
      const pwaBtn = document.getElementById('pwa-install-btn');
      if (pwaBtn) {
        pwaBtn.style.display = 'block';
        pwaBtn.onclick = async () => {
          window.deferredPWAInstallPrompt.prompt();
          const choice = await window.deferredPWAInstallPrompt.userChoice;
          if (choice.outcome === 'accepted') {
            console.log('User installed Parentfit PWA');
          }
          window.deferredPWAInstallPrompt = null;
          pwaBtn.style.display = 'none';
        };
      }
    }
  }
};

