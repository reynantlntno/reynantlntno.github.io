import wkDialog from '../wK_dialog/app_script.js'; // Import your wk_dialog module

export default function AManager() {
    // Retrieve saved app states from localStorage or initialize an empty object
    const appStates = JSON.parse(localStorage.getItem('appStates')) || {};

    // Define non-disableable apps
    const nonDisableableApps = ['aManager', 'Settings', 'Setup', 'wK_dialog', 'wK_bar', 'wK_rst'];

    // Define path to applets directory
    const appletsDir = './applets/';

    // Create a div element for the AManager app
    const aManagerAppDiv = document.createElement('div');
    aManagerAppDiv.setAttribute('id', 'aManagerAppDiv');
    // Apply CSS styles directly
    aManagerAppDiv.style.position = 'absolute';
    aManagerAppDiv.style.top = '0px';
    aManagerAppDiv.style.left = '50%';
    aManagerAppDiv.style.transform = 'translateX(-50%)';
    aManagerAppDiv.style.width = '375px';
    aManagerAppDiv.style.height = '812px';
    aManagerAppDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    aManagerAppDiv.style.borderStyle = 'ridge';
    aManagerAppDiv.style.borderRadius = '40px';
    aManagerAppDiv.style.zIndex = '999';
    aManagerAppDiv.style.display = 'flex';
    aManagerAppDiv.style.flexDirection = 'column';
    aManagerAppDiv.style.alignItems = 'flex-start';
    aManagerAppDiv.style.overflowY = 'auto'; // Enable vertical scrolling for the app list

    // Create a div element for the content
    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('id', 'aManagerContent');
    contentDiv.style.width = '100%';
    contentDiv.style.marginTop = '20px';

    // Create a heading for the AManager app
    const heading = document.createElement('h2');
    heading.textContent = 'Applet Manager';
    heading.style.fontSize = '28px';
    heading.style.color = 'white';
    heading.style.marginBottom = '20px';
    heading.style.paddingLeft = '20px';

    // Create a search bar element
    const searchBar = document.createElement('input');
    searchBar.setAttribute('type', 'text');
    searchBar.setAttribute('placeholder', 'Search for an app...');
    searchBar.style.padding = '8px';
    searchBar.style.width = '300px';
    searchBar.style.borderRadius = '8px';
    searchBar.style.backgroundColor = 'black';
    searchBar.style.color = 'white';
    searchBar.style.marginLeft = '20px';

    // Add event listener to respond to user input in the search bar
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.trim().toLowerCase();
        filterApps(searchTerm);
    });

    // Create a list element to display installed apps
    const appList = document.createElement('ul');
    appList.style.listStyleType = 'none';
    appList.style.padding = '0';
    appList.style.width = '100%';
    appList.style.maxHeight = '800px'; // Set a maximum height for the list
    appList.style.overflowY = 'auto'; // Enable vertical scrolling within the list

    // Function to fetch the list of installed apps
    async function fetchInstalledApps() {
        const appFolders = await fetchAppFolders();
        return appFolders.filter(appName => appName !== 'error_catcher');
    }

    // Function to render the list of installed apps
    async function renderAppList() {
        const installedApps = await fetchInstalledApps();
        appList.innerHTML = ''; // Clear existing list items

        installedApps.forEach(async appName => {
            const metadata = await fetchAppMetadata(appName); // Utilize the fetchAppMetadata function from app.js
            const listItem = document.createElement('li');
            listItem.style.cursor = 'pointer';
            listItem.style.display = 'flex';
            listItem.style.alignItems = 'center';
            listItem.style.fontSize = '18px';
            listItem.style.paddingLeft = '20px';

            // Check if the app is disabled
            const isDisabled = appStates[appName] && appStates[appName].disabled;

            // Create app icon element
            const appIcon = document.createElement('img');
            appIcon.src = `${appletsDir}${appName}/${metadata.icon}`;
            appIcon.alt = `${metadata.name} Icon`;
            appIcon.style.width = '44px';
            appIcon.style.height = '44px';
            appIcon.style.marginRight = '10px';
            appIcon.style.borderRadius = '12px';
            listItem.appendChild(appIcon);

            // Create div for app details (name, description, version, required app.js version)
            const appDetailsDiv = document.createElement('div');
            appDetailsDiv.style.display = 'flex';
            appDetailsDiv.style.flexDirection = 'column';
            appDetailsDiv.style.marginTop = '30px';
            appDetailsDiv.style.color = 'white';
            listItem.appendChild(appDetailsDiv);

            // Create span element for app name
            const appNameSpan = document.createElement('span');
            appNameSpan.textContent = metadata.name;
            appDetailsDiv.appendChild(appNameSpan);

            // Create small element for app description
            const appDesc = document.createElement('small');
            appDesc.textContent = metadata.desc; // Populate with app description from metadata
            appDesc.style.marginLeft = '10px'; // Add spacing between app name and description
            appDetailsDiv.appendChild(appDesc);

            // Create small element for app version
            const appVersion = document.createElement('small');
            appVersion.textContent = `Version: ${metadata.version}`;
            appVersion.style.marginLeft = '10px';
            appDetailsDiv.appendChild(appVersion);

            // Create small element for required app.js version
            const requiredAppJSVersion = document.createElement('small');
            requiredAppJSVersion.textContent = `Required app.js version: ${metadata['app.js']}`;
            requiredAppJSVersion.style.marginLeft = '10px';
            appDetailsDiv.appendChild(requiredAppJSVersion);

            // Grey out the app if it's disabled
            if (isDisabled) {
                appNameSpan.style.color = 'gray';
                appDesc.style.color = 'gray';
                appVersion.style.color = 'gray';
                requiredAppJSVersion.style.color = 'gray';
            }

            // Add click event listener to enable/disable the app
            listItem.addEventListener('click', async () => {
                if (nonDisableableApps.includes(appName)) {
                    // App is non-disableable, do not show the confirmation dialog
                    return;
                }

                const actionMessage = isDisabled ? 'enable' : 'disable';
                const confirmationMessage = `Are you sure you want to ${actionMessage} ${metadata.name}?`;

                wkDialog(confirmationMessage, 'confirm', async confirmed => {
                    if (confirmed) {
                        handleAppEnableDisable(appName);
                    }
                });
            });

            appList.appendChild(listItem);
        });

        filterApps(''); // Show all apps initially
    }

    // Function to handle app enable/disable logic
    function handleAppEnableDisable(appName) {
        if (nonDisableableApps.includes(appName)) {
            // App is non-disableable, do not change its state
            return;
        }

        if (appStates[appName] && appStates[appName].disabled) {
            delete appStates[appName].disabled;
        } else {
            appStates[appName] = { disabled: true };
        }

        localStorage.setItem('appStates', JSON.stringify(appStates));
        renderAppList(); // Re-render the app list after state change
    }

    // Function to filter apps based on search term
    function filterApps(searchTerm) {
        const appItems = appList.querySelectorAll('li');

        appItems.forEach(item => {
            const appName = item.querySelector('span').textContent.toLowerCase();

            // Check if the app name contains the search term
            if (appName.includes(searchTerm)) {
                item.style.display = 'flex'; // Display the app if it matches the search term
            } else {
                item.style.display = 'none'; // Hide the app if it does not match
            }
        });
    }

    // Call renderAppList to populate the initial list of installed apps
    renderAppList();

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
            aManagerAppDiv.appendChild(dragButton);
    
            let offsetX, offsetY, isDragging = false;
    
            // Event listeners for drag functionality
            dragButton.addEventListener('mousedown', function(e) {
                isDragging = true;
                offsetX = e.clientX - aManagerAppDiv.getBoundingClientRect().left;
                offsetY = e.clientY - aManagerAppDiv.getBoundingClientRect().top;
            });
    
            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    const x = e.clientX - offsetX;
                    const y = e.clientY - offsetY;
                    aManagerAppDiv.style.left = x + 'px';
                    aManagerAppDiv.style.top = y + 'px';
                }
            });
    
            document.addEventListener('mouseup', function() {
                isDragging = false;
            });
        }

    // Create an exit button to close the AManager app
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
        aManagerAppDiv.remove();
        document.body.style.overflow = 'auto';
    });

    // Append elements to the content div
    contentDiv.appendChild(heading);
    contentDiv.appendChild(searchBar);
    contentDiv.appendChild(appList);
    contentDiv.appendChild(exitButton);

    // Append the content div to the AManager app
    aManagerAppDiv.appendChild(contentDiv);

    // Append the AManager app to the screen
    document.getElementById('screen').appendChild(aManagerAppDiv);

    // Disable scrolling on the body when AManager app is active
    document.body.style.overflow = 'hidden';
}
