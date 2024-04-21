/**
 * Adjust the size of the document text, to make the terminal full the screen.
 * @param {Element} elem the element of the terminal.
 * @param {number} maxLines The maximum number of lines the terminal should display.
 */
export function adjustFontSize(elem, maxLines = 24) {
    const fontSize = Math.floor((elem.clientHeight-32) / maxLines);
    elem.style.fontSize = (fontSize * 0.90) + "px";
    document.body.style.fontSize = (fontSize * 0.90) + "px";
}