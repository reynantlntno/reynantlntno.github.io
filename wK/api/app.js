// Define the path to the applets directory
const appletsDir = 'applets/';

// Global variable to track applet switcher visibility
let appletSwitcherVisible = false;

// Object to track running apps in memory (RAM)
const runningApps = {}; // { appName: appDiv }

// Function to fetch the list of app folders
async function fetchAppFolders() {
    const response = await fetch(appletsDir);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return Array.from(doc.querySelectorAll('a'))
        .filter(link => link.getAttribute('href').startsWith('/applets/') && link.getAttribute('href') !== '/applets/')
        .map(link => link.getAttribute('href').replace('/applets/', '').replace('/', ''));
}

// Function to check for wK_dev key in localStorage
function isDeveloperModeEnabled() {
    const wKDev = localStorage.getItem('wK_dev');
    return wKDev === '1'; // Returns true if wK_dev is '1', indicating developer mode is enabled
}

// Function to fetch app metadata from the metadata.json file of each app
async function fetchAppMetadata(appName) {
    const metadataFile = `.${appletsDir}${appName}/metadata.json`;
    const response = await fetch(metadataFile);
    const metadata = await response.json();

    // Skip metadata verification if developer mode is enabled
    if (!isDeveloperModeEnabled() && shouldHideApp(appName)) {
        validateMetadata(metadata, appName);
    }

    return metadata;
}

function shouldHideApp(appName) {
    return appName !== 'wK_dialog' && appName !== 'wK_bar' && appName !== 'wK_rst';
}

function validateMetadata(metadata, appName) {
    const requiredFields = ['name', 'icon', 'desc', 'version', 'app.js'];

    // Exception list for metadata validation
    const exceptionList = ['wK_dialog', 'Setup', 'wK_rst'];

    if (!exceptionList.includes(appName)) {
        // Check for presence of required fields
        for (const field of requiredFields) {
            if (!metadata[field]) {
                throw new Error(`Metadata error: ${field} is missing for ${appName}.`);
            }
        }

        // Enforce app.js version compatibility
        const requiredAppJSVersion = '1.0.0';
        const appJSVersion = metadata['app.js'];
        if (!isVersionCompatible(appJSVersion, requiredAppJSVersion)) {
            throw new Error(`Incompatible applet (${appJSVersion}): Requires app.js version ${requiredAppJSVersion} or higher. ${appName} applet incompatible.`);
        }
    }
}

// Function to check if the app.js version is compatible
function isVersionCompatible(currentVersion, requiredVersion) {
    // Split versions into arrays for comparison
    const currentVersionParts = currentVersion.split('.').map(Number);
    const requiredVersionParts = requiredVersion.split('.').map(Number);

    // Compare version parts
    for (let i = 0; i < Math.max(currentVersionParts.length, requiredVersionParts.length); i++) {
        const currentPart = currentVersionParts[i] || 0;
        const requiredPart = requiredVersionParts[i] || 0;

        if (currentPart < requiredPart) {
            return false;
        } else if (currentPart > requiredPart) {
            return true;
        }
    }

    return true; // Versions are identical or compatible
}

// Function to update the HTML with the detected apps and display the applet switcher button
async function updateHTMLWithApps() {
    // Check for developer mode
    const developerModeEnabled = isDeveloperModeEnabled();

    const appFolders = await fetchAppFolders();
    const screen = document.getElementById('screen');

    // Clear any existing app icons
    screen.innerHTML = '';

    // Loop through each detected app folder
    for (const appName of appFolders) {
        try {
            const metadata = await fetchAppMetadata(appName);
            // Skip metadata verification if in developer mode or if the app should be hidden
            if (developerModeEnabled || shouldHideApp(appName)) {
                // Create a link element for the app
                const appLink = document.createElement('a');
                appLink.href = '#';
                appLink.className = 'app';

                // Create an image element for the app icon
                const appIcon = document.createElement('img');
                appIcon.src = `${appletsDir}${appName}/${metadata.icon}`;
                appIcon.alt = `${metadata.name} Icon`;

                // Append the app icon to the app link
                appLink.appendChild(appIcon);

                // Create a span element for the app name
                const appNameSpan = document.createElement('span');
                appNameSpan.textContent = metadata.name;

                // Append the app name to the app link
                appLink.appendChild(appNameSpan);

                // Append the app link to the screen
                screen.appendChild(appLink);

                // Add event listener to execute app script when clicked (if app is enabled)
                appLink.addEventListener('click', async (event) => {
                    event.preventDefault();
                    await showApp(appName);
                });
            }

            // Load and execute app_script.js for specific apps
            if (appName === 'wK_bar') {
                const appScript = await import(`.${appletsDir}${appName}/app_script.js`);
                appScript.default(); // Assuming the script has a default function to execute
            }
        } catch (error) {
            console.error(`Error loading ${appName}:`, error);
            // Launch the wK_dialog applet with the error details
            await noticeErrorExec(error);
        }
    }

    // Create and append applet switcher icon if not in developer mode
    if (true) {
        const switcherIcon = document.createElement('a');
        switcherIcon.href = '#';
        switcherIcon.className = 'app';

        // Create an image element for the switcher icon
        const switcherImg = document.createElement('img');
        switcherImg.src = './assets/switcher_icon.png'; // Provide path to the switcher icon image
        switcherImg.alt = 'Applet Switcher Icon';

        // Create a span element for the switcher name
        const switcherNameSpan = document.createElement('span');
        switcherNameSpan.textContent = 'Switcher';

        // Append the switcher icon and name to the switcher icon link
        switcherIcon.appendChild(switcherImg);
        switcherIcon.appendChild(switcherNameSpan);

        // Append the switcher icon link to the screen
        screen.appendChild(switcherIcon);

        // Add event listener to execute switcher function when switcher icon is clicked
        switcherIcon.addEventListener('click', toggleAppletSwitcher);
    }

    // Check if the username is set in localStorage
    const savedUsername = localStorage.getItem('username');
    if (!savedUsername) {
        // Username not set, call SetupApp to set it up
        await setupUsername();
    }
}

// Function to set up username using the SetupApp
async function setupUsername() {
    try {
        // Load the SetupApp script
        const setupAppScript = await import('../applets/Setup/app_script.js');

        // Call the SetupApp function to set up the username
        setupAppScript.default();
    } catch (error) {
        console.error('Error setting up username:', error);
    }
}

// Function to toggle applet switcher visibility
function toggleAppletSwitcher() {
    const switcherContainer = document.getElementById('appletSwitcher');
    if (switcherContainer) {
        // If switcher container exists, remove it from the screen
        switcherContainer.remove();
        appletSwitcherVisible = false;
    } else {
        // If switcher container doesn't exist, open the applet switcher
        openAppletSwitcher();
        appletSwitcherVisible = true;
    }
}

// Function to open the applet switcher
function openAppletSwitcher() {
    const screen = document.getElementById('screen');

    // Create a switcher container
    const switcherContainer = document.createElement('div');
    switcherContainer.setAttribute('id', 'appletSwitcher');
    switcherContainer.style.position = 'absolute';
    switcherContainer.style.top = '50px'; /* Adjust top position */
    switcherContainer.style.left = '50%'; /* Adjust left position */
    switcherContainer.style.transform = 'translateX(-50%)'; /* Center horizontally */
    switcherContainer.style.width = '80%';
    switcherContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    switcherContainer.style.color = 'white';
    switcherContainer.style.opacity = '0.9';
    switcherContainer.style.border = '1px solid #ccc';
    switcherContainer.style.borderRadius = '12px';
    switcherContainer.style.zIndex = '1000';
    switcherContainer.style.padding = '10px';
    switcherContainer.style.overflowY = 'auto';

    // Create applet icons in the switcher if apps are listed
    if (Object.keys(runningApps).length > 0) {
        Object.keys(runningApps).forEach(appName => {
            const metadata = runningApps[appName].metadata;

            // Create container for applet icon, name, and switch button
            const iconContainer = document.createElement('div');
            iconContainer.style.display = 'flex';
            iconContainer.style.alignItems = 'center';

            // Create app icon
            const appIcon = document.createElement('img');
            appIcon.src = `${appletsDir}${appName}/${metadata.icon}`;
            appIcon.alt = `${metadata.name} Icon`;
            appIcon.style.width = '50px';
            appIcon.style.height = '50px';
            appIcon.style.borderRadius = '12px';
            appIcon.style.marginTop = '10px';
            appIcon.style.marginBottom = '10px';
            iconContainer.appendChild(appIcon);

            // Create app name element
            const appNameElement = document.createElement('span');
            appNameElement.textContent = metadata.name;
            appNameElement.style.marginLeft = '10px';
            iconContainer.appendChild(appNameElement);

            // Create switch button
            const switchButton = document.createElement('button');
            switchButton.textContent = 'Switch';
            switchButton.style.marginLeft = 'auto'; // Push to the right
            switchButton.style.backgroundColor = 'black';
            switchButton.style.borderRadius = '6px';
            switchButton.style.color = 'white';
            switchButton.addEventListener('click', async () => {
                await showApp(appName); // Switch to the app
            });
            iconContainer.appendChild(switchButton);

            // Append icon container to switcher
            switcherContainer.appendChild(iconContainer);
        });
    } else {
        // Display text when no apps are listed in the switcher
        const noAppsText = document.createElement('p');
        noAppsText.textContent = 'No apps listed.';
        switcherContainer.appendChild(noAppsText);
    }

    // Append switcher container to screen
    screen.appendChild(switcherContainer);
}

// Function to check if an app is disabled
function isAppDisabled(appName) {
    const appStates = JSON.parse(localStorage.getItem('appStates')) || {};
    return appStates[appName] && appStates[appName].disabled;
}

// Function to execute the app script and show the app (if not disabled)
async function showApp(appName) {
    if (!isAppDisabled(appName)) {
        try {
            // Load the app script
            const appScript = await import(`.${appletsDir}${appName}/app_script.js`);

            // Create a div element for the app
            const appDiv = document.createElement('div');
            appDiv.classList.add('active-app'); // Add a class to identify active apps
            appDiv.metadata = await fetchAppMetadata(appName); // Store metadata in appDiv
            appScript.default(appDiv); // Execute the app script passing the appDiv as an argument

            // Store the running app in memory (RAM)
            runningApps[appName] = appDiv;

            // Append the app to the screen
            document.getElementById('screen').appendChild(appDiv);

        } catch (error) {
            console.error(`Error executing app_script.js for ${appName}:`, error);
            // Launch the wK_dialog applet with the error details
            await noticeErrorExec(error);
        }
    } else {
        // App is disabled, show a message or take appropriate action
        console.log(`${appName} is disabled.`);
    }
}

// Function to launch the wK_dialog applet with error details
async function noticeErrorExec(error) {
    try {
        // Load the wK_dialog script
        const wKDialogCall = await import('../applets/wK_dialog/app_script.js');

        // Launch the wK_dialog applet with the error details
        wKDialogCall.default(error.message || 'An unknown error occurred.');

    } catch (error) {
        console.error('Error launching wK_dialog:', error);
    }
}

// Function to apply custom wallpaper if available in IndexedDB
async function applyCustomWallpaperFromDB() {
    try {
        // Dynamically import the wK_rst module
        const module = await import('../applets/wK_rst/app_script.js');
        const wK_rst = module.default; // Assuming 'wK_rst' is the default export

        // Wait for the wK_rst initialization to complete before accessing the database
        await wK_rst();

        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        if (!indexedDB) {
            console.error("IndexedDB is not supported in this browser.");
            return;
        }

        const dbName = 'wK_db';
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;

            // Check if 'wallpaper' object store exists
            if (db.objectStoreNames.contains('wallpaper')) {
                // Open transaction to access 'wallpaper' object store
                const transaction = db.transaction(['wallpaper'], 'readonly');
                const wallpaperStore = transaction.objectStore('wallpaper');

                // Get the latest wallpaper record (by auto-incrementing id)
                const getRequest = wallpaperStore.openCursor(null, 'prev');

                getRequest.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        // Found a wallpaper record, apply the wallpaper
                        const wallpaperUrl = cursor.value.imageUrl;
                        document.getElementById('wKframe').style.backgroundImage = `url('${wallpaperUrl}')`;
                    } else {
                        // No wallpaper record found, do nothing (use default or current background)
                        console.log('No wallpaper found in IndexedDB');
                    }
                };

                getRequest.onerror = function(event) {
                    console.error('Error retrieving wallpaper from IndexedDB:', event.target.errorCode);
                };
            } else {
                console.log("The 'wallpaper' object store does not exist in IndexedDB.");
            }
        };

        request.onerror = function(event) {
            console.error('Failed to open IndexedDB database:', event.target.errorCode);
        };
    } catch (error) {
        console.error('Error importing or executing wK_rst module:', error);
    }
}

// Call the function to apply custom wallpaper from IndexedDB
applyCustomWallpaperFromDB();

// Call the function to update the HTML with the detected apps and display the applet switcher button
updateHTMLWithApps();
