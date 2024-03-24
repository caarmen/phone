import socketio
import uvicorn
from asgiref.wsgi import WsgiToAsgi
from flask import Flask
from redis import Redis

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


@sio.event
async def connect(sid, environ):
    print(f"connect: {sid}")


@sio.on('*', namespace="*")
async def any_event(event, namespace, sid, data):
    print(f"any_event {event}: sid={sid}, data={data}")


@sio.event
async def typed(sid, *args):
    print(f"typed {sid}: args {args}")
    await sio.emit(
        event="typed",
        data=args[0],
    )


@sio.event
async def disconnect(sid):
    print(f"disconnect: {sid}")


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
