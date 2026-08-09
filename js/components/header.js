/* Parentfit Top App Header Component */
import { store } from '../store.js';

let isDrawerOpen = false;

export function renderHeader() {
  return `
    <header class="app-header" role="banner">
      <div class="brand-logo" onclick="location.hash='home'" style="cursor: pointer;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
        <span>Parentfit</span>
      </div>

      <div class="flex items-center gap-1">
        <button id="header-hamburger-toggle" class="header-action-btn" aria-label="Open menu" aria-expanded="false" title="Menu">
          <span id="header-hamburger-icon" style="font-size: 1.3rem; line-height: 1;" aria-hidden="true">☰</span>
        </button>
      </div>
    </header>

    <!-- Backdrop for Mobile Drawer -->
    <div id="nav-drawer-backdrop" class="nav-drawer-backdrop"></div>

    <!-- Right-Side Navigation Drawer -->
    <aside id="nav-drawer" class="nav-drawer" aria-label="Navigation Menu">
      <div class="nav-drawer-header">
        <h2 class="nav-drawer-title">Menu</h2>
        <button id="drawer-close-btn" class="header-action-btn" aria-label="Close menu" title="Close menu">
          <span style="font-size: 1.2rem; line-height: 1;" aria-hidden="true">✕</span>
        </button>
      </div>
      <div class="nav-drawer-body">
        <ul class="nav-drawer-menu" role="menu">
          <li role="none">
            <button id="drawer-settings-btn" class="drawer-item-btn" role="menuitem">
              <span style="font-size: 1.3rem;" aria-hidden="true">⚙️</span>
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  `;
}

export function openDrawer() {
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  const toggleBtn = document.getElementById('header-hamburger-toggle');
  const toggleIcon = document.getElementById('header-hamburger-icon');

  if (drawer && backdrop) {
    isDrawerOpen = true;
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close menu');
    }
    if (toggleIcon) {
      toggleIcon.textContent = '✕';
    }
  }
}

export function closeDrawer() {
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  const toggleBtn = document.getElementById('header-hamburger-toggle');
  const toggleIcon = document.getElementById('header-hamburger-icon');

  if (drawer && backdrop) {
    isDrawerOpen = false;
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open menu');
    }
    if (toggleIcon) {
      toggleIcon.textContent = '☰';
    }
  }
}

export function toggleDrawer() {
  if (isDrawerOpen) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

export function initHeaderEvents() {
  const hamburgerBtn = document.getElementById('header-hamburger-toggle');
  const closeBtn = document.getElementById('drawer-close-btn');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  const settingsBtn = document.getElementById('drawer-settings-btn');

  if (hamburgerBtn) {
    hamburgerBtn.onclick = (e) => {
      e.stopPropagation();
      toggleDrawer();
    };
  }

  if (closeBtn) {
    closeBtn.onclick = () => {
      closeDrawer();
    };
  }

  if (backdrop) {
    backdrop.onclick = () => {
      closeDrawer();
    };
  }

  if (settingsBtn) {
    settingsBtn.onclick = () => {
      closeDrawer();
      window.location.hash = 'settings';
    };
  }

  // Keyboard accessibility: Escape key closes drawer
  document.addEventListener('keydown', (e) => {
    if (isDrawerOpen && e.key === 'Escape') {
      closeDrawer();
    }
  });

  // Close drawer on route change
  window.addEventListener('hashchange', () => {
    if (isDrawerOpen) {
      closeDrawer();
    }
  });
}

