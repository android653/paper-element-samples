// 1. Assign interactive ripples dynamically onto actionable chip variants
document.querySelectorAll('.paper-chip--action, .paper-chip--filterable').forEach(chip => {
  chip.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;

    const oldRipple = this.querySelector('.paper-ripple');
    if (oldRipple) oldRipple.remove();

    const ripple = document.createElement('span');
    ripple.classList.add('paper-ripple');

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// 2. Handle Selected Toggle Events for filterable layouts
document.querySelectorAll('.paper-chip--filterable').forEach(filterChip => {
  filterChip.addEventListener('click', function() {
    this.classList.toggle('is-selected');
  });
});
