import { getTextLinesPerParticipant, processInput, trimLeadingLines } from '../domain/usecases/textbuffer.js';
import { ReceivedTypedEvent } from '../domain/entities/typedevent.js';

/**
 * Create an Element for the given participant.
 * @param {Element} participantsElement the container element for all participants.
 * @param {string} roomName the name of the current room. Used for the display of the participant name.
 * @param {object} participant a new participant, with id and name attributes.
 * @returns {Element} the created Element.
 */
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

/**
 * Find the Element for the given participant.
 * @param {Element} participantsElement the container element for all participants.
 * @param {number} participantId the id of the participant to find.
 * @returns {Element} the Element of the given participant.
 */
function findParticipantElement(participantsElement, participantId) {
    return participantsElement.querySelector(`div[data-pid="${participantId}"]`);
}

/**
 * Update the Elements for the given participants, creating missing Elements if necessary.
 * @param {Element} participantsElement the container element for all participants.
 * @param {string} roomName the name of the current room. Used for the display of the participant names.
 * @param {Array<object>} participants the participants data, with an id and name for each participant.
 */
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
    Array.from(participantsElement.querySelectorAll(".participant")).filter(
        participantElement => !participants.some(participant => participant.id == participantElement.dataset.pid)
    ).forEach(leftParticipantElement => participantsElement.removeChild(leftParticipantElement));
}

/**
 * Update the participants display for the given typed event.
 *
 * Finds the Element for the participant in the event, and updates is text.
 * @param {ReceivedTypedEvent} typedEvent the event received for a given participant.
 * @param {Element} participantsElement the container element for all participants.
 */
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