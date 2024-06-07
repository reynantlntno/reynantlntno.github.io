import { plotCartesianPlane } from './GraphC.js';

export default function Grapher() {
    // Create a div element for the Grapher app
    const grapherAppDiv = document.createElement('div');
    grapherAppDiv.setAttribute('id', 'grapherAppDiv');

    // Apply CSS styles directly to the Grapher app
    grapherAppDiv.style.position = 'absolute'; /* Fix position relative to viewport */
    grapherAppDiv.style.top = '50px'; /* Adjust top position to match #wKframe */
    grapherAppDiv.style.left = '50%'; /* Adjust left position to center horizontally */
    grapherAppDiv.style.transform = 'translateX(-50%)'; /* Center horizontally */
    grapherAppDiv.style.width = '375px'; /* Match width of #wKframe */
    grapherAppDiv.style.height = '812px'; /* Match height of #wKframe */
    grapherAppDiv.style.backgroundColor = 'grey';
    grapherAppDiv.style.borderStyle = 'ridge'; /* Add border style */
    grapherAppDiv.style.borderRadius = '40px'; /* Add border radius */
    grapherAppDiv.style.zIndex = '999'; /* Ensure the Grapher app appears above other content */
    grapherAppDiv.style.display = 'flex'; /* Use flexbox to center items */
    grapherAppDiv.style.flexDirection = 'column'; /* Stack items vertically */
    grapherAppDiv.style.justifyContent = 'center'; /* Center items vertically */
    grapherAppDiv.style.alignItems = 'center'; /* Center items horizontally */

    // Create a paragraph element for initial text
    const initialText = document.createElement('p');
    initialText.textContent = 'Click the Plot Button to start';
    initialText.style.margin = '20px';
    grapherAppDiv.appendChild(initialText);

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%'; // Make canvas width 100% to fill the width of the grapherAppDiv
    canvas.style.flex = '0'; // Make canvas flexible to fill remaining height
    canvas.style.display = 'none'; // Initially hide the canvas
    grapherAppDiv.appendChild(canvas);

    // Create input fields for x and y values
    const xInput = document.createElement('input');
    xInput.setAttribute('type', 'text');
    xInput.setAttribute('placeholder', 'Enter x values (comma separated)');
    xInput.style.margin = '10px';
    xInput.style.borderRadius = '8px'; // Add border radius
    grapherAppDiv.appendChild(xInput);

    const yInput = document.createElement('input');
    yInput.setAttribute('type', 'text');
    yInput.setAttribute('placeholder', 'Enter y values (comma separated)');
    yInput.style.margin = '10px';
    yInput.style.borderRadius = '8px'; // Add border radius
    grapherAppDiv.appendChild(yInput);

    // Create a div to contain the zoom buttons and plot button
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex'; // Arrange buttons in a row
    buttonContainer.style.margin = '10px'; // Add margin
    grapherAppDiv.appendChild(buttonContainer);

    // Create zoom buttons
    const zoomInButton = document.createElement('button');
    zoomInButton.textContent = '+';
    zoomInButton.style.fontSize = '20px';
    zoomInButton.style.padding = '5px';
    zoomInButton.style.marginRight = '10px';
    zoomInButton.style.cursor = 'pointer';
    zoomInButton.style.borderRadius = '8px'; // Add border radius
    zoomInButton.addEventListener('click', function() {
        zoomIn();
    });
    buttonContainer.appendChild(zoomInButton);

    const zoomOutButton = document.createElement('button');
    zoomOutButton.textContent = '-';
    zoomOutButton.style.fontSize = '20px';
    zoomOutButton.style.padding = '5px';
    zoomOutButton.style.marginRight = '10px';
    zoomOutButton.style.cursor = 'pointer';
    zoomOutButton.style.borderRadius = '8px'; // Add border radius
    zoomOutButton.addEventListener('click', function() {
        zoomOut();
    });
    buttonContainer.appendChild(zoomOutButton);

    // Function to handle zoom in
    function zoomIn() {
        if (zoomLevel < 2) { // Limit max zoom level
            zoomLevel += 0.1;
            plotGraph();
        }
    }

    // Function to handle zoom out
    function zoomOut() {
        if (zoomLevel > 0.5) { // Limit min zoom level
            zoomLevel -= 0.1;
            plotGraph();
        }
    }

    // Create a button to plot the graph
    const plotButton = document.createElement('button');
    plotButton.textContent = 'Plot Graph';
    plotButton.style.fontSize = '20px';
    plotButton.style.padding = '10px';
    plotButton.style.cursor = 'pointer';
    plotButton.style.borderRadius = '8px'; // Add border radius
    plotButton.addEventListener('click', function() {
        plotGraph();
    });
    buttonContainer.appendChild(plotButton);

    // Create an exit button to close the Grapher app
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
        grapherAppDiv.remove();
    });
    grapherAppDiv.appendChild(exitButton);

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
        grapherAppDiv.appendChild(dragButton);

        let offsetX, offsetY, isDragging = false;

        // Event listeners for drag functionality
        dragButton.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - grapherAppDiv.getBoundingClientRect().left;
            offsetY = e.clientY - grapherAppDiv.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                grapherAppDiv.style.left = x + 'px';
                grapherAppDiv.style.top = y + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }

    // Initial zoom level
    let zoomLevel = 1;

    // Function to plot the graph
    function plotGraph() {
        const context = canvas.getContext('2d');
        const xValues = xInput.value.split(',').map(Number);
        const yValues = yInput.value.split(',').map(Number);
        plotCartesianPlane(context, xValues, yValues, zoomLevel);
        canvas.style.display = 'block'; // Show canvas after plotting
        initialText.style.display = 'none'; // Hide initial text after plotting
    }

    // Append the Grapher app to the screen
    document.body.appendChild(grapherAppDiv); /* Append to body to fix position relative to viewport */
}
