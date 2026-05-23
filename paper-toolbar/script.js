class PaperToolbar extends HTMLElement {
  constructor() {
    super();
    // Instantiate isolated Shadow DOM protection barrier matrix
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 1100;
          /* Material Design elevation shadow */
          box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 
                      0px 4px 5px 0px rgba(0,0,0,0.14);
        }
        
        .toolbar-header {
          display: flex;
          align-items: center;
          height: 64px;
          padding: 0 16px;
          background-color: #6750A4; /* Material M3 primary deep purple theme */
          color: #ffffff;
          box-sizing: border-box;
        }

        .title-slot-container {
          flex: 1;
          font-size: 22px;
          font-weight: 400;
          padding-left: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .actions-slot-container {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      </style>

      <header class="toolbar-header">
        <!-- Structural portals load inner markup dynamically based on slot criteria -->
        <slot name="nav-icon"></slot>
        
        <div class="title-slot-container">
          <slot name="title">Default Title</slot>
        </div>
        
        <div class="actions-slot-container">
          <slot name="actions"></slot>
        </div>
      </header>
    `;
  }
}

// Global initialization component mounting hook step
customElements.define('paper-toolbar', PaperToolbar);

// Optional: Functional runtime logic event hooks
document.getElementById('searchAction').addEventListener('click', () => {
  console.log('Toolbar search layout button pressed.');
});
