import wkDialog from '../wK_dialog/app_script.js'; // Import wkDialog module
export default function BrowserApp() {
    const MAX_TABS = 4; // Maximum number of tabs allowed

    // Create a div element for the Internet Browser app
    const browserAppDiv = document.createElement('div');
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

    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.style.display = 'flex';
    tabsContainer.style.height = '30px';
    tabsContainer.style.overflowX = 'auto';

    // Append tabs container to browser app
    browserAppDiv.appendChild(tabsContainer);

    // Array to keep track of tab headers and contents
    const tabs = [];
    let activeTabIndex = -1; // Initialize active tab index to -1 (no active tab initially)

    // Function to create a new browser tab
    function createBrowserTab(loadDefaultPage = true) {
        const tabHeader = document.createElement('div');
        tabHeader.textContent = 'New Tab';
        tabHeader.style.padding = '0 5px'; // Adjusted padding for better layout
        tabHeader.style.cursor = 'pointer';
        tabHeader.style.borderBottom = '1px solid #000';
        tabHeader.addEventListener('click', () => {
            // Select this tab
            selectTab(tabs.indexOf(tab));
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.marginLeft = '5px';
        closeButton.style.marginRight = '5px'; // Adjusted margin for better layout
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent tab selection on close button click
            removeTab(tabs.indexOf(tab));
        });

        tabHeader.appendChild(closeButton);

        const tabContent = document.createElement('iframe');
        tabContent.style.width = '100%';
        tabContent.style.height = 'calc(100% - 30px)';
        tabContent.style.border = 'none';

        // Load default webpage if specified
        if (loadDefaultPage) {
            tabContent.src = 'https://example.com';
        }

        // Add new tab to tabs array
        const tab = { tabHeader, tabContent };
        tabs.push(tab);

        return tab;
    }

    // Function to select a tab
    function selectTab(index) {
        if (index >= 0 && index < tabs.length) {
            activeTabIndex = index;
            tabs.forEach((tab, i) => {
                if (i === index) {
                    tab.tabHeader.style.backgroundColor = '#ccc'; // Highlight selected tab
                    tab.tabContent.style.display = 'block'; // Show tab content
                } else {
                    tab.tabHeader.style.backgroundColor = 'transparent';
                    tab.tabContent.style.display = 'none';
                }
            });
        }
    }

    // Function to remove a tab
    function removeTab(index) {
        if (index >= 0 && index < tabs.length) {
            tabsContainer.removeChild(tabs[index].tabHeader); // Remove tab header from tabs container
            browserAppDiv.removeChild(tabs[index].tabContent); // Remove tab content from browser app
            tabs.splice(index, 1); // Remove tab from tabs array
            if (index === activeTabIndex) {
                // If the removed tab was the active tab, select the next tab
                selectTab(Math.min(index, tabs.length - 1));
            }
        }
    }

    // Function to load URL in the active tab's iframe
    function loadURLInActiveTab(url) {
        console.log('URL to load:', url);
        console.log('Active tab index:', activeTabIndex);
        if (activeTabIndex >= 0) {
            tabs[activeTabIndex].tabContent.src = url;
        }
    }

    // Create link bar
    const linkBar = document.createElement('div');
    linkBar.style.height = '40px';
    linkBar.style.backgroundColor = '#f0f0f0';
    linkBar.style.display = 'flex';
    linkBar.style.alignItems = 'center';
    linkBar.style.padding = '0 10px';

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.style.flex = '1';
    urlInput.style.marginRight = '10px';
    urlInput.placeholder = 'Enter URL';
    urlInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // Load the URL in the currently active tab's iframe
            loadURLInActiveTab(urlInput.value.trim());
        }
    });

    const goButton = document.createElement('button');
    goButton.textContent = 'Go';
    goButton.addEventListener('click', () => {
        // Load the URL in the currently active tab's iframe
        loadURLInActiveTab(urlInput.value.trim());
    });

    linkBar.appendChild(urlInput);
    linkBar.appendChild(goButton);

    // Add button to create new tab if maximum tabs not reached
    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.style.marginRight = '10px';
    addButton.addEventListener('click', () => {
        if (tabs.length < MAX_TABS) {
            const newTab = createBrowserTab(false); // Don't load default page for new tabs
            tabsContainer.appendChild(newTab.tabHeader);
            browserAppDiv.appendChild(newTab.tabContent);
            selectTab(tabs.length - 1); // Select the newly created tab
        } else {
            const message = `Maximum number of tabs (${MAX_TABS}) reached.`;
            wkDialog(message, 'alert');
        }
    });

    linkBar.appendChild(addButton);

    // Append link bar to browser app
    browserAppDiv.appendChild(linkBar);

    // Create initial tab with default page
    const initialTab = createBrowserTab();
    tabsContainer.appendChild(initialTab.tabHeader);
    browserAppDiv.appendChild(initialTab.tabContent);

    // Select the initial tab
    selectTab(0);

    // Append browser app to the screen
    document.getElementById('screen').appendChild(browserAppDiv);
}
