import logging

from phone.domain.repositories.roomrepository import RoomRepository
from phone.domain.usecases import select_participant_name
from phone.settings import MAX_PARTICIPANTS_PER_ROOM

logger = logging.getLogger(__name__)


async def request_user_join_room(
    room_repo: RoomRepository,
    room_id: str,
    user_id: str,
    requested_participant_name: str,
) -> bool:
    participants = await room_repo.get_users_in_room(room_id)
    if len(participants) >= MAX_PARTICIPANTS_PER_ROOM:
        logger.warning(f"room {room_id} is full")
        return False

    participant_name = select_participant_name(
        requested_name=requested_participant_name,
        other_participant_names=[x.name for x in participants],
    )

    await room_repo.add_user_to_room(
        user_id=user_id,
        participant_name=participant_name,
        room_id=room_id,
    )

    return True
