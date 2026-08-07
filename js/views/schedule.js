/* FitMom Weekly Schedule View Page */
import { store } from '../store.js';

export const scheduleView = {
  async render() {
    let weeklyPlan = [];
    try {
      const res = await fetch('./data/schedule.json');
      const data = await res.json();
      weeklyPlan = data.weeklyPlan || [];
    } catch (e) {
      console.error('Failed to load schedule.json', e);
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    const completedWorkouts = store.state.completedWorkouts;
    const todayStr = new Date().toISOString().split('T')[0];

    return `
      <div class="view-schedule animate-fade-in">
        <div class="mb-3">
          <h1>Weekly Schedule</h1>
          <p class="text-muted">A gentle, balanced 7-day plan designed for consistent progress without strain.</p>
        </div>

        <div class="schedule-list flex flex-col gap-2">
          ${weeklyPlan.map((plan) => {
            const isToday = plan.day === todayName;
            const isRest = plan.intensity === 'Rest';
            
            // Check if completed today
            const isDoneToday = isToday && completedWorkouts.some(w => w.date === todayStr);

            return `
              <div class="card ${isToday ? 'card-hero' : ''} mb-1" style="padding: 1.25rem;">
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-2">
                    <h3 style="font-size: 1.3rem; margin-bottom: 0;">${plan.day}</h3>
                    ${isToday ? `<span class="badge badge-accent">TODAY</span>` : ''}
                    ${isDoneToday ? `<span class="badge badge-primary">✓ COMPLETED</span>` : ''}
                  </div>
                  <span class="badge ${isToday ? 'badge-accent' : 'badge-primary'}">${plan.intensity}</span>
                </div>

                <h4 style="margin-bottom: 0.25rem; font-size: 1.15rem; ${isToday ? 'color: #FFFFFF;' : ''}">${plan.title}</h4>

                <div class="flex gap-2 mb-2" style="font-size: 0.95rem; opacity: 0.9; font-weight: 500;">
                  <span>🎯 ${plan.focus}</span>
                  <span>•</span>
                  <span>⏱️ ${plan.duration}</span>
                </div>

                <div class="flex gap-2 mt-2">
                  <button onclick="location.hash='player?day=${plan.day}'" class="btn ${isToday ? 'btn-accent' : 'btn-primary'}" style="min-height: 48px; font-size: 1rem;">
                    ${isRest ? '🌱 Start Gentle Stretch' : '▶️ Start Workout'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
};
