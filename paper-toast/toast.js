const toast = document.getElementById('paperToast');
const toastText = document.getElementById('toastText');
const toastActionBtn = document.getElementById('toastActionBtn');

const simpleTrigger = document.getElementById('showSimpleToast');
const actionTrigger = document.getElementById('showActionToast');

let toastTimer = null;

// Core Toast Engine Controller
function showToast(text, duration = 3000, showAction = false) {
  // Clear any existing active closing schedules
  if (toastTimer) clearTimeout(toastTimer);

  // Update layout attributes dynamically
  toastText.textContent = text;
  toastActionBtn.style.display = showAction ? 'inline-flex' : 'none';

  // Open the component view block
  toast.classList.add('is-open');

  // Schedule auto-dismiss loop profile if duration is greater than zero
  if (duration > 0) {
    toastTimer = setTimeout(() => {
      closeToast();
    }, duration);
  }
}

function closeToast() {
  toast.classList.remove('is-open');
}

// Button Click Event Bindings
simpleTrigger.addEventListener('click', () => {
  showToast('Connection timed out. Retrying...');
});

actionTrigger.addEventListener('click', () => {
  showToast('Your message has been archived.', 5000, true);
});

// Dismiss action handler
toastActionBtn.addEventListener('click', () => {
  console.log('Action handler executed!');
  closeToast();
});
