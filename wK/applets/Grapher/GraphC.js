// GraphC.js

export function plotCartesianPlane(context, xValues = [], yValues = [], zoomLevel = 1) {
    // Set canvas size
    const canvas = context.canvas;
    const canvasSize = Math.min(375, grapherAppDiv.offsetWidth); // Limit canvas size to 375px width or grapherAppDiv width, whichever is smaller
    const canvasHeight = canvasSize * 1.2; // Adjust canvas height multiplier as needed
    canvas.width = canvasSize;
    canvas.height = canvasHeight;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom
    context.scale(zoomLevel, zoomLevel);

    // Draw x-axis grid lines
    context.strokeStyle = '#ddd'; // Light gray color
    context.beginPath();
    const stepX = 20; // Adjust as needed for grid spacing
    for (let x = stepX; x < canvas.width / zoomLevel; x += stepX) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height / zoomLevel);
    }
    context.stroke();

    // Draw y-axis grid lines
    context.beginPath();
    const stepY = 20; // Adjust as needed for grid spacing
    for (let y = stepY; y < canvas.height / zoomLevel; y += stepY) {
        context.moveTo(0, y);
        context.lineTo(canvas.width / zoomLevel, y);
    }
    context.stroke();

    // Draw x-axis
    context.strokeStyle = '#000'; // Black color
    context.beginPath();
    context.moveTo(0, canvas.height / 2 / zoomLevel);
    context.lineTo(canvas.width / zoomLevel, canvas.height / 2 / zoomLevel);
    context.stroke();

    // Draw y-axis
    context.beginPath();
    context.moveTo(canvas.width / 2 / zoomLevel, 0);
    context.lineTo(canvas.width / 2 / zoomLevel, canvas.height / zoomLevel);
    context.stroke();

    // Draw x-axis arrow
    context.beginPath();
    context.moveTo(canvas.width / zoomLevel - 10, canvas.height / 2 / zoomLevel - 5);
    context.lineTo(canvas.width / zoomLevel, canvas.height / 2 / zoomLevel);
    context.lineTo(canvas.width / zoomLevel - 10, canvas.height / 2 / zoomLevel + 5);
    context.stroke();

    // Draw y-axis arrow
    context.beginPath();
    context.moveTo(canvas.width / 2 / zoomLevel - 5, 10);
    context.lineTo(canvas.width / 2 / zoomLevel, 0);
    context.lineTo(canvas.width / 2 / zoomLevel + 5, 10);
    context.stroke();

    // Plot points if provided
    if (xValues.length > 0 && yValues.length > 0 && xValues.length === yValues.length) {
        context.fillStyle = 'red';
        const scale = 20; // Adjust scale as needed
        for (let i = 0; i < xValues.length; i++) {
            const x = canvas.width / 2 / zoomLevel + xValues[i] * scale;
            const y = canvas.height / 2 / zoomLevel - yValues[i] * scale;
            context.beginPath();
            context.arc(x, y, 4, 0, Math.PI * 2);
            context.fill();
        }

        // Draw line connecting input points
        context.strokeStyle = 'blue'; // Blue color for the line
        context.lineWidth = 2; // Adjust line width as needed
        context.beginPath();
        for (let i = 0; i < xValues.length - 1; i++) {
            const x1 = canvas.width / 2 / zoomLevel + xValues[i] * scale;
            const y1 = canvas.height / 2 / zoomLevel - yValues[i] * scale;
            const x2 = canvas.width / 2 / zoomLevel + xValues[i + 1] * scale;
            const y2 = canvas.height / 2 / zoomLevel - yValues[i + 1] * scale;
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
        }
        context.stroke();
    }
}
