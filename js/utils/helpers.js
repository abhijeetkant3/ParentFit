/**
 * Generic Helper Utilities for ParentFit PWA.
 * 
 * Standalone, application-agnostic utility functions.
 */

/**
 * Clamps a numerical value between a minimum and maximum range.
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function clamp(value, min, max) {
  const numVal = Number(value);
  const numMin = Number(min);
  const numMax = Number(max);
  if (isNaN(numVal) || isNaN(numMin) || isNaN(numMax)) return numVal;
  return Math.min(Math.max(numVal, numMin), numMax);
}

/**
 * Returns a new array containing unique elements from the provided array.
 * @param {Array} array 
 * @returns {Array}
 */
export function unique(array) {
  if (!Array.isArray(array)) return [];
  return Array.from(new Set(array));
}

/**
 * Groups elements of an array by a key string or a callback function.
 * @param {Array} array 
 * @param {string|function} keyOrFunction 
 * @returns {Object} An object with grouped items.
 */
export function groupBy(array, keyOrFunction) {
  if (!Array.isArray(array)) return {};
  
  const getKey = typeof keyOrFunction === 'function'
    ? keyOrFunction
    : item => (item && item[keyOrFunction] !== undefined ? item[keyOrFunction] : undefined);

  return array.reduce((acc, item) => {
    const rawKey = getKey(item);
    if (rawKey !== undefined && rawKey !== null) {
      const groupKey = String(rawKey);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
    }
    return acc;
  }, {});
}

/**
 * Formats a duration in seconds into a human-readable string (e.g. 45 -> "45s", 90 -> "1m 30s", 120 -> "2m").
 * @param {number} seconds 
 * @returns {string}
 */
export function formatDuration(seconds) {
  const totalSeconds = Math.floor(Math.max(0, Number(seconds) || 0));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins === 0) {
    return `${secs}s`;
  }
  if (secs === 0) {
    return `${mins}m`;
  }
  return `${mins}m ${secs}s`;
}

/**
 * Safely parses a JSON string, returning a fallback value if parsing fails.
 * @param {string} value 
 * @param {*} [fallback=null] 
 * @returns {*}
 */
export function safeParseJSON(value, fallback = null) {
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

/**
 * Creates a debounced function that delays execution until after `delay` milliseconds.
 * @param {function} fn 
 * @param {number} [delay=300] 
 * @returns {function}
 */
export function debounce(fn, delay = 300) {
  let timeoutId = null;
  return function (...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
