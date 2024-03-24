export class ReceivedTypedEvent {
    constructor(key, participantId) {
        this.key = key;
        this.participantId = participantId;
    }
}

export class SentTypedEvent {
    constructor(key, ctrl) {
        this.key = key;
        this.ctrl = ctrl;
    }
}