/**
 * Date Utilities for ParentFit PWA.
 * 
 * Pure functions for date manipulation, formatting, and comparison.
 * Standardizes normalized date strings in YYYY-MM-DD local calendar date format.
 */

/**
 * Helper to safely convert a Date, string, or timestamp into a valid local Date instance.
 * @param {Date|string|number} input 
 * @returns {Date|null}
 */
function toDate(input) {
  if (input === null || input === undefined || input === '') return null;
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : new Date(input.getTime());
  }
  if (typeof input === 'number') {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return null;
    // Parse YYYY-MM-DD explicitly as local calendar date
    const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Formats a Date object into a YYYY-MM-DD string using local time.
 * @param {Date} d 
 * @returns {string|null}
 */
function formatLocalDate(d) {
  if (!(d instanceof Date) || isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time.
 * @returns {string}
 */
export function getTodayDate() {
  return formatLocalDate(new Date());
}

/**
 * Returns the full day name (e.g. "Monday", "Tuesday") for a given date in local time.
 * @param {Date|string|number} date 
 * @returns {string} Day name or empty string if invalid.
 */
export function getDayName(date) {
  const d = toDate(date);
  if (!d) return '';
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[d.getDay()];
}

/**
 * Returns the 0-indexed day of the week (0 = Sunday, 6 = Saturday) for a given date in local time.
 * @param {Date|string|number} date 
 * @returns {number|null} Day index (0-6) or null if date is invalid.
 */
export function getDayIndex(date) {
  const d = toDate(date);
  if (!d) return null;
  return d.getDay();
}

/**
 * Returns yesterday's date formatted as YYYY-MM-DD in local time.
 * @returns {string}
 */
export function getYesterdayDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatLocalDate(d);
}

/**
 * Returns the date string (YYYY-MM-DD) for N days ago in local time.
 * @param {number} days 
 * @returns {string|null}
 */
export function getDateDaysAgo(days) {
  const numDays = Number(days);
  if (isNaN(numDays)) return null;
  const d = new Date();
  d.setDate(d.getDate() - numDays);
  return formatLocalDate(d);
}

/**
 * Normalizes a Date object, date string, or timestamp to a YYYY-MM-DD string.
 * @param {Date|string|number} date 
 * @returns {string|null} Formatted date string or null if invalid.
 */
export function formatDate(date) {
  const d = toDate(date);
  return d ? formatLocalDate(d) : null;
}

/**
 * Checks if a given date corresponds to today in local time.
 * @param {Date|string|number} date 
 * @returns {boolean}
 */
export function isToday(date) {
  const formatted = formatDate(date);
  return formatted !== null && formatted === getTodayDate();
}

/**
 * Checks if a given date corresponds to yesterday in local time.
 * @param {Date|string|number} date 
 * @returns {boolean}
 */
export function isYesterday(date) {
  const formatted = formatDate(date);
  return formatted !== null && formatted === getYesterdayDate();
}

/**
 * Checks if two dates fall on the exact same local calendar date (YYYY-MM-DD).
 * @param {Date|string|number} dateA 
 * @param {Date|string|number} dateB 
 * @returns {boolean}
 */
export function isSameDate(dateA, dateB) {
  const formattedA = formatDate(dateA);
  const formattedB = formatDate(dateB);
  if (!formattedA || !formattedB) return false;
  return formattedA === formattedB;
}

/**
 * Calculates the difference in calendar days between two dates.
 * @param {Date|string|number} dateA 
 * @param {Date|string|number} dateB 
 * @returns {number} Absolute difference in calendar days, or 0 if either date is invalid.
 */
export function getDateDifferenceInDays(dateA, dateB) {
  const dA = toDate(dateA);
  const dB = toDate(dateB);
  if (!dA || !dB) return 0;

  const utcA = Date.UTC(dA.getFullYear(), dA.getMonth(), dA.getDate());
  const utcB = Date.UTC(dB.getFullYear(), dB.getMonth(), dB.getDate());
  
  const diffMs = Math.abs(utcA - utcB);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
