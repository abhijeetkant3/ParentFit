/* Parentfit Reusable Modal Component */

class ModalManager {
  constructor() {
    this.overlay = null;
  }

  init() {
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'modal-overlay';
      this.overlay.id = 'global-modal-overlay';
      document.body.appendChild(this.overlay);

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
  }

  show({ title, bodyHTML, primaryText = 'Save', onPrimary, secondaryText = 'Cancel', onSecondary }) {
    this.init();

    this.overlay.innerHTML = `
      <div class="modal-card animate-scale-in" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title" class="mb-2" style="font-size: var(--font-size-lg);">${title}</h2>
        <div class="modal-body mb-3">
          ${bodyHTML}
        </div>
        <div class="flex gap-2">
          ${secondaryText ? `<button id="modal-secondary-btn" class="btn btn-outline" style="flex: 1;">${secondaryText}</button>` : ''}
          ${primaryText ? `<button id="modal-primary-btn" class="btn btn-primary" style="flex: 1;">${primaryText}</button>` : ''}
        </div>
      </div>
    `;

    this.overlay.classList.add('active');

    const primaryBtn = document.getElementById('modal-primary-btn');
    const secondaryBtn = document.getElementById('modal-secondary-btn');

    if (primaryBtn) {
      primaryBtn.onclick = () => {
        if (typeof onPrimary === 'function') {
          const result = onPrimary();
          if (result !== false) this.close();
        } else {
          this.close();
        }
      };
    }

    if (secondaryBtn) {
      secondaryBtn.onclick = () => {
        if (typeof onSecondary === 'function') onSecondary();
        this.close();
      };
    }
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
  }
}

export const modalManager = new ModalManager();
