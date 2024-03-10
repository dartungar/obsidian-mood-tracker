export function hexToRgba(hex: string, alpha = 1) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse the r, g, b values
    let r, g, b;
    if (hex.length === 3) {
        // If the hex code is shorthand (like #fff), multiply each value by 17 (0x11)
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else {
        throw new Error('Invalid hex color: ' + hex);
    }

    // Return the rgba() string with the provided alpha value
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}