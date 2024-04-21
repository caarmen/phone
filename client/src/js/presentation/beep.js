/**
 * Presents beeps.
 * @returns {object} Functions for presenting beeps.
 */
export function Beep() {
    const userInitiatedEvents = ["keydown", "touchstart"];
    let context = null;

    /**
     * Initialize the audio context on a user-initiated event.
     * This is required for beeps to work on iOS.
     */
    function init() {
        context = new (window.AudioContext || window.webkitAudioContext)();
        console.log("init context %o", context);
        userInitiatedEvents.forEach(eventName => {
            document.removeEventListener(eventName, init);
        });
    }

    /**
     * Play a beep.
     */
    function play() {
        if (context) {
            const oscillator = context.createOscillator();
            oscillator.connect(context.destination);
            oscillator.frequency.setValueAtTime(2100, context.currentTime);
            oscillator.frequency.setValueAtTime(0, context.currentTime + 0.05);
            oscillator.start(0);
        }
    }

    userInitiatedEvents.forEach(eventName => {
        document.addEventListener(eventName, init);
    });

    return {
        play,
    };
}