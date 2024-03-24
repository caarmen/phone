import { getTextLinesPerParticipant, processInput, trimLeadingLines } from '../domain/usecases/textbuffer.js';

function createParticipantElement(participantsElement, roomName, participant) {
    const participantElement = document.createElement('div');
    participantElement.dataset.pid = participant.id;
    participantElement.classList.add("participant");
    participantsElement.appendChild(participantElement);
    const participantNameElement = document.createElement("div");
    participantNameElement.classList.add("participant__name");
    participantNameElement.innerText = `${roomName.toUpperCase()}::${participant.name.toUpperCase()}`;
    participantElement.appendChild(participantNameElement);
    const participantTextEement = document.createElement("pre");
    participantElement.appendChild(participantTextEement);
    return participantElement;
}

function findParticipantElement(participantsElement, participantId) {
    return participantsElement.querySelector(`div[data-pid="${participantId}"]`);
}
function getAllParticipantElements(participantsElement) {
    return Array.from(participantsElement.querySelectorAll(".participant"));
}

export function updateParticipantElements(participantsElement, roomName, participants) {
    const textLinesPerParticipant = getTextLinesPerParticipant(participants.length);
    participants.forEach(
        participant => {
            let participantElement = findParticipantElement(participantsElement, participant.id);
            if (!participantElement) {
                participantElement = createParticipantElement(participantsElement, roomName, participant);
            }
            const textElement = participantElement.querySelector("pre");
            textElement.textContent = trimLeadingLines(textElement.textContent, textLinesPerParticipant);
            participantElement.style.setProperty("--lines-per-participant", textLinesPerParticipant);
            participantElement.dataset.linesPerParticipant = textLinesPerParticipant;
        }
    );
    getAllParticipantElements(participantsElement).filter(
        participantElement => !participants.some(participant => participant.id == participantElement.dataset.pid)
    ).forEach(leftParticipantElement => participantsElement.removeChild(leftParticipantElement));
}

export function receiveTypedEvent(typedEvent, participantsElement) {
    const participantElement = findParticipantElement(participantsElement, typedEvent.participantId);
    if (participantElement) {
        const textElement = participantElement.querySelector("pre");

        const processedText = processInput(
            textElement.textContent,
            typedEvent.key,
            participantElement.dataset.linesPerParticipant,
        );
        textElement.textContent = processedText;
    }
}