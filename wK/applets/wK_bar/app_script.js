export default function InfoBarApp() {
    // Retrieve saved username from localStorage or set default
    const savedUsername = localStorage.getItem('username') || '';

    // Create a div element for the InfoBar applet
    const infobarAppDiv = document.createElement('div');
    infobarAppDiv.setAttribute('id', 'infobarAppDiv');

    // Apply CSS styles directly
    infobarAppDiv.style.position = 'absolute';
    infobarAppDiv.style.top = '20px'; /* Adjust top position */
    infobarAppDiv.style.left = '50%'; /* Adjust left position to center horizontally */
    infobarAppDiv.style.transform = 'translateX(-50%)'; /* Center horizontally */
    infobarAppDiv.style.width = '308px'; /* Set width */
    infobarAppDiv.style.backgroundColor = 'none'; /* White background */
    infobarAppDiv.style.opacity = '0.6';
    infobarAppDiv.style.borderRadius = '6px'; /* Add border radius */
    infobarAppDiv.style.zIndex = '999'; /* Ensure it appears above other content */
    infobarAppDiv.style.padding = '10px'; /* Add padding */
    infobarAppDiv.style.display = 'flex';
    infobarAppDiv.style.justifyContent = 'space-between';
    infobarAppDiv.style.alignItems = 'center';

    // Create a span element for displaying username and date/time
    const userInfoSpan = document.createElement('span');
    userInfoSpan.style.fontSize = '14px';
    userInfoSpan.style.color = 'white';

    // Update user info and date/time every second
    setInterval(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString();
        userInfoSpan.textContent = `Welcome, ${savedUsername} | ${formattedDate}`;
    }, 1000);

    // Append userInfoSpan to infobarAppDiv
    infobarAppDiv.appendChild(userInfoSpan);

    // Append infobarAppDiv to the screen
    document.getElementById('screen').appendChild(infobarAppDiv);
}
