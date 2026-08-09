/**
 * Progression Engine for ParentFit PWA.
 * 
 * Pure domain module responsible for calculating conservative exercise progression
 * and set/rep recommendations based on user performance feedback.
 */

import { getExerciseType, parseRepRange, parseDuration, getExerciseSets } from './exerciseEngine.js';

/**
 * Internal compatibility helper to resolve exercise type.
 * Trusts explicit normalized exercise.type ("reps"|"time") if present,
 * otherwise falls back to getExerciseType(exercise).
 * 
 * @param {Object} exercise - Exercise object.
 * @returns {"reps"|"time"|"unknown"} Resolved exercise type.
 */
function resolveExerciseType(exercise) {
  if (!exercise || typeof exercise !== 'object') {
    return 'unknown';
  }

  if (exercise.type === 'reps' || exercise.type === 'time') {
    return exercise.type;
  }

  return getExerciseType(exercise);
}

/**
 * Normalizes a performance input rating into a standard string token.
 * Supports string ratings or object wrappers like { rating: "easy" }.
 * 
 * @param {string|Object} performance - Performance rating string or object.
 * @returns {"easy"|"good"|"difficult"|"too_difficult"|null} Normalized performance token or null if invalid.
 */
function normalizePerformance(performance) {
  if (!performance) return null;
  let ratingStr = '';
  if (typeof performance === 'string') {
    ratingStr = performance;
  } else if (typeof performance === 'object' && typeof performance.rating === 'string') {
    ratingStr = performance.rating;
  } else {
    return null;
  }

  const clean = ratingStr.trim().toLowerCase();
  if (['easy', 'good', 'difficult', 'too_difficult'].includes(clean)) {
    return clean;
  }
  return null;
}

/**
 * Determines the progression action ("increase", "maintain", "decrease") for a performance rating.
 * 
 * @param {string|Object} performance - Performance rating.
 * @returns {"increase"|"maintain"|"decrease"} Progression action token.
 */
export function getProgressionAction(performance) {
  const norm = normalizePerformance(performance);
  if (norm === 'easy') {
    return 'increase';
  }
  if (norm === 'good') {
    return 'maintain';
  }
  if (norm === 'difficult' || norm === 'too_difficult') {
    return 'decrease';
  }
  return 'maintain';
}

/**
 * Calculates the next recommended rep range for a repetition-based exercise.
 * Conservative logic: increases or decreases range boundaries by at most 2 reps.
 * Never reduces reps below 1.
 * 
 * @param {Object} exercise - Exercise object.
 * @param {string|Object} performance - Performance rating.
 * @returns {{ min: number, max: number, unit: string }|null} Recommended rep range object, or null if exercise is not rep-based.
 */
export function calculateNextRepRange(exercise, performance) {
  if (!exercise || typeof exercise !== 'object') {
    return null;
  }

  const type = resolveExerciseType(exercise);
  if (type !== 'reps') {
    return null;
  }

  const currentReps = typeof exercise.reps === 'object' &&
    exercise.reps !== null &&
    typeof exercise.reps.min === 'number' &&
    typeof exercise.reps.max === 'number'
      ? exercise.reps
      : parseRepRange(exercise.reps);

  if (!currentReps) {
    return null;
  }

  const action = getProgressionAction(performance);

  if (action === 'increase') {
    return {
      min: currentReps.min + 2,
      max: currentReps.max + 2,
      unit: 'reps'
    };
  }

  if (action === 'decrease') {
    const nextMin = Math.max(1, currentReps.min - 2);
    const nextMax = Math.max(nextMin, currentReps.max - 2);
    return {
      min: nextMin,
      max: nextMax,
      unit: 'reps'
    };
  }

  // "maintain" or unrecognized performance
  return {
    min: currentReps.min,
    max: currentReps.max,
    unit: 'reps'
  };
}

/**
 * Calculates the next recommended set count for an exercise.
 * Conservative logic: max 4 sets, min 1 set.
 * 
 * @param {Object} exercise - Exercise object.
 * @param {string|Object} performance - Performance rating.
 * @returns {number} Recommended set count as a positive integer.
 */
export function calculateNextSetCount(exercise, performance) {
  if (!exercise || typeof exercise !== 'object') {
    return 0;
  }

  const currentSets = getExerciseSets(exercise) || (Number.isInteger(exercise.sets) && exercise.sets > 0 ? exercise.sets : 0);
  if (currentSets <= 0) {
    return 0;
  }

  const action = getProgressionAction(performance);

  if (action === 'increase') {
    return Math.min(4, currentSets + 1);
  }

  if (action === 'decrease') {
    return Math.max(1, currentSets - 1);
  }

  return currentSets;
}

/**
 * Validates whether an exercise and performance input are eligible for progression.
 * 
 * @param {Object} exercise - Exercise object.
 * @param {string|Object} performance - Performance rating.
 * @returns {boolean} True if progression is allowed, false otherwise.
 */
export function isProgressionAllowed(exercise, performance) {
  if (!exercise || typeof exercise !== 'object') {
    return false;
  }
  if (!exercise.id) {
    return false;
  }

  const normPerf = normalizePerformance(performance);
  if (!normPerf) {
    return false;
  }

  const type = resolveExerciseType(exercise);
  if (type === 'unknown') {
    return false;
  }

  const sets = getExerciseSets(exercise);
  if (sets <= 0) {
    return false;
  }

  return true;
}

/**
 * Generates a comprehensive progression recommendation object for an exercise.
 * 
 * @param {Object} exercise - Exercise object (raw or normalized).
 * @param {string|Object} performance - Performance rating.
 * @returns {Object} Progression recommendation object.
 */
export function getProgressionRecommendation(exercise, performance) {
  if (!exercise || typeof exercise !== 'object') {
    return {
      exerciseId: null,
      action: 'maintain',
      currentSets: 0,
      recommendedSets: 0,
      recommendedReps: null,
      recommendedDuration: null
    };
  }

  const exerciseId = exercise.id || null;
  const action = getProgressionAction(performance);
  const type = resolveExerciseType(exercise);
  const currentSets = getExerciseSets(exercise);
  const recommendedSets = calculateNextSetCount(exercise, performance);

  if (type === 'reps') {
    const currentReps = typeof exercise.reps === 'object' &&
      exercise.reps !== null &&
      typeof exercise.reps.min === 'number' &&
      typeof exercise.reps.max === 'number'
        ? exercise.reps
        : parseRepRange(exercise.reps);

    return {
      exerciseId,
      action,
      currentSets,
      recommendedSets,
      currentReps,
      recommendedReps: calculateNextRepRange(exercise, performance)
    };
  }

  if (type === 'time') {
    const durationSource = exercise.duration ?? exercise.reps;
    const currentDuration = typeof durationSource === 'object' &&
      durationSource !== null &&
      typeof durationSource.minSeconds === 'number'
        ? durationSource
        : parseDuration(durationSource);

    return {
      exerciseId,
      action,
      currentSets,
      recommendedSets,
      currentDuration,
      recommendedDuration: null
    };
  }

  return {
    exerciseId,
    action: 'maintain',
    currentSets,
    recommendedSets: currentSets,
    recommendedReps: null,
    recommendedDuration: null
  };
}
