export const KEY_BACKSPACE = "Backspace";
export const KEY_ENTER = "Enter";
const MAX_CHARS_PER_LINE = 80;
const MAX_LINES_PER_SCREEN = 24;
export const TEXT_NEWLINE = "\r\n";

/**
 * Process the given input.
 * @param {string} inputText text before input was received
 * @param {string} key received input key
 * @param {number} maxLines  max number of lines allowed per text
 * @returns {string} modified text
 */
export function processInput(inputText, key = "", maxLines = 6) {
    if (key === KEY_BACKSPACE) {
        if (inputText.endsWith(TEXT_NEWLINE)) {
            return inputText.slice(0, -2);
        }
        if (inputText.length > 0) {
            return inputText.slice(0, -1);
        }
        return inputText;
    }
    if (key === KEY_ENTER) {
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
 * @param {string} inputText input text
 * @param {number} maxLines  max number of lines allowed per text
 * @returns {string} modified text
 */
export function trimLeadingLines(inputText, maxLines) {
    const text = inputText + " "; // add an extra space to make sure we have a token if the last line is a newline without text yet
    const lines = text.split(TEXT_NEWLINE);
    const trimmedLines = lines.length > maxLines ? lines.slice(-maxLines) : lines;
    return (trimmedLines.join(TEXT_NEWLINE)).slice(0, -1);
}


/**
 * Puts the last word of the last line on a newline, unless there are no spaces preceding this last word.
 * @param {string} inputText input text
 * @returns {string} modified text
 */
function wrapLastWord(inputText) {
    let indexOfLastSpace = -1;
    for (let i = inputText.length; i >= 0; i--) {
        if (inputText[i] === "\n" || inputText[i] === "\r") {
            // Got to the beginning of this line without finding a space
            if (inputText.length - i >= MAX_CHARS_PER_LINE) {
                // The last line in the text fills the whole line
                return inputText + TEXT_NEWLINE;
            }
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

/**
 * Get the number of lines of text each participant in a room can have.
 * @param {number} participantCount the number of participants in a room.
 * @returns {number} the number of lines for each participant in a room.
 */
export function getTextLinesPerParticipant(participantCount) {
    const unavailableFixedLines = 4; // header
    const unavailableLinesPerParticipant = 2; // divider + name
    return Math.floor((MAX_LINES_PER_SCREEN - unavailableFixedLines - participantCount * unavailableLinesPerParticipant) / participantCount);
}