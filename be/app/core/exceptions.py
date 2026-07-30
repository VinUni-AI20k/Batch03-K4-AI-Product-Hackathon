class VLearnError(Exception):
    """Base application exception."""


class SourceNotFoundError(VLearnError):
    """Raised when no grounded source can support an answer."""


class InvalidCitationError(VLearnError):
    """Raised when a generated citation is not present in the context."""
