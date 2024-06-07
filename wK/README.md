wk_dialog usage:

// Import or include the wk_dialog function definition here

// Example usage for confirmation
wk_dialog(
  'Are you sure you want to delete this item?', // Message
  'confirm', // Type
  function(confirmed, inputData) { // Callback function
    if (confirmed) {
      console.log('User confirmed deletion.');
      // Perform deletion logic here
    } else {
      console.log('User canceled deletion.');
      // Handle cancellation or do nothing
    }
  }
);

// Example usage with input fields
wk_dialog(
  'Please enter your name:', // Message
  'input', // Type (can be any string)
  function(confirmed, inputData) { // Callback function
    if (confirmed) {
      const name = inputData[0]; // Assuming only one input field
      console.log('User entered name:', name);
      // Process the input data here
    } else {
      console.log('User canceled.');
      // Handle cancellation or do nothing
    }
  },
  [{ placeholder: 'Name' }] // Input fields configuration
);


// Import or include the wk_dialog function definition here

// Example usage for notice
wk_dialog(
  'This is a notice message.', // Message
  'notice', // Type (can be any string, in this case, 'notice')
  function() {
    // Optional callback function if needed
    console.log('Notice displayed.');
  }
);


bg color:

(appname).style.backgroundColor = 'rgba(0, 0, 0, 0.9)';