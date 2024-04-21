/**
 * Adjust the size of the document text, to make the terminal full the screen.
 * @param {number} maxLines The maximum number of lines the terminal should display.
 * @param {number} maxColumns The maximum number of columns the terminal should display.
 */
export function adjustFontSize(maxLines = 24, maxColumns = 80) {
    const terminalFrame = document.querySelector(".terminal__frame");
    if (!terminalFrame.innerText) {
        let frameText = "";
        for (let i=0; i < maxColumns - 1; i++) {
            frameText += "X";
        }
        frameText += "0\n";
        for (let i=0; i < maxLines - 2; i++) {
            frameText += "X\n";
        }
        frameText += "0";
        terminalFrame.innerText = frameText;
    }
    const oldFontSize = parseFloat(window.getComputedStyle(terminalFrame).fontSize);

    const widthMultiplier = window.innerWidth / terminalFrame.clientWidth;
    const heightMultiplier = window.innerHeight / terminalFrame.clientHeight;
    const multiplier = Math.min(widthMultiplier, heightMultiplier);

    const newFontSize = oldFontSize * multiplier;
    document.body.style.fontSize = newFontSize + "px";
}