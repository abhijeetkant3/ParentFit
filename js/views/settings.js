/* FitMom Settings View Page */
import { store } from '../store.js';
import { modalManager } from '../components/modal.js';

export const settingsView = {
  async render() {
    const { userName, darkMode, soundEnabled, fontSize, targetWeight, language } = store.state.settings;

    return `
      <div class="view-settings animate-fade-in">
        <div class="mb-3">
          <h1>App Settings</h1>
          <p class="text-muted">Personalize your FitMom experience for comfort and legibility.</p>
        </div>

        <!-- Appearance & Accessibility Card -->
        <div class="card mb-3">
          <h2 style="font-size: 1.25rem;" class="mb-2">Display & Accessibility</h2>

          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 style="font-size: 1.1rem; margin-bottom: 0;">Dark Theme</h3>
              <span class="text-muted" style="font-size: 0.9rem;">Easier on eyes in low light</span>
            </div>
            <button id="settings-dark-toggle" class="btn btn-outline" style="width: auto; min-height: 44px; padding: 0.4rem 1.25rem;">
              ${darkMode ? '☀️ On' : '🌙 Off'}
            </button>
          </div>

          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 style="font-size: 1.1rem; margin-bottom: 0;">Audio Guidance Beeps</h3>
              <span class="text-muted" style="font-size: 0.9rem;">Timer ticks & success sounds</span>
            </div>
            <button id="settings-sound-toggle" class="btn btn-outline" style="width: auto; min-height: 44px; padding: 0.4rem 1.25rem;">
              ${soundEnabled ? '🔊 On' : '🔇 Off'}
            </button>
          </div>

          <div class="input-group mb-0">
            <label class="input-label" for="settings-text-size">Text Legibility Size:</label>
            <select id="settings-text-size" class="input-field">
              <option value="normal" ${fontSize === 'normal' ? 'selected' : ''}>Standard Size</option>
              <option value="large" ${fontSize === 'large' ? 'selected' : ''}>Large (Senior Friendly - Recommended)</option>
              <option value="xlarge" ${fontSize === 'xlarge' ? 'selected' : ''}>Extra Large Text</option>
            </select>
          </div>
        </div>

        <!-- User Profile Card -->
        <div class="card mb-3">
          <h2 style="font-size: 1.25rem;" class="mb-2">User Profile</h2>

          <div class="input-group mb-2">
            <label class="input-label" for="settings-name">Your Name:</label>
            <input id="settings-name" type="text" class="input-field" value="${userName}" placeholder="e.g. Mom" />
          </div>

          <div class="input-group mb-3">
            <label class="input-label" for="settings-target-weight">Target Weight (kg):</label>
            <input id="settings-target-weight" type="number" step="0.5" class="input-field" value="${targetWeight}" />
          </div>

          <button id="settings-save-profile-btn" class="btn btn-primary ripple">
            Save Profile Changes
          </button>
        </div>

        <!-- PWA Installation & Data Card -->
        <div class="card mb-3">
          <h2 style="font-size: 1.25rem;" class="mb-2">App & Storage</h2>

          <div class="mb-3">
            <button id="pwa-install-btn" class="btn btn-secondary" style="display: none; width: 100%;">
              📲 Install FitMom on Home Screen
            </button>
            <p id="pwa-installed-msg" class="text-muted text-center" style="font-size: 0.95rem;">
              ✓ FitMom is ready for offline use!
            </p>
          </div>

          <div class="card" style="background: #FFEBEE; border: 1px solid #FFCDD2; margin-bottom: 0;">
            <h3 style="font-size: 1.1rem; color: #C62828;" class="mb-1">Reset App Data</h3>
            <p style="font-size: 0.9rem; color: #B71C1C;" class="mb-2">Clears workout history, weight logs, and resets settings.</p>
            <button id="settings-reset-data-btn" class="btn" style="background: #D32F2F; color: #FFFFFF; min-height: 48px;">
              ⚠️ Reset All Local Data
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
    const saveProfileBtn = document.getElementById('settings-save-profile-btn');
    const resetDataBtn = document.getElementById('settings-reset-data-btn');

    if (darkToggle) {
      darkToggle.onclick = () => {
        store.updateSettings({ darkMode: !store.state.settings.darkMode });
        window.location.reload();
      };
    }

    if (soundToggle) {
      soundToggle.onclick = () => {
        store.updateSettings({ soundEnabled: !store.state.settings.soundEnabled });
        window.location.reload();
      };
    }

    if (textSizeSelect) {
      textSizeSelect.onchange = (e) => {
        store.updateSettings({ fontSize: e.target.value });
        window.location.reload();
      };
    }

    if (saveProfileBtn) {
      saveProfileBtn.onclick = () => {
        const nameVal = document.getElementById('settings-name')?.value || 'Mom';
        const targetW = parseFloat(document.getElementById('settings-target-weight')?.value) || 65;
        store.updateSettings({ userName: nameVal, targetWeight: targetW });
        alert('Profile saved successfully! ❤️');
      };
    }

    if (resetDataBtn) {
      resetDataBtn.onclick = () => {
        modalManager.show({
          title: 'Confirm Reset',
          bodyHTML: '<p style="color: #C62828;">Are you sure you want to clear all your workout logs and settings? This action cannot be undone.</p>',
          primaryText: 'Yes, Reset Everything',
          onPrimary: () => {
            store.resetAllData();
            window.location.hash = 'home';
            window.location.reload();
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
            console.log('User installed FitMom PWA');
          }
          window.deferredPWAInstallPrompt = null;
          pwaBtn.style.display = 'none';
        };
      }
    }
  }
};
