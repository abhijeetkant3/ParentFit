/* Parentfit Language & Localization Service */
import { store } from '../store.js';
import { en } from '../translations/en.js';
import { hi } from '../translations/hi.js';
import { ja } from '../translations/ja.js';

const dictionaries = {
  English: en,
  Hindi: hi,
  Japanese: ja
};

/**
 * Gets the current active language token ('English' | 'Hindi' | 'Japanese').
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
 * Translates day names ('Monday' -> 'सोमवार' in Hindi, '月曜日' in Japanese, 'Monday' in English).
 */
export function translateDay(dayName) {
  if (!dayName) return '';
  return t(`days.${dayName}`) || dayName;
}

/**
 * Translates rating internal tokens ('easy' -> 'Easy'/'आसान'/'簡単').
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
  
  const currentLang = getCurrentLanguage();
  if (currentLang === 'English') return exercise;

  const dict = dictionaries[currentLang];
  const langEx = dict?.exercises?.[exercise.id];

  if (!langEx) return exercise;

  return {
    ...exercise,
    name: langEx.name || exercise.name,
    difficulty: langEx.difficulty || exercise.difficulty,
    equipment: langEx.equipment || exercise.equipment,
    muscles: Array.isArray(langEx.muscles) ? [...langEx.muscles] : exercise.muscles,
    instructions: Array.isArray(langEx.instructions) ? [...langEx.instructions] : exercise.instructions,
    mistakes: Array.isArray(langEx.mistakes) ? [...langEx.mistakes] : exercise.mistakes,
    breathing: langEx.breathing || exercise.breathing
  };
}

/**
 * Translates workout plan / schedule item for user-facing UI rendering.
 * Does NOT mutate original plan object or internal day name.
 */
export function translateWorkoutPlan(plan) {
  if (!plan || typeof plan !== 'object') return plan;

  const translatedDay = translateDay(plan.day);
  const currentLang = getCurrentLanguage();

  if (currentLang === 'English') {
    return {
      ...plan,
      displayDay: translatedDay
    };
  }

  const dict = dictionaries[currentLang];
  const titleTrans = dict?.plans?.[plan.title] || plan.title;
  const focusTrans = dict?.plans?.[plan.focus] || plan.focus;
  const intensityTrans = dict?.plans?.[plan.intensity] || plan.intensity;

  return {
    ...plan,
    displayDay: translatedDay,
    title: titleTrans,
    focus: focusTrans,
    intensity: intensityTrans
  };
}

/**
 * Translates nutrition tips & meal ideas if target language is selected.
 */
export function translateNutritionData(data) {
  if (!data || typeof data !== 'object') return data;
  
  const currentLang = getCurrentLanguage();
  if (currentLang === 'English') return data;

  const dict = dictionaries[currentLang];

  return {
    ...data,
    dailyTips: dict?.nutritionData?.dailyTips || data.dailyTips,
    mealIdeas: dict?.nutritionData?.mealIdeas || data.mealIdeas
  };
}

