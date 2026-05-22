class PaperErrorMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Roboto, system-ui, sans-serif;
          box-sizing: border-box;
          width: 100%;
          max-width: 400px;
          
          /* Custom Token Variables Matrix for you, Jake */
          --paper-error-accent: #db4437; /* Paper Crimson Alert */
          --paper-error-text: #db4437;
          --paper-error-icon-size: 16px;
        }

        /* Core Visibility Frame, Jake */
        .error-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 6px 0;
          
          /* Smooth slide and fade layout transitions, Jake */
          opacity: 0;
          transform: translateY(-4px);
          transition: opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1), transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        :host([visible]) .error-wrapper {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .icon-container {
          flex-shrink: 0;
          width: var(--paper-error-icon-size);
          height: var(--paper-error-icon-size);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--paper-error-accent);
          margin-top: 1px;
        }

        .icon-svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
        }

        .message-content {
          font-size: 12px;
          line-height: 16px;
          font-weight: 400;
          color: var(--paper-error-text);
        }

        /* --- Theme Mapping Configurations, Jake --- */
        :host([variant="text"]) {
          --paper-error-accent: #3f51b5; /* Paper Indigo */
          --paper-error-text: #212121;
        }

        :host([variant="tonal"]) {
          --paper-error-accent: #00796b; /* Paper Medium Teal */
          --paper-error-text: #004d40;
        }

        :host([variant="error"]) {
          --paper-error-accent: #db4437; /* Paper Red */
          --paper-error-text: #db4437;
        }
      </style>
      
      <div class="error-wrapper" id="wrapper" role="alert" aria-live="assertive" aria-hidden="true">
        <div class="icon-container" id="iconBox">
          <svg class="icon-svg" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <div class="message-content">
          <slot>An unknown system exception occurred. (Jake)</slot>
        </div>
      </div>
    `;
  }

  static get observedAttributes() { return ['visible', 'variant', 'hide-icon']; }

  connectedCallback() {
    this.wrapper = this.shadowRoot.getElementById('wrapper');
    this.iconBox = this.shadowRoot.getElementById('iconBox');
    
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'error');
    this._updateLayout();
  }

  attributeChangedCallback() {
    this._updateLayout();
  }

  // Reactive Property Mappings for you, Jake
  get visible() { return this.hasAttribute('visible'); }
  set visible(val) {
    if (val) this.setAttribute('visible', '');
    else this.removeAttribute('visible');
  }

  get variant() { return this.getAttribute('variant'); }
  set variant(val) { this.setAttribute('variant', val); }

  get hideIcon() { return this.hasAttribute('hide-icon'); }
  set hideIcon(val) {
    if (val) this.setAttribute('hide-icon', '');
    else this.removeAttribute('hide-icon');
  }

  // Programmatic API manipulation commands, Jake
  show(customMessage = null) {
    if (customMessage) {
      this.textContent = customMessage;
    }
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  _updateLayout() {
    if (!this.wrapper) return;
    
    // Adjust aria properties to mirror active visibility bounds, Jake
    this.wrapper.setAttribute('aria-hidden', this.visible ? 'false' : 'true');
    
    if (this.hideIcon) {
      this.iconBox.style.display = 'none';
    } else {
      this.iconBox.style.display = 'inline-flex';
    }
  }
}

customElements.define('paper-error-message', PaperErrorMessage);
