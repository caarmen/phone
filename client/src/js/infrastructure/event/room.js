import io from "socket.io-client";
import { ReceivedTypedEvent, SentTypedEvent } from "../../domain/entities/typedevent.js";

/**
 * Entroy point to events communication with the server.
 * @returns {object} RoomEvents functions.
 */
export function RoomEvents()  {
    let socket = null;

    /**
     * Connect to the server's event stream.
     * @param {string} roomId the id of the room on the server.
     * @param {string} participantName the name of our own participant.
     * @param {object} listeners listeners for server event callbacks.
     */
    function connect(
        roomId,
        participantName,
        listeners = {
            typedEventListener: null,
            beepListener: null,
            participantChangeListener: null,
        }
    ) {
        socket = io(process.env.VITE_BE_SERVER, {
            path: "/chat",
            reconnectionDelayMax: 10000,
            query: {
                room_id: roomId,
                participant_name: participantName,
            },
        });

        // typed events are sent when any participant (including us) types in the chat.
        socket.on("typed", (data) => {
            listeners.typedEventListener?.(new ReceivedTypedEvent(data.key, data.sid));
        });

        // beep is sent when any participant (including us) typed a beep sequence (ctrl-g).
        socket.on("beep", () => {
            console.log("received beep");
            listeners.beepListener?.();
        });

        // joined is sent when any participant joined the room.
        socket.on("joined", (data) => {
            console.log("received joined %o", data);
            listeners.participantChangeListener?.(data);
        });

        // left is sent when any participant left the room.
        socket.on("left", (data) => {
            console.log("received left %o", data);
            listeners.participantChangeListener?.(data);
        });
    }

    /**
     * Let the server know we typed something.
     * @param {SentTypedEvent} sentTypedEvent the information about what we typed.
     */
    function sendTypedEvent(sentTypedEvent) {
        socket.emit("typed", {
            key: sentTypedEvent.key,
            ctrl: sentTypedEvent.ctrl,
        });
    }

    return {
        connect,
        sendTypedEvent,
    };
}