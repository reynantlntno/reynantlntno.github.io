export default function() {
  // Create a div element for the Hello World app
  var helloWorldAppDiv = document.createElement('div');
  helloWorldAppDiv.setAttribute('id', 'helloWorldAppDiv');

  // Apply CSS styles directly
  helloWorldAppDiv.style.position = 'absolute';
  helloWorldAppDiv.style.top = '0px'; /* Adjust top position to match #wKframe */
  helloWorldAppDiv.style.left = '50%'; /* Adjust left position to center horizontally */
  helloWorldAppDiv.style.transform = 'translateX(-50%)'; /* Center horizontally */
  helloWorldAppDiv.style.width = '375px'; /* Match width of #wKframe */
  helloWorldAppDiv.style.height = '812px'; /* Match height of #wKframe */
  helloWorldAppDiv.style.backgroundColor = 'black'; /* White background */
  helloWorldAppDiv.style.borderStyle = 'ridge'; /* Add border style */
  helloWorldAppDiv.style.borderRadius = '40px'; /* Add border radius */
  helloWorldAppDiv.style.zIndex = '999'; /* Ensure the Hello World app appears above other content */

  // Create a div element for the content
  var contentDiv = document.createElement('div');
  contentDiv.setAttribute('id', 'helloWorldContent');

  // Apply CSS styles directly
  contentDiv.style.display = 'flex';
  contentDiv.style.flexDirection = 'column';
  contentDiv.style.alignItems = 'center';
  contentDiv.style.justifyContent = 'center';
  contentDiv.style.height = '100%';

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
              helloWorldAppDiv.appendChild(dragButton);
      
              let offsetX, offsetY, isDragging = false;
      
              // Event listeners for drag functionality
              dragButton.addEventListener('mousedown', function(e) {
                  isDragging = true;
                  offsetX = e.clientX - helloWorldAppDiv.getBoundingClientRect().left;
                  offsetY = e.clientY - helloWorldAppDiv.getBoundingClientRect().top;
              });
      
              document.addEventListener('mousemove', function(e) {
                  if (isDragging) {
                      const x = e.clientX - offsetX;
                      const y = e.clientY - offsetY;
                      helloWorldAppDiv.style.left = x + 'px';
                      helloWorldAppDiv.style.top = y + 'px';
                  }
              });
      
              document.addEventListener('mouseup', function() {
                  isDragging = false;
              });
          }

  // Create a paragraph element for the message
  var messageParagraph = document.createElement('p');
  messageParagraph.textContent = 'Hello World';
  messageParagraph.style.fontWeight = 'bold';
  messageParagraph.style.color = 'white';

  // Apply CSS styles directly
  messageParagraph.style.fontSize = '24px';

  // Create a button element for the close button
  var closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', function() {
    // Remove the Hello World app when the close button is clicked
    helloWorldAppDiv.remove();
  });

  // Apply CSS styles directly
  closeButton.style.marginTop = '20px';

  // Append the message and close button to the content
  contentDiv.appendChild(messageParagraph);
  contentDiv.appendChild(closeButton);

  // Append the content to the Hello World app
  helloWorldAppDiv.appendChild(contentDiv);

  // Append the Hello World app to the screen
  document.getElementById('screen').appendChild(helloWorldAppDiv);
}
