/* Parentfit About & Safety View Page */
import { t } from '../services/languageService.js';

export const aboutView = {
  async render() {
    return `
      <div class="view-about animate-fade-in">
        <!-- Hero Card -->
        <div class="card card-hero text-center mb-3">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">❤️</div>
          <h1 style="font-size: 2rem;">${t('about.title')}</h1>
          <p style="opacity: 0.95; font-size: 1.15rem;">${t('about.subtitle')}</p>
          <span class="badge badge-accent mt-1">${t('about.version')}</span>
        </div>

        <!-- Mission Card -->
        <div class="card mb-3">
          <h2 style="font-size: 1.35rem;" class="mb-2">${t('about.missionTitle')}</h2>
          <p style="font-size: 1.05rem; line-height: 1.6;">
            ${t('about.missionBody')}
          </p>
        </div>

        <!-- Safety Disclaimer Card -->
        <div class="card mb-3" style="background: #FFF3E0; border: 1px solid #FFE0B2;">
          <div class="flex items-center gap-2 mb-1">
            <span style="font-size: 1.6rem;">🩺</span>
            <h3 style="font-size: 1.25rem; margin-bottom: 0; color: #E65100;">${t('about.safetyTitle')}</h3>
          </div>
          <p style="font-size: 1rem; color: #E65100; line-height: 1.6; margin-bottom: 0;">
            ${t('about.safetyBody')}
          </p>
        </div>

        <!-- Golden Rules Card -->
        <div class="card mb-3">
          <h2 style="font-size: 1.35rem;" class="mb-2">${t('about.goldenRulesTitle')}</h2>
          <ol style="padding-left: 1.25rem; line-height: 1.6; font-size: 1.05rem;">
            <li class="mb-2"><strong>${t('about.rule1Title')}</strong>${t('about.rule1Text')}</li>
            <li class="mb-2"><strong>${t('about.rule2Title')}</strong>${t('about.rule2Text')}</li>
            <li class="mb-2"><strong>${t('about.rule3Title')}</strong>${t('about.rule3Text')}</li>
          </ol>
        </div>

        <!-- Footer Info -->
        <div class="text-center text-muted mb-3" style="font-size: 0.95rem;">
          <p>${t('about.footerText')}</p>
        </div>
      </div>
    `;
  }
};

