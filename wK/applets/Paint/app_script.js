export default function PaintApp() {
    // Create a div element for the Paint app
    const paintAppDiv = document.createElement('div');
    paintAppDiv.setAttribute('id', 'paintAppDiv');

    // Apply CSS styles directly
    paintAppDiv.style.position = 'absolute';
    paintAppDiv.style.top = '50px'; /* Adjust top position to match #iphone */
    paintAppDiv.style.left = '50%'; /* Adjust left position to center horizontally */
    paintAppDiv.style.transform = 'translate(-50%)'; /* Center horizontally and vertically */
    paintAppDiv.style.width = '375px'; /* Match width of #iphone */
    paintAppDiv.style.height = '812px'; /* Match height of #iphone */
    paintAppDiv.style.backgroundColor = '#ffffff'; /* White background */
    paintAppDiv.style.borderStyle = 'ridge'; /* Add border style */
    paintAppDiv.style.borderRadius = '40px'; /* Add border radius */
    paintAppDiv.style.zIndex = '999'; /* Ensure the Paint app appears above other content */
    paintAppDiv.style.display = 'flex';
    paintAppDiv.style.flexDirection = 'column';
    paintAppDiv.style.alignItems = 'center';
    paintAppDiv.style.justifyContent = 'center';

    // Create canvas element for painting
    const canvas = document.createElement('canvas');
    canvas.width = 335; /* Set canvas width to fit within the div */
    canvas.height = 520; /* Set canvas height to fit within the div */
    canvas.style.borderStyle = 'dashed'; /* Add border to canvas */
    canvas.style.borderWidth = '2px';
    canvas.style.marginTop = '30px';

    // Get 2D context of the canvas
    const ctx = canvas.getContext('2d');

    // Variables to track drawing state
    let isPainting = false;
    let lastX = 0;
    let lastY = 0;
    let brushColor = '#000000'; /* Default brush color */
    let brushSize = 3; /* Default brush size */
    let isErasing = false;

    // Event listeners for drawing on the canvas
    canvas.addEventListener('mousedown', startPainting);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', stopPainting);
    canvas.addEventListener('mouseleave', stopPainting);

    // Touch event listeners for drawing on the canvas
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopPainting);

    function startPainting(e) {
        isPainting = true;
        [lastX, lastY] = [e.offsetX || e.clientX - canvas.offsetLeft, e.offsetY || e.clientY - canvas.offsetTop];
    }

    function paint(e) {
        if (!isPainting) return;
        ctx.strokeStyle = isErasing ? '#ffffff' : brushColor; /* Set stroke color */
        ctx.lineWidth = brushSize; /* Set line width */
        ctx.lineCap = 'round'; /* Set line cap */
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        [lastX, lastY] = [e.offsetX || e.clientX - canvas.offsetLeft, e.offsetY || e.clientY - canvas.offsetTop];
        ctx.lineTo(lastX, lastY);
        ctx.stroke();
    }

    function stopPainting() {
        isPainting = false;
    }

    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            startPainting(touch);
        }
    }

    function handleTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            paint(touch);
        }
    }

    // Function to clear the canvas
    function clearCanvas() {
        const confirmationMessage = `Are you sure you want to clear canvas?`;
        wkDialog(confirmationMessage, 'confirm', async confirmed => {
            if (confirmed) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
    }
     

    // Function to handle setting custom brush color
    function setBrushColor() {
        const hexInput = colorInput.value.trim(); // Get the hex color code input
        if (isValidHex(hexInput)) {
            brushColor = hexInput.toLowerCase(); // Set brush color to the input hex code
            isErasing = false; // Reset erasing mode
        } else {
            wkDialog('Please enter a valid hex color code.', 'notification'); // Alert user for invalid input
        }
    }

    // Helper function to validate hex color code
    function isValidHex(color) {
        return /^#[0-9A-F]{6}$/i.test(color);
    }

    // Create input field for entering custom hex color code
    const colorInput = document.createElement('input');
    colorInput.type = 'text';
    colorInput.placeholder = 'Enter hex color code';
    colorInput.style.marginTop = '10px';
    colorInput.style.marginRight = '10px';
    colorInput.style.padding = '5px';

    // Create button to set custom brush color
    const setColorButton = document.createElement('button');
    setColorButton.textContent = 'Set Color';
    setColorButton.style.marginTop = '10px';
    setColorButton.addEventListener('click', setBrushColor);

    // Create a button element to clear the canvas
    const clearButton = createButton('Clear Canvas', clearCanvas);
    clearButton.style.backgroundColor = 'darkorange'; // Set background color
    clearButton.style.color = 'white'; // Set text color

    // Create a button element for the eraser
    const eraserButton = createButton('Eraser', () => { isErasing = true; });
    eraserButton.style.backgroundColor = 'darkgrey'; // Set background color
    eraserButton.style.color = 'white'; // Set text color

    // Create a button element to save the canvas as PNG
    const saveButton = createButton('Save as PNG', saveAsPNG);
    saveButton.style.backgroundColor = 'green'; // Set background color
    saveButton.style.color = 'white'; // Set text color

    // Helper function to save the canvas as PNG
    function saveAsPNG() {
        const image = canvas.toDataURL('image/png'); // Convert canvas to image/png data URL
        const link = document.createElement('a'); // Create a link element
        link.href = image; // Set the href attribute to the data URL
        link.download = 'painting.png'; // Set the download attribute with a default file name
        link.click(); // Programmatically click the link to trigger the download
    }

    // Create color palette buttons
    const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']; /* List of colors */
    const colorButtonContainer = document.createElement('div');
    colorButtonContainer.style.display = 'flex';
    colorButtonContainer.style.flexWrap = 'wrap';
    colorButtonContainer.style.marginTop = '10px';
    colors.forEach(color => {
        const button = createColorButton(color);
        colorButtonContainer.appendChild(button);
    });

    // Create brush size selector
    const brushSizeSelector = document.createElement('input');
    brushSizeSelector.type = 'range';
    brushSizeSelector.min = '1';
    brushSizeSelector.max = '20';
    brushSizeSelector.value = brushSize.toString();
    brushSizeSelector.style.width = '238px';
    brushSizeSelector.style.marginTop = '10px';
    brushSizeSelector.addEventListener('input', () => {
        brushSize = parseInt(brushSizeSelector.value);
    });

    // Create label for brush size selector
    const brushSizeLabel = document.createElement('label');
    brushSizeLabel.textContent = 'Brush Size:';
    brushSizeLabel.style.fontSize = '12px';
    brushSizeLabel.style.marginTop = '20px';
    brushSizeLabel.style.display = 'block';

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
                paintAppDiv.appendChild(dragButton);
        
                let offsetX, offsetY, isDragging = false;
        
                // Event listeners for drag functionality
                dragButton.addEventListener('mousedown', function(e) {
                    isDragging = true;
                    offsetX = e.clientX - paintAppDiv.getBoundingClientRect().left;
                    offsetY = e.clientY - paintAppDiv.getBoundingClientRect().top;
                });
        
                document.addEventListener('mousemove', function(e) {
                    if (isDragging) {
                        const x = e.clientX - offsetX;
                        const y = e.clientY - offsetY;
                        paintAppDiv.style.left = x + 'px';
                        paintAppDiv.style.top = y + 'px';
                    }
                });
        
                document.addEventListener('mouseup', function() {
                    isDragging = false;
                });
            }

    // Create an exit button to close the Paint app
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
    exitButton.addEventListener('click', function() {
        paintAppDiv.remove();
        document.body.style.overflow = 'auto'; // Restore scrolling on the body
    });

    // Append canvas, buttons, and selectors to the Paint app div
    paintAppDiv.appendChild(canvas);

    // Append input field and set color button to the bottom left
    const customColorContainer = document.createElement('div');
    customColorContainer.style.marginTop = '10px';
    customColorContainer.appendChild(colorInput);
    customColorContainer.appendChild(setColorButton);
    paintAppDiv.appendChild(customColorContainer);

    // Append clear button and eraser button to the bottom left
    const buttonsLeftContainer = document.createElement('div');
    buttonsLeftContainer.style.display = 'flex';
    buttonsLeftContainer.style.marginTop = '10px';
    buttonsLeftContainer.appendChild(clearButton);
    buttonsLeftContainer.appendChild(eraserButton);
    paintAppDiv.appendChild(buttonsLeftContainer);

    // Append color palette and brush size selector to the bottom right
    const buttonsRightContainer = document.createElement('div');
    buttonsRightContainer.style.display = 'flex';
    buttonsRightContainer.style.flexDirection = 'column'; // Adjust to column layout for alignment
    buttonsRightContainer.style.marginTop = '10px';
    buttonsRightContainer.appendChild(colorButtonContainer);
    buttonsRightContainer.appendChild(brushSizeLabel); // Append brush size label
    buttonsRightContainer.appendChild(brushSizeSelector);
    paintAppDiv.appendChild(buttonsRightContainer);

    // Append the save button to the bottom left
    buttonsLeftContainer.appendChild(saveButton);

    // Append the exit button to the Paint app div
    paintAppDiv.appendChild(exitButton);

    // Append the Paint app div to the screen
    document.body.appendChild(paintAppDiv);

    // Disable scrolling on the body when Paint app is active
    document.body.style.overflow = 'hidden';

    // Helper function to create a button with text and click handler
    function createButton(text, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.marginRight = '10px';
        button.addEventListener('click', clickHandler);
        return button;
    }

    // Helper function to create a color button
    function createColorButton(color) {
        const button = document.createElement('button');
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.borderRadius = '50%';
        button.style.marginRight = '5px';
        button.style.backgroundColor = color; // Use backgroundColor for solid color buttons
        button.addEventListener('click', () => {
            brushColor = color;
            isErasing = false;
            console.log('Selected Color:', color); // Debugging to check the selected color
        });
        return button;
    }
}