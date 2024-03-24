import uuid
from dataclasses import asdict

from redis.asyncio import Redis

from phone.domain.entities.room import Room
from phone.domain.repositories.roomrepository import RoomRepository
from phone.domain.entities.user import User


class RedisRoomRepository(RoomRepository):

    def __init__(
        self,
        redis: Redis
    ):
        self.redis = redis

    async def create_room(
        self,
        room_name: str,
    ) -> Room:
        room = Room(
            id=str(uuid.uuid4()),
            name=room_name,
        )
        await self.redis.hset(f'room:{room.id}', mapping=asdict(room))
        return room

    async def get_room(
        self,
        room_id: str,
    ) -> Room | None:
        room_data = await self.redis.hgetall(f'room:{room_id}')
        if room_data:
            room_data_str = {key.decode('utf-8'): value.decode('utf-8') for key, value in room_data.items()}
            return Room(**room_data_str)
        else:
            return None

    async def delete_room(
        self,
        room_id: str,
    ):
        await self.redis.delete(
            f'room:{room_id}:users',
            f'room:{room_id}',
        )

    async def create_user(
        self,
        user_id: str,
        user_name: str,
    ):
        user = User(
            id=user_id,
            name=user_name,
        )
        await self.redis.hset(f'user:{user_id}', mapping=asdict(user))

    async def delete_user(
        self,
        user_id: str,
    ):
        await self.redis.delete(f'user:{user_id}')

    async def add_user_to_room(
        self,
        user_id: str,
        participant_name: str,
        room_id: str,
    ):
        await self.redis.hset(
            f"room:{room_id}:users",
            key=user_id,
            value=participant_name,
        )

    async def remove_user_from_room(
        self,
        user_id: str,
        room_id: str,
    ):
        await self.redis.hdel(
            f"room:{room_id}:users",
            user_id,
        )

    async def get_users_in_room(
        self,
        room_id: str,
    ) -> list[User]:
        users = await self.redis.hgetall(
            f"room:{room_id}:users",
        )
        return [
            User(
                id=user_id.decode("utf-8"),
                name=user_name.decode("utf-8"),
            ) for user_id, user_name in users.items()
        ]
