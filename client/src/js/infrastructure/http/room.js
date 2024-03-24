export class RoomNotFoundError extends Error {
    errorMessageKey = "errorRoomNotFound";
}

export class RoomFullError extends Error {
    errorMessageKey = "errorRoomFull";
}

export const roomService = {

    async createRoom(roomName) {
        const result = await fetch(
            `${process.env.VITE_BE_SERVER}room/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: roomName,
                })
            }
        );
        return await result.json();
    },

    async getRoom(roomId) {
        const result = await fetch(
            `${process.env.VITE_BE_SERVER}room/${roomId}/`,
            {
                headers: {
                    'Content-Type': 'application/json'
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

