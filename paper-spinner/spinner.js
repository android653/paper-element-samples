// Quick routine to turn spinning visibility states on and off, Jake
function toggleSpinners() {
  const spinners = document.querySelectorAll('.paper-spinner');
  spinners.forEach(spinner => {
    spinner.classList.toggle('active');
  });
}
