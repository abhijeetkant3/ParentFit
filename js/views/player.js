/* Parentfit Workout Player View Page */
import { store } from '../store.js';
import { audioManager } from '../audio.js';

export const playerView = {
  exercises: [],
  routineTitle: 'Workout Session',
  currentIndex: 0,
  currentSet: 1,
  totalSets: 3,
  
  // Timer State
  timerSeconds: 0,
  timerMax: 0,
  timerInterval: null,
  isResting: false,

  async render(params) {
    let exercisesData = [];
    let scheduleData = [];
    try {
      const [exRes, schRes] = await Promise.all([
        fetch('./data/exercises.json'),
        fetch('./data/schedule.json')
      ]);
      exercisesData = await exRes.json();
      const schJson = await schRes.json();
      scheduleData = schJson.weeklyPlan || [];
    } catch (e) {
      console.error('Failed to load JSON for player', e);
    }

    // Determine target routine
    let targetDay = params?.day || 'Monday';
    let singleExerciseId = params?.exercise;

    if (singleExerciseId) {
      const match = exercisesData.find(e => e.id === singleExerciseId);
      if (match) {
        this.exercises = [match];
        this.routineTitle = match.name;
      }
    } else {
      const plan = scheduleData.find(p => p.day === targetDay) || scheduleData[0];
      this.routineTitle = `${plan.day} - ${plan.title}`;
      this.exercises = plan.exercises
        .map(id => exercisesData.find(e => e.id === id))
        .filter(Boolean);
    }

    if (!this.exercises.length) {
      this.exercises = exercisesData.slice(0, 4);
    }

    this.currentIndex = 0;
    this.currentSet = 1;
    this.isResting = false;
    this.stopTimer();

    return this.buildPlayerHTML();
  },

  buildPlayerHTML() {
    const currentEx = this.exercises[this.currentIndex];
    const totalEx = this.exercises.length;
    const progressPercent = Math.round(((this.currentIndex + 1) / totalEx) * 100);

    return `
      <div class="view-player animate-fade-in">
        <!-- Top Routine Bar -->
        <div class="flex items-center justify-between mb-2">
          <button onclick="location.hash='home'" class="btn btn-outline" style="width: auto; min-height: 44px; padding: 0.4rem 1rem; font-size: 0.95rem;">
            ✕ Exit
          </button>
          <span class="font-bold text-muted" style="font-size: 1.05rem;">Exercise ${this.currentIndex + 1} of ${totalEx}</span>
          <span class="badge badge-primary">${currentEx.difficulty}</span>
        </div>

        <!-- Session Progress Bar -->
        <div class="progress-container mb-3">
          <div class="progress-bar" style="width: ${progressPercent}%;"></div>
        </div>

        <!-- Rest Overlay Screen (When active) -->
        <div id="rest-screen" class="card card-accent text-center mb-3" style="display: ${this.isResting ? 'block' : 'none'}; padding: 2rem 1.25rem;">
          <span class="badge badge-accent mb-2" style="font-size: 1.1rem;">REST TIME</span>
          <div id="timer-display" class="font-bold mb-2 animate-pulse" style="font-size: 4rem; color: #D84315; line-height: 1;">
            ${this.timerSeconds}s
          </div>
          <p class="mb-3" style="font-size: 1.15rem;">Take deep breaths and sip water 💧</p>
          <div class="flex gap-2 justify-center">
            <button id="add-10s-btn" class="btn btn-secondary" style="width: auto; min-height: 48px; padding: 0.5rem 1.25rem; font-size: 1rem;">
              +10 Sec
            </button>
            <button id="skip-rest-btn" class="btn btn-primary" style="width: auto; min-height: 48px; padding: 0.5rem 1.5rem; font-size: 1rem;">
              Skip Rest ⏭️
            </button>
          </div>
        </div>

        <!-- Exercise Card (Active when not resting) -->
        <div id="exercise-card" class="card mb-3" style="display: ${this.isResting ? 'none' : 'block'};">
          <!-- Illustration -->
          <div class="svg-illustration-wrapper">
            ${currentEx.svgIllustration}
          </div>

          <div class="text-center mb-2">
            <h2 style="font-size: 1.65rem; margin-bottom: 0.25rem;">${currentEx.name}</h2>
            <div class="flex justify-center gap-1 flex-wrap">
              ${currentEx.muscles.map(m => `<span class="badge badge-primary">${m}</span>`).join('')}
            </div>
          </div>

          <!-- Sets & Reps Target -->
          <div class="card card-accent text-center mb-3" style="padding: 1rem;">
            <div class="flex justify-around items-center">
              <div>
                <span class="text-muted" style="font-size: 0.9rem;">TARGET SET</span>
                <div class="font-bold" style="font-size: 1.4rem; color: var(--primary-dark);">Set ${this.currentSet} of ${currentEx.sets}</div>
              </div>
              <div style="width: 1px; height: 35px; background: #FFE0B2;"></div>
              <div>
                <span class="text-muted" style="font-size: 0.9rem;">REPETITIONS</span>
                <div class="font-bold" style="font-size: 1.4rem; color: var(--primary-dark);">${currentEx.reps}</div>
              </div>
            </div>
          </div>

          <!-- Instructions & Form Tips -->
          <div class="mb-3">
            <h4 style="font-size: 1.15rem;" class="mb-1">How to Perform:</h4>
            <ol style="padding-left: 1.25rem; line-height: 1.6; font-size: 1.05rem;">
              ${currentEx.instructions.map(inst => `<li class="mb-1">${inst}</li>`).join('')}
            </ol>
          </div>

          <!-- Breathing Advice -->
         <div class="card card-interactive player-breathing-tip" style="background: #F1F8E9; border: 1px solid #C8E6C9; padding: 0.85rem 1rem;">
            <span style="font-weight: 700; color: var(--primary-dark);">🌬️ Breathing Tip:</span>
            <span style="font-size: 1rem;"> ${currentEx.breathing}</span>
          </div>
        </div>

        <!-- Bottom Controls Bar -->
        <div class="flex gap-2 mb-2">
          <button id="player-prev-btn" class="btn btn-outline" style="flex: 1; ${this.currentIndex === 0 && this.currentSet === 1 ? 'opacity: 0.5; pointer-events: none;' : ''}">
            ◀ Previous
          </button>
          
          <button id="player-next-btn" class="btn btn-primary ripple" style="flex: 1.5;">
            ${this.currentSet < currentEx.sets ? `Set ${this.currentSet + 1} Complete ✓` : (this.currentIndex < totalEx - 1 ? 'Next Exercise ▶' : 'Finish Workout 🎉')}
          </button>
        </div>
      </div>
    `;
  },

  postRender() {
    this.attachEvents();
  },

  attachEvents() {
    const nextBtn = document.getElementById('player-next-btn');
    const prevBtn = document.getElementById('player-prev-btn');
    const skipRestBtn = document.getElementById('skip-rest-btn');
    const add10sBtn = document.getElementById('add-10s-btn');

    if (nextBtn) {
      nextBtn.onclick = () => this.handleNext();
    }

    if (prevBtn) {
      prevBtn.onclick = () => this.handlePrev();
    }

    if (skipRestBtn) {
      skipRestBtn.onclick = () => this.endRest();
    }

    if (add10sBtn) {
      add10sBtn.onclick = () => {
        this.timerSeconds += 10;
        this.updateTimerDisplay();
      };
    }
  },

  handleNext() {
    const currentEx = this.exercises[this.currentIndex];

    if (this.isResting) {
      this.endRest();
      return;
    }

    if (this.currentSet < currentEx.sets) {
      // Completed current set, trigger rest timer
      this.currentSet++;
      this.startRest(currentEx.rest || 30);
    } else if (this.currentIndex < this.exercises.length - 1) {
      // Completed all sets for this exercise, move to next exercise
      this.currentIndex++;
      this.currentSet = 1;
      this.startRest(45); // Rest between different exercises
    } else {
      // Completed entire workout!
      this.finishWorkout();
    }
  },

  handlePrev() {
    if (this.isResting) {
      this.endRest();
      return;
    }

    if (this.currentSet > 1) {
      this.currentSet--;
    } else if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentSet = this.exercises[this.currentIndex].sets;
    }
    this.refreshUI();
  },

  startRest(seconds) {
    this.isResting = true;
    this.timerSeconds = seconds;
    this.timerMax = seconds;
    this.refreshUI();

    audioManager.playCountdownTick();

    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      this.updateTimerDisplay();

      if (this.timerSeconds <= 3 && this.timerSeconds > 0) {
        audioManager.playCountdownTick();
      }

      if (this.timerSeconds <= 0) {
        audioManager.playTimerFinished();
        this.endRest();
      }
    }, 1000);
  },

  updateTimerDisplay() {
    const timerElem = document.getElementById('timer-display');
    if (timerElem) {
      timerElem.textContent = `${this.timerSeconds}s`;
    }
  },

  endRest() {
    this.stopTimer();
    this.isResting = false;
    this.refreshUI();
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  finishWorkout() {
    this.stopTimer();
    audioManager.playWorkoutSuccess();

    const exIds = this.exercises.map(e => e.id);
    store.logWorkoutCompletion(this.routineTitle, exIds);

    const mainContainer = document.getElementById('main-content');
    if (mainContainer) {
      mainContainer.innerHTML = `
        <div class="card card-hero text-center animate-scale-in" style="padding: 2.5rem 1.5rem; margin-top: 2rem;">
          <div style="font-size: 4rem; margin-bottom: 0.5rem;">🎉</div>
          <h1 style="font-size: 2.2rem;">Workout Complete!</h1>
          <p style="font-size: 1.25rem; opacity: 0.95; margin-bottom: 1.5rem;">
            Awesome job! You've taken a wonderful step for your strength, heart, and health today.
          </p>
          <div class="card mb-3 text-center" style="background: rgba(255, 255, 255, 0.2); border: none; color: #FFFFFF;">
            <div class="font-bold" style="font-size: 1.8rem;">${store.state.streak} Days 🔥</div>
            <span style="font-size: 0.95rem;">Current Active Streak</span>
          </div>
          <button onclick="location.hash='home'" class="btn btn-accent ripple" style="font-size: 1.2rem;">
            Back to Home ❤️
          </button>
        </div>
      `;
    }
  },

  refreshUI() {
    const mainContainer = document.getElementById('main-content');
    if (mainContainer) {
      mainContainer.innerHTML = this.buildPlayerHTML();
      this.attachEvents();
    }
  },

  destroy() {
    this.stopTimer();
  }
};
