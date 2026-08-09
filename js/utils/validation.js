/**
 * Validation Helpers for ParentFit PWA.
 * 
 * Pure functions for input and model validation.
 */

/**
 * Validates if a value is a valid numeric weight greater than 0.
 * @param {*} weight 
 * @returns {boolean}
 */
export function isValidWeight(weight) {
  if (weight === null || weight === undefined || weight === '' || typeof weight === 'boolean') {
    return false;
  }
  const num = Number(weight);
  return !isNaN(num) && isFinite(num) && num > 0;
}

/**
 * Validates if a value is a positive number (greater than 0).
 * @param {*} value 
 * @returns {boolean}
 */
export function isValidPositiveNumber(value) {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') {
    return false;
  }
  const num = Number(value);
  return !isNaN(num) && isFinite(num) && num > 0;
}

/**
 * Validates if a value is a non-negative number (greater than or equal to 0).
 * @param {*} value 
 * @returns {boolean}
 */
export function isValidNonNegativeNumber(value) {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') {
    return false;
  }
  const num = Number(value);
  return !isNaN(num) && isFinite(num) && num >= 0;
}

/**
 * Validates if an exercise ID is a non-empty string.
 * @param {*} id 
 * @returns {boolean}
 */
export function isValidExerciseId(id) {
  return typeof id === 'string' && id.trim().length > 0;
}

/**
 * Validates if a workout title is a non-empty string.
 * @param {*} title 
 * @returns {boolean}
 */
export function isValidWorkoutTitle(title) {
  return typeof title === 'string' && title.trim().length > 0;
}

/**
 * Validates rep values, supporting numeric reps or text formats (e.g., "10-12 reps", "30-40 seconds", "15-20 minutes").
 * @param {*} reps 
 * @returns {boolean}
 */
export function isValidRepValue(reps) {
  if (typeof reps === 'number') {
    return !isNaN(reps) && isFinite(reps) && reps > 0;
  }
  if (typeof reps === 'string') {
    return reps.trim().length > 0;
  }
  return false;
}

/**
 * Validates if a set count is a positive integer.
 * @param {*} sets 
 * @returns {boolean}
 */
export function isValidSetCount(sets) {
  if (sets === null || sets === undefined || sets === '' || typeof sets === 'boolean') {
    return false;
  }
  const num = Number(sets);
  return !isNaN(num) && Number.isInteger(num) && num > 0;
}
