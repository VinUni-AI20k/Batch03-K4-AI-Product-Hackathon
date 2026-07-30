# VLearn

The domain model and glossary for VLearn, a personalized learning platform using AI for Q&A and Elo for concept mastery.

## Language

**Elo**:
The raw numerical score (e.g., 1200) representing a user's proficiency on a concept, updated continuously after each attempt.
_Avoid_: Mastery score

**Mastery**:
The learning status or category (e.g., Needs Review, Proficient, Mastered) derived from Elo thresholds. Used by the decision engine to determine review paths.
_Avoid_: Elo level
