function toggleDarkMode() {
  var body = document.querySelector('body');
  body.classList.toggle('dark-mode');
}

document.getElementById('dark-mode-toggle').addEventListener('click', function() {
  toggleDarkMode();
});
