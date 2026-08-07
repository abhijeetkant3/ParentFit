/* FitMom About & Safety View Page */

export const aboutView = {
  async render() {
    return `
      <div class="view-about animate-fade-in">
        <!-- Hero Card -->
        <div class="card card-hero text-center mb-3">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">❤️</div>
          <h1 style="font-size: 2rem;">FitMom</h1>
          <p style="opacity: 0.95; font-size: 1.15rem;">Your Gentle Personal Fitness Coach</p>
          <span class="badge badge-accent mt-1">Version 1.0 (PWA Offline Ready)</span>
        </div>

        <!-- Mission Card -->
        <div class="card mb-3">
          <h2 style="font-size: 1.35rem;" class="mb-2">Designed With Love for Mom</h2>
          <p style="font-size: 1.05rem; line-height: 1.6;">
            FitMom was created specifically for women and older adults who want to stay active, build strength, protect joint health, and feel energized every single day—without intense gym strain.
          </p>
        </div>

        <!-- Safety Disclaimer Card -->
        <div class="card mb-3" style="background: #FFF3E0; border: 1px solid #FFE0B2;">
          <div class="flex items-center gap-2 mb-1">
            <span style="font-size: 1.6rem;">🩺</span>
            <h3 style="font-size: 1.25rem; margin-bottom: 0; color: #E65100;">Health & Safety Note</h3>
          </div>
          <p style="font-size: 1rem; color: #E65100; line-height: 1.6; margin-bottom: 0;">
            Always listen to your body! Exercises should feel comfortable and gentle. If you experience dizziness, sharp joint pain, or shortness of breath, stop immediately and rest. Consult your doctor or physician before starting any new fitness routine.
          </p>
        </div>

        <!-- Golden Rules Card -->
        <div class="card mb-3">
          <h2 style="font-size: 1.35rem;" class="mb-2">Golden Rules for Success</h2>
          <ol style="padding-left: 1.25rem; line-height: 1.6; font-size: 1.05rem;">
            <li class="mb-2"><strong>Consistency over Intensity:</strong> A gentle 10-minute walk or stretch every day is better than an exhausting workout once a month.</li>
            <li class="mb-2"><strong>Breathe Steadily:</strong> Never hold your breath while exercising. Inhale through your nose and exhale out through your mouth.</li>
            <li class="mb-2"><strong>Stay Hydrated:</strong> Drink a glass of fresh water before and after every workout session.</li>
          </ol>
        </div>

        <!-- Footer Info -->
        <div class="text-center text-muted mb-3" style="font-size: 0.95rem;">
          <p>FitMom Progressive Web App • Works 100% Offline</p>
        </div>
      </div>
    `;
  }
};
