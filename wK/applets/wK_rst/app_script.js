import wkDialog from '../wK_dialog/app_script.js'; // Import wkDialog module

export default async function wK_rst() {
    // Ensure the IndexedDB initialization is completed before continuing
    await initializeIndexedDB();

    function initializeIndexedDB() {
        return new Promise((resolve, reject) => {
            const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

            if (!indexedDB) {
                console.error("IndexedDB is not supported in this browser.");
                reject(new Error("IndexedDB not supported"));
            }

            const dbName = 'wK_db';
            const dbVersion = 1; // Database version

            // Retrieve the stored database version from localStorage
            const storedVersion = parseInt(localStorage.getItem('wK_db_version'));

            if (storedVersion && storedVersion >= dbVersion) {
                // If a stored version exists and is greater than or equal to the current dbVersion,
                // Proceed with resolving the promise
                resolve();
            } else {
                // Open the IndexedDB and perform version upgrade if necessary
                const request = indexedDB.open(dbName, dbVersion);

                request.onerror = function(event) {
                    console.error("IndexedDB error:", event.target.error);
                    reject(event.target.error);
                };

                request.onupgradeneeded = function(event) {
                    const db = event.target.result;

                    // Create default object stores if they don't exist
                    if (!db.objectStoreNames.contains('wallpaper')) {
                        db.createObjectStore('wallpaper', { keyPath: 'id' });
                    }
                    if (!db.objectStoreNames.contains('appletData')) {
                        db.createObjectStore('appletData', { keyPath: 'id' });
                    }
                    if (!db.objectStoreNames.contains('setupData')) {
                        db.createObjectStore('setupData', { keyPath: 'id' });
                    }
                    if (!db.objectStoreNames.contains('wK_temp')) {
                        db.createObjectStore('wK_temp', { keyPath: 'id' });
                    }
                    if (!db.objectStoreNames.contains('wK_user')) {
                        db.createObjectStore('wK_user', { keyPath: 'id' });
                    }

                    // Store the current database version in localStorage
                    localStorage.setItem('wK_db_version', dbVersion);
                };

                request.onsuccess = function(event) {
                    // Proceed with resolving the promise after successful database initialization
                    resolve();
                };
            }
        });
    }

    // Function to display startup animation or message
    function displayStartupAnimation() {
        const rstAppDiv = document.createElement('div');
        rstAppDiv.setAttribute('id', 'rstAppDiv');

        rstAppDiv.style.position = 'absolute';
        rstAppDiv.style.top = '0px';
        rstAppDiv.style.left = '50%';
        rstAppDiv.style.transform = 'translate(-50%)';
        rstAppDiv.style.width = '375px';
        rstAppDiv.style.height = '812px';
        rstAppDiv.style.backgroundColor = 'black';
        rstAppDiv.style.opacity = '0.9';
        rstAppDiv.style.borderStyle = 'ridge';
        rstAppDiv.style.borderRadius = '40px';
        rstAppDiv.style.zIndex = '999';
        rstAppDiv.style.display = 'flex';
        rstAppDiv.style.flexDirection = 'column';
        rstAppDiv.style.alignItems = 'center';
        rstAppDiv.style.justifyContent = 'center';

        const startupImage = new Image();
        startupImage.src = './applets/wK_rst/wK_logo.png';
        startupImage.style.width = '180px';
        startupImage.style.height = '180px';
        startupImage.style.objectFit = 'cover';
        startupImage.style.opacity = '0'; // Set initial opacity to 0

        // Apply fade-in animation directly within the script
        startupImage.style.transition = 'opacity 1s ease-in-out';
        startupImage.onload = function() {
            startupImage.style.opacity = '1'; // Set opacity to 1 once image is loaded
        };

        rstAppDiv.appendChild(startupImage);

        document.getElementById('screen').appendChild(rstAppDiv);

        // Check for unsupported browsers
        if (isUnsupportedBrowser()) {
            const unsupportedMessage = 'Browser unsupported.';
            wkDialog(unsupportedMessage, 'alert');
        } else {
            // Browser is supported, remove the applet after 2 seconds
            setTimeout(() => {
                rstAppDiv.remove();
            }, 2000);
        }
    }

    function isUnsupportedBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        const unsupportedBrowsers = ['msie', 'trident', 'opera', 'unknown'];
        return unsupportedBrowsers.some(browser => userAgent.includes(browser));
    }

    // Call the function to display the startup animation or message
    displayStartupAnimation();
}
