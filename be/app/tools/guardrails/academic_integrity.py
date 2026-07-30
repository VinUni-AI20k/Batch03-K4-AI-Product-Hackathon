def requests_impersonation_or_cheating(message: str) -> bool:
    normalized = message.casefold()
    signals = ("làm bài hộ", "thi hộ", "đáp án để nộp", "giả làm tôi")
    return any(signal in normalized for signal in signals)
