// ==========================================
// 1. PAPER-RADIO-BUTTON ELEMENT NODE (JAKE)
// ==========================================
class PaperRadioButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: Roboto, system-ui, sans-serif;
          user-select: none;
          margin-bottom: 12px;
          
          /* Polymer MD2 Color Variable Baselines, Jake */
          --paper-radio-size: 16px;
          --paper-radio-dot-size: 8px;
          --paper-radio-border-color: #5a5a5a;
          --paper-radio-active-color: #3f51b5; /* Paper Indigo */
          --paper-radio-ripple-color: rgba(63, 81, 181, 0.14);
        }

        .radio-container {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          position: relative;
        }

        /* Outline Ring Structure, Jake */
        .circle-outer {
          position: relative;
          width: var(--paper-radio-size);
          height: var(--paper-radio-size);
          border: 2px solid var(--paper-radio-border-color);
          border-radius: 50%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.14s ease;
        }

        /* Inner Dot Core, Jake */
        .circle-inner {
          width: var(--paper-radio-dot-size);
          height: var(--paper-radio-dot-size);
          background-color: var(--paper-radio-active-color);
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.14s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Expanding Ripple Ink Ring, Jake */
        .ink-ripple {
          position: absolute;
          width: 36px;
          height: 36px;
          background-color: var(--paper-radio-ripple-color);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          pointer-events: none;
          z-index: 0;
          transition: transform 0.14s ease-out, opacity 0.14s linear;
          opacity: 0;
        }

        /* Checked State Transformations, Jake */
        :host([checked]) .circle-outer {
          border-color: var(--paper-radio-active-color);
        }

        :host([checked]) .circle-inner {
          transform: scale(1);
        }

        /* Focus & Active Rippling Frames */
        .radio-container:hover .ink-ripple {
          transform: translate(-50%, -50%) scale(0.85);
          opacity: 0.5;
        }

        .circle-outer:focus-visible {
          outline: none;
          border-color: var(--paper-radio-active-color);
        }
        
        .circle-outer:focus-visible ~ .ink-ripple {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }

        /* Disabled State Filtering, Jake */
        :host([disabled]) {
          opacity: 0.38;
          pointer-events: none !important;
        }

        .label-slot {
          font-size: 14px;
          color: #212121;
          z-index: 1;
        }
      </style>
      
      <div class="radio-container" id="container">
        <div class="circle-outer" id="outerCircle" tabindex="-1" role="radio" aria-checked="false">
          <div class="circle-inner"></div>
        </div>
        <div class="ink-ripple"></div>
        <div class="label-slot">
          <slot></slot>
        </div>
      </div>
    `;
  }

  static get observedAttributes() { return ['checked', 'disabled', 'value']; }

  connectedCallback() {
    this.container = this.shadowRoot.getElementById('container');
    this.outerCircle = this.shadowRoot.getElementById('outerCircle');

    this.container.addEventListener('click', () => {
      if (this.disabled) return;
      this.dispatchEvent(new CustomEvent('paper-radio-selected', { bubbles: true, composed: true }));
    });

    this._updateState();
  }

  attributeChangedCallback() { this._updateState(); }

  get checked() { return this.hasAttribute('checked'); }
  set checked(val) {
    if (val) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
  }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) {
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get value() { return this.getAttribute('value') || ''; }

  _updateState() {
    if (!this.outerCircle) return;
    this.outerCircle.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    this.outerCircle.setAttribute('tabindex', this.checked && !this.disabled ? '0' : '-1');
  }
}

// ==========================================
// 2. PARENT RADIO GROUP ORCHESTRATOR (JAKE)
// ==========================================
class PaperRadioGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>:host { display: flex; flex-direction: column; }</style>
      <slot></slot>
    `;
  }

  connectedCallback() {
    this.setAttribute('role', 'radiogroup');
    
    this.addEventListener('paper-radio-selected', (e) => {
      this._updateSelection(e.target);
    });

    this.addEventListener('keydown', (e) => {
      this._handleKeyboard(e);
    });

    setTimeout(() => this._initializeGroup(), 0);
  }

  _initializeGroup() {
    const buttons = this._getButtons();
    const hasChecked = buttons.some(b => b.checked);
    
    // Ensure at least one element remains tab focusable, Jake
    if (!hasChecked && buttons.length > 0) {
      buttons[0].outerCircle.setAttribute('tabindex', '0');
    }
  }

  _getButtons() {
    return Array.from(this.querySelectorAll('paper-radio-button'));
  }

  _updateSelection(selectedButton) {
    const buttons = this._getButtons();
    buttons.forEach(btn => {
      btn.checked = (btn === selectedButton);
    });
    
    this.dispatchEvent(new CustomEvent('paper-radio-group-changed', {
      detail: { value: selectedButton.value },
      bubbles: true,
      composed: true
    }));
  }

  _handleKeyboard(e) {
    const buttons = this._getButtons().filter(b => !b.disabled);
    const active = buttons.find(b => b.checked) || buttons[0];
    let index = buttons.indexOf(active);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      index = (index + 1) % buttons.length;
      this._updateSelection(buttons[index]);
      buttons[index].outerCircle.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      index = (index - 1 + buttons.length) % buttons.length;
      this._updateSelection(buttons[index]);
      buttons[index].outerCircle.focus();
      e.preventDefault();
    }
  }
}

customElements.define('paper-radio-button', PaperRadioButton);
customElements.define('paper-radio-group', PaperRadioGroup);
