export default function() {
    // Create a div element for the Internet Browser app
    var browserAppDiv = document.createElement('div');
    browserAppDiv.setAttribute('id', 'browserAppDiv');

    // Apply CSS styles directly
    browserAppDiv.style.position = 'absolute';
    browserAppDiv.style.top = '0px'; /* Adjust top position to match #wKframe */
    browserAppDiv.style.left = '50%'; /* Adjust left position to center horizontally */
    browserAppDiv.style.transform = 'translateX(-50%)'; /* Center horizontally */
    browserAppDiv.style.width = '375px'; /* Match width of #wKframe */
    browserAppDiv.style.height = '812px'; /* Match height of #wKframe */
    browserAppDiv.style.backgroundColor = '#fff'; /* White background */
    browserAppDiv.style.borderStyle = 'ridge'; /* Add border style */
    browserAppDiv.style.borderRadius = '40px'; /* Add border radius */
    browserAppDiv.style.zIndex = '999'; /* Ensure the app appears above other content */
    browserAppDiv.style.display = 'flex';
    browserAppDiv.style.flexDirection = 'column';

    // Create a button for closing the browser app
    var closeButton = document.createElement('button');
    closeButton.textContent = 'Exit';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '8px';
    closeButton.style.backgroundColor = '#007bff';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';

    // Event listener for the close button to remove the browser app
    closeButton.addEventListener('click', function() {
        browserAppDiv.remove(); // Remove the browser app div from the screen
    });

    // Create an iframe element for displaying web content
    var iframeElement = document.createElement('iframe');
    iframeElement.setAttribute('id', 'browserFrame');
    iframeElement.style.marginTop = '40px';
    iframeElement.style.height = '670px';
    iframeElement.style.border = 'none'; /* Remove iframe border */

    // Set the default webpage URL to load within the iframe
    iframeElement.src = 'https://www.example.com'; // Change URL to desired webpage

    // Create a div element for the link bar
    var linkBarDiv = document.createElement('div');
    linkBarDiv.setAttribute('id', 'linkBar');
    linkBarDiv.style.height = '50px'; /* Set link bar height */
    linkBarDiv.style.backgroundColor = '#f0f0f0'; /* Light gray background */
    linkBarDiv.style.display = 'flex'; /* Use flexbox for layout */
    linkBarDiv.style.alignItems = 'center'; /* Center align items */
    linkBarDiv.style.padding = '10px 10px'; /* Add horizontal padding */

    // Create an input element for entering URLs
    var urlInput = document.createElement('input');
    urlInput.setAttribute('type', 'text');
    urlInput.style.flex = '1'; /* Fill remaining space within the link bar */
    urlInput.style.height = '100%'; /* Set input height */
    urlInput.style.marginRight = '10px'; /* Add right margin */
    urlInput.placeholder = 'Enter URL'; /* Placeholder text */

    // Create a button element to navigate to the entered URL
    var goButton = document.createElement('button');
    goButton.textContent = 'Go';
    goButton.style.height = '100%'; /* Set button height */
    goButton.style.padding = '0 15px'; /* Add horizontal padding */
    goButton.style.backgroundColor = '#007bff'; /* Blue background */
    goButton.style.color = '#fff'; /* White text color */
    goButton.style.border = 'none'; /* Remove button border */
    goButton.style.borderRadius = '5px'; /* Add border radius */
    goButton.style.cursor = 'pointer'; /* Show pointer cursor on hover */

    // Event listener for the Go button to navigate to the entered URL
    goButton.addEventListener('click', function() {
        var enteredURL = urlInput.value.trim();
        if (enteredURL !== '') {
            iframeElement.src = enteredURL;
        }
    });

    // Append input and button to the link bar
    linkBarDiv.appendChild(urlInput);
    linkBarDiv.appendChild(goButton);

    // Append close button, iframe, and link bar to the browser app div
    browserAppDiv.appendChild(closeButton);
    browserAppDiv.appendChild(iframeElement);
    browserAppDiv.appendChild(linkBarDiv);

    // Append the browser app to the screen
    document.getElementById('screen').appendChild(browserAppDiv);
}
