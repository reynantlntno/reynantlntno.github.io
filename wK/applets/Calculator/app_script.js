export default function Calculator() {
  // Create a div element for the Calculator app
  const calculatorAppDiv = document.createElement('div');
  calculatorAppDiv.setAttribute('id', 'calculatorAppDiv');

  // Apply CSS styles directly to the Calculator app
  calculatorAppDiv.style.position = 'absolute'; /* Fix position relative to viewport */
  calculatorAppDiv.style.top = '50px'; /* Adjust top position to match #wKframe */
  calculatorAppDiv.style.left = '50%'; /* Adjust left position to center horizontally */
  calculatorAppDiv.style.transform = 'translateX(-50%)'; /* Center horizontally */
  calculatorAppDiv.style.width = '375px'; /* Match width of #wKframe */
  calculatorAppDiv.style.height = '812px'; /* Match height of #wKframe */
  calculatorAppDiv.style.backgroundColor = 'grey'; /* White background */
  calculatorAppDiv.style.borderStyle = 'ridge'; /* Add border style */
  calculatorAppDiv.style.borderRadius = '40px'; /* Add border radius */
  calculatorAppDiv.style.zIndex = '999'; /* Ensure the Calculator app appears above other content */

  // Create a div element for the calculator display
  const displayDiv = document.createElement('div');
  displayDiv.setAttribute('id', 'calculatorDisplay');

  displayDiv.style.width = '300px';
  displayDiv.style.height = '163px';
  displayDiv.style.border = '1px solid #ccc';
  displayDiv.style.display = 'flex';
  displayDiv.style.alignItems = 'center';
  displayDiv.style.justifyContent = 'flex-end';
  displayDiv.style.marginLeft = '40px';
  displayDiv.style.marginRight = '40px';
  displayDiv.style.marginTop = '70px';
  displayDiv.style.fontSize = '30px';
  displayDiv.style.overflow = 'auto'; /* Enable vertical scroll if content exceeds height */
  displayDiv.style.overflowWrap = 'break-word'; /* Allow text to wrap */
  displayDiv.style.wordWrap = 'break-word'; /* Break words if they exceed width */
  displayDiv.style.borderRadius = '20px'; /* Add border radius to display */

  // Create a div element for the calculator buttons
  const buttonsDiv = document.createElement('div');
  buttonsDiv.setAttribute('id', 'calculatorButtons');
  buttonsDiv.style.width = '80%';
  buttonsDiv.style.display = 'grid';
  buttonsDiv.style.gridTemplateColumns = 'repeat(4, 1fr)';
  buttonsDiv.style.gap = '10px';
  buttonsDiv.style.padding = '40px';

  // Calculator button labels
  const buttonLabels = [
      '7', '8', '9', '/',
      '4', '5', '6', '*',
      '1', '2', '3', '-',
      'C', '0', '=', '+',
      'π', '√', 'sin', 'cos',
      'tan', '%'
  ];

  // Create and style calculator buttons dynamically
  buttonLabels.forEach(label => {
      const button = document.createElement('button');
      button.textContent = label;
      button.style.fontSize = '24px';
      button.style.padding = '10px'; /* Add padding to buttons */
      button.style.border = '1px solid #ccc'; /* Add outline border */
      button.style.borderRadius = '20px'; /* Add border radius */
      button.style.cursor = 'pointer'; /* Change cursor to pointer on hover */
      button.addEventListener('click', function() {
          handleCalculatorInput(label);
      });
      buttonsDiv.appendChild(button);
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
              calculatorAppDiv.appendChild(dragButton);
      
              let offsetX, offsetY, isDragging = false;
      
              // Event listeners for drag functionality
              dragButton.addEventListener('mousedown', function(e) {
                  isDragging = true;
                  offsetX = e.clientX - calculatorAppDiv.getBoundingClientRect().left;
                  offsetY = e.clientY - calculatorAppDiv.getBoundingClientRect().top;
              });
      
              document.addEventListener('mousemove', function(e) {
                  if (isDragging) {
                      const x = e.clientX - offsetX;
                      const y = e.clientY - offsetY;
                      calculatorAppDiv.style.left = x + 'px';
                      calculatorAppDiv.style.top = y + 'px';
                  }
              });
      
              document.addEventListener('mouseup', function() {
                  isDragging = false;
              });
          }

  // Create an exit button to close the Calculator app
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
      calculatorAppDiv.remove();
  });

  // Append display, buttons, and exit button to calculator app
  calculatorAppDiv.appendChild(displayDiv);
  calculatorAppDiv.appendChild(buttonsDiv);
  calculatorAppDiv.appendChild(exitButton);

  // Append the Calculator app to the screen
  document.body.appendChild(calculatorAppDiv); /* Append to body to fix position relative to viewport */

  // Function to handle calculator button clicks
  function handleCalculatorInput(input) {
      let displayValue = displayDiv.textContent;

      if (input === 'C') {
          displayValue = '0';
      } else if (input === '=') {
          try {
              displayValue = eval(displayValue).toString();
          } catch (error) {
              displayValue = 'Error';
          }
      } else if (input === 'π') {
          displayValue += Math.PI;
      } else if (input === '√') {
          displayValue = Math.sqrt(eval(displayValue)).toString();
      } else if (input === 'sin') {
          displayValue = Math.sin(eval(displayValue)).toString();
      } else if (input === 'cos') {
          displayValue = Math.cos(eval(displayValue)).toString();
      } else if (input === 'tan') {
          displayValue = Math.tan(eval(displayValue)).toString();
      } else if (input === '%') {
          displayValue = (eval(displayValue) / 100).toString();
      } else {
          if (displayValue === '0') {
              displayValue = input;
          } else {
              displayValue += input;
          }
      }

      displayDiv.textContent = displayValue;
  }
}
