export default function SettingsAppearance(contentDiv) {
    let db; // Variable to hold the IndexedDB database instance

    // Function to initialize IndexedDB database
    function initializeDB() {
        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        if (!indexedDB) {
            console.error("IndexedDB is not supported in this browser.");
            return;
        }

        const dbName = 'wK_db';
        const dbVersion = 1;

        // Open or create the database
        const request = indexedDB.open(dbName, dbVersion);

        // Handle database upgrade or creation
        request.onupgradeneeded = function(event) {
            db = event.target.result;
            // Create object store for wallpaper if it doesn't exist
            if (!db.objectStoreNames.contains('wallpaper')) {
                db.createObjectStore('wallpaper', { keyPath: 'id', autoIncrement: true });
            }
        };

        // Handle successful database opening
        request.onsuccess = function(event) {
            db = event.target.result;
            // Load the saved wallpaper on database initialization
            loadSavedWallpaper();
        };

        // Handle database opening errors
        request.onerror = function(event) {
            console.error('Failed to open IndexedDB database:', event.target.errorCode);
        };
    }

    // Initialize the IndexedDB database
    initializeDB();

// Update the function to use auto-increment IDs instead of date timestamps 
function setWallpaper(imageUrl) { let id = 1;  
    // Start a transaction on the 'wallpaper' object store with readwrite access
    const transaction = db.transaction(['wallpaper'], 'readwrite');
    
    // Get the object store to perform operations on it
    const wallpaperStore = transaction.objectStore('wallpaper');
    
    // Clear the existing wallpaper record
    wallpaperStore.clear();
    
    // Add the new wallpaper record
    const wallpaperRecord = { id: id++, imageUrl, };  
    const request = wallpaperStore.add(wallpaperRecord);
    
    // Handle successful wallpaper storage
    request.onsuccess = function(event) {
        console.log('Wallpaper saved to IndexedDB with ID:', event.target.result);
        // Update the wallpaper preview after setting the new wallpaper
        wallpaperPreview.src = imageUrl;
    };
    
    // Handle errors during wallpaper storage
    request.onerror = function(event) {
        console.error('Error saving wallpaper to IndexedDB:', event.target.error);
    };
}


    // Retrieve saved wallpaper from IndexedDB or use default
    function loadSavedWallpaper() {
        const transaction = db.transaction(['wallpaper'], 'readonly');
        const wallpaperStore = transaction.objectStore('wallpaper');

        // Retrieve the latest wallpaper record (by auto-incrementing id)
        const request = wallpaperStore.openCursor(null, 'prev');

        request.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                // Found a wallpaper record, update preview
                wallpaperPreview.src = cursor.value.imageUrl;
            } else {
                // No wallpaper record found, use default
                wallpaperPreview.src = 'def.png';
            }
        };

        request.onerror = function(event) {
            console.error('Failed to load wallpaper from IndexedDB:', event.target.errorCode);
            wallpaperPreview.src = 'def.png'; // Fallback to default wallpaper
        };
    }

    // Create header title "Settings > Appearance"
    const headerTitle = document.createElement('h3');
    headerTitle.textContent = 'Settings > Appearance';
    headerTitle.style.fontSize = '20px'; // Adjust font size
    headerTitle.style.color = 'white';
    headerTitle.style.marginBottom = '10px';
    headerTitle.style.paddingLeft = '20px';

    // Append header title to the content div
    contentDiv.appendChild(headerTitle);

    // Create container for wallpaper preview
    const wallpaperPreviewContainer = document.createElement('div');
    wallpaperPreviewContainer.style.display = 'flex';
    wallpaperPreviewContainer.style.justifyContent = 'center';
    wallpaperPreviewContainer.style.alignItems = 'center';
    wallpaperPreviewContainer.style.width = '200px'; // Set container width
    wallpaperPreviewContainer.style.height = '356px'; // Set container height (9:16 ratio)
    wallpaperPreviewContainer.style.overflow = 'hidden';
    wallpaperPreviewContainer.style.margin = '0 auto'; // Center the container
    wallpaperPreviewContainer.style.marginTop = '20px';
    wallpaperPreviewContainer.style.borderRadius = '12px';

    // Create wallpaper preview image element
    const wallpaperPreview = document.createElement('img');
    wallpaperPreview.style.width = 'auto';
    wallpaperPreview.style.height = '100%';
    wallpaperPreview.style.objectFit = 'cover'; // Maintain aspect ratio and cover container

    // Append wallpaper preview image to the container
    wallpaperPreviewContainer.appendChild(wallpaperPreview);

    // Append wallpaper preview container to the content div
    contentDiv.appendChild(wallpaperPreviewContainer);

    // Create button to change wallpaper
    const changeWallpaperButton = document.createElement('button');
    changeWallpaperButton.textContent = 'Change Wallpaper';
    changeWallpaperButton.className = 'button';
    changeWallpaperButton.style.marginTop = '10px';
    changeWallpaperButton.style.width = '160px'; // Adjust button width
    changeWallpaperButton.style.fontSize = '16px'; // Adjust font size
    changeWallpaperButton.style.display = 'block';
    changeWallpaperButton.style.margin = '20px auto'; // Center the button

    // Event listener for change wallpaper button
    changeWallpaperButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg, image/png';

        fileInput.click();

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    setWallpaper(imageUrl);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Append change wallpaper button to the content div
    contentDiv.appendChild(changeWallpaperButton);

}
