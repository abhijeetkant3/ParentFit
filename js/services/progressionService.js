/**
 * Progression Service for ParentFit PWA.
 * 
 * Service layer responsible for recording exercise performance feedback,
 * invoking progressionEngine.js for recommendations, and persisting
 * progression history via storageService.js.
 */

import {
  isProgressionAllowed,
  getProgressionRecommendation
} from '../domain/progressionEngine.js';
import { getJSON, setJSON, removeJSON } from './storageService.js';
import { getTodayDate } from '../utils/date.js';

const STORAGE_KEY = 'Parentfit_progression_history';

/**
 * Retrieves the complete progression history from storage.
 * 
 * @returns {Array<Object>} Array of stored progression records.
 */
export function getProgressionHistory() {
  const data = getJSON(STORAGE_KEY, []);
  return Array.isArray(data) ? [...data] : [];
}

/**
 * Records user performance feedback for an exercise, calculates progression recommendation,
 * persists the result to storage, and returns the new progression record.
 * 
 * @param {Object} exercise - Exercise object (must include id, reps/sets).
 * @param {string|Object} performance - Performance rating ("easy"|"good"|"difficult"|"too_difficult").
 * @returns {Object|null} Created progression record, or null if input is invalid or not allowed.
 */
export function recordPerformance(exercise, performance) {
  if (!isProgressionAllowed(exercise, performance)) {
    return null;
  }

  const rec = getProgressionRecommendation(exercise, performance);
  if (!rec || !rec.exerciseId) {
    return null;
  }

  let perfRating = typeof performance === 'string'
    ? performance.trim().toLowerCase()
    : (performance && typeof performance.rating === 'string' ? performance.rating.trim().toLowerCase() : 'maintain');

  const record = {
    id: 'p_' + Date.now(),
    exerciseId: exercise.id,
    date: getTodayDate(),
    performance: perfRating,
    action: rec.action,
    currentSets: rec.currentSets,
    recommendedSets: rec.recommendedSets,
    currentReps: rec.currentReps || null,
    recommendedReps: rec.recommendedReps || null,
    currentDuration: rec.currentDuration || null,
    recommendedDuration: rec.recommendedDuration || null
  };

  const history = getProgressionHistory();
  history.push(record);
  setJSON(STORAGE_KEY, history);

  return record;
}

/**
 * Retrieves the latest progression record for a given exercise ID.
 * 
 * @param {string} exerciseId - Unique exercise identifier.
 * @returns {Object|null} Most recent progression record for the exercise, or null if none exists.
 */
export function getLatestProgression(exerciseId) {
  if (!exerciseId || typeof exerciseId !== 'string') {
    return null;
  }

  const history = getProgressionHistory();
  const matching = history.filter(r => r && r.exerciseId === exerciseId);
  return matching.length > 0 ? matching[matching.length - 1] : null;
}

/**
 * Retrieves all progression records for a given exercise ID.
 * 
 * @param {string} exerciseId - Unique exercise identifier.
 * @returns {Array<Object>} Array of progression records for the exercise.
 */
export function getExerciseProgressionHistory(exerciseId) {
  if (!exerciseId || typeof exerciseId !== 'string') {
    return [];
  }

  const history = getProgressionHistory();
  return history.filter(r => r && r.exerciseId === exerciseId);
}

/**
 * Clears all stored progression history from storage.
 * 
 * @returns {boolean} True if successfully cleared.
 */
export function clearProgressionHistory() {
    return removeJSON(STORAGE_KEY);
}
