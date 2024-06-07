export default function BrowserCheck() {
    // Detect browser information
    const userAgent = navigator.userAgent;
    const isWebKit = 'WebkitAppearance' in document.documentElement.style;
    const isSafari = /Version\/[\d.]+.*Safari/.test(userAgent);
    const browserVersion = getBrowserVersion(userAgent);
    const browserName = getBrowserName(userAgent);
    const browserEngine = isWebKit ? 'WebKit' : 'Non-WebKit';
    const platform = navigator.platform;
    const isMobile = /(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i.test(userAgent);
    const compatibilityDetails = getCompatibilityDetails(isWebKit, isSafari, browserVersion, isMobile);

    // Create a div element for the Browser Check app
    const browserCheckAppDiv = document.createElement('div');
    browserCheckAppDiv.setAttribute('id', 'browserCheckAppDiv');

    // Apply CSS styles directly
    browserCheckAppDiv.style.position = 'absolute';
    browserCheckAppDiv.style.top = '50px'; /* Adjust top position to match #wKframe */
    browserCheckAppDiv.style.left = '50%'; /* Adjust left position to center horizontally */
    browserCheckAppDiv.style.transform = 'translate(-50%)'; /* Center horizontally and vertically */
    browserCheckAppDiv.style.width = '375px'; /* Match width of #wKframe */
    browserCheckAppDiv.style.height = '812px'; /* Match height of #wKframe */
    browserCheckAppDiv.style.backgroundColor = 'black'; /* Black background */
    browserCheckAppDiv.style.color = '#fff'; /* White text color */
    browserCheckAppDiv.style.borderStyle = 'ridge'; /* Add border style */
    browserCheckAppDiv.style.borderRadius = '40px'; /* Add border radius */
    browserCheckAppDiv.style.zIndex = '999'; /* Ensure the Browser Check app appears above other content */
    browserCheckAppDiv.style.display = 'flex';
    browserCheckAppDiv.style.flexDirection = 'column';
    browserCheckAppDiv.style.alignItems = 'center';
    browserCheckAppDiv.style.justifyContent = 'center';

    // Create a div element for the content
    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('id', 'browserCheckContent');

    // Apply CSS styles directly
    contentDiv.style.display = 'flex';
    contentDiv.style.flexDirection = 'column';
    contentDiv.style.alignItems = 'center';
    contentDiv.style.justifyContent = 'center';
    contentDiv.style.height = '100%';
    contentDiv.style.padding = '0px 50px 50px 50px';

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
                browserCheckAppDiv.appendChild(dragButton);
        
                let offsetX, offsetY, isDragging = false;
        
                // Event listeners for drag functionality
                dragButton.addEventListener('mousedown', function(e) {
                    isDragging = true;
                    offsetX = e.clientX - browserCheckAppDiv.getBoundingClientRect().left;
                    offsetY = e.clientY - browserCheckAppDiv.getBoundingClientRect().top;
                });
        
                document.addEventListener('mousemove', function(e) {
                    if (isDragging) {
                        const x = e.clientX - offsetX;
                        const y = e.clientY - offsetY;
                        browserCheckAppDiv.style.left = x + 'px';
                        browserCheckAppDiv.style.top = y + 'px';
                    }
                });
        
                document.addEventListener('mouseup', function() {
                    isDragging = false;
                });
            }

    // Create paragraphs to display browser information
    const browserInfoParagraphs = [
        `Browser Name: ${browserName}`,
        `Browser Version: ${browserVersion}`,
        `Browser Engine: ${browserEngine}`,
        `Platform: ${platform}`,
        `Compatibility: ${compatibilityDetails}`
    ];

    // Append browser information paragraphs to the content
    browserInfoParagraphs.forEach(info => {
        const infoParagraph = document.createElement('p');
        infoParagraph.textContent = info;
        infoParagraph.style.fontSize = '18px';
        contentDiv.appendChild(infoParagraph);
    });

    // Create a button element for the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', function() {
        // Remove the Browser Check app when the close button is clicked
        browserCheckAppDiv.remove();
    });

    // Apply CSS styles directly
    closeButton.style.marginTop = '20px';

    // Append the close button to the content
    contentDiv.appendChild(closeButton);

    // Append the content to the Browser Check app
    browserCheckAppDiv.appendChild(contentDiv);

    // Append the Browser Check app to the screen
    document.body.appendChild(browserCheckAppDiv);
}

// Function to extract browser version from user agent string
function getBrowserVersion(userAgent) {
    const match = userAgent.match(/(?:Edge\/|Chrome\/|Firefox\/|Safari\/)(\d+\.\d+)/);
    return match ? match[1] : 'Unknown';
}

// Function to extract browser name from user agent string
function getBrowserName(userAgent) {
    if (userAgent.includes('Chrome')) {
        return 'Google Chrome';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        return 'Safari';
    } else if (userAgent.includes('Firefox')) {
        return 'Mozilla Firefox';
    } else if (userAgent.includes('Edge')) {
        return 'Microsoft Edge';
    } else {
        return 'Unknown Browser';
    }
}

// Function to determine compatibility details based on browser type and mobile detection
function getCompatibilityDetails(isWebKit, isSafari, browserVersion, isMobile) {
    if (isMobile) {
        return 'Partial Compatibility (Mobile Device)';
    }

    if (isWebKit) {
        if (isSafari) {
            return 'Full Compatibility (Safari)';
        } else {
            return 'Partial Compatibility';
        }
    } else {
        if (parseFloat(browserVersion) >= 70) {
            return 'Full Compatibility';
        } else if (parseFloat(browserVersion) >= 60) {
            return 'Partial Compatibility';
        } else {
            return 'Incompatible';
        }
    }
}
