/**
 * Adjust the size of the document text, to make the terminal full the screen.
 * @param {Element} elem the element of the terminal.
 * @param {number} maxLines The maximum number of lines the terminal should display.
 * @param {number} maxColumns The maximum number of columns the terminal should display.
 * @param {number} fontAspectRatio The aspect ratio of the font (height to width).
 */
export function adjustFontSize(elem, maxLines = 24, maxColumns = 80, fontAspectRatio = 2.5) {
    const fontSizeFromWidth = Math.floor((elem.clientHeight-32) / maxLines);
    const fontSizeFromHeight = Math.floor((elem.clientWidth) / (maxColumns / fontAspectRatio));
    const fontSize = Math.min(fontSizeFromWidth, fontSizeFromHeight);
    elem.style.fontSize = (fontSize * 0.90) + "px";
    document.body.style.fontSize = (fontSize * 0.90) + "px";
}