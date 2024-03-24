import io from 'socket.io-client';
import { ReceivedTypedEvent } from "../../domain/entities/typedevent.js";
export function RoomEvents()  {
    let socket = null;
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

        socket.on("typed", (data) => {
            listeners.typedEventListener?.(new ReceivedTypedEvent(data.key, data.sid));
        });

        socket.on("beep", () => {
            console.log("received beep");
            listeners.beepListener?.();
        });

        socket.on("joined", (data) => {
            console.log("received joined %o", data);
            listeners.participantChangeListener?.(data);
        });

        socket.on("left", (data) => {
            console.log("received left %o", data);
            listeners.participantChangeListener?.(data);
        });
    }

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