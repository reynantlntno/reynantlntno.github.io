import wkDialog from '../wK_dialog/app_script.js'; 

// Export a function that initializes the Applet Maker
export default function() {
  // Create a div element for the Applet Maker
  var appletMakerDiv = document.createElement('div');
  appletMakerDiv.setAttribute('id', 'appletMakerDiv');

  // Apply CSS styles directly
  appletMakerDiv.style.position = 'absolute';
  appletMakerDiv.style.top = '50px'; /* Adjust top position to match #iphone */
  appletMakerDiv.style.left = '50%'; /* Adjust left position to center horizontally */
  appletMakerDiv.style.transform = 'translate(-50%)'; /* Center horizontally and vertically */
  appletMakerDiv.style.width = '375px'; /* Match width of #iphone */
  appletMakerDiv.style.height = '812px'; /* Match height of #iphone */
  appletMakerDiv.style.backgroundColor = '#ffffff'; /* White background */
  appletMakerDiv.style.borderStyle = 'ridge'; /* Add border style */
  appletMakerDiv.style.borderRadius = '40px'; /* Add border radius */
  appletMakerDiv.style.zIndex = '999'; /* Ensure the Applet Maker appears above other content */
  appletMakerDiv.style.display = 'flex';
  appletMakerDiv.style.flexDirection = 'column';
  appletMakerDiv.style.alignItems = 'center';
  appletMakerDiv.style.justifyContent = 'center';
  

// Function to render saved applet projects
function renderAppletProjects() {
  // Clear existing content
  appletMakerDiv.innerHTML = '';

  // Create a header for the applet projects
  var header = document.createElement('h2');
  header.textContent = 'Applet Projects';

  // Apply CSS styles for top left positioning
  header.style.position = 'absolute';
  header.style.top = '20px'; // Adjust the top position
  header.style.left = '20px'; // Adjust the left position

  // Append the header to the appletMakerDiv
  appletMakerDiv.appendChild(header);

  // Retrieve saved projects from localStorage
  var projects = getSavedProjects();

  // Create a container to hold the projects and new project button
  var projectsContainer = document.createElement('div');
  projectsContainer.style.position = 'absolute';
  projectsContainer.style.top = '100px'; // Adjust top position to align with header
  projectsContainer.style.left = '20px'; // Adjust left position to position next to header
  projectsContainer.style.width = '200px'; // Adjust width as needed

  // Display each project as a button with download, delete, and copy options
  projects.forEach(projectName => {
    var projectContainer = document.createElement('div');
    projectContainer.style.display = 'flex';
    projectContainer.style.alignItems = 'center';
    projectContainer.style.marginBottom = '10px';

    var projectButton = document.createElement('button');
    projectButton.textContent = projectName;
    projectButton.style.marginRight = '10px';
    projectButton.style.padding = '8px 16px'; // Add padding to the button
    projectButton.style.width = '160px'; // Set button width
    projectButton.style.fontSize = '14px'; // Increase font size
    projectButton.style.backgroundColor = 'grey'; // Blue background color
    projectButton.style.color = '#fff'; // White text color
    projectButton.style.border = 'none'; // No border
    projectButton.style.borderRadius = '5px'; // Rounded corners
    projectButton.addEventListener('click', function() {
      // Load and display the selected project
      loadAppletProject(projectName);
    });
    projectContainer.appendChild(projectButton);

    // Add download button (unicode down arrow)
    var downloadButton = document.createElement('button');
    downloadButton.innerHTML = '&#x21A7;'; // Unicode down arrow
    downloadButton.style.fontSize = '16px'; // Increase font size
    downloadButton.style.padding = '8px 12px'; // Add padding to the button
    downloadButton.style.marginRight = '10px';
    downloadButton.style.backgroundColor = '#6c757d'; // Gray background color
    downloadButton.style.color = '#fff'; // White text color
    downloadButton.style.border = 'none'; // No border
    downloadButton.style.borderRadius = '5px'; // Rounded corners
    downloadButton.addEventListener('click', function(event) {
      event.stopPropagation(); // Prevent click event from bubbling to projectButton
      openDownloadDialog(projectName);
    });
    projectContainer.appendChild(downloadButton);

    // Add delete button (unicode trash can)
    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&#x1F5D1;'; // Unicode trash can
    deleteButton.style.fontSize = '16px'; // Increase font size
    deleteButton.style.padding = '8px 12px'; // Add padding to the button
    deleteButton.style.marginRight = '10px';
    deleteButton.style.backgroundColor = '#dc3545'; // Red background color
    deleteButton.style.color = '#fff'; // White text color
    deleteButton.style.border = 'none'; // No border
    deleteButton.style.borderRadius = '5px'; // Rounded corners
    deleteButton.addEventListener('click', function(event) {
      event.stopPropagation();
      wkDialog(`Are you sure you want to delete '${projectName}'?`, 'confirm', async confirmed => {
        if (confirmed) {
          try {
            deleteProject(projectName);
            renderAppletProjects(); // Refresh the project list after deletion
            wkDialog(`'${projectName}' deleted successfully!`, 'notification');
          } catch (error) {
            console.error('Error deleting project:', error);
            wkDialog('Error deleting project. Please try again.', 'error');
          }
        }
      });
    });

    // Add copy button
    var copyButton = document.createElement('button');
    copyButton.innerHTML = 'Copy';
    copyButton.style.fontSize = '16px'; // Increase font size
    copyButton.style.padding = '8px 12px'; // Add padding to the button
    copyButton.style.marginRight = '10px';
    copyButton.style.backgroundColor = '#007bff'; // Blue background color
    copyButton.style.color = '#fff'; // White text color
    copyButton.style.border = 'none'; // No border
    copyButton.style.borderRadius = '5px'; // Rounded corners
    copyButton.addEventListener('click', function(event) {
      event.stopPropagation();
      copyProject(projectName);
    });
    
    projectContainer.appendChild(copyButton);
    projectContainer.appendChild(deleteButton);

    projectsContainer.appendChild(projectContainer);
  });

  // Create a button to create a new applet project
  var newProjectButton = document.createElement('button');
  newProjectButton.textContent = '+ New Project';
  newProjectButton.style.marginTop = '20px';
  newProjectButton.style.padding = '8px 16px'; // Add padding to the button
  newProjectButton.style.width = '160px'; // Set button width
  newProjectButton.style.fontSize = '16px'; // Increase font size
  newProjectButton.style.backgroundColor = '#28a745'; // Green background color
  newProjectButton.style.color = '#fff'; // White text color
  newProjectButton.style.border = 'none'; // No border
  newProjectButton.style.borderRadius = '5px'; // Rounded corners
  newProjectButton.addEventListener('click', function() {
    // Clear existing content and display applet creation form
    renderAppletCreationForm();
  });
  projectsContainer.appendChild(newProjectButton);

  // Append the projects container to the appletMakerDiv
  appletMakerDiv.appendChild(projectsContainer);

  // Create an exit button to close the Applet Maker
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
    appletMakerDiv.remove();
  });
  appletMakerDiv.appendChild(exitButton);
}

// Function to copy a project into the 'appletTest' folder in localStorage
function copyProject(projectName) {
  try {
    // Retrieve the project data from localStorage
    var appletFolder = `applets/${projectName}`;
    var appletData = {};

    // Retrieve metadata
    var metadata = localStorage.getItem(`${appletFolder}/metadata.json`);
    if (!metadata) {
      throw new Error(`Metadata not found for '${projectName}'`);
    }
    appletData.metadata = JSON.parse(metadata);

    // Retrieve icon
    var icon = localStorage.getItem(`${appletFolder}/icon.png`);
    if (!icon) {
      throw new Error(`Icon not found for '${projectName}'`);
    }
    appletData.icon = icon;

    // Retrieve script
    var script = localStorage.getItem(`${appletFolder}/app_script.js`);
    if (!script) {
      throw new Error(`Script not found for '${projectName}'`);
    }
    appletData.script = script;

    // Ensure 'appletTest' folder exists or create it
    var appletTestFolder = 'appletTest';
    if (!localStorage.getItem(appletTestFolder)) {
      localStorage.setItem(appletTestFolder, JSON.stringify({}));
    }

    // Store project data in 'appletTest' folder
    var appletTestData = JSON.parse(localStorage.getItem(appletTestFolder));
    appletTestData[projectName] = appletData;
    localStorage.setItem(appletTestFolder, JSON.stringify(appletTestData));

    // Display success message
    wkDialog(`'${projectName}' copied to 'appletTest' successfully!`, 'notification');
  } catch (error) {
    // Handle errors
    console.error('Error copying project:', error);
    wkDialog(`Error copying '${projectName}'. ${error.message}`, 'error');
  }
}


// Function to delete a project and its associated data
function deleteProject(projectName) {
  var appletFolder = `applets/${projectName}`;

  // Remove project data from localStorage
  localStorage.removeItem(`${appletFolder}/metadata.json`);
  localStorage.removeItem(`${appletFolder}/icon.png`);
  localStorage.removeItem(`${appletFolder}/app_script.js`);

  // Refresh the projects list
  renderAppletProjects();

}

  // Function to retrieve saved applet project names
  function getSavedProjects() {
    // Retrieve all keys from localStorage
    var allKeys = Object.keys(localStorage);

    // Filter keys to extract unique project names
    var projectNames = allKeys.reduce((names, key) => {
      if (key.startsWith('applets/')) {
        var projectName = key.split('/')[1]; // Extract project name from key
        if (!names.includes(projectName)) {
          names.push(projectName);
        }
      }
      return names;
    }, []);

    return projectNames;
  }
  

// Function to load and display an applet project
function loadAppletProject(projectName) {
  // Clear existing content
  appletMakerDiv.innerHTML = '';

  // Retrieve project data from local storage
  var appletFolder = `applets/${projectName}`;

  // Load metadata.json
  var metadata = JSON.parse(localStorage.getItem(`${appletFolder}/metadata.json`));

  // Create container for app details
  var appDetailsContainer = document.createElement('div');
  appDetailsContainer.style.display = 'flex';
  appDetailsContainer.style.alignItems = 'center';

  // Display app icon
  var iconImg = document.createElement('img');
  iconImg.src = localStorage.getItem(`${appletFolder}/icon.png`);
  iconImg.style.width = '60px'; // Adjusted width for smaller icon
  iconImg.style.height = '60px'; // Adjusted height for smaller icon
  iconImg.style.marginRight = '20px'; // Margin to separate icon from text
  iconImg.style.marginLeft = '0'; // Set margin left to 0 to align icon to farthest left
  iconImg.style.borderRadius = '16px';
  appDetailsContainer.appendChild(iconImg);

  // Display app name
  var appNameHeader = document.createElement('h2');
  appNameHeader.textContent = metadata.name;
  appDetailsContainer.appendChild(appNameHeader);

  appletMakerDiv.appendChild(appDetailsContainer);

  // Display app description
  var projectDescPara = document.createElement('p');
  projectDescPara.textContent = metadata.desc;
  projectDescPara.style.fontStyle = 'italic'; // Italicize the description
  projectDescPara.style.marginLeft = '20px'; // Indent description
  appletMakerDiv.appendChild(projectDescPara);

  // Display placeholder code in a read-only text area
  var existingScript = localStorage.getItem(`${appletFolder}/app_script.js`) || '';
  var placeholderTextarea = document.createElement('textarea');
  placeholderTextarea.textContent = existingScript;
  placeholderTextarea.style.width = '90%';
  placeholderTextarea.style.height = '200px';
  placeholderTextarea.readOnly = true; // Make it read-only
  placeholderTextarea.style.marginTop = '20px'; // Margin top for separation
  appletMakerDiv.appendChild(placeholderTextarea);

  // Create a new text area for adding code
  var newCodeTextarea = document.createElement('textarea');
  newCodeTextarea.placeholder = 'Add your code here...';
  newCodeTextarea.style.width = '90%';
  newCodeTextarea.style.height = '200px';
  newCodeTextarea.style.marginTop = '20px'; // Margin top for separation
  appletMakerDiv.appendChild(newCodeTextarea);

  // Create a button to save the added code
  var saveCodeButton = document.createElement('button');
  saveCodeButton.textContent = 'Save Code';
  saveCodeButton.style.backgroundColor = '#007bff';
  saveCodeButton.style.color = '#fff';
  saveCodeButton.style.padding = '8px 16px';
  saveCodeButton.style.border = 'none';
  saveCodeButton.style.borderRadius = '5px';
  saveCodeButton.style.cursor = 'pointer';
  saveCodeButton.style.marginTop = '20px'; // Margin top for separation
  saveCodeButton.addEventListener('click', function() {
    // Append the new code to app_script.js content
    var newCode = newCodeTextarea.value;
    var updatedScript = existingScript + '\n\n' + newCode;
    localStorage.setItem(`${appletFolder}/app_script.js`, updatedScript);

    // Refresh the display to show updated script
    loadAppletProject(projectName);
    wkDialog('Code added successfully!', 'notification');
  });
  appletMakerDiv.appendChild(saveCodeButton);

  // Create a button to go back to the list of applet projects
  var backButton = document.createElement('button');
  backButton.textContent = 'Back to Projects';
  backButton.style.backgroundColor = '#6c757d';
  backButton.style.color = '#fff';
  backButton.style.padding = '8px 16px';
  backButton.style.border = 'none';
  backButton.style.borderRadius = '5px';
  backButton.style.cursor = 'pointer';
  backButton.style.marginTop = '20px'; // Margin top for separation
  backButton.addEventListener('click', function() {
    // Render the applet projects list
    renderAppletProjects();
  });
  appletMakerDiv.appendChild(backButton);
}


  // Function to generate placeholder code for app_script.js
  function generateAppScriptCode(appName) {
    var placeholderCode = `// Export a function that initializes ${appName}
export default function() {
  // Create a div element for the ${appName}
  var ${appName}Div = document.createElement('div');
  ${appName}Div.setAttribute('id', '${appName}Div');

  // Apply CSS styles directly
  ${appName}Div.style.position = 'absolute';
  ${appName}Div.style.top = '50px'; /* Adjust top position to match #iphone */
  ${appName}Div.style.left = '50%'; /* Adjust left position to center horizontally */
  ${appName}Div.style.transform = 'translate(-50%)'; /* Center horizontally and vertically */
  ${appName}Div.style.width = '375px'; 
  ${appName}Div.style.height = '812px'; 
  ${appName}Div.style.backgroundColor = '#ffffff'; /* White background */
  ${appName}Div.style.borderStyle = 'ridge'; /* Add border style */
  ${appName}Div.style.borderRadius = '40px'; /* Add border radius */
  ${appName}Div.style.zIndex = '999'; 
  ${appName}Div.style.display = 'flex';
  ${appName}Div.style.flexDirection = 'column';
  ${appName}Div.style.alignItems = 'center';
  ${appName}Div.style.justifyContent = 'center';
};`;
    return placeholderCode;
  }

// Function to render the applet creation form
function renderAppletCreationForm() {
  // Clear existing content
  appletMakerDiv.innerHTML = '';

  // Create input fields for applet customization
  var appNameInput = document.createElement('input');
  appNameInput.setAttribute('type', 'text');
  appNameInput.setAttribute('placeholder', 'Enter App Name');
  appNameInput.style.width = '300px'; // Set width for input field
  appNameInput.style.marginBottom = '10px'; // Add bottom margin

  var appDescInput = document.createElement('input');
  appDescInput.setAttribute('placeholder', 'Enter App Description');
  appDescInput.style.width = '300px'; // Set width for textarea
  appDescInput.style.height = '100px'; // Set height for textarea
  appDescInput.style.marginBottom = '10px'; // Add bottom margin

  var iconInput = document.createElement('input');
  iconInput.setAttribute('type', 'file');
  iconInput.setAttribute('accept', '.png');
  iconInput.setAttribute('id', 'iconInput');
  iconInput.style.marginBottom = '10px'; // Add bottom margin

  var createAppButton = document.createElement('button');
  createAppButton.textContent = 'Create Applet';
  createAppButton.style.backgroundColor = '#007bff'; // Blue background color
  createAppButton.style.color = '#fff'; // White text color
  createAppButton.style.padding = '8px 16px'; // Padding
  createAppButton.style.border = 'none'; // No border
  createAppButton.style.borderRadius = '5px'; // Rounded corners
  createAppButton.style.cursor = 'pointer'; // Pointer cursor
  createAppButton.style.marginBottom = '20px'; // Add bottom margin

  // Event listener for creating the applet
  createAppButton.addEventListener('click', function() {
    // Get user input values
    var appName = appNameInput.value;
    var appDesc = appDescInput.value;
    var iconFile = iconInput.files[0];

    if (!appName || !appDesc || !iconFile) {
      wkDialog('Please fill in all fields and upload an icon image.', 'notification');
      return;
    }

    // Validate file type (must be image/png)
    if (iconFile.type !== 'image/png') {
      wkDialog('Please upload a valid PNG image file.', 'notification');
      return;
    }

    // Create a new applet using the user input
    createApplet(appName, appDesc, iconFile);
  });

  // Append input fields and button to the Applet Maker
  appletMakerDiv.appendChild(createLabel('App Name:'));
  appletMakerDiv.appendChild(appNameInput);
  appletMakerDiv.appendChild(document.createElement('br'));

  appletMakerDiv.appendChild(createLabel('App Description:'));
  appletMakerDiv.appendChild(appDescInput);
  appletMakerDiv.appendChild(document.createElement('br'));

  appletMakerDiv.appendChild(createLabel('Upload Icon (.png):'));
  appletMakerDiv.appendChild(iconInput);
  appletMakerDiv.appendChild(document.createElement('br'));

  appletMakerDiv.appendChild(createAppButton);

  // Create a button to go back to the list of applet projects
  var backButton = document.createElement('button');
  backButton.textContent = 'Back to Projects';
  backButton.style.backgroundColor = '#6c757d'; // Gray background color
  backButton.style.color = '#fff'; // White text color
  backButton.style.padding = '8px 16px'; // Padding
  backButton.style.border = 'none'; // No border
  backButton.style.borderRadius = '5px'; // Rounded corners
  backButton.style.cursor = 'pointer'; // Pointer cursor
  backButton.style.marginTop = '20px'; // Top margin

  backButton.addEventListener('click', function() {
    // Render the applet projects list
    renderAppletProjects();
  });

  appletMakerDiv.appendChild(backButton);
}

// Helper function to create label elements
function createLabel(text) {
  var label = document.createElement('label');
  label.textContent = text;
  label.style.marginBottom = '5px'; // Add bottom margin to label
  return label;

}

  // Function to create a new applet based on user input
  function createApplet(name, desc, iconFile) {
    // Create a new applet metadata
    var appletMetadata = {
      "name": name,
      "desc": desc,
      "version": "1.0.0",
      "app.js": "1.0.0"
    };

    // Create folder for the new applet project
    var appletFolder = `applets/${name.replace(/\s+/g, '-').toLowerCase()}`;

    // Store metadata.json
    localStorage.setItem(`${appletFolder}/metadata.json`, JSON.stringify(appletMetadata));

    // Store icon.png as a data URL
    var reader = new FileReader();
    reader.onload = function(event) {
      localStorage.setItem(`${appletFolder}/icon.png`, event.target.result);
    };
    reader.readAsDataURL(iconFile);

    // Store app_script.js (using a placeholder for demonstration)
    var appScript = generateAppScriptCode(name);
    localStorage.setItem(`${appletFolder}/app_script.js`, appScript);

    // Display a success message
    wkDialog('Applet created successfully!', 'notification');

    // Reload applet projects list
    renderAppletProjects();
  }

  // Function to open download dialog for project files
  function openDownloadDialog(projectName) {
    var appletFolder = `applets/${projectName}`;

    // Create a small window for download options
    var downloadWindow = document.createElement('div');
    downloadWindow.style.position = 'fixed';
    downloadWindow.style.top = '50%';
    downloadWindow.style.left = '50%';
    downloadWindow.style.transform = 'translate(-50%, -50%)';
    downloadWindow.style.backgroundColor = '#ffffff';
    downloadWindow.style.border = '1px solid #ccc';
    downloadWindow.style.padding = '20px';
    downloadWindow.style.zIndex = '1000';
    downloadWindow.style.width = '300px';

    // Display download options
    var downloadHeader = document.createElement('h3');
    downloadHeader.textContent = 'Download Project Files';
    downloadWindow.appendChild(downloadHeader);

    // Create download buttons for each project file
    var metadataButton = createDownloadButton(`${appletFolder}/metadata.json`, 'Download metadata.json');
    downloadWindow.appendChild(metadataButton);

    var iconButton = createDownloadButton(`${appletFolder}/icon.png`, 'Download icon.png');
    downloadWindow.appendChild(iconButton);

    var scriptButton = createDownloadButton(`${appletFolder}/app_script.js`, 'Download app_script.js');
    downloadWindow.appendChild(scriptButton);

    // Create close button for the download window
    var closeButton = document.createElement('button');
    closeButton.textContent = '✕'; // Unicode multiply symbol (close icon)
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', function() {
      // Close the download window
      downloadWindow.remove();
    });
    downloadWindow.appendChild(closeButton);

    // Append download window to document body
    document.body.appendChild(downloadWindow);
  }

  // Function to create a download button for a specific file
  function createDownloadButton(filePath, buttonText) {
    var button = document.createElement('button');
    button.textContent = buttonText;
    button.style.marginTop = '10px';
    button.addEventListener('click', function() {
      // Retrieve file content from localStorage
      var fileContent = localStorage.getItem(filePath);

      if (!fileContent) {
        wkDialog(`File '${filePath}' not found.`, 'notification');
        return;
      }

      // Create a blob and initiate download
      var blob = new Blob([fileContent], { type: 'text/plain' });
      var url = URL.createObjectURL(blob);

      var a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop(); // Extract filename from path
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke the URL to free up memory
      URL.revokeObjectURL(url);
    });

    return button;
  }

  // Initial rendering of applet projects list
  renderAppletProjects();

  // Append the Applet Maker to the screen
  document.body.appendChild(appletMakerDiv);
}