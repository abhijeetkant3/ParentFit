/* Parentfit LocalStorage & State Management Store */

const STORAGE_KEYS = {
  COMPLETED_WORKOUTS: 'Parentfit_completed_workouts',
  COMPLETED_EXERCISES: 'Parentfit_completed_exercises',
  STREAK: 'Parentfit_streak',
  WEIGHT_HISTORY: 'Parentfit_weight_history',
  WATER_INTAKE: 'Parentfit_water_intake',
  SETTINGS: 'Parentfit_settings'
};

const DEFAULT_SETTINGS = {
  userName: 'Mom',
  darkMode: false,
  soundEnabled: true,
  fontSize: 'large', // 'normal', 'large', 'xlarge'
  targetWeight: 65,
  language: 'English'
};

class Store {
  constructor() {
    this.listeners = [];
    this.state = {
      completedWorkouts: this.load(STORAGE_KEYS.COMPLETED_WORKOUTS, []),
      completedExercises: this.load(STORAGE_KEYS.COMPLETED_EXERCISES, []),
      streak: this.load(STORAGE_KEYS.STREAK, 0),
      weightHistory: this.load(STORAGE_KEYS.WEIGHT_HISTORY, [
        { date: new Date().toISOString().split('T')[0], weight: 68.0 }
      ]),
      waterIntake: this.load(STORAGE_KEYS.WATER_INTAKE, {
        date: new Date().toISOString().split('T')[0],
        count: 0
      }),
      settings: { ...DEFAULT_SETTINGS, ...this.load(STORAGE_KEYS.SETTINGS, {}) }
    };

    this.checkWaterReset();
    this.recalculateStreak();
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error loading key ${key} from LocalStorage`, e);
      return fallback;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving key ${key} to LocalStorage`, e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // --- Water Intake ---
  checkWaterReset() {
    const today = new Date().toISOString().split('T')[0];
    if (this.state.waterIntake.date !== today) {
      this.state.waterIntake = { date: today, count: 0 };
      this.save(STORAGE_KEYS.WATER_INTAKE, this.state.waterIntake);
    }
  }

  setWaterCount(count) {
    const today = new Date().toISOString().split('T')[0];
    this.state.waterIntake = { date: today, count: Math.max(0, count) };
    this.save(STORAGE_KEYS.WATER_INTAKE, this.state.waterIntake);
    this.notify();
  }

  // --- Workouts & Exercises ---
  logWorkoutCompletion(workoutTitle, exerciseIds = [], durationSec = 900) {
    const todayStr = new Date().toISOString().split('T')[0];
    const newLog = {
      id: 'w_' + Date.now(),
      title: workoutTitle,
      date: todayStr,
      timestamp: Date.now(),
      durationSec: durationSec,
      exercisesCount: exerciseIds.length
    };

    this.state.completedWorkouts.unshift(newLog);
    this.save(STORAGE_KEYS.COMPLETED_WORKOUTS, this.state.completedWorkouts);

    // Merge completed exercise IDs
    const updatedExercises = Array.from(new Set([...this.state.completedExercises, ...exerciseIds]));
    this.state.completedExercises = updatedExercises;
    this.save(STORAGE_KEYS.COMPLETED_EXERCISES, updatedExercises);

    this.recalculateStreak();
    this.notify();
  }

  // --- Streak Calculation ---
  recalculateStreak() {
    if (!this.state.completedWorkouts.length) {
      this.state.streak = 0;
      this.save(STORAGE_KEYS.STREAK, 0);
      return;
    }

    const uniqueDates = Array.from(
      new Set(this.state.completedWorkouts.map(w => w.date))
    ).sort().reverse();

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterdayStr = yesterdayObj.toISOString().split('T')[0];

    // Check if performed today or yesterday to maintain active streak
    if (!uniqueDates.includes(todayStr) && !uniqueDates.includes(yesterdayStr)) {
      this.state.streak = 0;
      this.save(STORAGE_KEYS.STREAK, 0);
      return;
    }

    let streakCount = 0;
    let currDate = new Date();
    
    // If not completed today yet, start checking from yesterday
    if (!uniqueDates.includes(todayStr)) {
      currDate.setDate(currDate.getDate() - 1);
    }

    while (true) {
      const dStr = currDate.toISOString().split('T')[0];
      if (uniqueDates.includes(dStr)) {
        streakCount++;
        currDate.setDate(currDate.getDate() - 1);
      } else {
        break;
      }
    }

    this.state.streak = streakCount;
    this.save(STORAGE_KEYS.STREAK, streakCount);
  }

  // --- Weight Tracking ---
  addWeightLog(weightKg) {
    const todayStr = new Date().toISOString().split('T')[0];
    const existingIndex = this.state.weightHistory.findIndex(w => w.date === todayStr);

    if (existingIndex >= 0) {
      this.state.weightHistory[existingIndex].weight = weightKg;
    } else {
      this.state.weightHistory.unshift({ date: todayStr, weight: weightKg });
    }

    this.save(STORAGE_KEYS.WEIGHT_HISTORY, this.state.weightHistory);
    this.notify();
  }

  getLatestWeight() {
    return this.state.weightHistory[0]?.weight || 68.0;
  }

  // --- Settings ---
  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.save(STORAGE_KEYS.SETTINGS, this.state.settings);
    this.notify();
  }

  // --- Reset All Data ---
  resetAllData() {
    localStorage.clear();
    this.state = {
      completedWorkouts: [],
      completedExercises: [],
      streak: 0,
      weightHistory: [{ date: new Date().toISOString().split('T')[0], weight: 68.0 }],
      waterIntake: { date: new Date().toISOString().split('T')[0], count: 0 },
      settings: { ...DEFAULT_SETTINGS }
    };
    this.notify();
  }
}

export const store = new Store();
