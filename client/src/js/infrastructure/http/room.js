export class RoomNotFoundError extends Error {
    errorMessageKey = "errorRoomNotFound";
}

export class RoomFullError extends Error {
    errorMessageKey = "errorRoomFull";
}

export const roomService = {

    /**
     * Create a new room with the given name.
     * @param {string} roomName the name of the room to create.
     * @returns {object} the created room, with id and name attributes.
     */
    async createRoom(roomName) {
        const result = await fetch(
            `${process.env.VITE_BE_SERVER}room/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: roomName,
                })
            }
        );
        return await result.json();
    },

    /**
     * Retrieve details for the given room.
     * @param {string} roomId the id of the room to retrieve.
     * @returns {object} the found room, with id and name attributes.
     * @throws {RoomNotFoundError} if no room was found for the given id.
     * @throws {RoomFullError} if the room has its maximum number of participants.
     */
    async getRoom(roomId) {
        const result = await fetch(
            `${process.env.VITE_BE_SERVER}room/${roomId}/`,
            {
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        if (result.ok) {
            return await result.json();
        }

        if (result.status === 404) {
            throw new RoomNotFoundError();
        }
        if (result.status === 403) {
            throw new RoomFullError();
        }
        throw Error(`Unexpected room error ${result.status}: ${result.body}`);

    }
};

