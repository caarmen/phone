import { adjustFontSize } from "./fontsize.js";
import { toggleTheme } from "./toggletheme.js";
import { translateElement } from "../i18n/i18n.js";
import { getNowDateString } from "../domain/usecases/date.js";

export function Home() {
    const start = document.getElementById("start");
    const join = document.getElementById("join");
    const terminal = document.getElementById("terminal");

    function init() {

        start.style.display = "none";
        join.style.display = "none";
        terminal.style.display = "none";

        const toggleThemeButton = document.getElementById("toggle-theme");
        toggleThemeButton.onclick = () => {
            toggleTheme();
        };

        const date = document.getElementById("date");
        date.innerText = getNowDateString();

        const main = document.getElementById("main");
        translateElement(main);
    }

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

    function showTerminal() {
        terminal.style.display = "block";
        adjustFontSize(terminal);
        start.style.display = "none";
        join.style.display = "none";
        window.addEventListener("resize", () => adjustFontSize(terminal));
    }

    return {
        init,
        showStart,
        showJoin,
        showTerminal,
    };
}