document.addEventListener('DOMContentLoaded', function() {
    var typed = document.getElementById('typewriter');
    var text = typed.innerHTML;
    typed.innerHTML = '';
  
    var i = 0;
    var typing = setInterval(function() {
      if (i < text.length) {
        typed.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(typing);
      }
    }, 200); 
  
    var cursorVisible = true;
    setInterval(function() {
      cursorVisible = !cursorVisible;
      typed.style.borderRightColor = cursorVisible ? 'transparent' : 'grey';
    }, 500); 
  });
  