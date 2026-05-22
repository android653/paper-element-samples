// Universal track tracking initialization wrapper
function initPaperSlider(sliderEl, isRange = false) {
  const track = sliderEl.querySelector('.paper-slider__track');
  const fill = sliderEl.querySelector('.paper-slider__track-fill');
  const pinValue = sliderEl.querySelector('.pin-value');
  
  let activeThumb = null;
  let valMin = 20; // Default range percentages
  let valMax = 80;
  let singleVal = 50;

  function updateVisuals() {
    const rect = sliderEl.getBoundingClientRect();
    if (!isRange) {
      // Single continuous handling logic
      if (singleVal === 0) {
        sliderEl.classList.add('is-zero');
      } else {
        sliderEl.classList.remove('is-zero');
      }
      const thumb = sliderEl.querySelector('.paper-slider__thumb');
      thumb.style.left = `${singleVal}%`;
      fill.style.width = `${singleVal}%`;
      if (pinValue) pinValue.textContent = Math.round(singleVal);
    } else {
      // Dual coordinate target operations
      const thumbMin = sliderEl.querySelector('.thumb-min');
      const thumbMax = sliderEl.querySelector('.thumb-max');
      thumbMin.style.left = `${valMin}%`;
      thumbMax.style.left = `${valMax}%`;
      fill.style.left = `${valMin}%`;
      fill.style.width = `${valMax - valMin}%`;
    }
  }

  function handleCalculatePercent(clientX) {
    const rect = sliderEl.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    return Math.max(0, Math.min(100, pct)); // Boundary clamping clamp safely
  }

  sliderEl.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    
    const pct = handleCalculatePercent(e.clientX);
    sliderEl.classList.add('is-dragging');

    if (!isRange) {
      activeThumb = sliderEl.querySelector('.paper-slider__thumb');
      singleVal = pct;
    } else {
      // Figure out which handle marker point is closer to pointer target click coordinate
      activeThumb = Math.abs(pct - valMin) < Math.abs(pct - valMax) ? 'min' : 'max';
      if (activeThumb === 'min') valMin = Math.min(pct, valMax);
      else valMax = Math.max(pct, valMin);
    }
    
    updateVisuals();

    function onMouseMove(moveEvent) {
      const currentPct = handleCalculatePercent(moveEvent.clientX);
      if (!isRange) {
        singleVal = currentPct;
      } else {
        if (activeThumb === 'min') valMin = Math.min(currentPct, valMax);
        else valMax = Math.max(currentPct, valMin);
      }
      updateVisuals();
    }

    function onMouseUp() {
      sliderEl.classList.remove('is-dragging');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Initial load execution call
  updateVisuals();
}

// Bind standard configurations to template engine DOM objects on load
initPaperSlider(document.getElementById('basicSlider'));
initPaperSlider(document.getElementById('pinnedSlider'));
initPaperSlider(document.getElementById('rangeSlider'), true);
