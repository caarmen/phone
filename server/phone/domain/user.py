import dataclasses

from phone.domain.room import Room


@dataclasses.dataclass
class User:
    id: str
    room: Room | None = None
