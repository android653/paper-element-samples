const button = document.querySelector('.paper-icon-button');

button.addEventListener('click', function (e) {
  const ripple = this.querySelector('.ripple');
  
  // Calculate position relative to the button
  const rect = this.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Position and activate the ripple css
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.classList.add('active');
  
  // Remove the animation class after it finishes
  setTimeout(() => {
    ripple.classList.remove('active');
  }, 400);
});
