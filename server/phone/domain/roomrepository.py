from abc import ABC

from phone.domain.room import Room
from phone.domain.user import User


class RoomRepository(ABC):

    def create_room(
        self,
        room_id: str,
    ) -> Room:
        pass

    def delete_room(
        self,
        room_id: str,
    ):
        pass

    def add_user_to_room(
        self,
        user_id: str,
        room_id: str,
    ):
        pass

    def remove_user_from_room(
        self,
        user_id: str,
        room_id: str,
    ):
        pass

    def get_users_in_room(
        self,
        room_id: str,
    ) -> list[User]:
        pass

    def get_room_for_user(
        self,
    ):
        pass
