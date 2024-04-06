import uuid
from urllib.parse import parse_qs

import socketio
import uvicorn
from asgiref.wsgi import WsgiToAsgi
from flask import Flask
from redis import Redis

from phone.data.redisroomrepository import RedisRoomRepository
from phone.settings import settings

http_app = Flask(
    __name__,
    static_folder="../../client/dist",
    static_url_path="/client",
)
redis = Redis(
    host=settings.redis_dsn.host,
    port=settings.redis_dsn.port,
)
redis_mgr = socketio.AsyncRedisManager(
    url=f"redis://{settings.redis_dsn.host}:{settings.redis_dsn.port}{settings.redis_dsn.path}",
)
sio = socketio.AsyncServer(
    client_manager=redis_mgr,
    namespaces=["chat"],
    async_mode="asgi",
    cors_allowed_origins=settings.cors_allowed_origins,
)

ws_app = socketio.ASGIApp(
    socketio_server=sio,
    other_asgi_app=WsgiToAsgi(http_app),
    socketio_path="chat",
)

NAMESPACE = "/"
MAX_PARTICIPANTS_PER_ROOM = 6

room_repo = RedisRoomRepository(redis)


async def _emit_room_participants(
    room: str,
    event: str,
    changed_participant_id: str,
):
    room_participants_sid = [
        user.id for user in room_repo.get_users_in_room(room_id=room)
    ]
    await sio.emit(
        event=event,
        room=room,
        data={
            "sid": changed_participant_id,
            "participants": room_participants_sid,
        }
    )


@sio.event
async def connect(sid, environ):
    print(f"connect: {sid}")
    query_params = parse_qs(environ['QUERY_STRING'])
    room_id = query_params.get("room_id")[0] if "room_id" in query_params else str(uuid.uuid4())

    participants = room_repo.get_users_in_room(room_id)
    if len(participants) >= MAX_PARTICIPANTS_PER_ROOM:
        print("room is full")
        return

    room_repo.add_user_to_room(
        user_id=sid,
        room_id=room_id,
    )
    await sio.enter_room(
        sid=sid,
        namespace=NAMESPACE,
        room=room_id,
    )
    await _emit_room_participants(
        room=room_id,
        event="joined",
        changed_participant_id=sid,
    )


@sio.event
async def disconnect(sid):
    print(f"disconnect: {sid}")
    room_ids = _get_room_ids(sid)
    for room_id in room_ids:
        await sio.leave_room(
            sid=sid,
            namespace=NAMESPACE,
            room=room_id,
        )
        room_repo.remove_user_from_room(
            user_id=sid,
            room_id=room_id,
        )
        participants = room_repo.get_users_in_room(room_id)
        if participants:
            await _emit_room_participants(
                room=room_id,
                event="left",
                changed_participant_id=sid,
            )
        else:
            room_repo.delete_room(room_id)


@sio.on('*', namespace="*")
async def any_event(event, _namespace, sid, data):
    print(f"any_event {event}: sid={sid}, data={data}")


def _get_room_ids(sid: str) -> list[str]:
    all_room_ids = sio.rooms(sid=sid, namespace=NAMESPACE)
    return [room_id for room_id in all_room_ids if room_id != sid]


@sio.event
async def typed(sid, *args):
    print(f"typed {sid}: args {args}")

    await sio.emit(
        event="typed",
        room=_get_room_ids(sid),
        data={**args[0], "sid": sid},
    )


@http_app.route('/redistest/')
async def redis_test():
    redis.incr('hits')
    counter = str(redis.get('hits'), 'utf-8')
    return "This webpage has been viewed " + counter + " time(s)"


if __name__ == "__main__":
    uvicorn.run(
        ws_app,
        host="0.0.0.0",
        port=8000,
        log_level="debug",
    )
