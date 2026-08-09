/**
 * Workout Core Engine for ParentFit PWA.
 * 
 * Domain module responsible for taking workout schedule plans and exercise definitions,
 * interpreting them via exerciseEngine.js, and producing normalized workout structures.
 */

import { getWorkoutByDay, getTodayWorkout, getExercisesByIds } from '../services/workoutService.js';
import { getExerciseMetadata } from './exerciseEngine.js';

/**
 * Normalizes an individual exercise definition into a standardized representation.
 * Clearly distinguishes between repetition-based and time-based exercises.
 * 
 * @param {Object} exercise - Raw exercise definition object from data/exercises.json.
 * @returns {Object|null} Normalized exercise object, or null if input is invalid.
 */
export function normalizeWorkoutExercise(exercise) {
  if (!exercise || typeof exercise !== 'object') {
    return null;
  }

  const meta = getExerciseMetadata(exercise);
  if (!meta || !meta.id) {
    return null;
  }

  const normalized = {
    id: exercise.id,
    name: exercise.name || '',
    difficulty: exercise.difficulty || '',
    equipment: exercise.equipment || '',
    muscles: Array.isArray(exercise.muscles) ? [...exercise.muscles] : [],
    type: meta.type,
    sets: meta.sets,
    rest: meta.rest,
    instructions: Array.isArray(exercise.instructions) ? [...exercise.instructions] : [],
    mistakes: Array.isArray(exercise.mistakes) ? [...exercise.mistakes] : [],
    breathing: exercise.breathing || '',
    svgIllustration: exercise.svgIllustration || ''
  };

  if (meta.type === 'reps') {
    normalized.reps = meta.reps;
  } else if (meta.type === 'time') {
    normalized.duration = meta.duration;
  } else {
    normalized.repsRaw = exercise.reps || '';
  }

  return normalized;
}

/**
 * Creates a normalized workout object from a raw workout schedule plan.
 * Resolves exercise IDs via workoutService and normalizes each exercise via exerciseEngine.
 * 
 * @async
 * @param {Object} workoutPlan - Workout plan object (e.g. from schedule.json).
 * @returns {Promise<Object|null>} Normalized workout object, or null if input is invalid.
 */
export async function createWorkout(workoutPlan) {
  if (!workoutPlan || typeof workoutPlan !== 'object') {
    return null;
  }

  const rawExercises = Array.isArray(workoutPlan.exercises) ? workoutPlan.exercises : [];
  let resolvedExercises = [];

  if (rawExercises.length > 0) {
    if (typeof rawExercises[0] === 'string') {
      // Array of exercise ID strings -> fetch exercise objects
      resolvedExercises = await getExercisesByIds(rawExercises);
    } else if (typeof rawExercises[0] === 'object') {
      // Array of pre-resolved exercise objects
      resolvedExercises = rawExercises;
    }
  }

  const normalizedExercises = resolvedExercises
    .map(ex => normalizeWorkoutExercise(ex))
    .filter(Boolean);

  const totalExercises = normalizedExercises.length;
  const totalSets = normalizedExercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);

  return {
    day: workoutPlan.day || '',
    title: workoutPlan.title || '',
    focus: workoutPlan.focus || '',
    duration: workoutPlan.duration || '',
    intensity: workoutPlan.intensity || '',
    exercises: normalizedExercises,
    totalExercises,
    totalSets
  };
}

/**
 * Retrieves the schedule for a given day and builds a normalized workout object.
 * 
 * @async
 * @param {string} dayName - Day of the week (e.g. "Monday").
 * @returns {Promise<Object|null>} Normalized workout object, or null if day/plan is not found.
 */
export async function createWorkoutForDay(dayName) {
  if (!dayName || typeof dayName !== 'string') {
    return null;
  }

  const plan = await getWorkoutByDay(dayName);
  if (!plan) {
    return null;
  }

  return createWorkout(plan);
}

/**
 * Builds a normalized workout object for today based on local calendar day.
 * 
 * @async
 * @returns {Promise<Object|null>} Today's normalized workout object, or null if not found.
 */
export async function createTodayWorkout() {
  const plan = await getTodayWorkout();
  if (!plan) {
    return null;
  }

  return createWorkout(plan);
}

/**
 * Calculates the total number of exercises in a workout.
 * 
 * @param {Object} workout - Normalized workout object or raw plan.
 * @returns {number} Number of exercises, or 0 if invalid.
 */
export function getTotalExerciseCount(workout) {
  if (!workout || typeof workout !== 'object' || !Array.isArray(workout.exercises)) {
    return 0;
  }
  return workout.exercises.length;
}

/**
 * Calculates the total number of sets across all exercises in a workout.
 * 
 * @param {Object} workout - Normalized workout object or raw plan.
 * @returns {number} Total set count across all exercises, or 0 if invalid.
 */
export function getTotalSetCount(workout) {
  if (!workout || typeof workout !== 'object' || !Array.isArray(workout.exercises)) {
    return 0;
  }

  return workout.exercises.reduce((total, ex) => {
    if (!ex) return total;
    const sets = Number(ex.sets);
    return total + (!isNaN(sets) && sets > 0 ? sets : 0);
  }, 0);
}

/**
 * Extracts a lightweight summary object from a workout object.
 * 
 * @param {Object} workout - Normalized workout object or raw plan.
 * @returns {Object} Workout summary object.
 */
export function getWorkoutSummary(workout) {
  if (!workout || typeof workout !== 'object') {
    return {
      title: '',
      focus: '',
      intensity: '',
      duration: '',
      totalExercises: 0,
      totalSets: 0
    };
  }

  return {
    title: workout.title || '',
    focus: workout.focus || '',
    intensity: workout.intensity || '',
    duration: workout.duration || '',
    totalExercises: getTotalExerciseCount(workout),
    totalSets: getTotalSetCount(workout)
  };
}
