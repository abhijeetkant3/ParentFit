/* FitMom Top App Header Component */
import { store } from '../store.js';

export function renderHeader() {
  const { darkMode } = store.state.settings;
  
  return `
    <header class="app-header" role="banner">
      <div class="brand-logo" onclick="location.hash='home'" style="cursor: pointer;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
        <span>FitMom</span>
      </div>

      <div class="flex items-center gap-1">
        <button id="header-theme-toggle" class="header-action-btn" aria-label="Toggle Dark Mode" title="Toggle Theme">
          ${darkMode ? '☀️' : '🌙'}
        </button>
        <button onclick="location.hash='settings'" class="header-action-btn" aria-label="Open Settings" title="Settings">
          ⚙️
        </button>
      </div>
    </header>
  `;
}

export function initHeaderEvents() {
  const themeBtn = document.getElementById('header-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = store.state.settings.darkMode;
      store.updateSettings({ darkMode: !current });
    });
  }
}
