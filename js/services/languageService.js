/* Parentfit Language & Localization Service */
import { store } from '../store.js';
import { en } from '../translations/en.js';
import { hi } from '../translations/hi.js';

const dictionaries = {
  English: en,
  Hindi: hi
};

/**
 * Gets the current active language token ('English' | 'Hindi').
 */
export function getCurrentLanguage() {
  return store.state.settings.language || 'English';
}

/**
 * Checks if current language is Hindi.
 */
export function isHindi() {
  return getCurrentLanguage() === 'Hindi';
}

/**
 * Translation lookup function.
 * 
 * @param {string} keyPath - Dot notation key (e.g. 'home.goodMorning', 'player.setOf').
 * @param {Object} [params] - Optional placeholder parameters (e.g. { name: 'Mom' }).
 * @returns {string} Translated string or English fallback string.
 */
export function t(keyPath, params = {}) {
  if (!keyPath || typeof keyPath !== 'string') return '';

  const currentLang = getCurrentLanguage();
  const dict = dictionaries[currentLang] || en;

  let val = getNestedValue(dict, keyPath);

  // Fallback to English dictionary if missing in target language
  if (val === undefined || val === null) {
    val = getNestedValue(en, keyPath);
  }

  // Final safety fallback: return keyPath or empty string if not found
  if (val === undefined || val === null) {
    return keyPath;
  }

  if (typeof val !== 'string') {
    return val;
  }

  // Replace placeholder parameters like {name}, {count}, etc.
  return val.replace(/\{(\w+)\}/g, (match, paramKey) => {
    return params[paramKey] !== undefined ? params[paramKey] : match;
  });
}

/**
 * Helper to safely extract nested property via dot notation ('home.goodMorning').
 */
function getNestedValue(obj, keyPath) {
  const keys = keyPath.split('.');
  let current = obj;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Translates day names ('Monday' -> 'सोमवार' in Hindi, 'Monday' in English).
 */
export function translateDay(dayName) {
  if (!dayName) return '';
  return t(`days.${dayName}`) || dayName;
}

/**
 * Translates rating internal tokens ('easy' -> 'Easy'/'आसान').
 */
export function translateRating(rating) {
  if (!rating) return '';
  const clean = String(rating).toLowerCase().trim();
  return t(`ratings.${clean}`) || rating;
}

/**
 * Translates exercise object for user-facing UI rendering.
 * Does NOT mutate the original exercise object.
 */
export function translateExercise(exercise) {
  if (!exercise || typeof exercise !== 'object') return exercise;
  if (!isHindi()) return exercise;

  const exId = exercise.id;
  const hiEx = hi.exercises?.[exId];

  if (!hiEx) return exercise;

  return {
    ...exercise,
    name: hiEx.name || exercise.name,
    difficulty: hiEx.difficulty || exercise.difficulty,
    equipment: hiEx.equipment || exercise.equipment,
    muscles: Array.isArray(hiEx.muscles) ? [...hiEx.muscles] : exercise.muscles,
    instructions: Array.isArray(hiEx.instructions) ? [...hiEx.instructions] : exercise.instructions,
    mistakes: Array.isArray(hiEx.mistakes) ? [...hiEx.mistakes] : exercise.mistakes,
    breathing: hiEx.breathing || exercise.breathing
  };
}

/**
 * Translates workout plan / schedule item for user-facing UI rendering.
 * Does NOT mutate original plan object or internal day name.
 */
export function translateWorkoutPlan(plan) {
  if (!plan || typeof plan !== 'object') return plan;

  const translatedDay = translateDay(plan.day);

  if (!isHindi()) {
    return {
      ...plan,
      displayDay: translatedDay
    };
  }

  const titleHi = hi.plans?.[plan.title] || plan.title;
  const focusHi = hi.plans?.[plan.focus] || plan.focus;
  const intensityHi = hi.plans?.[plan.intensity] || plan.intensity;

  return {
    ...plan,
    displayDay: translatedDay,
    title: titleHi,
    focus: focusHi,
    intensity: intensityHi
  };
}

/**
 * Translates nutrition tips & meal ideas if Hindi is selected.
 */
export function translateNutritionData(data) {
  if (!data || typeof data !== 'object') return data;
  if (!isHindi()) return data;

  return {
    ...data,
    dailyTips: hi.nutritionData?.dailyTips || data.dailyTips,
    mealIdeas: hi.nutritionData?.mealIdeas || data.mealIdeas
  };
}
