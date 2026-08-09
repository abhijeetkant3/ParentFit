/* Parentfit Workout Player View Page */
import { store } from '../store.js';
import { audioManager } from '../audio.js';
import { createWorkoutForDay, createWorkout } from '../domain/workoutEngine.js';
import { recordPerformance } from '../services/progressionService.js';
import { modalManager } from '../components/modal.js';

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
    let targetDay = params?.day || 'Monday';
    let singleExerciseId = params?.exercise;

    if (singleExerciseId) {
      try {
        const workout = await createWorkout({
          title: '',
          exercises: [singleExerciseId]
        });
        if (workout && workout.exercises.length > 0) {
          this.exercises = workout.exercises;
          this.routineTitle = this.exercises[0]?.name || 'Workout Session';
        } else {
          this.exercises = [];
        }
      } catch (e) {
        console.warn('Failed to load single exercise via workoutEngine', e);
        this.exercises = [];
      }
    } else {
      try {
        const workout = await createWorkoutForDay(targetDay);
        if (workout && workout.exercises.length > 0) {
          this.routineTitle = `${workout.day} - ${workout.title}`;
          this.exercises = workout.exercises;
        } else {
          this.exercises = [];
        }
      } catch (e) {
        console.warn('Failed to load daily workout via workoutEngine', e);
        this.exercises = [];
      }
    }

    if (!this.exercises.length) {
      this.exercises = [];
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

    const isTimeBased = currentEx?.type === 'time';
    const targetLabel = isTimeBased ? 'DURATION' : 'REPETITIONS';

    let targetValue = '—';
    if (isTimeBased && currentEx?.duration) {
      if (typeof currentEx.duration === 'string') {
        targetValue = currentEx.duration;
      } else if (typeof currentEx.duration === 'object') {
        const { minSeconds, maxSeconds } = currentEx.duration;
        if (minSeconds !== undefined && maxSeconds !== undefined) {
          targetValue = minSeconds === maxSeconds ? `${minSeconds} seconds` : `${minSeconds}-${maxSeconds} seconds`;
        }
      }
    } else if (!isTimeBased && currentEx?.reps) {
      if (typeof currentEx.reps === 'string') {
        targetValue = currentEx.reps;
      } else if (typeof currentEx.reps === 'object') {
        const { min, max, unit } = currentEx.reps;
        if (min !== undefined && max !== undefined) {
          const u = unit || 'reps';
          targetValue = min === max ? `${min} ${u}` : `${min}-${max} ${u}`;
        }
      }
    }

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
                <span class="text-muted" style="font-size: 0.9rem;">${targetLabel}</span>
                <div class="font-bold" style="font-size: 1.4rem; color: var(--primary-dark);">${targetValue}</div>
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
    } else {
      // Completed final set -> prompt for performance feedback
      this.showFeedbackModal(currentEx, () => {
        if (this.currentIndex < this.exercises.length - 1) {
          // Completed all sets for this exercise, move to next exercise
          this.currentIndex++;
          this.currentSet = 1;
          this.startRest(45); // Rest between different exercises
        } else {
          // Completed entire workout!
          this.finishWorkout();
        }
      });
    }
  },

  showFeedbackModal(currentEx, onComplete) {
    let rated = false;

    modalManager.show({
      title: 'How did this exercise feel?',
      bodyHTML: `
        <p style="font-size: 1rem; color: var(--text-muted);" class="mb-3">
          Select feedback for <strong>${currentEx?.name || 'this exercise'}</strong>:
        </p>
        <div class="flex flex-col gap-2 mb-2">
          <button id="rating-easy-btn" class="btn btn-outline" style="justify-content: flex-start; font-size: 1.05rem; padding: 0.75rem 1rem;">
            🙂 Easy
          </button>
          <button id="rating-good-btn" class="btn btn-outline" style="justify-content: flex-start; font-size: 1.05rem; padding: 0.75rem 1rem;">
            👍 Good
          </button>
          <button id="rating-difficult-btn" class="btn btn-outline" style="justify-content: flex-start; font-size: 1.05rem; padding: 0.75rem 1rem;">
            😓 Difficult
          </button>
          <button id="rating-too-difficult-btn" class="btn btn-outline" style="justify-content: flex-start; font-size: 1.05rem; padding: 0.75rem 1rem;">
            🛑 Too Difficult
          </button>
        </div>
      `,
      primaryText: null,
      secondaryText: null
    });

    const handleRating = (rating) => {
      if (rated) return;
      rated = true;

      try {
        recordPerformance(currentEx, rating);
      } catch (error) {
        console.error('[Player] Failed to record performance:', error);
      }

      modalManager.close();
      onComplete();
    };

    const btnEasy = document.getElementById('rating-easy-btn');
    const btnGood = document.getElementById('rating-good-btn');
    const btnDiff = document.getElementById('rating-difficult-btn');
    const btnTooDiff = document.getElementById('rating-too-difficult-btn');

    if (btnEasy) btnEasy.onclick = () => handleRating('easy');
    if (btnGood) btnGood.onclick = () => handleRating('good');
    if (btnDiff) btnDiff.onclick = () => handleRating('difficult');
    if (btnTooDiff) btnTooDiff.onclick = () => handleRating('too_difficult');
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
