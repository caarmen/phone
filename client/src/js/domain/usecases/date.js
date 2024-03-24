export function getDateString(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const monthAbbrev = date.toLocaleString('en-US', { month: 'long' }).slice(0, 3).toUpperCase();
    const year = date.getFullYear();
    return `${day}-${monthAbbrev}-${year}`;
}

export function getNowDateString() {
    return getDateString(new Date());
}