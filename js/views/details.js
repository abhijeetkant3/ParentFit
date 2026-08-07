/* FitMom Exercise Details View Page */
import { store } from '../store.js';

export const detailsView = {
  exercises: [],
  selectedId: null,

  async render(params) {
    try {
      const res = await fetch('./data/exercises.json');
      this.exercises = await res.json();
    } catch (e) {
      console.error('Failed to load exercises.json', e);
    }

    this.selectedId = params?.id || null;
    const selectedEx = this.exercises.find(e => e.id === this.selectedId);

    if (selectedEx) {
      return this.renderSingleExercise(selectedEx);
    }

    return this.renderLibrary();
  },

  renderLibrary() {
    return `
      <div class="view-details animate-fade-in">
        <div class="mb-3">
          <h1>Exercise Library</h1>
          <p class="text-muted">Explore gentle beginner exercises with step-by-step posture illustrations & safety tips.</p>
        </div>

        <div class="flex flex-col gap-2">
          ${this.exercises.map(ex => `
            <div class="card card-interactive mb-1" onclick="location.hash='details?id=${ex.id}'">
              <div class="flex items-start gap-2">
                <div style="width: 76px; height: 76px; border-radius: 12px; overflow: hidden; background: #E8F5E9; flex-shrink: 0;">
                  ${ex.svgIllustration}
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div class="flex justify-between items-start" style="gap:8px;">
<h3
style="
font-size:1.15rem;
margin-bottom:0.15rem;
flex:1;
min-width:0;
word-break:break-word;
">
    ${ex.name}
</h3>
                    <span class="badge badge-primary">${ex.difficulty}</span>
                  </div>
                  <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 0.25rem;">🏋️ ${ex.equipment}</p>
                  <div class="flex gap-1 flex-wrap">
                    ${ex.muscles.map(m => `<span class="badge" style="background:#F1F8E9; color:#33691E; font-size:0.8rem; padding:0.15rem 0.5rem;">${m}</span>`).join('')}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderSingleExercise(ex) {
    return `
      <div class="view-details animate-fade-in">
        <button onclick="location.hash='details'" class="btn btn-outline mb-2" style="width: auto; min-height: 44px; padding: 0.4rem 1rem; font-size: 0.95rem;">
          ← Back to All Exercises
        </button>

        <div class="card mb-3">
          <div class="svg-illustration-wrapper" style="max-width: 320px;">
            ${ex.svgIllustration}
          </div>

          <div class="flex items-center justify-between"  style="align-items:flex-start; gap:8px;">
            <h1 style="font-size: 1.8rem; margin-bottom: 0;">${ex.name}</h1>
            <span class="badge badge-primary">${ex.difficulty}</span>
          </div>

          <div class="flex gap-2 text-muted mb-3" style="font-size: 1rem;">
            <span>🏋️ <strong>Equipment:</strong> ${ex.equipment}</span>
          </div>

          <div class="mb-3">
            <h3 class="mb-1" style="font-size: 1.15rem;">Muscles Targeted:</h3>
            <div class="flex gap-1 flex-wrap">
              ${ex.muscles.map(m => `<span class="badge badge-accent">${m}</span>`).join('')}
            </div>
          </div>

          <!-- Recommended Sets/Reps -->
          <div class="card card-accent mb-3" style="padding: 1rem;">
            <div class="flex justify-around items-center text-center">
              <div>
                <span class="text-muted" style="font-size: 0.85rem;">RECOMMENDED SETS</span>
                <div class="font-bold" style="font-size: 1.3rem; color: #D84315;">${ex.sets} Sets</div>
              </div>
              <div style="width: 1px; height: 35px; background: #FFE0B2;"></div>
              <div>
                <span class="text-muted" style="font-size: 0.85rem;">REPETITIONS</span>
                <div class="font-bold" style="font-size: 1.3rem; color: #D84315;">${ex.reps}</div>
              </div>
            </div>
          </div>

          <!-- Step by step -->
          <div class="mb-3">
            <h3 class="mb-1" style="font-size: 1.2rem;">Step-by-Step Instructions:</h3>
            <ol style="padding-left: 1.25rem; line-height: 1.6; font-size: 1.05rem;">
              ${ex.instructions.map(inst => `<li class="mb-1">${inst}</li>`).join('')}
            </ol>
          </div>

          <!-- Common Mistakes -->
          <div class="mb-3 card" style="background: #FFEBEE; border: 1px solid #FFCDD2;">
            <h3 class="mb-1" style="font-size: 1.15rem; color: #C62828;">⚠️ Common Mistakes to Avoid:</h3>
            <ul style="padding-left: 1.25rem; line-height: 1.5; font-size: 1rem; color: #B71C1C;">
              ${ex.mistakes.map(m => `<li class="mb-1">${m}</li>`).join('')}
            </ul>
          </div>

          <!-- Breathing Tips -->
          <div class="card" style="background: #E8F5E9; border: 1px solid #C8E6C9;">
            <h3 class="mb-1" style="font-size: 1.15rem; color: #2E7D32;">🌬️ Proper Breathing Technique:</h3>
            <p style="font-size: 1.05rem; margin-bottom: 0; color: #1B5E20;">${ex.breathing}</p>
          </div>

          <!-- Action Button -->
          <button onclick="location.hash='player?exercise=${ex.id}'" class="btn btn-primary ripple mt-3">
            ▶ Practice This Exercise Now
          </button>
        </div>
      </div>
    `;
  }
};
