export default function CameraApp() {
    // Create a div element for the Camera app
    const cameraAppDiv = document.createElement('div');
    cameraAppDiv.setAttribute('id', 'cameraAppDiv');

    // Apply CSS styles directly to position and style the camera app container
    cameraAppDiv.style.position = 'absolute';
    cameraAppDiv.style.top = '50px'; /* Adjust top position */
    cameraAppDiv.style.left = '50%'; /* Adjust left position */
    cameraAppDiv.style.transform = 'translateX(-50%)'; /* Center horizontally */
    cameraAppDiv.style.width = '375px'; /* Match width */
    cameraAppDiv.style.height = '812px'; /* Match height */
    cameraAppDiv.style.backgroundColor = 'black'; /* Black background */
    cameraAppDiv.style.borderStyle = 'ridge'; /* Add border style */
    cameraAppDiv.style.borderRadius = '40px'; /* Add border radius */
    cameraAppDiv.style.zIndex = '999'; /* Ensure the app appears above other content */
    cameraAppDiv.style.display = 'flex';
    cameraAppDiv.style.flexDirection = 'column';

    // Create a video element for displaying camera feed
    const videoElement = document.createElement('video');
    videoElement.setAttribute('id', 'cameraVideo');
    videoElement.style.display = 'none'; // Hide the original video element
    videoElement.style.height = '0';
    videoElement.style.width = '0';
    
    let stream;

    // Check for browser support of getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Access camera stream and attach to video element
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((mediaStream) => {
                stream = mediaStream;
                videoElement.srcObject = stream;
                videoElement.play(); // Start playing camera feed
                // Call the render function to continuously render video frames with selected filter
                render();
            })
            .catch((error) => {
                console.error('Error accessing camera:', error);
                displayErrorMessage(); // Display error message if access is denied or not supported
            });
    } else {
        console.error('getUserMedia is not supported');
        displayErrorMessage(); // Display error message if getUserMedia is not supported
    }

    // Function to display error message in case of camera access issues
    function displayErrorMessage() {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Failed to access camera. Please check camera permissions.';
        errorMessage.style.color = 'white';
        errorMessage.style.textAlign = 'center';
        errorMessage.style.marginTop = '350px';
        cameraAppDiv.appendChild(errorMessage);
    }

    // Function to apply selected filter to the video frame
    function applyFilter(context, videoElement, filter) {
        // Draw the video frame onto the canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Get the image data from the canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply the selected filter
        switch (filter) {
            case 'grayscale':
                // Apply grayscale filter by averaging RGB values
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg; // Red channel
                    data[i + 1] = avg; // Green channel
                    data[i + 2] = avg; // Blue channel
                }
                case 'sepia':
                    // Apply sepia filter by transforming RGB values
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189)); // Red channel
                        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // Green channel
                        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // Blue channel
                    }
                    break;
                case 'invert':
                    // Apply invert filter by subtracting RGB values from 255
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = 255 - data[i]; // Red channel
                        data[i + 1] = 255 - data[i + 1]; // Green channel
                        data[i + 2] = 255 - data[i + 2]; // Blue channel
                    }
                    break;
            // Add more cases for other filters here
            default:
                break;
        }

        // Put the modified image data back onto the canvas
        context.putImageData(imageData, 0, 0);
    }

    // Function to continuously render video frames with selected filter
    function render() {
        requestAnimationFrame(render); // Request next frame

        // Get the selected filter
        const selectedFilter = document.getElementById('filterSelect').value;

        // Apply the selected filter to the video frame
        applyFilter(context, videoElement, selectedFilter);
    }

    // Create a canvas element for drawing filtered video frames
    const canvas = document.createElement('canvas');
    canvas.width = 375;
    canvas.height = 670;
    canvas.style.borderRadius = '40px';
    const context = canvas.getContext('2d');

    // Create a dropdown menu for selecting filters
    const filterSelect = document.createElement('select');
    filterSelect.setAttribute('id', 'filterSelect');
    filterSelect.style.margin = '10px auto';
    filterSelect.style.padding = '5px 10px';
    filterSelect.style.borderRadius = '5px';
    filterSelect.style.backgroundColor = '#f8f9fa';
    filterSelect.style.border = '1px solid #ced4da';
    filterSelect.style.color = '#495057';
    filterSelect.style.cursor = 'pointer';
    filterSelect.style.zIndex = '1000';

    // Add options for filters
    const filters = ['None', 'Grayscale', 'Sepia', 'Invert']; // Add more filter options here
    filters.forEach(filter => {
        const option = document.createElement('option');
        option.value = filter.toLowerCase();
        option.textContent = filter;
        filterSelect.appendChild(option);
    });

    // Create a button for capturing photos
    const captureButton = document.createElement('button');
    captureButton.innerHTML = '&#x1F4F7;'; // Camera emoji
    captureButton.style.marginTop = '20px';
    captureButton.style.padding = '10px';
    captureButton.style.fontSize = '34px';
    captureButton.style.backgroundColor = 'black';
    captureButton.style.border = 'none';
    captureButton.style.color = '#fff';
    captureButton.style.cursor = 'pointer';
    captureButton.style.zIndex = '1000';

    // Event listener for the capture button to take a photo
    captureButton.addEventListener('click', function() {
        if (stream) {
            const img = new Image();
            img.src = canvas.toDataURL('image/jpeg');
            img.onload = function() {
                const link = document.createElement('a');
                link.href = img.src;
                link.download = 'captured_photo.jpg';
                link.click(); // Simulate click to trigger download
            };
        }
    });

    // Append video element, capture button, canvas, and filter select to the camera app div
    cameraAppDiv.appendChild(videoElement);
    cameraAppDiv.appendChild(canvas);
    cameraAppDiv.appendChild(captureButton);
    cameraAppDiv.appendChild(filterSelect);

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
                cameraAppDiv.appendChild(dragButton);
        
                let offsetX, offsetY, isDragging = false;
        
                // Event listeners for drag functionality
                dragButton.addEventListener('mousedown', function(e) {
                    isDragging = true;
                    offsetX = e.clientX - cameraAppDiv.getBoundingClientRect().left;
                    offsetY = e.clientY - cameraAppDiv.getBoundingClientRect().top;
                });
        
                document.addEventListener('mousemove', function(e) {
                    if (isDragging) {
                        const x = e.clientX - offsetX;
                        const y = e.clientY - offsetY;
                        cameraAppDiv.style.left = x + 'px';
                        cameraAppDiv.style.top = y + 'px';
                    }
                });
        
                document.addEventListener('mouseup', function() {
                    isDragging = false;
                });
            }

    // Create a button for closing the Camera app
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Exit';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '8px';
    closeButton.style.backgroundColor = '#007bff';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '1000';

    // Event listener for the close button to stop camera stream and remove camera app
    closeButton.addEventListener('click', function() {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop()); // Stop all tracks of the stream
        }
        cameraAppDiv.remove(); // Remove the camera app div from the screen
    });

    // Append the close button to the camera app div
    cameraAppDiv.appendChild(closeButton);

    // Append the camera app to the screen
    document.body.appendChild(cameraAppDiv);
}
