from abc import ABC

from phone.domain.entities.room import Room
from phone.domain.entities.user import User


class RoomRepository(ABC):

    async def create_room(
        self,
        room_name: str,
    ) -> Room:
        pass

    async def get_room(
        self,
        room_id: str,
    ) -> Room | None:
        pass

    async def delete_room(
        self,
        room_id: str,
    ):
        pass

    async def create_user(
        self,
        user_id: str,
        user_name: str,
    ):
        pass

    async def delete_user(
        self,
        user_id: str,
    ):
        pass

    async def add_user_to_room(
        self,
        user_id: str,
        participant_name: str,
        room_id: str,
    ):
        pass

    async def remove_user_from_room(
        self,
        user_id: str,
        room_id: str,
    ):
        pass

    async def get_users_in_room(
        self,
        room_id: str,
    ) -> list[User]:
        pass

    async def get_room_for_user(
        self,
    ):
        pass
