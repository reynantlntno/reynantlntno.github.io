export default function(message, type, callback, inputFields = []) {
  // Create a div element for the wk_dialog applet
  var wkDialogAppDiv = document.createElement('div');
  wkDialogAppDiv.setAttribute('id', 'wkDialogAppDiv');

  // Apply CSS styles directly to the dialog box
  wkDialogAppDiv.style.position = 'absolute';
  wkDialogAppDiv.style.top = '340px';
  wkDialogAppDiv.style.left = '50%';
  wkDialogAppDiv.style.transform = 'translate(-50%)';
  wkDialogAppDiv.style.width = '275px';
  wkDialogAppDiv.style.backgroundColor = '#222222';
  wkDialogAppDiv.style.borderRadius = '20px';
  wkDialogAppDiv.style.borderStyle = 'solid';
  wkDialogAppDiv.style.borderWidth = '1px'; 
  wkDialogAppDiv.style.borderColor = 'grey'; 
  wkDialogAppDiv.style.zIndex = '999';
  wkDialogAppDiv.style.display = 'flex';
  wkDialogAppDiv.style.flexDirection = 'column';
  wkDialogAppDiv.style.alignItems = 'center';
  wkDialogAppDiv.style.justifyContent = 'center';
  wkDialogAppDiv.style.padding = '20px';
  wkDialogAppDiv.style.overflowY = 'auto';
  

  // Create a div element for the message content
  var messageContentDiv = document.createElement('div');
  messageContentDiv.setAttribute('id', 'messageContent');

  // Create a heading for the message type
  var messageTypeHeading = document.createElement('h2');
  var defaultHeadingText = 'Message';
  messageTypeHeading.textContent = type === 'confirm' ? 'Confirmation' : defaultHeadingText;
  messageTypeHeading.style.color = 'white';

  // Create a paragraph for displaying the message
  var messageParagraph = document.createElement('p');
  messageParagraph.textContent = message || 'No message provided.';
  messageParagraph.style.color = 'white';

  // Create input fields
  var inputFieldElements = inputFields.map(field => {
    var inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('placeholder', field.placeholder || '');
    inputField.style.width = '260px'; // Make input fields wider
    inputField.style.borderRadius = '8px';
    inputField.style.color = 'white';
    inputField.style.backgroundColor = 'black';
    inputField.style.marginBottom = '10px';
    return inputField;
  });

  // Create buttons based on message type
  var confirmButton = document.createElement('button');
  confirmButton.textContent = type === 'confirm' ? 'Yes' : 'OK';
  confirmButton.style.backgroundColor = '#007bff'; // Blue background
  confirmButton.style.color = '#ffffff'; // White text
  confirmButton.style.padding = '10px 20px'; // Larger padding for a bigger button
  confirmButton.style.borderRadius = '10px'; // Rounded corners

  var cancelButton = null;
  if (type === 'confirm') {
    cancelButton = document.createElement('button');
    cancelButton.textContent = 'No';
    cancelButton.style.backgroundColor = '#dc3545'; // Red background for cancel button
    cancelButton.style.color = '#ffffff'; // White text
    cancelButton.style.padding = '10px 20px'; // Larger padding for a bigger button
    cancelButton.style.borderRadius = '10px'; // Rounded corners
  }

  // Event listener for confirm button
  confirmButton.addEventListener('click', function() {
    // Pass back confirmation to callback if provided
    if (typeof callback === 'function') {
      var inputData = inputFieldElements.map(input => input.value);
      callback(true, inputData);
    }
    wkDialogAppDiv.remove(); // Remove dialog from DOM
  });

  // Event listener for cancel button (only for confirm dialog)
  if (cancelButton) {
    cancelButton.addEventListener('click', function() {
      // Pass back cancellation to callback if provided
      if (typeof callback === 'function') {
        callback(false, []);
      }
      wkDialogAppDiv.remove(); // Remove dialog from DOM
    });
  }

  // Append elements to messageContentDiv
  messageContentDiv.appendChild(messageTypeHeading);
  messageContentDiv.appendChild(messageParagraph);
  
  // Append input fields to messageContentDiv
  inputFieldElements.forEach(inputField => {
    messageContentDiv.appendChild(inputField);
  });

  // Create a div for buttons
  var buttonsDiv = document.createElement('div');
  buttonsDiv.style.display = 'flex';
  buttonsDiv.style.justifyContent = 'space-between';
  buttonsDiv.style.width = '100%';

  // Append buttons to buttonsDiv based on type
  buttonsDiv.appendChild(confirmButton);
  if (cancelButton) {
    buttonsDiv.appendChild(cancelButton);
  }

  // Append buttonsDiv to messageContentDiv
  messageContentDiv.appendChild(buttonsDiv);

  // Append messageContentDiv to wkDialogAppDiv
  wkDialogAppDiv.appendChild(messageContentDiv);

  // Append wkDialogAppDiv to the body of the document
  document.body.appendChild(wkDialogAppDiv);
}

