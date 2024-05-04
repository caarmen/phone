import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import { SentTypedEvent } from "../domain/entities/typedevent.js";

/**
 * Subscribe to SentTypedEvents sent from the soft keyboard.
 * @param {Function} sendTypedEventListener callback which will receive SentTypedEvents
 */
export function subscribeSoftKeyboard(sendTypedEventListener) {

    let keyboard = null;

    /**
     * Show or hide the soft keyboard.
     */
    function toggleSoftKeyboard() {
        if (keyboard) {
            keyboard.destroy();
            keyboard = null;
        } else {
            keyboard = new Keyboard({
                onKeyPress: button => onKeyPress(button),
                theme: "hg-theme-default hg-theme-terminal",
                // Theme based on iOS demo theme:
                // https://hodgef.com/simple-keyboard/editor/?d=hodgef/simple-keyboard-npm-demos/tree/ios-theme
                layout: {
                    default: [
                        "q w e r t y u i o p {bksp}",
                        "a s d f g h j k l {enter}",
                        "{shift} z x c v b n m , . {shift}",
                        "{alt} {space} {alt}"
                    ],
                    shift: [
                        "Q W E R T Y U I O P {bksp}",
                        "A S D F G H J K L {enter}",
                        "{shift} Z X C V B N M , . {shift}",
                        "{alt} {space} {alt}"
                    ],
                    alt: [
                        "1 2 3 4 5 6 7 8 9 0 {bksp}",
                        "@ # $ & * ( ) ' \" {enter}",
                        "{shift} % - + = / ; : ! ? {shift}",
                        "{default} {space} {default}"
                    ],
                },
                display: {
                    "{alt}": ".?123",
                    "{shift}": "Shift",
                    "{enter}": "Return",
                    "{bksp}": "⌫",
                    "{space}": " ",
                    "{default}": "ABC",
                    "{back}": "⇦"
                }
            });
        }
    }

    document.getElementById("open-keyboard").onclick = toggleSoftKeyboard;

    /**
     * @param {string} button the key which was pressed
     */
    function onKeyPress(button) {
        const newLayoutName = getNewLayoutName(button);
        if (newLayoutName) {
            keyboard.setOptions({ layoutName: newLayoutName });
            return;
        }

        // Disable shift after a character is pressed.
        if (keyboard.options.layoutName === "shift") {
            keyboard.setOptions({
                layoutName: "default",
            });
        }

        sendTypedEventListener(new SentTypedEvent(
            getKey(button),
            false,
        ));
    }

    /**
     * Get the name of the new keyboard layout to show, based on the keyboard button pressed.
     * @param {string} softKeyboardButton the soft keyboard button which was pressed
     * @returns {string} the name of the new keyboard layout, or null if the layout shouldn't change;
     */
    function getNewLayoutName(softKeyboardButton) {
        switch (softKeyboardButton) {
        case "{shift}":
            return keyboard.options.layoutName === "default" ? "shift" : "default";
        case "{alt}":
            return "alt";
        case "{default}":
            return "default";
        default:
            return null;
        }
    }

    /**
     * Get the typed key for the soft keyboard button which was pressed.
     * @param {string} softKeyboardButton the soft keyboard button which was pressed
     * @returns {string} the typed key for the soft keyboard button
     */
    function getKey(softKeyboardButton) {
        switch (softKeyboardButton) {
        case "{bksp}":
            return "Backspace";
        case "{enter}":
            return "Enter";
        case "{space}":
            return " ";
        default:
            return softKeyboardButton;
        }
    }
}