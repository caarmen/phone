import dataclasses
from typing import Union


@dataclasses.dataclass
class InputTypedEvent:
    key: str
    ctrl: bool


@dataclasses.dataclass
class TextEvent:
    key: str


BeepEvent = object()

TypedEvent = Union[TextEvent, BeepEvent]
