/* FitMom Home View Page */
import { store } from '../store.js';
import { modalManager } from '../components/modal.js';

export const homeView = {
  async render() {
    const { userName } = store.state.settings;
    const streak = store.state.streak;
    const completedCount = store.state.completedWorkouts.length;
    const latestWeight = store.getLatestWeight();
    const waterCount = store.state.waterIntake.count;

    // Determine Greeting Time
    const hour = new Date().getHours();
    let greeting = 'Good Morning';
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
    else if (hour >= 17) greeting = 'Good Evening';

    // Get today's day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    // Fetch schedule data
    let todayPlan = {
      title: "Gentle Full Body Starter",
      focus: "Full Body",
      duration: "15-20 min",
      intensity: "Gentle",
      exercises: ["chair-squat", "wall-push-up", "biceps-curl", "stretching"]
    };

    try {
      const res = await fetch('./data/schedule.json');
      const data = await res.json();
      const match = data.weeklyPlan.find(p => p.day === todayName);
      if (match) todayPlan = match;
    } catch (e) {
      console.warn('Could not fetch schedule data for home', e);
    }

    return `
      <div class="view-home animate-fade-in">
        <!-- Hero Greeting -->
        <div class="card card-hero mb-3">
          <div class="flex items-center justify-between mb-1">
            <span class="badge badge-accent">Daily Coach</span>
            <span style="font-size: 1.5rem;">❤️</span>
          </div>
          <h1 style="margin-bottom: 0.25rem;">${greeting}, ${userName}!</h1>
          <p style="opacity: 0.95; font-size: 1.15rem;">Let's move gently today and take care of your health.</p>
        </div>

        <!-- Today's Workout Card -->
        <div class="card mb-3" style="border-left: 6px solid var(--primary);">
          <div class="flex items-center justify-between mb-2">
            <div>
              <span class="badge badge-primary">${todayName}'s Routine</span>
              <h2 class="mt-1" style="font-size: 1.45rem;">${todayPlan.title}</h2>
            </div>
            <span class="badge badge-accent">${todayPlan.intensity}</span>
          </div>

          <div class="flex gap-2 text-muted mb-3" style="font-size: 1rem; font-weight: 600;">
            <span>⏱️ ${todayPlan.duration}</span>
            <span>•</span>
            <span>💪 ${todayPlan.exercises.length} Exercises</span>
            <span>•</span>
            <span>🎯 ${todayPlan.focus}</span>
          </div>

          <button id="home-quick-start-btn" class="btn btn-primary ripple">
            <span>▶️ Start Today's Workout</span>
          </button>
        </div>

        <!-- Progress Overview Grid -->
        <div class="stats-grid mb-3">
          <div class="stat-card">
            <div style="font-size: 1.8rem;">🔥</div>
            <div class="stat-value">${streak} Days</div>
            <div class="stat-label">Workout Streak</div>
          </div>

          <div class="stat-card">
            <div style="font-size: 1.8rem;">🏆</div>
            <div class="stat-value">${completedCount}</div>
            <div class="stat-label">Workouts Completed</div>
          </div>
        </div>

        <!-- Weight & Water Row Cards -->
        <div class="card mb-3">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span style="font-size: 1.6rem;">⚖️</span>
              <div>
                <h3 style="font-size: 1.15rem; margin-bottom: 0;">Weight Tracker</h3>
                <span class="text-muted" style="font-size: 0.95rem;">Current: <strong>${latestWeight} kg</strong></span>
              </div>
            </div>
            <button id="home-log-weight-btn" class="btn btn-secondary" style="min-height: 44px; padding: 0.4rem 1rem; width: auto; font-size: 0.95rem;">
              + Log Weight
            </button>
          </div>
        </div>

        <div class="card card-accent card-interactive mb-3" onclick="location.hash='nutrition'">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span style="font-size: 1.6rem;">💧</span>
              <div>
                <h3 style="font-size: 1.15rem; margin-bottom: 0;">Hydration Progress</h3>
                <span class="text-muted" style="font-size: 0.95rem;">${waterCount} of 8 glasses logged today</span>
              </div>
            </div>
            <span style="font-weight: 700; color: #D84315;">View Tips ›</span>
          </div>
        </div>

        <!-- Quick Shortcut Cards -->
        <h3 class="mb-2" style="font-size: 1.25rem;">Quick Shortcuts</h3>
        <div class="flex gap-2">
          <button onclick="location.hash='schedule'" class="btn btn-outline" style="flex: 1; flex-direction: column; height: 90px; gap: 0.2rem; font-size: 1rem;">
            <span style="font-size: 1.4rem;">📅</span>
            <span>Weekly Schedule</span>
          </button>
          <button onclick="location.hash='details'" class="btn btn-outline" style="flex: 1; flex-direction: column; height: 90px; gap: 0.2rem; font-size: 1rem;">
            <span style="font-size: 1.4rem;">📖</span>
            <span>Exercise Library</span>
          </button>
        </div>
      </div>
    `;
  },

  postRender() {
    const quickStartBtn = document.getElementById('home-quick-start-btn');
    if (quickStartBtn) {
      quickStartBtn.onclick = () => {
        // Determine today's name
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = days[new Date().getDay()];
        window.location.hash = `player?day=${todayName}`;
      };
    }

    const logWeightBtn = document.getElementById('home-log-weight-btn');
    if (logWeightBtn) {
      logWeightBtn.onclick = () => {
        const currentW = store.getLatestWeight();
        modalManager.show({
          title: 'Log Today\'s Weight',
          bodyHTML: `
            <p style="font-size: 1rem; color: var(--text-muted);">Track your body weight gently without stress.</p>
            <div class="input-group">
              <label class="input-label" for="weight-input">Weight (in kg):</label>
              <input id="weight-input" type="number" step="0.1" class="input-field" value="${currentW}" autofocus />
            </div>
          `,
          primaryText: 'Save Weight',
          onPrimary: () => {
            const val = parseFloat(document.getElementById('weight-input')?.value);
            if (!isNaN(val) && val > 30 && val < 250) {
              store.addWeightLog(val);
              // Re-render home view
              window.location.reload();
            } else {
              alert('Please enter a valid weight between 30 kg and 250 kg.');
              return false;
            }
          }
        });
      };
    }
  }
};
