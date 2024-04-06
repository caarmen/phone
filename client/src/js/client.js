import io from 'socket.io-client';
import { processInput, getTextLinesPerParticipant, trimLeadingLines } from './textbuffer.js';

let socket = null;

function handleMyInput() {
    return (event) => {
        socket.emit("typed", {
            code: event.keyCode,
            key: event.key,
        });
        event.preventDefault();
    };
}

function createParticipantElement(participantsElement, participantId) {
    const participantElement = document.createElement('div');
    participantElement.dataset.pid = participantId;
    participantElement.classList.add("participant");
    participantsElement.appendChild(participantElement);
    const participantNameElement = document.createElement("div");
    participantNameElement.classList.add("participant__name");
    participantNameElement.innerText = participantId;
    participantElement.appendChild(participantNameElement);
    const participantTextEement = document.createElement("pre");
    participantElement.appendChild(participantTextEement);
    return participantElement;
}

function findParticipantElement(participantsElement, participantId, createIfMissing = false) {
    const participantElement = participantsElement.querySelector(`div[data-pid="${participantId}"]`);
    if (participantElement) {
        return participantElement;
    }
    if (createIfMissing) {
        return createParticipantElement(participantsElement, participantId);
    }
    return null;
}
function getAllParticipantElements(participantsElement) {
    return Array.from(participantsElement.querySelectorAll(".participant"));
}

function updateParticipantElements(participantsElement, participantIds) {
    const textLinesPerParticipant = getTextLinesPerParticipant(participantIds.length);
    participantIds.forEach(
        participantId => {
            const participantElement = findParticipantElement(participantsElement, participantId, true);
            const textElement = participantElement.querySelector("pre");
            textElement.textContent = trimLeadingLines(textElement.textContent, textLinesPerParticipant);
            participantElement.style.setProperty("--lines-per-participant", textLinesPerParticipant);
            participantElement.dataset.linesPerParticipant = textLinesPerParticipant;
        }
    );
    getAllParticipantElements(participantsElement).filter(
        participantElement => participantIds.indexOf(participantElement.dataset.pid) < 0
    ).forEach(leftParticipantElement => participantsElement.removeChild(leftParticipantElement));
}

function receiveJoinedEvent(participantsElement, joinedEventData) {
    updateParticipantElements(participantsElement, joinedEventData.participants);
}

function receiveLeftEvent(participantsElement, leftEventData) {
    updateParticipantElements(participantsElement, leftEventData.participants);
}

function receiveTypedEvent(typedEventData, participantsElement) {
    const participantElement = findParticipantElement(participantsElement, typedEventData.sid, true);
    if (participantElement) {
        const textElement = participantElement.querySelector("pre");

        const processedText = processInput(
            textElement.textContent,
            typedEventData.code,
            typedEventData.key,
            participantElement.dataset.linesPerParticipant,
        );
        textElement.textContent = processedText;
    }
}

export function setup(roomId, participantsElement) {
    const query = roomId ? { room_id: roomId } : null;
    socket = io(process.env.VITE_WS_SERVER, {
        path: "/chat/",
        reconnectionDelayMax: 10000,
        query: query,
    });

    document.addEventListener(
        'keydown',
        handleMyInput(),
        true,
    );

    socket.on("typed", (data) => {
        receiveTypedEvent(data, participantsElement);
    });

    socket.on("joined", (data) => {
        console.log("received joined %o", data);
        receiveJoinedEvent(participantsElement, data);
    });

    socket.on("left", (data) => {
        console.log("received left %o", data);
        receiveLeftEvent(participantsElement, data);
    });
}

export function testPlaceholder() {
    return true;
}