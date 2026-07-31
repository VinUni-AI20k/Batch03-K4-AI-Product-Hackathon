from pathlib import Path
from typing import List, Dict

import pandas as pd


def _merge_turn(turn_df: pd.DataFrame) -> Dict:
    """
    Convert one turn (student + tutor messages) into DialogueKT format.
    """

    turn_df = turn_df.sort_values("message_created_at")

    student = turn_df[turn_df["role"] == "student"]
    tutor = turn_df[turn_df["role"] == "tutor"]

    student_text = " ".join(student["content"].fillna("").astype(str)).strip()
    tutor_text = " ".join(tutor["content"].fillna("").astype(str)).strip()

    return {
        "student": student_text,
        "teacher": tutor_text,
    }


def load_vlearn_chatlog(csv_path: str | Path) -> pd.DataFrame:
    """
    Load VLearn chat history and convert to DialogueKT source format.

    Returns DataFrame:

    index
    dialogue
    meta_data
    """

    df = pd.read_csv(csv_path)

    # đảm bảo đúng thứ tự thời gian
    df["message_created_at"] = pd.to_datetime(df["message_created_at"])

    df = df.sort_values(
        [
            "conversation_id",
            "message_created_at",
        ]
    )

    samples = []

    grouped = df.groupby("conversation_id")

    for idx, (_, conv_df) in enumerate(grouped):

        dialogue = []

        turn_groups = conv_df.groupby("turn_id")

        meta = {
            "conversation_id": conv_df.iloc[0]["conversation_id"],
            "user_id": conv_df.iloc[0]["user_id"],
            "day_code": conv_df.iloc[0]["day_code"],
            "conversation_mode": conv_df.iloc[0]["conversation_mode"],
        }

        for turn_idx, (_, turn_df) in enumerate(turn_groups):

            turn = _merge_turn(turn_df)

            dialogue.append(
                {
                    "turn": turn_idx,
                    "student": turn["student"],
                    "teacher": turn["teacher"],
                }
            )

        samples.append(
            {
                "index": idx,
                "dialogue": dialogue,
                "meta_data": meta,
            }
        )

    return pd.DataFrame(samples)