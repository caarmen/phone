
import { translateText } from "./i18n/i18n.js";

import { showDialog } from "./presentation/dialog.js";
import { Home } from "./presentation/home.js";
import { Beep } from "./presentation/beep.js";
import { updateParticipantElements, receiveTypedEvent } from "./presentation/participants.js";

import { SentTypedEvent } from "./domain/entities/typedevent.js";

import { RoomEvents } from "./infrastructure/event/room.js";
import { roomService } from "./infrastructure/http/room.js";

/**
 * Entry point to the application.
 */
export function main() {
    const home = Home();
    home.init();

    const roomId = new URLSearchParams(window.location.search).get("room");
    const participantName = sessionStorage.getItem("participantName");

    // Case: we're in the room.
    if (roomId && participantName) {
        enterRoom(roomId, participantName);
        home.showTerminal();
    }
    // Case: we're joining a room.
    else if (roomId) {
        home.showJoin(async (participantName) => {
            sessionStorage.removeItem("participantName");
            await enterRoom(roomId, participantName);
            home.showTerminal();
        });
    }
    // Case: we're creating a room.
    else {
        home.showStart(async (roomName, participantName) => {
            const room = await roomService.createRoom(roomName);
            sessionStorage.setItem("participantName", participantName);
            document.location = `${process.env.VITE_FE_SERVER}?room=${room.id}`;
        });
    }
}

/**
 * Enter the given room.
 * @param {string} roomId the id of the room to enter.
 * @param {string} participantName our requested participant name.
 */
async function enterRoom(roomId, participantName) {
    const participants = document.getElementById("participants");
    const dialog = document.querySelector(".dialog__overlay");

    // Get the room details, showing a dialog if an error occurs.
    let room = null;
    try {
        room = await roomService.getRoom(roomId);
    } catch (error) {
        showDialog(dialog, translateText(error.errorMessageKey ?? "errorOops"), () => {
            document.location = process.env.VITE_FE_SERVER;
        });
        return;
    }

    const beep = Beep();
    const roomEvents = RoomEvents();

    // Subscribe to room events sent from the server.
    roomEvents.connect(
        roomId,
        participantName,
        {
            typedEventListener: (data) => {
                receiveTypedEvent(data, participants);
            },
            beepListener: () => {
                beep.play();
            },
            participantChangeListener: (data) => {
                updateParticipantElements(participants, room.name, data.participants);
            },
        }
    );

    const hiddenInput = document.querySelector(".hidden-input");
    // Subscribe to browser typed events, so we can send them to the server.
    const typedEventListener = (event) => {
        if (event.type === "keydown") {
            document.removeEventListener("textInput", typedEventListener, true);
        } else if (event.type === "textinput") {
            document.removeEventListener("keydown", typedEventListener, true);
        }
        console.log("typed event %o", event);
        const key = event.key ?? event.data;
        if (document.activeElement === hiddenInput && key.length === 1) {
            return;
        }
        roomEvents.sendTypedEvent(new SentTypedEvent(
            key,
            event.ctrlKey ?? false,
        ));
    };
    document.addEventListener("keydown", typedEventListener, true);
    document.addEventListener("textInput", typedEventListener, true);
    let hiddenInputSentCharsCount = 0;
    hiddenInput.addEventListener("input", (event) =>{
        console.log("input event %o", event);
        const text = event.target.value;
        if (event.inputType === "insertReplacementText") {
            for (let i = 0; i < hiddenInputSentCharsCount; i++) {
                roomEvents.sendTypedEvent(new SentTypedEvent(
                    "Backspace",
                    event.ctrlKey ?? false,
                ));
            }
            for (let i = 0; i < text.length; i++) {
                roomEvents.sendTypedEvent(new SentTypedEvent(
                    event.key ?? text[i],
                    event.ctrlKey ?? false,
                ));
            }
            hiddenInputSentCharsCount = 0;
            event.target.value = "";
        }
        if (event.inputType !== "insertText") {
            hiddenInputSentCharsCount = 0;
            event.target.value = "";
            return;
        }
        console.log("input is now %o", event.target.value);
        for (let i = hiddenInputSentCharsCount; i < text.length; i++) {
            roomEvents.sendTypedEvent(new SentTypedEvent(
                event.key ?? text[i],
                event.ctrlKey ?? false,
            ));
        }
        if (event.target.value === " ") {
            hiddenInputSentCharsCount = 0;
            event.target.value = "";
        }
        hiddenInputSentCharsCount = event.target.value.length;
        //event.target.value = "";
        //event.preventDefault();
    } );
}
