from pydantic import RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    redis_dsn: RedisDsn = "redis://redis:6379/"
    cors_allowed_origins: list[str] | None = None
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
MAX_PARTICIPANTS_PER_ROOM = 6
