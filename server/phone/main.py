import logging

import socketio
import uvicorn
from asgiref.wsgi import WsgiToAsgi
from flask import Flask
from flask.logging import default_handler
from flask_cors import CORS
from redis.asyncio import Redis

from phone.data.redisroomrepository import RedisRoomRepository
from phone.events.room import Room
from phone.settings import settings
from phone.views.room import register as register_bp_room

http_app = Flask(
    __name__,
    static_folder="../../client/dist",
    static_url_path="/client",
)
http_app.logger.removeHandler(default_handler)
logging.basicConfig(
    level=logging.DEBUG, format="%(levelname)-10s[%(name)s] %(message)s"
)
if settings.cors_allowed_origins:
    CORS(http_app, origins=settings.cors_allowed_origins)

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

room_repo = RedisRoomRepository(redis)
http_app.register_blueprint(register_bp_room(room_repo))
sio.register_namespace(Room(room_repo))

if __name__ == "__main__":
    uvicorn.run(
        ws_app,
        host="0.0.0.0",
        port=8000,
        log_level="debug",
    )
