/* Parentfit Bottom Navigation Bar Component */
import { t } from '../services/languageService.js';

export function renderNavbar() {
  return `
    <nav class="bottom-navbar" aria-label="Main Navigation">
      <button class="nav-item active" data-route="home" onclick="location.hash='home'" aria-label="${t('navbar.home')}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>${t('navbar.home')}</span>
      </button>

      <button class="nav-item" data-route="schedule" onclick="location.hash='schedule'" aria-label="${t('navbar.schedule')}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        <span>${t('navbar.schedule')}</span>
      </button>

      <button class="nav-item" data-route="details" onclick="location.hash='details'" aria-label="${t('navbar.exercises')}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.4 14.4 9.6 9.6"/>
          <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l.707-.707a2 2 0 1 1 2.829 2.828l-.707.707z"/>
          <path d="M3.515 6.343a2 2 0 1 1 2.828-2.828l.707.707a2 2 0 1 1-2.828 2.828l-.707-.707z"/>
          <path d="m5.636 12.707 5.657-5.657"/>
          <path d="m11.293 18.364 5.657-5.657"/>
        </svg>
        <span>${t('navbar.exercises')}</span>
      </button>

      <button class="nav-item" data-route="progress" onclick="location.hash='progress'" aria-label="${t('navbar.progress')}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" x2="18" y1="20" y2="10"/>
          <line x1="12" x2="12" y1="20" y2="4"/>
          <line x1="6" x2="6" y1="20" y2="14"/>
        </svg>
        <span>${t('navbar.progress')}</span>
      </button>

      <button class="nav-item" data-route="nutrition" onclick="location.hash='nutrition'" aria-label="${t('navbar.nutrition')}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        <span>${t('navbar.nutrition')}</span>
      </button>
    </nav>
  `;
}
