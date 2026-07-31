"""
Tools package for AIQAAgent.
Each tool exposes:
  - SCHEMA  : OpenAI function-calling schema dict
  - run(**kwargs) -> str  : execute and return JSON string result
"""

from .search_kb        import run as search_knowledge_base,   SCHEMA as SCHEMA_SEARCH_KB
from .search_internet  import run as search_internet,         SCHEMA as SCHEMA_SEARCH_INTERNET
from .calculate        import run as calculate,               SCHEMA as SCHEMA_CALCULATE
from .get_time         import run as get_current_time,        SCHEMA as SCHEMA_GET_TIME
from .summarize_doc    import run as summarize_doc,           SCHEMA as SCHEMA_SUMMARIZE_DOC
from .translate        import run as translate,               SCHEMA as SCHEMA_TRANSLATE
from .explain_concept  import run as explain_concept,         SCHEMA as SCHEMA_EXPLAIN_CONCEPT
from .check_deadline   import run as check_deadline,          SCHEMA as SCHEMA_CHECK_DEADLINE
from .recommend_path   import run as recommend_path,          SCHEMA as SCHEMA_RECOMMEND_PATH
from .format_code      import run as format_code,             SCHEMA as SCHEMA_FORMAT_CODE
from .kb_stats         import run as get_kb_stats,            SCHEMA as SCHEMA_KB_STATS

ALL_SCHEMAS = [
    SCHEMA_SEARCH_KB,
    SCHEMA_SEARCH_INTERNET,
    SCHEMA_CALCULATE,
    SCHEMA_GET_TIME,
    SCHEMA_SUMMARIZE_DOC,
    SCHEMA_TRANSLATE,
    SCHEMA_EXPLAIN_CONCEPT,
    SCHEMA_CHECK_DEADLINE,
    SCHEMA_RECOMMEND_PATH,
    SCHEMA_FORMAT_CODE,
    SCHEMA_KB_STATS,
]

TOOL_REGISTRY = {
    "search_knowledge_base": search_knowledge_base,
    "search_internet":       search_internet,
    "calculate":             calculate,
    "get_current_time":      get_current_time,
    "summarize_doc":         summarize_doc,
    "translate":             translate,
    "explain_concept":       explain_concept,
    "check_deadline":        check_deadline,
    "recommend_path":        recommend_path,
    "format_code":           format_code,
    "get_kb_stats":          get_kb_stats,
}
