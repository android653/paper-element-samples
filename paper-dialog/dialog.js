const openBtn = document.getElementById('openDialogBtn');
const backdrop = document.getElementById('dialogBackdrop');
const cancelBtn = document.getElementById('closeDialogBtn');
const confirmBtn = document.getElementById('confirmDialogBtn');

// Helper wrapper functions
function openDialog() {
  backdrop.classList.add('is-open');
  document.body.style.overflow = 'hidden'; // Stop background scrolling mechanics
}

function closeDialog() {
  backdrop.classList.remove('is-open');
  document.body.style.overflow = ''; // Unlock viewport layout container rules
}

// Event Bindings
openBtn.addEventListener('click', openDialog);
cancelBtn.addEventListener('click', closeDialog);
confirmBtn.addEventListener('click', () => {
  console.log('Action accepted');
  closeDialog();
});

// Structural Dismiss wrapper: Close window cleanly if user clicks directly on backdrop masking region
backdrop.addEventListener('click', function(e) {
  if (e.target === this) {
    closeDialog();
  }
});
