/* Parentfit Progress & Weight Tracking View Page */
import { store } from '../store.js';
import { modalManager } from '../components/modal.js';
import { t } from '../services/languageService.js';

export const progressView = {
  async render() {
    const streak = store.state.streak;
    const completedWorkouts = store.state.completedWorkouts;
    const weightHistory = store.state.weightHistory;
    const latestWeight = store.getLatestWeight();

    return `
      <div class="view-progress animate-fade-in">
        <div class="mb-3">
          <h1>${t('progress.title')}</h1>
          <p class="text-muted">${t('progress.subtitle')}</p>
        </div>

        <!-- Highlights Grid -->
        <div class="stats-grid mb-3">
          <div class="stat-card">
            <div style="font-size: 2rem;">🔥</div>
            <div class="stat-value">${t('home.daysUnit', { count: streak })}</div>
            <div class="stat-label">${t('progress.activeStreak')}</div>
          </div>

          <div class="stat-card">
            <div style="font-size: 2rem;">💪</div>
            <div class="stat-value">${completedWorkouts.length}</div>
            <div class="stat-label">${t('progress.totalWorkouts')}</div>
          </div>
        </div>

        <!-- Weight Tracking Section -->
        <div class="card mb-3">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h2 style="font-size: 1.35rem; margin-bottom: 0;">${t('progress.weightTracker')}</h2>
              <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 0;">${t('progress.currentWeight', { weight: latestWeight })}</p>
            </div>
            <button id="progress-log-weight-btn" class="btn btn-primary" style="width: auto; min-height: 44px; padding: 0.4rem 1.1rem; font-size: 0.95rem;">
              ${t('progress.logWeightBtn')}
            </button>
          </div>

          <!-- Weight Visualizer Bars -->
          <div class="mb-3" style="background: var(--background); padding: 1rem; border-radius: 12px;">
            <span class="text-muted font-semibold" style="font-size: 0.85rem;">${t('progress.recentLogHeader')}</span>
            <div class="flex items-end gap-2 mt-2" style="height: 100px; padding-bottom: 0.5rem; border-bottom: 2px solid var(--border-color);">
              ${weightHistory.slice(0, 6).reverse().map(item => {
                const min = Math.min(...weightHistory.map(w => w.weight)) - 2;
                const max = Math.max(...weightHistory.map(w => w.weight)) + 2;
                const range = (max - min) || 1;
                const heightPercent = Math.max(20, Math.min(100, ((item.weight - min) / range) * 100));

                return `
                  <div class="flex flex-col items-center" style="flex: 1; height: 100%;">
                    <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary-dark);">${item.weight}</span>
                    <div style="width: 100%; max-width: 24px; background: var(--primary); border-radius: 6px 6px 0 0; height: ${heightPercent}%; margin-top: auto;"></div>
                    <span style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">${item.date.slice(5)}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Workout History List -->
        <div class="card mb-3">
          <h2 style="font-size: 1.35rem;" class="mb-2">${t('progress.completedHistory')}</h2>
          
          ${completedWorkouts.length === 0 ? `
            <div class="text-center text-muted" style="padding: 1.5rem 0;">
              <p>${t('progress.noWorkoutsYet')}</p>
              <p style="font-size: 0.95rem;">${t('progress.startFirstSession')}</p>
              <button onclick="location.hash='schedule'" class="btn btn-secondary mt-1" style="width: auto; margin: 0 auto;">
                ${t('progress.viewScheduleBtn')}
              </button>
            </div>
          ` : `
            <div class="flex flex-col gap-2">
              ${completedWorkouts.slice(0, 10).map(w => `
                <div class="flex items-center justify-between" style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
                  <div>
                    <h4 style="margin-bottom: 0; font-size: 1.05rem;">${w.title}</h4>
                    <span class="text-muted" style="font-size: 0.85rem;">📅 ${w.date} • ⏱️ ${t('progress.minUnit', { min: Math.round(w.durationSec / 60) })}</span>
                  </div>
                  <span class="badge badge-primary">${t('progress.completedTag')}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  },

  postRender() {
    const logBtn = document.getElementById('progress-log-weight-btn');
    if (logBtn) {
      logBtn.onclick = () => {
        const currentW = store.getLatestWeight();
        modalManager.show({
          title: t('home.logWeightModalTitle'),
          bodyHTML: `
            <div class="input-group">
              <label class="input-label" for="weight-input-progress">${t('home.weightInputLabel')}</label>
              <input id="weight-input-progress" type="number" step="0.1" class="input-field" value="${currentW}" autofocus />
            </div>
          `,
          primaryText: t('home.saveWeightBtn'),
          onPrimary: () => {
            const val = parseFloat(document.getElementById('weight-input-progress')?.value);
            if (!isNaN(val) && val > 30 && val < 250) {
              store.addWeightLog(val);
            } else {
              alert(t('home.validWeightAlert'));
              return false;
            }
          }
        });
      };
    }
  }
};

