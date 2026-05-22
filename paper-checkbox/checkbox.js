const checkbox = document.getElementById('paperCheckbox');

// Monitor structural boolean flag values toggling
checkbox.addEventListener('change', function() {
  if (this.checked) {
    console.log('Checkbox State: Checked');
  } else {
    console.log('Checkbox State: Unchecked');
  }
});
