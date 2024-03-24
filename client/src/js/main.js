
import beepSound from '../res/beep.wav';
import { translateText } from "./i18n/i18n.js";

import { showDialog } from "./presentation/dialog.js";
import { Home } from "./presentation/home.js";
import { updateParticipantElements, receiveTypedEvent } from "./presentation/participants.js";

import { SentTypedEvent } from "./domain/entities/typedevent.js";

import { RoomEvents } from "./infrastructure/event/room.js";
import { roomService } from "./infrastructure/http/room.js";

const beep = new Audio(beepSound);

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

async function enterRoom(roomId, participantName) {
    const participants = document.getElementById("participants");
    const dialog = document.querySelector(".dialog__overlay");
    let room = null;
    try {
        room = await roomService.getRoom(roomId);
    } catch (error) {
        showDialog(dialog, translateText(error.errorMessageKey ?? "errorOops"), () => {
            document.location = process.env.VITE_FE_SERVER;
        });
        return;
    }
    const roomEvents = RoomEvents();

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

    document.addEventListener(
        'keydown',
        (event) => {
            roomEvents.sendTypedEvent(new SentTypedEvent(
                event.key,
                event.ctrlKey,
            ));
            event.preventDefault();
        },
        true,
    );
}