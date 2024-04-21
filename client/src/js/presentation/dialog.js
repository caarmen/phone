/**
 * Display a dialog execute a callback when the dialog is dismissed.
 * @param {Element} dialogElement The top-level element of the dialog.
 * @param {string} message The text to display in the dialog.
 * @param {Function} dismissCallback A callback to be executed when the dialog is dismissed.
 */
export function showDialog(dialogElement, message, dismissCallback = null) {
    dialogElement.querySelector(".dialog__message").innerText = message;
    dialogElement.style.display = "flex";
    const dialogButton = dialogElement.querySelector(".dialog__button");
    dialogButton.onclick = () => {
        if (dismissCallback) dismissCallback();
        dialogElement.style.display = "none";
    };
}
