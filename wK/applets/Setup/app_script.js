export default function SetupApp() {
    // Retrieve saved username from localStorage or set default
    const savedUsername = localStorage.getItem('username') || '';
  
    // Create a div element for the Setup app
    const setupAppDiv = document.createElement('div');
    setupAppDiv.setAttribute('id', 'setupAppDiv');
  
    // Apply CSS styles directly
    setupAppDiv.style.position = 'absolute';
    setupAppDiv.style.top = '0px'; /* Adjust top position to match #wKframe */
    setupAppDiv.style.left = '50%'; /* Adjust left position to center horizontally */
    setupAppDiv.style.transform = 'translateX(-50%)'; /* Center horizontally */
    setupAppDiv.style.width = '375px'; /* Match width of #wKframe */
    setupAppDiv.style.height = '812px'; /* Match height of #wKframe */
    setupAppDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    setupAppDiv.style.borderStyle = 'ridge'; /* Add border style */
    setupAppDiv.style.borderRadius = '40px'; /* Add border radius */
    setupAppDiv.style.zIndex = '999'; /* Ensure the Setup app appears above other content */
  
    // Create a div element for the content
    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('id', 'setupContent');
  
    // Apply CSS styles directly
    contentDiv.style.display = 'flex';
    contentDiv.style.flexDirection = 'column';
    contentDiv.style.alignItems = 'center';
    contentDiv.style.justifyContent = 'center';
    contentDiv.style.height = '100%';
    contentDiv.style.color = 'white';
  
    // Create a label and input for username
    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Username:';
    usernameLabel.style.fontSize = '18px';
    usernameLabel.style.marginBottom = '10px';
  
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.value = savedUsername;
    usernameInput.style.width = '200px';
    usernameInput.style.padding = '8px';
    usernameInput.style.fontSize = '16px';
    usernameInput.style.borderRadius = '8px';
    usernameInput.style.backgroundColor = 'black';
    usernameInput.style.color = 'white';
    usernameInput.style.marginBottom = '20px';
  
    // Save username to localStorage on input change
    usernameInput.addEventListener('input', () => {
      localStorage.setItem('username', usernameInput.value);
    });
  
    // Create a paragraph to display the current username
    const currentUsernameParagraph = document.createElement('p');
    currentUsernameParagraph.textContent = `Current username: ${savedUsername}`;
    currentUsernameParagraph.style.fontSize = '16px';
    currentUsernameParagraph.style.marginBottom = '20px';
  
    // Create a README notes paragraph
    const readmeParagraph = document.createElement('p');
    readmeParagraph.textContent = 'Please read the README before proceeding.';
    readmeParagraph.style.fontSize = '16px';
    readmeParagraph.style.marginBottom = '20px';
  
    // Create an OK button to exit
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.addEventListener('click', function() {
      // Remove the Setup app when the OK button is clicked
      setupAppDiv.remove();
    });
  
    // Apply CSS styles directly
    okButton.style.padding = '10px 20px';
    okButton.style.fontSize = '18px';
    okButton.style.backgroundColor = '#007bff';
    okButton.style.color = '#fff';
    okButton.style.border = 'none';
    okButton.style.borderRadius = '5px';
    okButton.style.cursor = 'pointer';
  
    // Append elements to contentDiv
    contentDiv.appendChild(usernameLabel);
    contentDiv.appendChild(usernameInput);
    contentDiv.appendChild(currentUsernameParagraph);
    contentDiv.appendChild(readmeParagraph);
    contentDiv.appendChild(okButton);
  
    // Append contentDiv to setupAppDiv
    setupAppDiv.appendChild(contentDiv);
  
    // Append setupAppDiv to the screen
    document.getElementById('screen').appendChild(setupAppDiv);
  }