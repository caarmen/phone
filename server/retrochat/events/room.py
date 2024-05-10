import logging
from dataclasses import asdict
from urllib.parse import parse_qs

import socketio

from retrochat.domain import usecases
from retrochat.domain.entities.typedevent import BeepEvent, InputTypedEvent, TypedEvent
from retrochat.domain.repositories.roomrepository import RoomRepository
from retrochat.domain.usecases.request_user_join_room import request_user_join_room
from retrochat.domain.usecases.user_leave_room import user_leave_room

logger = logging.getLogger(__name__)


class Room(socketio.AsyncNamespace):
    def __init__(self, room_repo: RoomRepository):
        super().__init__(namespace="/")
        self.room_repo = room_repo

    async def _emit_room_participants(
        self,
        room: str,
        event: str,
        changed_participant_id: str,
    ):
        room_participants = await self.room_repo.get_users_in_room(room_id=room)
        if room_participants:
            await self.emit(
                event=event,
                room=room,
                data={
                    "sid": changed_participant_id,
                    "participants": [asdict(x) for x in room_participants],
                },
            )

    def _get_room_ids(self, sid: str) -> list[str]:
        all_room_ids = self.rooms(sid=sid, namespace=self.namespace)
        return [room_id for room_id in all_room_ids if room_id != sid]

    async def on_connect(self, sid, environ):
        logger.debug(f"connect: {sid}")
        query_params = parse_qs(environ["QUERY_STRING"])
        room_id = query_params.get("room_id")[0]
        requested_participant_name = query_params.get("participant_name")[0]

        if not await request_user_join_room(
            room_repo=self.room_repo,
            room_id=room_id,
            user_id=sid,
            requested_participant_name=requested_participant_name,
        ):
            return

        await self.enter_room(
            sid=sid,
            namespace=self.namespace,
            room=room_id,
        )
        await self._emit_room_participants(
            room=room_id,
            event="joined",
            changed_participant_id=sid,
        )

    async def on_disconnect(self, sid):
        logger.debug(f"disconnect: {sid}")
        room_ids = self._get_room_ids(sid)
        for room_id in room_ids:
            await self.leave_room(
                sid=sid,
                namespace=self.namespace,
                room=room_id,
            )
            await user_leave_room(
                room_repo=self.room_repo,
                room_id=room_id,
                user_id=sid,
            )
            await self._emit_room_participants(
                room=room_id,
                event="left",
                changed_participant_id=sid,
            )

    async def on_typed(self, sid, *args):
        logger.debug(f"typed {sid}: args {args}")

        input_typed_event = InputTypedEvent(**args[0])
        typed_event: TypedEvent = usecases.map_input_typed_event_to_typed_event(
            input_typed_event
        )
        room_ids = self._get_room_ids(sid)
        if typed_event is BeepEvent:
            await self.emit(
                event="beep",
                room=room_ids,
            )
        else:
            await self.emit(
                event="typed",
                room=room_ids,
                data={**asdict(typed_event), "sid": sid},
            )
