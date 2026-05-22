const trigger = document.getElementById('pickerTrigger');
const menu = document.getElementById('swatchMenu');
const preview = document.getElementById('currentPreview');
const swatches = document.querySelectorAll('.swatch');

// Open or close menu panel when trigger is clicked
trigger.addEventListener('click', (e) => {
  e.stopPropagation();
  menu.classList.toggle('open');
});

// Update the target UI color on selection
swatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    const selectedColor = swatch.getAttribute('data-color');
    preview.style.backgroundColor = selectedColor;
    menu.classList.remove('open'); // Close menu instantly
    
    // Log color to see it working in developer tools
    console.log("Selected Color Hex Code:", selectedColor);
  });
});

// Close picker if click happens outside the element boundaries
document.addEventListener('click', () => {
  menu.classList.remove('open');
});
