from phone.domain.entities.typedevent import (
    BeepEvent,
    InputTypedEvent,
    TextEvent,
    TypedEvent,
)


def map_input_typed_event_to_typed_event(
    input_typed_event: InputTypedEvent,
) -> TypedEvent:
    if input_typed_event.ctrl and input_typed_event.key == "g":
        return BeepEvent
    return TextEvent(
        key=input_typed_event.key,
    )
