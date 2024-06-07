export default function Settings() {
    // Retrieve saved wallpaper URL from localStorage
    const savedWallpaper = localStorage.getItem('customWallpaper');

    // Create a div element for the Settings app
    const settingsAppDiv = document.createElement('div');
    settingsAppDiv.setAttribute('id', 'settingsAppDiv');

    // Apply CSS styles directly
    settingsAppDiv.style.position = 'absolute';
    settingsAppDiv.style.top = '0px'; /* Adjust top position to match #wKframe */
    settingsAppDiv.style.left = '50%'; /* Adjust left position to center horizontally */
    settingsAppDiv.style.transform = 'translateX(-50%)'; /* Center horizontally */
    settingsAppDiv.style.width = '375px'; /* Match width of #wKframe */
    settingsAppDiv.style.height = '812px'; /* Match height of #wKframe */
    settingsAppDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    settingsAppDiv.style.borderStyle = 'ridge'; /* Add border style */
    settingsAppDiv.style.borderRadius = '40px'; /* Add border radius */
    settingsAppDiv.style.zIndex = '999'; /* Ensure the Settings app appears above other content */
    settingsAppDiv.style.display = 'flex';
    settingsAppDiv.style.flexDirection = 'column';
    settingsAppDiv.style.alignItems = 'flex-start'; /* Align content to the left */
    settingsAppDiv.style.overflow = 'auto'; /* Enable scrolling within the div */
    settingsAppDiv.style.maxWidth = '375px'; /* Enforce maximum width */
    settingsAppDiv.style.maxHeight = '812px'; /* Enforce maximum height */

    // Create a div element for the content
    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('id', 'settingsContent');
    contentDiv.style.width = '100%'; /* Adjust content width */
    contentDiv.style.marginTop = '20px'; /* Add margin from top */

    // Create a heading for the Settings app
    const heading = document.createElement('h2');
    heading.textContent = 'Settings';
    heading.style.fontSize = '28px'; /* Increase font size */
    heading.style.color = 'white';
    heading.style.marginBottom = '20px';
    heading.style.paddingLeft = '20px';

    // Create navigation items for different sections
    const sections = ['General', 'Appearance', 'About'];
    const sectionList = document.createElement('ul');
    sectionList.style.listStyleType = 'none';
    sectionList.style.padding = '0';

    // Function to handle section change
    function handleSectionChange(section) {
        // Clear existing content
        contentDiv.innerHTML = '';

        // Load the corresponding applet based on the selected section
        switch (section) {
            case 'General':
                import('./settings_general.js').then(module => {
                    module.default(contentDiv); // Load General settings applet and pass contentDiv
                });
                break;
            case 'Appearance':
                import('./settings_appearance.js').then(module => {
                     module.default(contentDiv); // Load Appearance settings applet and pass contentDiv
                });
                 break;
            case 'About':
                 import('./settings_about.js').then(module => {
                     module.default(contentDiv); // Load About settings applet and pass contentDiv
                 });
                break;
            default:
                break;
        }
    }

    // Create navigation items for each section with icons and padding
    sections.forEach(section => {
        const listItem = document.createElement('li');
        listItem.style.cursor = 'pointer';
        listItem.style.fontSize = '26px'; /* Adjust font size */
        listItem.style.padding = '15px'; /* Add padding */
        listItem.style.display = 'flex'; /* Make items flex */
        listItem.style.color = 'white';
        listItem.style.alignItems = 'center'; /* Align items vertically */
        
        // Add icons for each section
        const icon = document.createElement('img');
        switch (section) {
            case 'General':
                icon.src = './applets/Settings/general.png'; // URL for General icon
                break;
            case 'Appearance':
                icon.src = './applets/Settings/appearance.png'; // URL for Appearance icon
                break;
            case 'About':
                icon.src = './applets/Settings/about.png'; // URL for About icon
                break;
            default:
                break;
        }
        icon.style.width = '40px'; // Set width of the icon
        icon.style.marginLeft = '20px';
        icon.style.marginRight = '14px'; // Add margin between icon and text
        icon.style.borderRadius = '10px'
        
        const text = document.createElement('span');
        text.textContent = section;
        
        listItem.appendChild(icon);
        listItem.appendChild(text);
        
        listItem.addEventListener('click', () => {
            handleSectionChange(section);
        });
        sectionList.appendChild(listItem);
    });

    // Append elements to the content div
    contentDiv.appendChild(heading);
    contentDiv.appendChild(sectionList);

    // Append the content div to the Settings app
    settingsAppDiv.appendChild(contentDiv);

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
                settingsAppDiv.appendChild(dragButton);
        
                let offsetX, offsetY, isDragging = false;
        
                // Event listeners for drag functionality
                dragButton.addEventListener('mousedown', function(e) {
                    isDragging = true;
                    offsetX = e.clientX - settingsAppDiv.getBoundingClientRect().left;
                    offsetY = e.clientY - settingsAppDiv.getBoundingClientRect().top;
                });
        
                document.addEventListener('mousemove', function(e) {
                    if (isDragging) {
                        const x = e.clientX - offsetX;
                        const y = e.clientY - offsetY;
                        settingsAppDiv.style.left = x + 'px';
                        settingsAppDiv.style.top = y + 'px';
                    }
                });
        
                document.addEventListener('mouseup', function() {
                    isDragging = false;
                });
            }

    // Append the exit button
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
        // Remove the Settings app from the screen
        settingsAppDiv.remove();

        // Restore scrolling on the body
        document.body.style.overflow = 'auto';
    });

    // Append the exit button to the Settings app
    settingsAppDiv.appendChild(exitButton);

    // Append the Settings app to the screen
    document.getElementById('screen').appendChild(settingsAppDiv);

    // Disable scrolling on the body when Settings app is active
    document.body.style.overflow = 'hidden';
}
