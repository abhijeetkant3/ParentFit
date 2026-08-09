/**
 * Workout Data Service for ParentFit PWA.
 * 
 * Data-access service responsible exclusively for loading and retrieving
 * workout exercise definitions and weekly schedules.
 */

import { getDayName } from '../utils/date.js';

/**
 * Loads the complete list of exercise definitions from data/exercises.json.
 * @async
 * @returns {Promise<Array<Object>>} Array of exercise objects, or empty array if request fails.
 */
export async function loadExercises() {
  try {
    const response = await fetch('./data/exercises.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('[WorkoutService] Failed to load exercises:', error);
    return [];
  }
}

/**
 * Loads the weekly workout schedule from data/schedule.json.
 * @async
 * @returns {Promise<Object>} Schedule object containing weeklyPlan array, or fallback empty structure on error.
 */
export async function loadSchedule() {
  try {
    const response = await fetch('./data/schedule.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data && typeof data === 'object' ? data : { weeklyPlan: [] };
  } catch (error) {
    console.warn('[WorkoutService] Failed to load schedule:', error);
    return { weeklyPlan: [] };
  }
}

/**
 * Retrieves a single exercise definition by its unique identifier.
 * @async
 * @param {string} exerciseId - Unique ID of the exercise.
 * @returns {Promise<Object|null>} Exercise object if found, or null if invalid/not found.
 */
export async function getExerciseById(exerciseId) {
  if (!exerciseId || typeof exerciseId !== 'string') {
    return null;
  }
  const exercises = await loadExercises();
  const found = exercises.find(ex => ex.id === exerciseId);
  return found || null;
}

/**
 * Retrieves a list of exercise definitions corresponding to an array of exercise IDs.
 * Preserves the exact ordering of the input IDs and skips missing/invalid IDs.
 * @async
 * @param {Array<string>} exerciseIds - Array of exercise unique IDs.
 * @returns {Promise<Array<Object>>} Array of matching exercise objects.
 */
export async function getExercisesByIds(exerciseIds) {
  if (!Array.isArray(exerciseIds) || exerciseIds.length === 0) {
    return [];
  }
  const exercises = await loadExercises();
  const exerciseMap = new Map(exercises.map(ex => [ex.id, ex]));
  
  const result = [];
  for (const id of exerciseIds) {
    if (typeof id === 'string' && exerciseMap.has(id)) {
      result.push(exerciseMap.get(id));
    }
  }
  return result;
}

/**
 * Retrieves the scheduled workout plan for a specific day of the week.
 * @async
 * @param {string} dayName - Day of the week (e.g., "Monday", "Tuesday").
 * @returns {Promise<Object|null>} Workout plan object for the specified day, or null if not found.
 */
export async function getWorkoutByDay(dayName) {
  if (!dayName || typeof dayName !== 'string') {
    return null;
  }
  const schedule = await loadSchedule();
  const weeklyPlan = Array.isArray(schedule.weeklyPlan) ? schedule.weeklyPlan : [];
  
  const targetDay = dayName.trim().toLowerCase();
  const workout = weeklyPlan.find(plan => plan.day && plan.day.toLowerCase() === targetDay);
  return workout || null;
}

/**
 * Retrieves the scheduled workout plan for today based on local time.
 * @async
 * @returns {Promise<Object|null>} Today's workout plan object, or null if not found.
 */
export async function getTodayWorkout() {
  const todayName = getDayName(new Date());
  if (!todayName) {
    return null;
  }
  return getWorkoutByDay(todayName);
}
