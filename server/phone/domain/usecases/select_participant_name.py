def select_participant_name(
    requested_name: str,
    other_participant_names: list[str],
) -> str:
    if requested_name not in other_participant_names:
        return requested_name
    participant_count = len(other_participant_names)
    for i in range(2, participant_count + 1):
        requested_name = f"{requested_name}{i}"
        if requested_name not in other_participant_names:
            return requested_name

    return f"{requested_name}{participant_count + 1}"
