import wkDialog from '../wK_dialog/app_script.js'; // Import wkDialog module
import { executeCommand } from './terminalCommands.js'; // Import executeCommand function

export default function TerminalApp() {
    const MAX_TABS = 4; // Maximum number of tabs allowed

    // Retrieve saved username from localStorage or set default
    const savedUsername = localStorage.getItem('username') || '';

    // Create a div element for the Terminal app
    const terminalAppDiv = document.createElement('div');
    terminalAppDiv.setAttribute('id', 'terminalAppDiv');

    // Apply CSS styles directly
    terminalAppDiv.style.position = 'absolute';
    terminalAppDiv.style.top = '0px'; /* Adjust top position */
    terminalAppDiv.style.left = '50%'; /* Center horizontally */
    terminalAppDiv.style.transform = 'translateX(-50%)'; /* Center horizontally */
    terminalAppDiv.style.width = '375px'; /* Match width */
    terminalAppDiv.style.height = '812px'; /* Match height */
    terminalAppDiv.style.backgroundColor = '#000'; /* Black background */
    terminalAppDiv.style.color = '#fff'; /* White text color */
    terminalAppDiv.style.borderStyle = 'ridge'; /* Add border style */
    terminalAppDiv.style.borderRadius = '40px'; /* Add border radius */
    terminalAppDiv.style.zIndex = '999'; /* Ensure the Terminal app appears above other content */
    terminalAppDiv.style.overflow = 'hidden'; /* Hide overflow content */

    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.style.display = 'flex';
    tabsContainer.style.height = '30px';
    tabsContainer.style.overflowX = 'auto';

    // Add button to create new tab if maximum tabs not reached
    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.style.marginRight = '10px';
    addButton.addEventListener('click', () => {
        if (tabs.length < MAX_TABS) {
            const newTab = createTerminalTab(savedUsername);
            tabsContainer.insertBefore(newTab.tabHeader, addButton);
            terminalAppDiv.appendChild(newTab.tabContent);
            selectTab(newTab.tabHeader); // Select the newly created tab
        } else {
            const message = `Maximum number of tabs (${MAX_TABS}) reached.`;
            wkDialog(message, 'alert');
        }
    });

    tabsContainer.appendChild(addButton);

    // Append tabs container to terminal app
    terminalAppDiv.appendChild(tabsContainer);

    // Append terminal app to the screen
    document.getElementById('screen').appendChild(terminalAppDiv);

    // Array to keep track of tab headers and contents
    const tabs = [];

    // Create a default tab and select it
    const defaultTab = createTerminalTab(savedUsername);
    tabsContainer.appendChild(defaultTab.tabHeader);
    terminalAppDiv.appendChild(defaultTab.tabContent);
    selectTab(defaultTab.tabHeader);

    // Function to create a new terminal tab
    function createTerminalTab(username) {
        const tabHeader = document.createElement('div');
        tabHeader.textContent = `${username} wK`;
        tabHeader.style.padding = '0 10px';
        tabHeader.style.cursor = 'pointer';
        tabHeader.style.borderBottom = '1px solid #fff';
        tabHeader.addEventListener('click', () => {
            // Select this tab
            selectTab(tabHeader);
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.marginLeft = '5px';
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent tab selection on close button click
            removeTab(tabHeader);
        });

        tabHeader.appendChild(closeButton);

        const tabContent = document.createElement('div');
        tabContent.style.padding = '10px';
        tabContent.style.height = 'calc(100% - 60px)';
        tabContent.style.overflowY = 'auto';
        tabContent.style.display = 'none'; // Hide tab content initially

        // Create terminal prompt
        const terminalPrompt = document.createElement('span');
        terminalPrompt.textContent = `(${username}) wK > `;
        terminalPrompt.style.fontWeight = 'bold';

        // Create terminal input
        const terminalInput = document.createElement('input');
        terminalInput.type = 'text';
        terminalInput.style.width = 'calc(100% - 100px)';
        terminalInput.style.padding = '5px';
        terminalInput.style.backgroundColor = '#000';
        terminalInput.style.color = '#fff';
        terminalInput.style.border = 'none';
        terminalInput.style.fontFamily = 'monospace';

        terminalInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const command = terminalInput.value.trim();
                const output = executeCommand(command, username, tabContent);
                
// Create a pre element to preserve line breaks
const outputPre = document.createElement('pre');
outputPre.textContent = output;

// Adjust CSS styling for the pre element
outputPre.style.marginTop = '5px'; // Add margin top
outputPre.style.marginBottom = '0'; // Remove margin bottom
outputPre.style.whiteSpace = 'pre-wrap'; // Preserve whitespace and wrap lines

// Append the pre element to the tab content
tabContent.appendChild(outputPre);

                
                terminalInput.value = ''; // Clear input after executing command
            }
        });
        
        // Append prompt and input to tab content
        tabContent.appendChild(terminalPrompt);
        tabContent.appendChild(terminalInput);

        // Add new tab to tabs array
        tabs.push({ tabHeader, tabContent });

        return { tabHeader, tabContent };
    }

    // Function to select a tab
    function selectTab(selectedTabHeader) {
        tabs.forEach(tab => {
            if (tab.tabHeader === selectedTabHeader) {
                tab.tabHeader.style.backgroundColor = '#333'; // Highlight selected tab
                tab.tabContent.style.display = 'block'; // Show tab content
            } else {
                tab.tabHeader.style.backgroundColor = 'transparent';
                tab.tabContent.style.display = 'none';
            }
        });
    }

    // Function to remove a tab
    function removeTab(tabHeaderToRemove) {
        const indexToRemove = tabs.findIndex(tab => tab.tabHeader === tabHeaderToRemove);
        if (indexToRemove !== -1) {
            tabsContainer.removeChild(tabHeaderToRemove); // Remove tab header from tabs container
            terminalAppDiv.removeChild(tabs[indexToRemove].tabContent); // Remove tab content from terminal app
            tabs.splice(indexToRemove, 1); // Remove tab from tabs array
            if (tabs.length > 0) {
                // Select the first tab if there are remaining tabs
                selectTab(tabs[0].tabHeader);
            }
        }
    }

}
