export function showDialog(dialogElement, message, dismissCallback = null) {
    dialogElement.querySelector(".dialog__message").innerText = message;
    dialogElement.style.display = "flex";
    const dialogButton = dialogElement.querySelector(".dialog__button");
    dialogButton.onclick = () => {
        if (dismissCallback) dismissCallback();
        dialogElement.style.display = "none";
    };
}
