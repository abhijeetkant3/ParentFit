/**
 * Voice Guidance & Speech Service for ParentFit PWA.
 * 
 * Provides a text-to-speech abstraction using browser native SpeechSynthesis API.
 * Formats announcements for senior-friendly workout guidance.
 */

const DEFAULT_SETTINGS = {
  enabled: true,
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
  lang: 'en-US'
};

let currentSettings = { ...DEFAULT_SETTINGS };

/**
 * Checks if the browser supports SpeechSynthesis API.
 * @returns {boolean} True if speech synthesis is supported, false otherwise.
 */
export function isSpeechSupported() {
  return typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window;
}

/**
 * Returns a copy of the current in-memory speech settings.
 * @returns {Object} Speech settings copy.
 */
export function getSpeechSettings() {
  return { ...currentSettings };
}

/**
 * Updates in-memory speech settings with partial overrides.
 * @param {Object} settings - Partial settings object (enabled, rate, pitch, volume, lang).
 * @returns {Object} Updated speech settings copy.
 */
export function setSpeechSettings(settings) {
  if (!settings || typeof settings !== 'object') {
    return { ...currentSettings };
  }

  if (typeof settings.enabled === 'boolean') {
    currentSettings.enabled = settings.enabled;
  }

  if (typeof settings.rate === 'number' && !isNaN(settings.rate)) {
    currentSettings.rate = Math.min(2, Math.max(0.1, settings.rate));
  }

  if (typeof settings.pitch === 'number' && !isNaN(settings.pitch)) {
    currentSettings.pitch = Math.min(2, Math.max(0.1, settings.pitch));
  }

  if (typeof settings.volume === 'number' && !isNaN(settings.volume)) {
    currentSettings.volume = Math.min(1, Math.max(0, settings.volume));
  }

  if (typeof settings.lang === 'string' && settings.lang.trim().length > 0) {
    currentSettings.lang = settings.lang.trim();
  }

  return { ...currentSettings };
}

/**
 * Speaks a text string using SpeechSynthesis with current or custom options.
 * Cancels active speech before starting a new announcement.
 * 
 * @param {string} text - Text string to speak.
 * @param {Object} [options] - Optional rate, pitch, volume, lang overrides.
 * @returns {boolean} True if speech was queued, false if disabled/unsupported/invalid.
 */
export function speak(text, options = {}) {
  if (!isSpeechSupported() || !currentSettings.enabled) {
    return false;
  }

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());

    const rate = (options && typeof options.rate === 'number' && !isNaN(options.rate)) ? options.rate : currentSettings.rate;
    const pitch = (options && typeof options.pitch === 'number' && !isNaN(options.pitch)) ? options.pitch : currentSettings.pitch;
    const volume = (options && typeof options.volume === 'number' && !isNaN(options.volume)) ? options.volume : currentSettings.volume;
    const lang = (options && typeof options.lang === 'string' && options.lang.trim()) ? options.lang.trim() : currentSettings.lang;

    utterance.rate = Math.min(2, Math.max(0.1, rate));
    utterance.pitch = Math.min(2, Math.max(0.1, pitch));
    utterance.volume = Math.min(1, Math.max(0, volume));
    utterance.lang = lang;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn('[AudioService] Speech synthesis failed:', e);
    return false;
  }
}

/**
 * Cancels all currently active and queued speech announcements.
 * @returns {boolean} True if cancelled successfully, false otherwise.
 */
export function stopSpeaking() {
  if (!isSpeechSupported()) return false;
  try {
    window.speechSynthesis.cancel();
    return true;
  } catch (e) {
    console.warn('[AudioService] Failed to stop speech:', e);
    return false;
  }
}

/**
 * Pauses active speech output.
 * @returns {boolean} True if paused successfully, false otherwise.
 */
export function pauseSpeaking() {
  if (!isSpeechSupported()) return false;
  try {
    window.speechSynthesis.pause();
    return true;
  } catch (e) {
    console.warn('[AudioService] Failed to pause speech:', e);
    return false;
  }
}

/**
 * Resumes paused speech output.
 * @returns {boolean} True if resumed successfully, false otherwise.
 */
export function resumeSpeaking() {
  if (!isSpeechSupported()) return false;
  try {
    window.speechSynthesis.resume();
    return true;
  } catch (e) {
    console.warn('[AudioService] Failed to resume speech:', e);
    return false;
  }
}

/**
 * Checks if speech synthesis is currently active or speaking.
 * @returns {boolean} True if speaking, false otherwise.
 */
export function isSpeaking() {
  if (!isSpeechSupported()) return false;
  try {
    return window.speechSynthesis.speaking;
  } catch (e) {
    return false;
  }
}

/**
 * Speaks a countdown number or "Go!".
 * Does NOT create timers or intervals.
 * 
 * @param {number} seconds - Countdown number (0 speaks "Go!").
 * @returns {boolean} True if speech was queued.
 */
export function announceCountdown(seconds) {
  const sec = Number(seconds);
  if (isNaN(sec) || sec < 0) return false;
  const text = sec === 0 ? 'Go!' : String(sec);
  return speak(text);
}

/**
 * Speaks the name of an upcoming exercise.
 * 
 * @param {string} exerciseName - Name of the exercise.
 * @returns {boolean} True if speech was queued.
 */
export function announceExerciseStart(exerciseName) {
  if (!exerciseName || typeof exerciseName !== 'string' || exerciseName.trim() === '') {
    return false;
  }
  return speak(`Next exercise: ${exerciseName.trim()}.`);
}

/**
 * Speaks a rest duration announcement.
 * Does NOT create a timer or wait.
 * 
 * @param {number} seconds - Rest duration in seconds.
 * @returns {boolean} True if speech was queued.
 */
export function announceRest(seconds) {
  const sec = Number(seconds);
  if (isNaN(sec) || sec <= 0) return false;
  return speak(`Rest for ${sec} seconds.`);
}

/**
 * Speaks set progress (e.g., "Set 1 of 3.").
 * 
 * @param {number} setNumber - Current set index.
 * @param {number} totalSets - Total set count.
 * @returns {boolean} True if speech was queued.
 */
export function announceSet(setNumber, totalSets) {
  const current = Number(setNumber);
  const total = Number(totalSets);

  if (isNaN(current) || isNaN(total) || current <= 0 || total <= 0 || current > total) {
    return false;
  }

  return speak(`Set ${current} of ${total}.`);
}

/**
 * Speaks a positive workout completion announcement.
 * @returns {boolean} True if speech was queued.
 */
export function announceWorkoutComplete() {
  return speak('Workout complete. Great job.');
}
