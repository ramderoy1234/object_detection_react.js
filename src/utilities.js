export const drawRect = (detection, ctx) => {
  detection.forEach(prediction => {
    // Destructure the bounding box coordinates and dimensions
    const [x, y, width, height] = prediction['bbox'];
    const text = prediction['class'];
    
    // Get the confidence score and convert it to a percentage
    const confidence = (prediction['score'] * 100).toFixed(2); // Rounded to 2 decimal places

    // Set styling
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16); // Generate random color
    ctx.strokeStyle = color;
    ctx.font = '19px Arial';
    ctx.fillStyle = color;
    ctx.lineWidth = 4;

    // Draw rectangle and text
    ctx.beginPath();
    ctx.fillText(`${text} (${confidence}%)`, x, y > 10 ? y - 5 : 10); // Display the class and confidence percentage
    ctx.rect(x, y, width, height); 
    ctx.stroke(); // Draw the rectangle
  });
};



