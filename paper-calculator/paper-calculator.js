import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';

class PaperCalculator extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          max-width: 320px;
          margin: 20px auto;
          font-family: 'Roboto', 'Helvetica', Arial, sans-serif;
        }

        paper-card {
          width: 100%;
          background-color: #f5f5f5;
          padding: 16px;
          border-radius: 12px;
        }

        .display {
          background-color: #263238;
          color: #eceff1;
          padding: 20px;
          font-size: 2rem;
          text-align: right;
          border-radius: 4px;
          margin-bottom: 16px;
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        paper-button {
          margin: 0;
          font-size: 1.2rem;
          font-weight: bold;
          border-radius: 4px;
          background-color: #ffffff;
          color: #37474f;
          --paper-button-flat-keyboard-focus: {
            background-color: #e0e0e0;
          };
        }

        paper-button.operator {
          background-color: #ffb300;
          color: #ffffff;
        }

        paper-button.span-2 {
          grid-column: span 2;
        }

        paper-button.clear {
          background-color: #e53935;
          color: #ffffff;
        }
      </style>

      <paper-card>
        <div class="display">[[displayValue]]</div>

        <div class="buttons">
          <paper-button class="clear" on-click="clearAll">AC</paper-button>
          <paper-button on-click="appendOperator" class="operator">/</paper-button>
          <paper-button on-click="appendOperator" class="operator">*</paper-button>
          <paper-button on-click="deleteLast">DEL</paper-button>

          <paper-button on-click="appendNumber">7</paper-button>
          <paper-button on-click="appendNumber">8</paper-button>
          <paper-button on-click="appendNumber">9</paper-button>
          <paper-button on-click="appendOperator" class="operator">-</paper-button>

          <paper-button on-click="appendNumber">4</paper-button>
          <paper-button on-click="appendNumber">5</paper-button>
          <paper-button on-click="appendNumber">6</paper-button>
          <paper-button on-click="appendOperator" class="operator">+</paper-button>

          <paper-button on-click="appendNumber">1</paper-button>
          <paper-button on-click="appendNumber">2</paper-button>
          <paper-button on-click="appendNumber">3</paper-button>
          <paper-button on-click="calculate" class="operator">=</paper-button>

          <paper-button on-click="appendNumber" class="span-2">0</paper-button>
          <paper-button on-click="appendNumber">.</paper-button>
        </div>
      </paper-card>
    `;
  }

  static get properties() {
    return {
      displayValue: {
        type: String,
        value: '0'
      },
      previousOperand: {
        type: String,
        value: null
      },
      currentOperand: {
        type: String,
        value: '0'
      },
      operation: {
        type: String,
        value: null
      }
    };
  }

  appendNumber(e) {
    const number = e.target.innerText;
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
    this.displayValue = this.currentOperand;
  }

  appendOperator(e) {
    if (this.currentOperand === '0' && !this.previousOperand) return;
    if (this.previousOperand !== null) {
      this.calculate();
    }
    this.operation = e.target.innerText;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '0';
  }

  deleteLast() {
    if (this.currentOperand.length > 1) {
      this.currentOperand = this.currentOperand.slice(0, -1);
    } else {
      this.currentOperand = '0';
    }
    this.displayValue = this.currentOperand;
  }

  clearAll() {
    this.currentOperand = '0';
    this.previousOperand = null;
    this.operation = null;
    this.displayValue = '0';
  }

  calculate() {
    if (this.previousOperand === null || this.operation === null) return;
    
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    let result = 0;

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          alert("Cannot divide by zero");
          this.clearAll();
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = result.toString();
    this.operation = null;
    this.previousOperand = null;
    this.displayValue = this.currentOperand;
  }
}

customElements.define('paper-calculator', PaperCalculator);
