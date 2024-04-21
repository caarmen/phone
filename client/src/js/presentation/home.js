import { adjustFontSize } from "./fontsize.js";
import { toggleTheme } from "./toggletheme.js";
import { translateElement } from "../i18n/i18n.js";
import { getNowDateString } from "../domain/usecases/date.js";

/**
 * Presentation of the home screen of the application.
 * @returns {object} Functions for presenting the home screen.
 */
export function Home() {
    const start = document.getElementById("start");
    const join = document.getElementById("join");
    const terminal = document.getElementById("terminal");

    /**
     * Present the home screen for its initial state.
     */
    function init() {

        // Hide all our views
        start.style.display = "none";
        join.style.display = "none";
        terminal.style.display = "none";

        // Set up the click listener on the theme toggle.
        const toggleThemeButton = document.getElementById("toggle-theme");
        toggleThemeButton.onclick = () => {
            toggleTheme();
        };

        const openKeyboardButton = document.getElementById("open-keyboard");
        const hiddenInput = document.querySelector(".hidden-input");
        openKeyboardButton.onclick = () => {
            hiddenInput.focus();
        };

        // Set the current date display.
        const date = document.getElementById("date");
        date.innerText = getNowDateString();

        // Translate all text.
        const main = document.getElementById("main");
        translateElement(main);
    }

    /**
     * Present the home screen for the "start" state.
     *
     * This is the state when a user first accesses the application
     * without a room id. They are prompted to create a room.
     * @param {Function} formSubmitCallback will be invoked when the user submits the create room form.
     */
    function showStart(formSubmitCallback = () => { }) {
        start.style.display = "block";
        const createRoomForm = document.getElementById("form-create-room");
        createRoomForm.room_name.focus();
        join.style.display = "none";
        terminal.style.display = "none";
        createRoomForm.addEventListener("submit", function (event) {
            event.preventDefault();
            formSubmitCallback(createRoomForm.room_name.value, createRoomForm.participant_name.value);
        });
    }

    /**
     * Present the home screen for the "join" state.
     *
     * This is the state when a user accesses the application from a link
     * containing a room id.
     * @param {Function} formSubmitCallback will be invoked when the user submits the join room form.
     */
    function showJoin(formSubmitCallback = () => { }) {
        join.style.display = "block";
        const joinRoomForm = document.getElementById("form-join-room");
        joinRoomForm.participant_name.focus();
        start.style.display = "none";
        terminal.style.display = "none";
        joinRoomForm.addEventListener("submit", function (event) {
            event.preventDefault();
            formSubmitCallback(joinRoomForm.participant_name.value);
        });
    }

    /**
     * Present the home screen for the live chat state.
     * 
     * This is the state when a user is actively in a room.
     */
    function showTerminal() {
        terminal.style.display = "block";
        adjustFontSize();
        start.style.display = "none";
        join.style.display = "none";
        window.addEventListener("resize", () => adjustFontSize());
    }

    return {
        init,
        showStart,
        showJoin,
        showTerminal,
    };
}