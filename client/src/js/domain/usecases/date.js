/**
 * Format the given date in a YY-MMM-YYYY format.
 * @param {Date} date the date to format.
 * @returns {string} the formatted date.
 */
export function getDateString(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const monthAbbrev = date.toLocaleString("en-US", { month: "long" }).slice(0, 3).toUpperCase();
    const year = date.getFullYear();
    return `${day}-${monthAbbrev}-${year}`;
}

/**
 * Format today's date in a YY-MMM-YYYY format.
 * @returns {string} the formatted date.
 */
export function getNowDateString() {
    return getDateString(new Date());
}