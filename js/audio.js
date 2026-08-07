/* FitMom Offline Web Audio API Synthesizer */
import { store } from './store.js';

class AudioManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBeep(frequency = 600, durationMs = 150, type = 'sine') {
    if (!store.state.settings.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.value = frequency;

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (durationMs / 1000));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + (durationMs / 1000));
    } catch (e) {
      console.warn('Audio playback prevented', e);
    }
  }

  playCountdownTick() {
    this.playBeep(650, 100, 'sine');
  }

  playTimerFinished() {
    this.playBeep(880, 250, 'triangle');
    setTimeout(() => this.playBeep(1100, 400, 'sine'), 260);
  }

  playWorkoutSuccess() {
    this.playBeep(523.25, 180, 'sine'); // C5
    setTimeout(() => this.playBeep(659.25, 180, 'sine'), 190); // E5
    setTimeout(() => this.playBeep(783.99, 180, 'sine'), 380); // G5
    setTimeout(() => this.playBeep(1046.50, 400, 'sine'), 570); // C6
  }
}

export const audioManager = new AudioManager();
