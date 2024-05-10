import logging
from dataclasses import asdict

from flask import Blueprint, abort, jsonify, request
from flask.views import MethodView

from retrochat.domain.repositories.roomrepository import RoomRepository
from retrochat.settings import MAX_PARTICIPANTS_PER_ROOM

bp = Blueprint("room", __name__, url_prefix="/room")

logger = logging.getLogger(__name__)


class RoomView(MethodView):
    def __init__(self, room_repo: RoomRepository):
        self.room_repo = room_repo

    async def post(self):
        room_name = request.get_json().get("name")
        logger.debug(f"Create room {room_name}")
        room = await self.room_repo.create_room(room_name)
        return jsonify(asdict(room))

    async def get(self, room_id: str):
        logger.debug(f"Get room {room_id}")
        room = await self.room_repo.get_room(room_id=room_id)
        if room:
            if (
                len((await self.room_repo.get_users_in_room(room_id)))
                >= MAX_PARTICIPANTS_PER_ROOM
            ):
                logger.warning(f"room {room_id}:{room.name} is full")
                abort(403)
            return jsonify(asdict(room))
        else:
            abort(404)


def register(room_repo: RoomRepository):
    view = RoomView.as_view("room", room_repo)
    bp.add_url_rule("/", view_func=view)
    bp.add_url_rule("/<string:room_id>/", view_func=view)
    return bp
