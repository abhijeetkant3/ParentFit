/* Parentfit Core ES6 Application Entrypoint */
import { store } from './store.js';
import { router } from './router.js';
import { renderHeader, initHeaderEvents } from './components/header.js';
import { renderNavbar } from './components/navbar.js';

import { homeView } from './views/home.js';
import { scheduleView } from './views/schedule.js';
import { playerView } from './views/player.js';
import { detailsView } from './views/details.js';
import { progressView } from './views/progress.js';
import { nutritionView } from './views/nutrition.js';
import { settingsView } from './views/settings.js';
import { aboutView } from './views/about.js';

class ParentfitApp {
  init() {
    this.applySettingsTheme();

    // Register Routes
    router.register('home', homeView);
    router.register('schedule', scheduleView);
    router.register('player', playerView);
    router.register('details', detailsView);
    router.register('progress', progressView);
    router.register('nutrition', nutritionView);
    router.register('settings', settingsView);
    router.register('about', aboutView);

    // Render Static Structural Components
    const appElem = document.getElementById('app');
    if (appElem) {
      appElem.innerHTML = `
        ${renderHeader()}
        <main id="main-content" role="main"></main>
        ${renderNavbar()}
      `;
    }

    initHeaderEvents();

    // Subscribe to store updates for real-time theme adjustment
    store.subscribe(() => this.applySettingsTheme());

    // Initialize Router to render view into #main-content
    const mainContent = document.getElementById('main-content');
    router.init(mainContent);

    // Register Service Worker for PWA Offline mode
    this.registerServiceWorker();

    // Handle PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredPWAInstallPrompt = e;
    });
  }

  applySettingsTheme() {
    const { darkMode, fontSize } = store.state.settings;

    // Dark Mode class
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Font Legibility Size
    if (fontSize === 'xlarge') {
      document.documentElement.style.fontSize = '22px';
    } else if (fontSize === 'normal') {
      document.documentElement.style.fontSize = '16px';
    } else {
      // Large (Default Senior Friendly)
      document.documentElement.style.fontSize = '19px';
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => console.log('[ServiceWorker] Registered with scope:', reg.scope))
          .catch((err) => console.warn('[ServiceWorker] Registration failed:', err));
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new ParentfitApp();
  app.init();
});
