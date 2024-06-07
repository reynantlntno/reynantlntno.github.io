export default function SettingsAbout(contentDiv) {
    // Create header title "Settings > About"
    const headerTitle = document.createElement('h3');
    headerTitle.textContent = 'Settings > About';
    headerTitle.style.color = 'white';
    headerTitle.style.fontSize = '20px'; /* Adjust font size */
    headerTitle.style.marginBottom = '10px';
    headerTitle.style.paddingLeft = '20px';

    // Append header title to the content div
    contentDiv.appendChild(headerTitle);

    // Create container for displaying information
    const infoContainer = document.createElement('div');
    infoContainer.style.paddingLeft = '20px'; /* Add left padding */
    infoContainer.style.color = 'white';

    // Fetch and display information from info.txt
    fetchInfo('./api/info.txt')
        .then(data => {
            // Split data into lines
            const lines = data.split('\n');

            // Process each line and format accordingly
            lines.forEach(line => {
                const formattedLine = formatLine(line);
                const lineElement = document.createElement('p');
                lineElement.innerHTML = formattedLine;
                infoContainer.appendChild(lineElement);
            });

            // Display browser information
            displayBrowserInfo(infoContainer);
        })
        .catch(error => {
            console.error('Error fetching info:', error);
        });

    // Append info container to the content div
    contentDiv.appendChild(infoContainer);
}

// Function to fetch content from info.txt
async function fetchInfo(filePath) {
    const response = await fetch(filePath);
    const data = await response.text();
    return data;
}

// Function to format a line based on markers for styles
function formatLine(line) {
    // Replace bold markers (**text**) with <strong> tags
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace italic markers (*text*) with <em> tags
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

    return line;
}

// Function to display browser information
function displayBrowserInfo(container) {
    const browserInfo = document.createElement('p');
    browserInfo.textContent = `Browser Info: ${navigator.userAgent}`;
    browserInfo.style.color = 'white';
    container.appendChild(browserInfo);
}
