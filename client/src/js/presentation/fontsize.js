export function adjustFontSize(elem, maxLines = 24) {
    const fontSize = Math.floor((elem.clientHeight-32) / maxLines);
    elem.style.fontSize = (fontSize * 0.90) + "px";
    document.body.style.fontSize = (fontSize * 0.90) + "px";
}