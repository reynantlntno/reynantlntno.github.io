export default function() {
    const flappyBirdAppDiv = document.createElement('div');
    flappyBirdAppDiv.setAttribute('id', 'flappyBirdAppDiv');

    // Apply CSS styles directly to position and style the game container
    flappyBirdAppDiv.style.position = 'absolute';
    flappyBirdAppDiv.style.top = '50px'; /* Adjust top position */
    flappyBirdAppDiv.style.left = '50%'; /* Adjust left position */
    flappyBirdAppDiv.style.transform = 'translateX(-50%)'; /* Center horizontally */
    flappyBirdAppDiv.style.width = '375px'; /* Match width */
    flappyBirdAppDiv.style.height = '812px'; /* Match height */
    flappyBirdAppDiv.style.backgroundColor = '#70c5ce'; /* Background color */
    flappyBirdAppDiv.style.borderStyle = 'ridge'; /* Add border style */
    flappyBirdAppDiv.style.borderRadius = '40px'; /* Add border radius */
    flappyBirdAppDiv.style.zIndex = '999'; /* Ensure the app appears above other content */
    flappyBirdAppDiv.style.overflow = 'hidden'; /* Ensure game content doesn't overflow */
    flappyBirdAppDiv.style.display = 'flex';
    flappyBirdAppDiv.style.flexDirection = 'column';
    flappyBirdAppDiv.style.alignItems = 'center';
    flappyBirdAppDiv.style.justifyContent = 'center';

    const bird = document.createElement('img');
    bird.src = './applets/Flappy/assets/bird.png'; // Replace with your bird image path
    bird.className = 'bird';
    bird.style.position = 'absolute';
    bird.style.width = '40px'; // Adjust bird size as needed
    bird.style.height = '30px'; // Adjust bird size as needed
    bird.style.top = '50%';
    bird.style.left = '50px'; // Initial bird position
    flappyBirdAppDiv.appendChild(bird);

    let gameActive = false;
    let gravity = 2; // Adjust gravity for faster descent
    let jumpStrength = -50;
    let birdPosition = 200; // Initial bird position
    let pipes = [];
    let score = 0;
    let bestScore = localStorage.getItem('flappyBirdBestScore') || 0;
    let scoreElement = null;
    let bestScoreElement = null;

    function startGame() {
        gameActive = true;
        birdPosition = 200;
        pipes = [];
        score = 0;
        flappyBirdAppDiv.innerHTML = '';
        flappyBirdAppDiv.appendChild(bird);
        createPipe();
        updateGame();
    }

    function createPipe() {
        const pipeGap = 200; // Gap between pipes
        const pipeWidth = 50;
        const randomHeight = Math.floor(Math.random() * 300) + 50; // Random height for top pipe

        const pipeTop = document.createElement('div');
        pipeTop.className = 'pipe';
        pipeTop.style.position = 'absolute';
        pipeTop.style.width = pipeWidth + 'px';
        pipeTop.style.height = randomHeight + 'px';
        pipeTop.style.top = '0';
        pipeTop.style.left = '400px'; // Initial pipe position
        pipeTop.style.backgroundColor = 'green';
        flappyBirdAppDiv.appendChild(pipeTop);

        const pipeBottom = document.createElement('div');
        pipeBottom.className = 'pipe';
        pipeBottom.style.position = 'absolute';
        pipeBottom.style.width = pipeWidth + 'px';
        pipeBottom.style.height = flappyBirdAppDiv.clientHeight - randomHeight - pipeGap + 'px';
        pipeBottom.style.bottom = '0';
        pipeBottom.style.left = '400px'; // Initial pipe position
        pipeBottom.style.backgroundColor = 'green';
        flappyBirdAppDiv.appendChild(pipeBottom);

        pipes.push({ top: pipeTop, bottom: pipeBottom });
    }

    function updateGame() {
        if (!gameActive) return;

        birdPosition += gravity;
        bird.style.top = birdPosition + 'px';

        pipes.forEach((pipe, index) => {
            const pipeRectTop = pipe.top.getBoundingClientRect();
            const pipeRectBottom = pipe.bottom.getBoundingClientRect();
            const birdRect = bird.getBoundingClientRect();

            // Check if bird passes through the gap between pipes
            if (
                birdRect.left > pipeRectTop.right &&
                !(
                    birdRect.top < pipeRectTop.bottom ||
                    birdRect.bottom > pipeRectBottom.top
                )
            ) {
                // Bird has passed through the gap without hitting the pipes
                score++;
                scoreElement.textContent = 'Score: ' + score;

                // Update best score if current score is higher
                if (score > bestScore) {
                    bestScore = score;
                    localStorage.setItem('flappyBirdBestScore', bestScore);
                    bestScoreElement.textContent = 'Best Score: ' + bestScore;
                }
            }

            // Check if bird hits the pipes
            if (
                birdRect.right > pipeRectTop.left &&
                birdRect.left < pipeRectTop.right &&
                (birdRect.top < pipeRectTop.bottom || birdRect.bottom > pipeRectBottom.top)
            ) {
                endGame(); // Bird hits the pipe
            }

            // Move pipes to the left
            if (parseInt(pipe.top.style.left) + pipe.top.clientWidth < 0) {
                pipe.top.remove();
                pipe.bottom.remove();
                pipes.splice(index, 1);
            } else {
                pipe.top.style.left = parseInt(pipe.top.style.left) - 2 + 'px';
                pipe.bottom.style.left = parseInt(pipe.bottom.style.left) - 2 + 'px';
            }

            // Create new pipes when first pipe reaches specific position
            if (parseInt(pipe.top.style.left) === 100) {
                createPipe();
            }
        });

        // Check if bird hits the ground
        if (birdPosition + bird.clientHeight > flappyBirdAppDiv.clientHeight) {
            endGame(); // Bird hits the ground
        }

        requestAnimationFrame(updateGame);
    }

    function endGame() {
        gameActive = false;
        const message = document.createElement('div');
        message.textContent = 'Game Over! Tap or Press Enter to Restart';
        message.style.color = 'red';
        message.style.fontSize = '24px';
        message.style.fontWeight = 'bold';
        message.style.textAlign = 'center';
        message.style.zIndex = '1000'; // Ensure message appears above pipes
        flappyBirdAppDiv.appendChild(message);

        const restartGame = () => {
            startGame();
            flappyBirdAppDiv.removeChild(message); // Remove the game over message
        };
        

        flappyBirdAppDiv.addEventListener('click', restartGame);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                restartGame();
            }
        });

                // Create a drag button if wK_dev is set to 1 in localStorage
                const wK_dev = localStorage.getItem('wK_dev');
                if (wK_dev === '1') {
                    const dragButton = document.createElement('button');
                    dragButton.textContent = 'Drag';
                    dragButton.style.position = 'absolute';
                    dragButton.style.top = '20px';
                    dragButton.style.left = '10px';
                    dragButton.style.padding = '8px';
                    dragButton.style.backgroundColor = '#007bff';
                    dragButton.style.color = '#fff';
                    dragButton.style.border = 'none';
                    dragButton.style.borderRadius = '5px';
                    dragButton.style.cursor = 'move';
                    flappyBirdAppDiv.appendChild(dragButton);
            
                    let offsetX, offsetY, isDragging = false;
            
                    // Event listeners for drag functionality
                    dragButton.addEventListener('mousedown', function(e) {
                        isDragging = true;
                        offsetX = e.clientX - flappyBirdAppDiv.getBoundingClientRect().left;
                        offsetY = e.clientY - flappyBirdAppDiv.getBoundingClientRect().top;
                    });
            
                    document.addEventListener('mousemove', function(e) {
                        if (isDragging) {
                            const x = e.clientX - offsetX;
                            const y = e.clientY - offsetY;
                            flappyBirdAppDiv.style.left = x + 'px';
                            flappyBirdAppDiv.style.top = y + 'px';
                        }
                    });
            
                    document.addEventListener('mouseup', function() {
                        isDragging = false;
                    });
                }

        const exitButton = document.createElement('button');
        exitButton.textContent = 'Exit';
        exitButton.style.position = 'absolute';
        exitButton.style.top = '20px';
        exitButton.style.right = '10px';
        exitButton.style.padding = '8px';
        exitButton.style.backgroundColor = '#007bff';
        exitButton.style.color = '#fff';
        exitButton.style.border = 'none';
        exitButton.style.borderRadius = '5px';
        exitButton.style.cursor = 'pointer';
        exitButton.style.zIndex = '1000';
    
        exitButton.addEventListener('click', () => {
            flappyBirdAppDiv.remove(); // Remove the Flappy Bird game from the screen
        });
    
        flappyBirdAppDiv.appendChild(exitButton);
        
    }

    // Detect touch support and set up touch-based controls
    const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (supportsTouch) {
        flappyBirdAppDiv.addEventListener('touchstart', () => {
            if (!gameActive) {
                startGame();
            } else {
                birdPosition += jumpStrength;
                bird.style.top = birdPosition + 'px';
            }
        });
    } else {
        // Fallback to keyboard controls for devices without touch support
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !gameActive) {
                startGame();
            }

            if ((event.key === ' ' || event.key === 'ArrowUp') && gameActive) {
                birdPosition += jumpStrength;
                bird.style.top = birdPosition + 'px';
            }
        });
    }

    const startMessage = document.createElement('div');
    startMessage.textContent = supportsTouch ? 'Tap to Start' : 'Press Enter to Start';
    startMessage.style.color = 'green';
    startMessage.style.fontSize = '24px';
    startMessage.style.fontWeight = 'bold';
    startMessage.style.textAlign = 'center';
    startMessage.style.zIndex = '1000'; // Ensure message appears above pipes
    flappyBirdAppDiv.appendChild(startMessage);

    scoreElement = document.createElement('div');
    scoreElement.style.position = 'absolute';
    scoreElement.style.top = '20px';
    scoreElement.style.left = '50%';
    scoreElement.style.transform = 'translateX(-50%)';
    scoreElement.style.color = 'orange';
    scoreElement.style.fontSize = '24px';
    scoreElement.style.fontWeight = 'bold';
    scoreElement.style.textAlign = 'center';
    scoreElement.style.zIndex = '1000';
    flappyBirdAppDiv.appendChild(scoreElement);

    bestScoreElement = document.createElement('div');
    bestScoreElement.textContent = 'Best Score: ' + bestScore;
    bestScoreElement.style.color = 'orange';
    bestScoreElement.style.fontSize = '20px';
    bestScoreElement.style.fontWeight = 'bold';
    bestScoreElement.style.textAlign = 'center';
    bestScoreElement.style.zIndex = '1000';
    bestScoreElement.style.marginTop = '20px';
    flappyBirdAppDiv.appendChild(bestScoreElement);

    document.body.appendChild(flappyBirdAppDiv);
}
