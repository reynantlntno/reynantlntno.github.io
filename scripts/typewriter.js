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
            introText.style.opacity = '1';
            introText.style.top = '0';
            showOtherContents();
        }
    }, 200);

    var cursorVisible = true;
    setInterval(function() {
        cursorVisible = !cursorVisible;
        typed.style.borderRightColor = cursorVisible ? 'transparent' : 'grey';
    }, 500);

    function showOtherContents() {
        document.querySelectorAll('.content-text, .footer, .shadow-box, .container h1').forEach(function(element) {
            element.style.opacity = '1';
            element.style.animation = 'fadeIn 1s ease-in forwards';
        });
    }
});
