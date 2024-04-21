import pytest

from phone.domain.usecases import select_participant_name


@pytest.mark.parametrize(
    argnames=[
        "input_requested_name",
        "input_existing_names",
        "expected_selected_name",
    ],
    argvalues=[
        [
            "hello",
            ["hello"],
            "hello2",
        ],
        [
            "jdoe",
            ["mdurant"],
            "jdoe",
        ],
        [
            "jdoe",
            ["jdoe"],
            "jdoe2",
        ],
        [
            "jdoe",
            ["mdurant", "jdoe"],
            "jdoe2",
        ],
        [
            "jdoe",
            ["jdoe", "mdurant"],
            "jdoe2",
        ],
    ],
)
def test_usecase(
    input_requested_name: str,
    input_existing_names: list[str],
    expected_selected_name: str,
):
    assert (
        select_participant_name(
            requested_name=input_requested_name,
            other_participant_names=input_existing_names,
        )
        == expected_selected_name
    )
