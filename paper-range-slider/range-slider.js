import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class RangeSlider extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          font-family: sans-serif;
          margin: 15px 0;
          --slider-color: #04AA6D;
          --track-color: #d3d3d3;
        }

        .slider-container {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Base track styling resetting native appearance */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: var(--track-color);
          outline: none;
          opacity: 0.9;
          transition: opacity .2s;
        }

        input[type="range"]:hover {
          opacity: 1;
        }

        /* Webkit browser thumb (Chrome, Safari, Edge, Opera) */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--slider-color);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.1s ease;
        }

        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }

        /* Firefox browser thumb */
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 50%;
          background: var(--slider-color);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.1s ease;
        }

        input[type="range"]::-moz-range-thumb:active {
          transform: scale(1.2);
        }

        .value-display {
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }
      </style>

      <div class="slider-container">
        <label for="polymerSlider" class="value-display">
          Value: [[sliderValue]]
        </label>
        <input 
          id="polymerSlider"
          type="range" 
          min="[[min]]" 
          max="[[max]]" 
          value="{{sliderValue::input}}"
        />
      </div>
    `;
  }

  static get properties() {
    return {
      sliderValue: {
        type: Number,
        value: 50,
        notify: true, // Allows parent components to listen to changes
        reflectToAttribute: true
      },
      min: {
        type: Number,
        value: 0
      },
      max: {
        type: Number,
        value: 100
      }
    };
  }
}

customElements.define('range-slider', RangeSlider);
