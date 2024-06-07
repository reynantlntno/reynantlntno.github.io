import wkDialog from '../wK_dialog/app_script.js'; // Import your wk_dialog module

export default function SettingsGeneral(contentDiv) {
    // Function to set wallpaper and save to localStorage
    function setWallpaper(imageUrl) {
        document.getElementById('wKframe').style.backgroundImage = `url('${imageUrl}')`;
        localStorage.setItem('customWallpaper', imageUrl);
    }

    // Function to restore the default wallpaper with confirmation using wkDialog
    function restoreDefaultWallpaper() {
        const defaultWallpaper = 'def.png'; // Set the default wallpaper URL here

        const confirmationMessage = `Are you sure you want to reset to the default wallpaper?`;
        wkDialog(confirmationMessage, 'confirm', async confirmed => {
            if (confirmed) {
                setWallpaper(defaultWallpaper);
                // Remove custom wallpaper from IndexedDB
                removeWallpaperFromDB();
            }
        });
    }

    // Function to remove wallpaper from IndexedDB
    function removeWallpaperFromDB() {
        const dbName = 'wKInternal';
        const dbVersion = 1;
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = (event) => {
            console.error('Failed to open IndexedDB:', event.target.error);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction('wallpapers', 'readwrite');
            const wallpaperStore = transaction.objectStore('wallpapers');

            // Clear all wallpaper entries
            wallpaperStore.clear();

            console.log('Custom wallpaper removed from IndexedDB.');
        };
    }

    // Function to clear localStorage with confirmation using wkDialog
    function clearLocalStorage() {
        const confirmationMessage = `Are you sure you want to clear local storage?`;
        wkDialog(confirmationMessage, 'confirm', async confirmed => {
            if (confirmed) {
                localStorage.clear(); // Clear all items from localStorage
            }
        });
    }

    // Function to delete all databases in IndexedDB with confirmation using wkDialog
    function deleteAllIndexedDB() {
        const confirmationMessage = `Are you sure you want to delete all databases in IndexedDB? This action cannot be undone.`;
        wkDialog(confirmationMessage, 'confirm', async confirmed => {
            if (confirmed) {
                const databases = await indexedDB.databases(); // Retrieve a list of all databases

                // Iterate through each database and delete it
                await Promise.all(databases.map(dbInfo => indexedDB.deleteDatabase(dbInfo.name)));

                // Display success message
                wkDialog('All IndexedDB databases have been deleted.', 'notification');
            }
        });
    }

    // Create header title "Settings"
    const headerTitle = document.createElement('h3');
    headerTitle.textContent = 'Settings > General';
    headerTitle.style.fontSize = '20px';
    headerTitle.style.color = 'white';
    headerTitle.style.marginBottom = '10px';
    headerTitle.style.paddingLeft = '20px';

    // Create General settings section
    const generalSettingsSection = document.createElement('div');
    generalSettingsSection.style.marginTop = '20px';

    const generalSettingsTitle = document.createElement('h4');
    generalSettingsTitle.textContent = 'Reset Options';
    generalSettingsTitle.style.color = 'white';
    generalSettingsTitle.style.fontSize = '18px';
    generalSettingsTitle.style.marginLeft = '20px';

    // Create buttons for General settings
    const resetWallpaperButton = document.createElement('button');
    resetWallpaperButton.textContent = 'Reset to Default Wallpaper';
    resetWallpaperButton.className = 'button';
    resetWallpaperButton.style.width = '300px';
    resetWallpaperButton.style.fontSize = '16px';
    resetWallpaperButton.style.marginLeft = '20px';
    resetWallpaperButton.style.textAlign = 'left';
    resetWallpaperButton.style.backgroundColor = 'darkgrey';
    resetWallpaperButton.style.color = 'white';
    resetWallpaperButton.addEventListener('click', () => {
        restoreDefaultWallpaper();
    });

    const clearStorageButton = document.createElement('button');
    clearStorageButton.textContent = 'Clear Local Storage';
    clearStorageButton.className = 'button';
    clearStorageButton.style.marginTop = '10px';
    clearStorageButton.style.marginLeft = '20px';
    clearStorageButton.style.width = '300px';
    clearStorageButton.style.backgroundColor = 'darkorange';
    clearStorageButton.style.color = 'white';
    clearStorageButton.style.fontSize = '16px';
    clearStorageButton.style.textAlign = 'left';
    clearStorageButton.addEventListener('click', () => {
        clearLocalStorage();
    });

    const deleteIndexedDBButton = document.createElement('button');
    deleteIndexedDBButton.textContent = 'Delete All IndexedDB Databases';
    deleteIndexedDBButton.className = 'button';
    deleteIndexedDBButton.style.marginTop = '10px';
    deleteIndexedDBButton.style.width = '300px';
    deleteIndexedDBButton.style.fontSize = '16px';
    deleteIndexedDBButton.style.marginLeft = '20px';
    deleteIndexedDBButton.style.backgroundColor = 'darkred';
    deleteIndexedDBButton.style.color = 'white';
    deleteIndexedDBButton.style.textAlign = 'left';
    deleteIndexedDBButton.addEventListener('click', () => {
        deleteAllIndexedDB();
    });

    // Append buttons to the General settings section
    generalSettingsSection.appendChild(generalSettingsTitle);
    generalSettingsSection.appendChild(resetWallpaperButton);
    generalSettingsSection.appendChild(clearStorageButton);
    generalSettingsSection.appendChild(deleteIndexedDBButton);

    // Append header title and General settings section to the content div
    contentDiv.appendChild(headerTitle);
    contentDiv.appendChild(generalSettingsSection);
}
