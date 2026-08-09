/**
 * Recovery & Rest Engine for ParentFit PWA.
 * 
 * Pure domain module responsible for providing conservative workout scheduling
 * and recovery recommendations based on workout history and frequency.
 */

import { getTodayDate, getDateDaysAgo, formatDate, isToday, isYesterday, getDateDifferenceInDays } from '../utils/date.js';

const DEFAULT_OPTIONS = {
  maxConsecutiveDays: 4,
  maxWeeklyWorkouts: 5,
  weeklyWindowDays: 7
};

/**
 * Normalizes options object with fallback defaults.
 * @param {Object} [options] 
 * @returns {Object}
 */
function getNormalizedOptions(options) {
  if (!options || typeof options !== 'object') {
    return { ...DEFAULT_OPTIONS };
  }
  const maxConsecutiveDays = Number(options.maxConsecutiveDays);
  const maxWeeklyWorkouts = Number(options.maxWeeklyWorkouts);
  const weeklyWindowDays = Number(options.weeklyWindowDays);

  return {
    maxConsecutiveDays: (!isNaN(maxConsecutiveDays) && maxConsecutiveDays > 0) ? maxConsecutiveDays : DEFAULT_OPTIONS.maxConsecutiveDays,
    maxWeeklyWorkouts: (!isNaN(maxWeeklyWorkouts) && maxWeeklyWorkouts > 0) ? maxWeeklyWorkouts : DEFAULT_OPTIONS.maxWeeklyWorkouts,
    weeklyWindowDays: (!isNaN(weeklyWindowDays) && weeklyWindowDays > 0) ? weeklyWindowDays : DEFAULT_OPTIONS.weeklyWindowDays
  };
}

/**
 * Extracts and deduplicates valid local date strings (YYYY-MM-DD) from workout history.
 * Ignores malformed records and future dates. Returns dates sorted descending.
 * 
 * @param {Array<Object|string>} workoutHistory 
 * @returns {Array<string>} Unique date strings sorted descending.
 */
function extractWorkoutDates(workoutHistory) {
  if (!Array.isArray(workoutHistory) || workoutHistory.length === 0) {
    return [];
  }

  const todayStr = getTodayDate();
  const dateSet = new Set();

  for (const item of workoutHistory) {
    if (!item) continue;
    let rawDate = null;
    if (typeof item === 'string' || typeof item === 'number' || item instanceof Date) {
      rawDate = item;
    } else if (typeof item === 'object') {
      rawDate = item.date || item.completedAt || item.timestamp || null;
    }

    if (!rawDate) continue;
    const formatted = formatDate(rawDate);
    if (!formatted) continue;

    // Ignore future dates
    if (formatted > todayStr) continue;

    dateSet.add(formatted);
  }

  return Array.from(dateSet).sort().reverse();
}

/**
 * Counts the number of unique workout calendar days within a given number of recent days.
 * 
 * @param {Array<Object|string>} workoutHistory - Array of completed workout records.
 * @param {number} [days=7] - Number of recent calendar days to inspect.
 * @returns {number} Count of unique workout days within the window.
 */
export function getWorkoutFrequency(workoutHistory, days = 7) {
  const windowSize = (typeof days === 'number' && days > 0) ? days : 7;
  const uniqueDates = extractWorkoutDates(workoutHistory);
  if (uniqueDates.length === 0) return 0;

  const todayStr = getTodayDate();
  const startDateStr = getDateDaysAgo(windowSize - 1) || todayStr;

  let count = 0;
  for (const dStr of uniqueDates) {
    if (dStr >= startDateStr && dStr <= todayStr) {
      count++;
    }
  }
  return count;
}

/**
 * Calculates the current consecutive workout streak from the most recent workout date backwards.
 * Returns 0 if the most recent workout was 2 or more days ago.
 * 
 * @param {Array<Object|string>} workoutHistory - Array of completed workout records.
 * @returns {number} Consecutive workout days count.
 */
export function getConsecutiveWorkoutDays(workoutHistory) {
  const uniqueDates = extractWorkoutDates(workoutHistory);
  if (uniqueDates.length === 0) return 0;

  const mostRecentStr = uniqueDates[0];

  // If the most recent workout was prior to yesterday, active streak is broken
  if (!isToday(mostRecentStr) && !isYesterday(mostRecentStr)) {
    return 0;
  }

  let consecutiveCount = 1;
  let currentDate = mostRecentStr;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = uniqueDates[i];
    const diff = getDateDifferenceInDays(currentDate, prevDate);
    if (diff === 1) {
      consecutiveCount++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return consecutiveCount;
}

/**
 * Determines whether a recovery day is recommended based on workout history and thresholds.
 * 
 * @param {Array<Object|string>} workoutHistory - Workout history records.
 * @param {Object} [options] - Threshold options.
 * @returns {boolean} True if recovery is recommended, false otherwise.
 */
export function shouldRecommendRecovery(workoutHistory, options) {
  if (!Array.isArray(workoutHistory) || workoutHistory.length === 0) {
    return false;
  }

  const opts = getNormalizedOptions(options);
  const consecutiveDays = getConsecutiveWorkoutDays(workoutHistory);
  const weeklyWorkouts = getWorkoutFrequency(workoutHistory, opts.weeklyWindowDays);

  if (consecutiveDays >= opts.maxConsecutiveDays) {
    return true;
  }
  if (weeklyWorkouts >= opts.maxWeeklyWorkouts) {
    return true;
  }

  return false;
}

/**
 * Generates a short, human-readable reason for the recovery recommendation.
 * Avoids medical terms or alarming language.
 * 
 * @param {Array<Object|string>} workoutHistory - Workout history records.
 * @param {Object} [options] - Threshold options.
 * @returns {string} Human-readable reason string.
 */
export function getRecoveryReason(workoutHistory, options) {
  if (!Array.isArray(workoutHistory) || workoutHistory.length === 0) {
    return 'Insufficient workout history.';
  }

  const opts = getNormalizedOptions(options);
  const consecutiveDays = getConsecutiveWorkoutDays(workoutHistory);
  const weeklyWorkouts = getWorkoutFrequency(workoutHistory, opts.weeklyWindowDays);

  if (consecutiveDays >= opts.maxConsecutiveDays) {
    return "You've completed several workout days in a row.";
  }
  if (weeklyWorkouts >= opts.maxWeeklyWorkouts) {
    return "You've had a high workout frequency this week.";
  }

  return 'Your recent workout frequency looks balanced.';
}

/**
 * Convenience function checking if today is a recommended recovery day.
 * 
 * @param {Array<Object|string>} workoutHistory - Workout history records.
 * @param {Object} [options] - Threshold options.
 * @returns {boolean} True if recovery day, false otherwise.
 */
export function isRecoveryDay(workoutHistory, options) {
  return shouldRecommendRecovery(workoutHistory, options);
}

/**
 * Constructs a comprehensive normalized recovery recommendation object.
 * 
 * @param {Array<Object|string>} workoutHistory - Workout history records.
 * @param {Object} [options] - Threshold options.
 * @returns {Object} Recovery recommendation object.
 */
export function getRecoveryRecommendation(workoutHistory, options) {
  if (!Array.isArray(workoutHistory) || workoutHistory.length === 0) {
    return {
      type: 'unknown',
      recommended: false,
      reason: 'Insufficient workout history.',
      consecutiveDays: 0,
      weeklyWorkouts: 0
    };
  }

  const opts = getNormalizedOptions(options);
  const consecutiveDays = getConsecutiveWorkoutDays(workoutHistory);
  const weeklyWorkouts = getWorkoutFrequency(workoutHistory, opts.weeklyWindowDays);
  const recommended = shouldRecommendRecovery(workoutHistory, opts);
  const reason = getRecoveryReason(workoutHistory, opts);

  return {
    type: recommended ? 'recovery' : 'workout',
    recommended,
    reason,
    consecutiveDays,
    weeklyWorkouts
  };
}
