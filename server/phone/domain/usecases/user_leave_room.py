from phone.domain.repositories.roomrepository import RoomRepository


async def user_leave_room(
    room_repo: RoomRepository,
    room_id: str,
    user_id: str,
):
    await room_repo.remove_user_from_room(
        user_id=user_id,
        room_id=room_id,
    )

    participants = await room_repo.get_users_in_room(room_id)
    if not participants:
        await room_repo.delete_room(room_id)
    await room_repo.delete_user(user_id=user_id)
