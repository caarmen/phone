export const KEYCODE_BACKSPACE = 8;
export const KEYCODE_ENTER = 13;
export const KEYCODE_META = 91;
const MAX_CHARS_PER_LINE = 80;
const MAX_LINES_PER_SCREEN = 24;
export const TEXT_NEWLINE = "\r\n";

/**
 * Process the given input.
 *
 * @param {String} inputText text before input was received
 * @param {Integer} keyCode received input keyCode
 * @param {String} key received input key
 * @param {Integer} maxLines  max number of lines allowed per text
 * @returns {String} modified text
 */
export function processInput(inputText, keyCode, key = '', maxLines = 6) {
    if (keyCode === KEYCODE_BACKSPACE) {
        if (inputText.endsWith(TEXT_NEWLINE)) {
            return inputText.slice(0, -2);
        }
        if (inputText.length > 0) {
            return inputText.slice(0, -1);
        }
        return inputText;
    }
    if (keyCode === KEYCODE_ENTER) {
        return trimLeadingLines(inputText + TEXT_NEWLINE, maxLines);
    }
    if (key.length !== 1) {
        return inputText; // Ignored
    }
    let text = inputText;
    const lastLine = text.split(TEXT_NEWLINE).pop();
    if (lastLine.length >= MAX_CHARS_PER_LINE) {
        text = wrapLastWord(text);
        text = trimLeadingLines(text, maxLines);
    }
    return text + key;
}

/**
 * Remove leading lines of the given text if the text content exceeds maxLines.
 *
 * @param {String} inputText input text
 * @param {Integer} maxLines  max number of lines allowed per text
 * @returns {String} modified text
 */
export function trimLeadingLines(inputText, maxLines) {
    const text = inputText + " "; // add an extra space to make sure we have a token if the last line is a newline without text yet
    const lines = text.split(TEXT_NEWLINE);
    const trimmedLines = lines.length > maxLines ? lines.slice(-maxLines) : lines;
    return (trimmedLines.join(TEXT_NEWLINE)).slice(0, -1);
}


/**
 * Puts the last word of the last line on a newline, unless there are no spaces preceding this last word.
 * 
 * @param {String} inputText input text
 * @returns {String} modified text
 */
function wrapLastWord(inputText) {
    let indexOfLastSpace = -1;
    for (let i = inputText.length; i >= 0; i--) {
        if (inputText[i] === "\n" || inputText[i] === "\r") {
            return inputText;
        }
        if (inputText[i] === " ") {
            indexOfLastSpace = i;
            break;
        }
    }
    if (indexOfLastSpace >= 0) {
        return inputText.substring(0, indexOfLastSpace) + TEXT_NEWLINE + inputText.substring(indexOfLastSpace + 1);
    }
    return inputText + TEXT_NEWLINE;
}

export function getTextLinesPerParticipant(pariticpantCount) {
    const unavailableFixedLines = 4; // header
    const unavailableLinesPerParticipant = 2; // divider + name
    return Math.floor((MAX_LINES_PER_SCREEN - unavailableFixedLines - pariticpantCount * unavailableLinesPerParticipant) / pariticpantCount);
}