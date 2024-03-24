import io from 'socket.io-client';
import { processInput } from './textbuffer.js';

const socket = io(process.env.VITE_WS_SERVER, {
    path: "/chat/",
    reconnectionDelayMax: 10000,
});

function handleMyInput() {
    return (event) => {
        socket.emit("typed", {
            code: event.keyCode,
            key: event.key,
        });
    };
}

function receiveTypedEvent(typedEventData, destElement) {
    const processedText = processInput(
        destElement.textContent,
        typedEventData.code,
        typedEventData.key,
    );
    destElement.textContent = processedText;
}

export function setup(sourceElement, destElement) {
    sourceElement.addEventListener(
        'keydown',
        handleMyInput(),
        true,
    );

    socket.on("typed", (data) => {
        console.log("received typed %o", data);
        receiveTypedEvent(data, destElement);
    });

    // Focus on chat window when the page loads
    sourceElement.focus();
}

export function testPlaceholder() {
    return true;
}