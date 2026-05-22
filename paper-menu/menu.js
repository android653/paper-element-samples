// ==========================================
// 1. PAPER-MENU-ITEM COMPONENT NODE (JAKE)
// ==========================================
class PaperMenuItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Roboto, system-ui, sans-serif;
          user-select: none;
        }
        .menu-item-core {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          height: 40px;
          font-size: 14px;
          font-weight: 500;
          color: var(--paper-menu-color, #212121);
          background-color: transparent;
          cursor: pointer;
          outline: none;
          transition: background-color 0.12s ease;
          box-sizing: border-box;
        }
        .menu-item-core:hover {
          background-color: var(--paper-menu-hover-bg, rgba(0, 0, 0, 0.05));
        }
        .menu-item-core:focus-visible {
          background-color: var(--paper-menu-focus-bg, rgba(0, 0, 0, 0.08));
          box-shadow: inset 4px 0 0 0 var(--paper-menu-accent, #3f51b5);
        }
        :host([disabled]) {
          opacity: 0.38;
          pointer-events: none !important;
        }
        ::slotted([slot="shortcut"]) {
          font-size: 12px;
          opacity: 0.5;
          font-weight: 400;
          margin-inline-start: 24px;
        }
      </style>
      <div class="menu-item-core" id="itemCore" tabindex="-1" role="menuitem">
        <slot></slot>
        <slot name="shortcut"></slot>
      </div>
    `;
  }

  static get observedAttributes() { return ['disabled']; }

  connectedCallback() {
    this.itemCore = this.shadowRoot.getElementById('itemCore');
    this._updateAccessibility();
  }

  attributeChangedCallback() { this._updateAccessibility(); }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) {
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  _updateAccessibility() {
    if (!this.itemCore) return;
    if (this.disabled) {
      this.itemCore.removeAttribute('tabindex');
    } else {
      this.itemCore.setAttribute('tabindex', '-1');
    }
  }
}
customElements.define('paper-menu-item', PaperMenuItem);

// ==========================================
// 2. PARENT DROPDOWN SHELL CONTAINER (JAKE)
// ==========================================
class PaperMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          z-index: 10010;
          min-width: 168px;
          border-radius: 2px;
          overflow: hidden;
          background: var(--paper-menu-bg, #ffffff);
          box-shadow: 0 2px 5px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1);
          padding: 8px 0;
          box-sizing: border-box;
          
          /* MD2 scaling entry translation mechanics, Jake */
          opacity: 0;
          transform: scale(0.95);
          pointer-events: none;
          transform-origin: top left;
          transition: opacity 0.12s cubic-bezier(0,0,0.2,1), transform 0.12s cubic-bezier(0,0,0.2,1);
        }
        :host(.visible) {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }
        .menu-list-wrapper {
          display: flex;
          flex-direction: column;
        }
      </style>
      <div class="menu-list-wrapper" id="container" role="menu" tabindex="-1">
        <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'text');
    this.addEventListener('keydown', (e) => this._handleKeyboardOrchestration(e));
    
    // Clear menus safely on dynamic clicking outside, Jake
    this._outsideClickHandler = (e) => {
      if (!this.contains(e.target) && !e.target.hasAttribute('data-menu-trigger')) {
        this.close();
      }
    };
  }

  _getItems() {
    return Array.from(this.querySelectorAll('paper-menu-item')).filter(item => !item.disabled);
  }

  open(anchorElement) {
    const rect = anchorElement.getBoundingClientRect();
    this.classList.add('visible');
    
    // Anchor coordinates calculation step, Jake
    this.style.top = `${rect.bottom + 2}px`;
    this.style.left = `${rect.left}px`;
    
    window.addEventListener('click', this._outsideClickHandler, true);
    
    // Run an automated routing focus shift targeting item #1, Jake
    setTimeout(() => {
      const items = this._getItems();
      if (items.length > 0) {
        items[0].itemCore.focus();
      }
    }, 40);
  }

  close() {
    this.classList.remove('visible');
    window.removeEventListener('click', this._outsideClickHandler, true);
  }

  _handleKeyboardOrchestration(e) {
    const items = this._getItems();
    const activeElement = this.shadowRoot.activeElement || document.activeElement;
    
    const currentItem = items.find(item => item.itemCore === activeElement || item === activeElement);
    let index = items.indexOf(currentItem);

    if (e.key === 'ArrowDown') {
      index = (index + 1) % items.length;
      items[index].itemCore.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      index = (index - 1 + items.length) % items.length;
      items[index].itemCore.focus();
      e.preventDefault();
    } else if (e.key === 'Escape') {
      this.close();
      e.preventDefault();
    }
  }
}
customElements.define('paper-menu', PaperMenu);
