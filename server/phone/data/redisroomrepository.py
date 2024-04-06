from redis import Redis

from phone.domain.room import Room
from phone.domain.roomrepository import RoomRepository
from phone.domain.user import User


class RedisRoomRepository(RoomRepository):

    def __init__(
        self,
        redis: Redis
    ):
        self.redis = redis

    def create_room(
        self,
        room_id: str,
    ) -> Room:
        return Room(id=room_id)

    def delete_room(
        self,
        room_id: str,
    ):
        self.redis.delete(f'room:{room_id}:users')

    def add_user_to_room(
        self,
        user_id: str,
        room_id: str,
    ):
        self.redis.sadd(f"room:{room_id}:users", user_id)

    def remove_user_from_room(
        self,
        user_id: str,
        room_id: str,
    ):
        self.redis.srem(f"room:{room_id}:users", user_id)

    def get_users_in_room(
        self,
        room_id: str,
    ) -> list[User]:
        user_ids = self.redis.smembers(f"room:{room_id}:users")
        return [
            User(
                id=x.decode("utf-8"),
                room=Room(id=room_id),
            ) for x in user_ids
        ]
