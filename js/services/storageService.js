/**
 * Storage Service for ParentFit PWA.
 * 
 * Provides a clean, safe persistence abstraction over Web Storage API (localStorage).
 * Handles quota errors, browser restrictions, and prefix-scoped data clearing.
 */

const STORAGE_PREFIX = 'Parentfit_';

/**
 * Reads a string value from localStorage for the specified key.
 * @param {string} key - Storage key.
 * @param {*} [fallback=null] - Fallback value if key is not found or storage access fails.
 * @returns {string|*} Stored string value or fallback.
 */
export function getItem(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : fallback;
  } catch (e) {
    console.warn(`[StorageService] Failed to read item for key "${key}":`, e);
    return fallback;
  }
}

/**
 * Stores a string representation of a value in localStorage.
 * @param {string} key - Storage key.
 * @param {*} value - Value to store (converted to String).
 * @returns {boolean} True if successfully stored, false otherwise.
 */
export function setItem(key, value) {
  try {
    const strValue = String(value);
    localStorage.setItem(key, strValue);
    return true;
  } catch (e) {
    console.warn(`[StorageService] Failed to set item for key "${key}":`, e);
    return false;
  }
}

/**
 * Removes a key from localStorage.
 * @param {string} key - Storage key to remove.
 * @returns {boolean} True if successfully removed, false otherwise.
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn(`[StorageService] Failed to remove item for key "${key}":`, e);
    return false;
  }
}

/**
 * Checks if a key exists in localStorage.
 * @param {string} key - Storage key to check.
 * @returns {boolean} True if key exists, false otherwise.
 */
export function hasItem(key) {
  try {
    return localStorage.getItem(key) !== null;
  } catch (e) {
    console.warn(`[StorageService] Failed to check key "${key}":`, e);
    return false;
  }
}

/**
 * Clears all application keys starting with "Parentfit_".
 * Does NOT call localStorage.clear() to preserve non-ParentFit data.
 * @returns {boolean} True if completed successfully, false otherwise.
 */
export function clearAll() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
    return true;
  } catch (e) {
    console.warn('[StorageService] Failed to clear application storage keys:', e);
    return false;
  }
}

/**
 * Reads and parses a JSON item from localStorage.
 * @param {string} key - Storage key.
 * @param {*} [fallback=null] - Fallback value if key is missing, JSON is invalid, or storage access fails.
 * @returns {*} Parsed JavaScript object/value or fallback.
 */
export function getJSON(key, fallback = null) {
  try {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) {
      return fallback;
    }
    return JSON.parse(rawValue);
  } catch (e) {
    console.warn(`[StorageService] Failed to read or parse JSON for key "${key}":`, e);
    return fallback;
  }
}

/**
 * Serializes a value as JSON and stores it in localStorage.
 * @param {string} key - Storage key.
 * @param {*} value - Value to serialize and store.
 * @returns {boolean} True if successfully stored, false otherwise.
 */
export function setJSON(key, value) {
  try {
    const jsonString = JSON.stringify(value);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (e) {
    console.warn(`[StorageService] Failed to serialize or store JSON for key "${key}":`, e);
    return false;
  }
}

/**
 * Removes a JSON key from localStorage.
 * @param {string} key - Storage key to remove.
 * @returns {boolean} True if successfully removed, false otherwise.
 */
export function removeJSON(key) {
  return removeItem(key);
}
