document.addEventListener('DOMContentLoaded', function() {
    var introText = document.querySelector('.intro-text');
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
            // Show intro text after typing ends
            introText.style.opacity = '1';
            introText.style.top = '0';
            // After intro text appears, show other contents
            showOtherContents();
        }
    }, 200);

    var cursorVisible = true;
    setInterval(function() {
        cursorVisible = !cursorVisible;
        typed.style.borderRightColor = cursorVisible ? 'transparent' : 'grey';
    }, 500);

    function showOtherContents() {
        // Select other contents and show them
        document.querySelectorAll('.content-text, .footer, .shadow-box, .container h1').forEach(function(element) {
            element.style.opacity = '1';
            element.style.animation = 'fadeIn 1s ease-in forwards';
        });
    }
});
