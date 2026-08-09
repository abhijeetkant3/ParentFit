/**
 * Exercise Interpretation Engine for ParentFit PWA.
 * 
 * Domain-level service for classifying and parsing exercise definitions,
 * specifically distinguishing between repetition-based and time-based exercises.
 */

/**
 * Parses a repetition specification into a min/max rep range object.
 * 
 * @param {string|number} reps - Raw reps value (e.g., "10-12 reps", "10 reps", 10).
 * @returns {{ min: number, max: number, unit: string }|null} Rep range object or null if invalid/not rep-based.
 */
export function parseRepRange(reps) {
  if (reps === null || reps === undefined || typeof reps === 'boolean') {
    return null;
  }

  // Direct numeric rep count
  if (typeof reps === 'number') {
    if (Number.isInteger(reps) && reps > 0) {
      return { min: reps, max: reps, unit: 'reps' };
    }
    return null;
  }

  if (typeof reps !== 'string') {
    return null;
  }

  const str = reps.trim().toLowerCase();
  if (!str) {
    return null;
  }

  // Reject strings containing time units to prevent false rep matches
  const timeKeywordsRegex = /(\b|\d)(sec|secs|second|seconds|min|mins|minute|minutes)\b/i;
  if (timeKeywordsRegex.test(str)) {
    return null;
  }

  // Rep unit keywords or purely numeric/range pattern
  const repKeywordsRegex = /(\b|\d)(rep|reps|repetition|repetitions)\b/i;
  const isNumericOrRange = /^\d+\s*([-–—]\s*\d+)?\s*$/i.test(str);

  if (!repKeywordsRegex.test(str) && !isNumericOrRange) {
    return null;
  }

  // Match range (e.g., "10-12 reps", "8-10 repetitions")
  const rangeMatch = str.match(/^(\d+)\s*[-–—]\s*(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0 || min > max) {
      return null;
    }
    return { min, max, unit: 'reps' };
  }

  // Match single count (e.g., "10 reps", "12")
  const singleMatch = str.match(/^(\d+)/);
  if (singleMatch) {
    const count = parseInt(singleMatch[1], 10);
    if (isNaN(count) || count <= 0) {
      return null;
    }
    return { min: count, max: count, unit: 'reps' };
  }

  return null;
}

/**
 * Parses a duration specification into min/max duration in seconds.
 * 
 * @param {string} reps - Raw reps/duration value (e.g., "30-40 seconds", "15-20 minutes").
 * @returns {{ minSeconds: number, maxSeconds: number }|null} Duration object in seconds or null if not time-based.
 */
export function parseDuration(reps) {
  if (!reps || typeof reps !== 'string') {
    return null;
  }

  const str = reps.trim().toLowerCase();
  if (!str) {
    return null;
  }

  // Determine unit multiplier (minutes vs seconds)
  const isMinutes = /(\b|\d)(min|mins|minute|minutes)\b/i.test(str);
  const isSeconds = /(\b|\d)(sec|secs|second|seconds)\b/i.test(str);

  if (!isMinutes && !isSeconds) {
    return null;
  }

  const multiplier = isMinutes ? 60 : 1;

  // Match range (e.g., "30-40 seconds", "1-2 minutes")
  const rangeMatch = str.match(/(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    const minVal = parseFloat(rangeMatch[1]);
    const maxVal = parseFloat(rangeMatch[2]);
    if (isNaN(minVal) || isNaN(maxVal) || minVal <= 0 || maxVal <= 0 || minVal > maxVal) {
      return null;
    }
    return {
      minSeconds: Math.round(minVal * multiplier),
      maxSeconds: Math.round(maxVal * multiplier)
    };
  }

  // Match single value (e.g., "30 seconds", "45 sec hold", "1 minute")
  const singleMatch = str.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    if (isNaN(val) || val <= 0) {
      return null;
    }
    const seconds = Math.round(val * multiplier);
    return {
      minSeconds: seconds,
      maxSeconds: seconds
    };
  }

  return null;
}

/**
 * Classifies an exercise into "reps", "time", or "unknown".
 * 
 * @param {Object} exercise - Exercise object containing a reps property.
 * @returns {"reps"|"time"|"unknown"} Exercise classification.
 */
export function getExerciseType(exercise) {
  if (!exercise || typeof exercise !== 'object') {
    return 'unknown';
  }

  const repsField = exercise.reps;

  if (parseRepRange(repsField) !== null) {
    return 'reps';
  }

  if (parseDuration(repsField) !== null) {
    return 'time';
  }

  return 'unknown';
}

/**
 * Checks if an exercise is repetition-based.
 * 
 * @param {Object} exercise - Exercise object.
 * @returns {boolean} True if repetition-based, false otherwise.
 */
export function isRepBasedExercise(exercise) {
  return getExerciseType(exercise) === 'reps';
}

/**
 * Checks if an exercise is time-based.
 * 
 * @param {Object} exercise - Exercise object.
 * @returns {boolean} True if time-based, false otherwise.
 */
export function isTimeBasedExercise(exercise) {
  return getExerciseType(exercise) === 'time';
}

/**
 * Retrieves the set count for an exercise.
 * 
 * @param {Object} exercise - Exercise object.
 * @returns {number} Set count as a positive integer, or 0 if invalid.
 */
export function getExerciseSets(exercise) {
  if (!exercise || typeof exercise !== 'object') {
    return 0;
  }
  const sets = Number(exercise.sets);
  if (!isNaN(sets) && Number.isInteger(sets) && sets > 0) {
    return sets;
  }
  return 0;
}

/**
 * Retrieves the rest duration in seconds for an exercise.
 * 
 * @param {Object} exercise - Exercise object.
 * @returns {number} Rest duration in seconds, or 0 if invalid.
 */
export function getExerciseRest(exercise) {
  if (!exercise || typeof exercise !== 'object') {
    return 0;
  }
  const rest = Number(exercise.rest);
  if (!isNaN(rest) && rest >= 0) {
    return rest;
  }
  return 0;
}

/**
 * Constructs a normalized metadata object for an exercise.
 * 
 * @param {Object} exercise - Exercise object.
 * @returns {Object} Normalized exercise metadata.
 */
export function getExerciseMetadata(exercise) {
  if (!exercise || typeof exercise !== 'object') {
    return {
      id: null,
      type: 'unknown',
      sets: 0,
      rest: 0
    };
  }

  const type = getExerciseType(exercise);
  const sets = getExerciseSets(exercise);
  const rest = getExerciseRest(exercise);
  const id = exercise.id || null;

  if (type === 'reps') {
    return {
      id,
      type: 'reps',
      sets,
      reps: parseRepRange(exercise.reps),
      rest
    };
  }

  if (type === 'time') {
    return {
      id,
      type: 'time',
      sets,
      duration: parseDuration(exercise.reps),
      rest
    };
  }

  return {
    id,
    type: 'unknown',
    sets,
    rest
  };
}
