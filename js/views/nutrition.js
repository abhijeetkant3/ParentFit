/* FitMom Nutrition & Water Tracker View Page */
import { store } from '../store.js';

export const nutritionView = {
  async render() {
    let nutritionData = { waterGoalCups: 8, dailyTips: [], mealIdeas: [] };
    try {
      const res = await fetch('./data/nutrition.json');
      nutritionData = await res.json();
    } catch (e) {
      console.error('Failed to load nutrition.json', e);
    }

    const waterCount = store.state.waterIntake.count;
    const goal = nutritionData.waterGoalCups || 8;

    return `
      <div class="view-nutrition animate-fade-in">
        <div class="mb-3">
          <h1>Nutrition & Hydration</h1>
          <p class="text-muted">Nourish your body with simple, wholesome food and daily hydration guidance.</p>
        </div>

        <!-- Interactive Water Tracker Card -->
        <div class="card card-accent mb-3">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <span style="font-size: 1.8rem;">💧</span>
              <div>
                <h2 style="font-size: 1.35rem; margin-bottom: 0; color: #1E88E5;">Daily Water Tracker</h2>
                <span class="text-muted" style="font-size: 0.95rem;">Goal: ${goal} glasses (2 Liters)</span>
              </div>
            </div>
            <span class="font-bold" style="font-size: 1.4rem; color: #1E88E5;">${waterCount} / ${goal}</span>
          </div>

          <!-- Interactive Cups Grid -->
          <div class="water-cups-grid">
            ${Array.from({ length: goal }).map((_, idx) => `
              <button class="water-cup-btn ${idx < waterCount ? 'filled' : ''}" data-index="${idx + 1}" aria-label="Water cup ${idx + 1}">
                🥛
              </button>
            `).join('')}
          </div>

          <div class="flex justify-between mt-3">
            <button id="water-minus-btn" class="btn btn-outline" style="min-height: 44px; width: 48%; padding: 0;">- Remove Cup</button>
            <button id="water-plus-btn" class="btn btn-primary" style="min-height: 44px; width: 48%; padding: 0;">+ Drink Cup 🥛</button>
          </div>
        </div>

        <!-- Daily Health Tips -->
        <h2 style="font-size: 1.35rem;" class="mb-2">Vital Health Guidance</h2>
        <div class="flex flex-col gap-2 mb-3">
          ${nutritionData.dailyTips.map(tip => `
            <div class="card mb-1" style="padding: 1.15rem;">
              <div class="flex items-center gap-2 mb-1">
                <span style="font-size: 1.6rem;">${tip.icon}</span>
                <div>
                  <span class="badge badge-primary" style="font-size: 0.8rem;">${tip.category}</span>
                  <h3 style="font-size: 1.15rem; margin-bottom: 0;">${tip.title}</h3>
                </div>
              </div>
              <p style="font-size: 1rem; color: var(--text-muted); margin-bottom: 0; padding-left: 2.2rem;">
                ${tip.detail}
              </p>
            </div>
          `).join('')}
        </div>

        <!-- Healthy Meal Ideas -->
        <h2 style="font-size: 1.35rem;" class="mb-2">Wholesome Meal Ideas</h2>
        <div class="flex flex-col gap-2">
          ${nutritionData.mealIdeas.map(meal => `
            <div class="card mb-1">
              <div class="flex items-center justify-between mb-1">
                <span class="badge badge-accent">${meal.meal}</span>
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">${meal.calories}</span>
              </div>
              <h3 style="font-size: 1.2rem; margin-bottom: 0.25rem;">${meal.title}</h3>
              <p style="font-size: 1rem; color: var(--text-muted); margin-bottom: 0;">${meal.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  postRender() {
    const waterCount = store.state.waterIntake.count;

    const plusBtn = document.getElementById('water-plus-btn');
    const minusBtn = document.getElementById('water-minus-btn');

    if (plusBtn) {
      plusBtn.onclick = () => {
        store.setWaterCount(waterCount + 1);
        window.location.reload();
      };
    }

    if (minusBtn) {
      minusBtn.onclick = () => {
        store.setWaterCount(waterCount - 1);
        window.location.reload();
      };
    }

    // Direct Cup Clicks
    const cupBtns = document.querySelectorAll('.water-cup-btn');
    cupBtns.forEach(btn => {
      btn.onclick = () => {
        const targetIndex = parseInt(btn.getAttribute('data-index'), 10);
        store.setWaterCount(targetIndex);
        window.location.reload();
      };
    });
  }
};
