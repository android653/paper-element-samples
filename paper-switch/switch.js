const toggleSwitch = document.getElementById('paperSwitch');

// Monitor switch click updates cleanly
toggleSwitch.addEventListener('change', function() {
  if (this.checked) {
    console.log('Switch State: Enabled');
  } else {
    console.log('Switch State: Disabled');
  }
});
