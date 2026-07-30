from __future__ import annotations

import csv
import html
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any

import streamlit as st
import yaml

from chat import now_iso, run_model_tool_loop, trim_history, write_transcript
from env_loader import load_lab_env
from providers import make_provider
from tools import load_tool_declarations, to_openai_tools
from versioning import artifact_version_dict, build_artifact_version


ROOT = Path(__file__).parent
ARTIFACTS_DIR = ROOT / "artifacts"
RUNS_DIR = ROOT / "runs"
TRANSCRIPTS_DIR = ROOT / "transcripts"
CURRENT_VERSION = "v3.8"
SYSTEM_PROMPT_PATH = ARTIFACTS_DIR / "system_prompt.md"
TOOLS_PATH = ARTIFACTS_DIR / "tools.yaml"
VERSION_LOG_PATH = ARTIFACTS_DIR / "version_log.csv"

load_lab_env(ROOT)

st.set_page_config(
    page_title="Signal Lab · Research Agent",
    page_icon="◈",
    layout="wide",
    initial_sidebar_state="expanded",
)


def safe_slug(value: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9_.-]+", "_", value.strip())
    return slug.strip("_") or "session"


def json_text(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2, default=str)


def short_hash(value: str | None, length: int = 12) -> str:
    return (value or "")[:length] or "—"


def initialize_state() -> None:
    defaults = {
        "theme_mode": "System",
        "chat_messages": [],
        "transcript": None,
        "transcript_path": None,
        "provider_name": "openrouter",
        "model_override": "",
        "history_window": 5,
        "max_tool_rounds": 4,
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


def conversation_title(transcript: dict[str, Any], max_chars: int = 42) -> str:
    for turn in transcript.get("turns", []):
        title = " ".join(str(turn.get("user") or "").split())
        if title:
            return title if len(title) <= max_chars else title[:max_chars - 1].rstrip() + "…"
    return "Cuộc trò chuyện chưa đặt tên"


def load_transcript_history(limit: int = 30) -> list[dict[str, Any]]:
    history: list[dict[str, Any]] = []
    for path in TRANSCRIPTS_DIR.glob("*.transcript.json"):
        try:
            transcript = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        if not transcript.get("turns"):
            continue
        transcript["_path"] = str(path)
        transcript["_title"] = conversation_title(transcript)
        transcript["_sort_time"] = path.stat().st_mtime
        history.append(transcript)
    return sorted(history, key=lambda item: item["_sort_time"], reverse=True)[:limit]


def history_bucket(transcript: dict[str, Any]) -> str:
    raw_time = transcript.get("updated_at") or transcript.get("created_at") or ""
    try:
        transcript_date = datetime.fromisoformat(str(raw_time).replace("Z", "+00:00")).date()
        days_ago = (datetime.now().date() - transcript_date).days
    except ValueError:
        days_ago = 99
    if days_ago <= 0:
        return "Hôm nay"
    if days_ago == 1:
        return "Hôm qua"
    return "Trước đó"


def restore_conversation(transcript: dict[str, Any]) -> None:
    clean_transcript = {
        key: value for key, value in transcript.items()
        if not key.startswith("_")
    }
    messages: list[dict[str, Any]] = []
    fallback_artifact = clean_transcript.get("artifact_version")
    for turn in clean_transcript.get("turns", []):
        user_text = turn.get("user")
        if user_text:
            messages.append({"role": "user", "content": user_text})
        assistant_text = turn.get("assistant_text")
        if not assistant_text and turn.get("status") == "provider_error":
            assistant_text = "Không thể hoàn tất request này. Mở trace để xem lỗi provider."
        if assistant_text:
            messages.append({
                "role": "assistant",
                "content": assistant_text,
                "status": turn.get("status"),
                "rounds": turn.get("rounds") or [],
                "tool_events": turn.get("tool_events") or [],
                "error": turn.get("error"),
                "artifact_version": turn.get("artifact_version") or fallback_artifact,
            })
    st.session_state.chat_messages = messages
    st.session_state.transcript = clean_transcript
    st.session_state.transcript_path = transcript["_path"]


def theme_variables(mode: str) -> str:
    light = """
      --bg: #f5f7fc; --surface: rgba(255,255,255,.82); --surface-solid: #ffffff;
      --surface-2: #eef2fb; --text: #172033; --muted: #68738a; --border: #dce3f0;
      --primary: #6d5dfc; --primary-2: #4f46e5; --accent: #0fb8d0;
      --success: #0fa968; --warning: #d78a08; --danger: #e14f67;
      --shadow: 0 18px 50px rgba(62, 72, 112, .12); --code: #f1f4fa;
      color-scheme: light;
    """
    dark = """
      --bg: #090e1c; --surface: rgba(17,24,43,.86); --surface-solid: #11182b;
      --surface-2: #172138; --text: #eef2ff; --muted: #9ca9c4; --border: #293552;
      --primary: #8c7cff; --primary-2: #7264f4; --accent: #31cfe0;
      --success: #31c989; --warning: #f5b84b; --danger: #ff7085;
      --shadow: 0 18px 56px rgba(0, 0, 0, .34); --code: #0d1426;
      color-scheme: dark;
    """
    if mode == "Light":
        return f":root {{{light}}}"
    if mode == "Dark":
        return f":root {{{dark}}}"
    return f":root {{{light}}} @media (prefers-color-scheme: dark) {{ :root {{{dark}}} }}"


def inject_styles(mode: str) -> None:
    st.markdown(
        f"""
        <style>
        {theme_variables(mode)}
        html, body, [class*="css"] {{
          font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }}
        .stApp {{
          color: var(--text);
          background:
            radial-gradient(circle at 88% -5%, color-mix(in srgb, var(--primary) 17%, transparent), transparent 30rem),
            radial-gradient(circle at 8% 18%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 26rem),
            var(--bg);
        }}
        [data-testid="stHeader"] {{ background: transparent; }}
        [data-testid="stSidebar"] {{
          background: color-mix(in srgb, var(--surface-solid) 94%, transparent);
          border-right: 1px solid var(--border);
        }}
        [data-testid="stSidebar"] * {{ color: var(--text); }}
        .block-container {{ max-width: 1480px; padding-top: 1.5rem; padding-bottom: 4rem; }}
        h1, h2, h3 {{ color: var(--text); letter-spacing: -.035em; }}
        p, label, .stCaption {{ color: var(--muted); }}
        .hero {{
          position: relative; overflow: hidden; padding: 1.55rem 1.65rem; margin-bottom: 1rem;
          border: 1px solid var(--border); border-radius: 26px; box-shadow: var(--shadow);
          background: linear-gradient(135deg, color-mix(in srgb, var(--surface-solid) 95%, transparent), color-mix(in srgb, var(--surface-2) 88%, transparent));
        }}
        .hero::after {{
          content: ""; position: absolute; right: -4rem; top: -5rem; width: 18rem; height: 18rem;
          border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent));
          opacity: .13; filter: blur(2px);
        }}
        .hero-row {{ display: flex; align-items: center; gap: 1rem; position: relative; z-index: 1; }}
        .brand-mark {{
          flex: 0 0 auto; width: 3.35rem; height: 3.35rem; display: grid; place-items: center;
          border-radius: 18px; color: white; font-weight: 850; font-size: 1.45rem;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          box-shadow: 0 12px 30px color-mix(in srgb, var(--primary) 35%, transparent);
        }}
        .hero h1 {{ margin: 0; font-size: clamp(1.55rem, 2.8vw, 2.45rem); line-height: 1.05; }}
        .hero p {{ margin: .42rem 0 0; max-width: 52rem; font-size: .98rem; }}
        .pill-row {{ display: flex; flex-wrap: wrap; gap: .45rem; margin-top: 1rem; position: relative; z-index: 1; }}
        .pill {{
          display: inline-flex; align-items: center; gap: .35rem; padding: .32rem .62rem;
          border: 1px solid var(--border); border-radius: 999px; color: var(--muted);
          background: color-mix(in srgb, var(--surface-solid) 78%, transparent); font-size: .76rem; font-weight: 700;
        }}
        .dot {{ width: .48rem; height: .48rem; border-radius: 50%; background: var(--success); box-shadow: 0 0 0 4px color-mix(in srgb, var(--success) 14%, transparent); }}
        .section-label {{ color: var(--muted); font-size: .74rem; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; margin: .4rem 0 .25rem; }}
        .soft-card {{
          border: 1px solid var(--border); border-radius: 20px; padding: 1rem 1.05rem;
          background: var(--surface); box-shadow: 0 10px 32px rgba(48,59,96,.07); backdrop-filter: blur(14px);
        }}
        .soft-card h3 {{ margin: 0 0 .3rem; font-size: 1rem; }}
        .soft-card p {{ margin: 0; font-size: .86rem; }}
        .status-pass {{ color: var(--success); font-weight: 850; }}
        .status-fail {{ color: var(--danger); font-weight: 850; }}
        .mono {{ font-family: "SFMono-Regular", Consolas, monospace; font-size: .78rem; color: var(--muted); }}
        div[data-testid="stMetric"] {{
          border: 1px solid var(--border); border-radius: 18px; padding: .8rem 1rem;
          background: var(--surface); box-shadow: 0 8px 26px rgba(48,59,96,.06);
        }}
        div[data-testid="stMetric"] label {{ font-weight: 750; }}
        [data-testid="stChatMessage"] {{
          border: 1px solid var(--border); border-radius: 20px; background: var(--surface); padding: .35rem .45rem;
        }}
        [data-testid="stChatInput"] {{ border-color: var(--border); background: var(--surface-solid); }}
        .stTabs [data-baseweb="tab-list"] {{ gap: .35rem; padding: .3rem; border: 1px solid var(--border); border-radius: 16px; background: var(--surface); }}
        .stTabs [data-baseweb="tab"] {{ height: 2.7rem; border-radius: 12px; padding: 0 1rem; font-weight: 760; color: var(--muted); }}
        .stTabs [aria-selected="true"] {{ background: color-mix(in srgb, var(--primary) 14%, var(--surface-solid)); color: var(--primary); }}
        .stButton > button, .stDownloadButton > button {{
          border-radius: 13px; border: 1px solid var(--border); font-weight: 760;
          background: var(--surface-solid); color: var(--text); transition: transform .15s ease, border-color .15s ease;
        }}
        .stButton > button:hover, .stDownloadButton > button:hover {{ transform: translateY(-1px); border-color: var(--primary); color: var(--primary); }}
        div[data-baseweb="select"] > div, input, textarea {{ background: var(--surface-solid) !important; color: var(--text) !important; border-color: var(--border) !important; }}
        [data-testid="stExpander"] {{ border: 1px solid var(--border); border-radius: 16px; background: var(--surface); overflow: hidden; }}
        code, pre {{ background: var(--code) !important; }}
        .sidebar-brand {{ padding: .4rem 0 1rem; }}
        .sidebar-brand strong {{ font-size: 1.08rem; color: var(--text); }}
        .sidebar-brand span {{ display: block; color: var(--muted); font-size: .78rem; margin-top: .2rem; }}
        [data-testid="stSidebar"] .stButton > button {{
          justify-content: flex-start; text-align: left; min-height: 2.45rem;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }}
        [data-testid="stSidebar"] .stButton > button[kind="primary"] {{
          background: color-mix(in srgb, var(--primary) 14%, var(--surface-solid));
          border-color: color-mix(in srgb, var(--primary) 28%, var(--border)); color: var(--primary);
        }}
        @media (max-width: 760px) {{
          .block-container {{ padding: .8rem .75rem 3rem; }}
          .hero {{ padding: 1.1rem; border-radius: 20px; }}
          .brand-mark {{ width: 2.9rem; height: 2.9rem; border-radius: 15px; }}
          .hero-row {{ align-items: flex-start; }}
          .pill-row {{ gap: .32rem; }}
          .pill {{ font-size: .69rem; }}
          .stTabs [data-baseweb="tab"] {{ padding: 0 .55rem; font-size: .76rem; }}
        }}
        </style>
        """,
        unsafe_allow_html=True,
    )


def load_runs() -> list[dict[str, Any]]:
    runs: list[dict[str, Any]] = []
    for path in sorted(RUNS_DIR.glob("*.json")):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        payload["_path"] = str(path)
        payload["_filename"] = path.name
        runs.append(payload)
    return sorted(runs, key=lambda item: (item.get("generated_at", ""), item.get("run_id", "")))


def load_version_rows() -> list[dict[str, str]]:
    if not VERSION_LOG_PATH.exists():
        return []
    with VERSION_LOG_PATH.open(encoding="utf-8", newline="") as file:
        return list(csv.DictReader(file))


def canonical_runs(all_runs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_filename = {run["_filename"]: run for run in all_runs}
    selected: list[dict[str, Any]] = []
    for row in load_version_rows():
        filename = Path(row.get("run_file", "")).name
        if filename in by_filename:
            selected.append(by_filename[filename])
    return selected


def final_run(all_runs: list[dict[str, Any]], suite: str) -> dict[str, Any] | None:
    candidates = [
        run for run in all_runs
        if run.get("version") == CURRENT_VERSION and run.get("suite") == suite
    ]
    if not candidates:
        return None

    def quality(run: dict[str, Any]) -> tuple[int, int, str]:
        errors = tool_error_count(run)
        passed = int(run.get("summary", {}).get("passed_cases", 0))
        return (passed, -errors, run.get("generated_at", ""))

    return max(candidates, key=quality)


def tool_error_count(run: dict[str, Any]) -> int:
    count = 0
    for item in run.get("results", []):
        for event in item.get("tool_results", []):
            result = event.get("result")
            if isinstance(result, dict) and result.get("error"):
                count += 1
    return count


def percent(value: Any) -> str:
    if value is None:
        return "—"
    return f"{float(value) * 100:.0f}%"


def tool_names(calls: list[dict[str, Any]] | None) -> str:
    names = [str(call.get("name", "")) for call in calls or [] if call.get("name")]
    return " + ".join(names) if names else "No tool"


def expected_tool_names(expect: dict[str, Any]) -> str:
    if expect.get("no_tool"):
        return "No tool"
    return tool_names(expect.get("tool_calls"))


def run_case(run: dict[str, Any], case_id: str) -> dict[str, Any] | None:
    return next((item for item in run.get("results", []) if item.get("id") == case_id), None)


def render_hero(artifact: Any, final_base: dict[str, Any] | None, final_group: dict[str, Any] | None) -> None:
    base_score = percent(final_base.get("summary", {}).get("case_accuracy")) if final_base else "—"
    group_score = percent(final_group.get("summary", {}).get("case_accuracy")) if final_group else "—"
    st.markdown(
        f"""
        <div class="hero">
          <div class="hero-row">
            <div class="brand-mark">◈</div>
            <div>
              <h1>Signal Lab</h1>
              <p>A transparent research agent cockpit — ask, inspect every tool decision, and replay how routing improved across versions.</p>
            </div>
          </div>
          <div class="pill-row">
            <span class="pill"><span class="dot"></span> Live provider ready</span>
            <span class="pill">Artifact {html.escape(artifact.artifact_version)}</span>
            <span class="pill">Base {base_score}</span>
            <span class="pill">Group {group_score}</span>
            <span class="pill">Evidence-first</span>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_rounds(rounds: list[dict[str, Any]], overall_status: str | None = None) -> None:
    if not rounds:
        st.caption("No tool rounds — the agent answered directly.")
        return
    for round_item in rounds:
        round_number = round_item.get("round", "?")
        calls = round_item.get("tool_calls") or []
        events = round_item.get("tool_results") or []
        has_skip = any(
            isinstance(event.get("result"), dict) and event["result"].get("skipped")
            for event in events
        )
        has_error = any(
            isinstance(event.get("result"), dict)
            and event["result"].get("error")
            and not event["result"].get("skipped")
            for event in events
        )
        status = "blocked / skipped" if has_skip else ("error" if has_error else (overall_status or "completed"))
        title = f"Round {round_number} · {len(calls)} tool call(s) · {status}"
        with st.expander(title, expanded=has_error or has_skip):
            if round_item.get("assistant_text"):
                st.caption(f"Assistant planning: {round_item['assistant_text']}")
            if not events and calls:
                st.warning("Tool calls were returned without local execution results.")
            for index, event in enumerate(events, start=1):
                result = event.get("result")
                error = result.get("error") if isinstance(result, dict) else None
                skipped = result.get("skipped") if isinstance(result, dict) else False
                label = f"{index}. {event.get('tool', 'unknown')}"
                event_status = ":orange[blocked / skipped]" if skipped else (":red[error]" if error else ":green[completed]")
                st.markdown(
                    f"**{label}** · {event_status}"
                )
                args_col, result_col = st.columns(2)
                with args_col:
                    st.caption("Arguments")
                    st.json(event.get("args") or {}, expanded=False)
                with result_col:
                    st.caption("Result / error")
                    st.json(result, expanded=False)


def render_eval_case(item: dict[str, Any]) -> None:
    result = item.get("result", {})
    passed = bool(result.get("passed"))
    status = "PASS" if passed else "FAIL"
    status_class = "status-pass" if passed else "status-fail"
    st.markdown(
        f"<div class='soft-card'><h3>{html.escape(item.get('id', 'Unknown case'))}</h3>"
        f"<p><span class='{status_class}'>{status}</span> · expected "
        f"<span class='mono'>{html.escape(expected_tool_names(item.get('expect', {})))}</span> · actual "
        f"<span class='mono'>{html.escape(tool_names(result.get('actual_tool_calls')))}</span></p></div>",
        unsafe_allow_html=True,
    )
    if item.get("input") is not None:
        with st.expander("Request / conversation context"):
            st.json(item.get("input"), expanded=True)
    call_col, failure_col = st.columns(2)
    with call_col:
        st.caption("Actual tool calls")
        st.json(result.get("actual_tool_calls") or [], expanded=True)
    with failure_col:
        st.caption("Mismatch / failures")
        st.json(
            {
                "observed_mismatch": result.get("observed_mismatch"),
                "failures": result.get("failures") or [],
                "actual_text": result.get("actual_text"),
            },
            expanded=True,
        )
    events = item.get("tool_results") or []
    if events:
        render_rounds([{"round": 1, "tool_calls": result.get("actual_tool_calls") or [], "tool_results": events}])


def new_transcript(provider_name: str, model: str | None, artifact: Any, history_window: int, max_rounds: int) -> tuple[dict[str, Any], Path]:
    timestamp = datetime.now().strftime("%Y%m%dT%H%M%S%f")
    transcript_id = "_".join([safe_slug(CURRENT_VERSION), safe_slug(provider_name), timestamp])
    path = TRANSCRIPTS_DIR / f"{transcript_id}.transcript.json"
    transcript = {
        "transcript_id": transcript_id,
        **artifact_version_dict(artifact),
        "provider": provider_name,
        "model": model,
        "system_prompt": str(SYSTEM_PROMPT_PATH),
        "tools": str(TOOLS_PATH),
        "history_window": history_window,
        "max_tool_rounds": max_rounds,
        "created_at": now_iso(),
        "updated_at": now_iso(),
        "turns": [],
        "surface": "streamlit_ui",
    }
    write_transcript(path, transcript)
    return transcript, path


def reset_chat() -> None:
    st.session_state.chat_messages = []
    st.session_state.transcript = None
    st.session_state.transcript_path = None


def handle_chat_request(user_text: str, artifact: Any, tools: list[dict[str, Any]]) -> None:
    provider_name = st.session_state.provider_name
    model_override = st.session_state.model_override.strip() or None
    provider = make_provider(provider_name)
    selected_model = model_override or getattr(provider, "default_model", None)

    if st.session_state.transcript is None:
        transcript, path = new_transcript(
            provider_name,
            selected_model,
            artifact,
            st.session_state.history_window,
            st.session_state.max_tool_rounds,
        )
        st.session_state.transcript = transcript
        st.session_state.transcript_path = str(path)

    history = [
        {"role": message["role"], "content": message["content"]}
        for message in st.session_state.chat_messages
    ]
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")},
        *trim_history(history, st.session_state.history_window),
        {"role": "user", "content": user_text},
    ]
    turn_index = len(st.session_state.transcript["turns"]) + 1
    turn_record: dict[str, Any] = {
        "turn_index": turn_index,
        **artifact_version_dict(artifact),
        "started_at": now_iso(),
        "user": user_text,
        "status": "started",
        "assistant_text": None,
        "rounds": [],
        "tool_events": [],
    }
    st.session_state.chat_messages.append({"role": "user", "content": user_text})

    try:
        result = run_model_tool_loop(
            provider=provider,
            messages=messages,
            tools=tools,
            model=model_override,
            max_tool_rounds=st.session_state.max_tool_rounds,
        )
        turn_record.update(result)
        assistant_text = result.get("assistant_text") or ""
        st.session_state.chat_messages.append({
            "role": "assistant",
            "content": assistant_text,
            "status": result.get("status"),
            "rounds": result.get("rounds") or [],
            "tool_events": result.get("tool_events") or [],
            "artifact_version": artifact.artifact_version,
        })
    except Exception as exc:
        error_text = f"{type(exc).__name__}: {str(exc)}"
        turn_record.update({"status": "provider_error", "error": error_text})
        st.session_state.chat_messages.append({
            "role": "assistant",
            "content": "Không thể hoàn tất request này. Mở trace để xem lỗi provider.",
            "status": "provider_error",
            "rounds": [],
            "tool_events": [],
            "error": error_text,
            "artifact_version": artifact.artifact_version,
        })

    turn_record["ended_at"] = now_iso()
    st.session_state.transcript["turns"].append(turn_record)
    write_transcript(Path(st.session_state.transcript_path), st.session_state.transcript)


initialize_state()

with st.sidebar:
    st.markdown(
        "<div class='sidebar-brand'><strong>◈ Signal Lab</strong><span>Research Agent · evidence console</span></div>",
        unsafe_allow_html=True,
    )
    st.radio(
        "Appearance",
        ["System", "Light", "Dark"],
        horizontal=True,
        key="theme_mode",
    )
    st.markdown("<div class='section-label'>Live agent</div>", unsafe_allow_html=True)
    st.selectbox(
        "Provider",
        ["openrouter", "openai", "anthropic", "gemini"],
        key="provider_name",
    )
    st.text_input(
        "Model override",
        key="model_override",
        placeholder="Use provider default",
        help="Leave blank to use the provider default configured in code.",
    )
    st.slider("History pairs", 1, 10, key="history_window")
    st.slider("Maximum tool rounds", 1, 8, key="max_tool_rounds")
    if st.button("＋ New conversation", width="stretch"):
        reset_chat()
        st.rerun()

inject_styles(st.session_state.theme_mode)

system_prompt = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")
declarations = load_tool_declarations(TOOLS_PATH)
openai_tools = to_openai_tools(declarations)
artifact = build_artifact_version(CURRENT_VERSION, SYSTEM_PROMPT_PATH, TOOLS_PATH)
all_runs = load_runs()
final_base = final_run(all_runs, "base")
final_group = final_run(all_runs, "group")
canonical = canonical_runs(all_runs)
transcript_history = load_transcript_history()

with st.sidebar:
    st.markdown("<div class='section-label'>Lịch sử trò chuyện</div>", unsafe_allow_html=True)
    if not transcript_history:
        st.caption("Chưa có cuộc trò chuyện nào.")
    else:
        active_path = st.session_state.transcript_path
        for bucket in ("Hôm nay", "Hôm qua", "Trước đó"):
            bucket_items = [item for item in transcript_history if history_bucket(item) == bucket]
            if not bucket_items:
                continue
            st.caption(bucket)
            for item in bucket_items:
                is_active = active_path == item["_path"]
                if st.button(
                    f"💬 {item['_title']}",
                    key=f"history_{Path(item['_path']).stem}",
                    type="primary" if is_active else "secondary",
                    help=f"{item.get('updated_at', '')} · {item.get('artifact_version', '')}",
                    width="stretch",
                ):
                    restore_conversation(item)
                    st.rerun()

render_hero(artifact, final_base, final_group)

chat_tab, evolution_tab, runs_tab, artifacts_tab = st.tabs(
    ["✦ Live Chat", "↗ Version Evolution", "⌁ Run Explorer", "◇ Artifacts"]
)

with chat_tab:
    top_left, top_mid, top_right = st.columns([1.25, 1, 1])
    with top_left:
        st.markdown(f"<div class='soft-card'><h3>Live request → answer</h3><p>Chat with the current {CURRENT_VERSION} agent. Every turn is persisted with its full tool trace.</p></div>", unsafe_allow_html=True)
    with top_mid:
        transcript_name = Path(st.session_state.transcript_path).name if st.session_state.transcript_path else "Created on first message"
        st.markdown(
            f"<div class='soft-card'><h3>Transcript</h3><p class='mono'>{html.escape(transcript_name)}</p></div>",
            unsafe_allow_html=True,
        )
    with top_right:
        st.markdown(
            f"<div class='soft-card'><h3>Artifact identity</h3><p class='mono'>p{short_hash(artifact.prompt_hash)} · t{short_hash(artifact.tools_hash)}</p></div>",
            unsafe_allow_html=True,
        )

    st.write("")
    if not st.session_state.chat_messages:
        st.info("Try: “Tìm trên web tin AI hôm nay và tìm thêm bài đăng về AI trên X.”")

    for message in st.session_state.chat_messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
            if message["role"] == "assistant":
                status = message.get("status") or "answered"
                message_artifact = message.get("artifact_version") or artifact.artifact_version
                st.caption(f"Status · {status} · Artifact {message_artifact}")
                if message.get("error"):
                    st.error(message["error"])
                render_rounds(message.get("rounds") or [], overall_status=status)

    prompt = st.chat_input("Ask for web research, social signals, a URL summary, or a citation audit…")
    if prompt:
        with st.spinner("Researching and recording trace…"):
            handle_chat_request(prompt, artifact, openai_tools)
        st.rerun()

    if st.session_state.transcript is not None:
        st.download_button(
            "Download current transcript JSON",
            data=json_text(st.session_state.transcript),
            file_name=Path(st.session_state.transcript_path).name,
            mime="application/json",
            width="content",
        )

with evolution_tab:
    st.subheader("Replay one scenario across prompt/tool versions")
    st.caption("Canonical runs come from version_log.csv, so the comparison follows the experiment record rather than cherry-picking reruns.")
    case_versions: dict[str, list[dict[str, Any]]] = {}
    for run in canonical:
        if run.get("suite") != "base":
            continue
        for item in run.get("results", []):
            case_versions.setdefault(item.get("id", ""), []).append(run)
    comparable_ids = sorted(case_id for case_id, runs in case_versions.items() if case_id and len(runs) >= 2)
    default_case = comparable_ids.index("R12_confirm_before_send") if "R12_confirm_before_send" in comparable_ids else 0
    selected_case_id = st.selectbox("Scenario", comparable_ids, index=default_case)

    timeline_rows: list[dict[str, Any]] = []
    selected_pairs: list[tuple[dict[str, Any], dict[str, Any]]] = []
    for run in case_versions.get(selected_case_id, []):
        item = run_case(run, selected_case_id)
        if not item:
            continue
        selected_pairs.append((run, item))
        result = item.get("result", {})
        timeline_rows.append({
            "Version": run.get("version"),
            "Outcome": "PASS" if result.get("passed") else "FAIL",
            "Expected": expected_tool_names(item.get("expect", {})),
            "Actual": tool_names(result.get("actual_tool_calls")),
            "Mismatch": result.get("observed_mismatch") or "—",
            "Artifact": run.get("artifact_version"),
        })
    st.dataframe(timeline_rows, width="stretch", hide_index=True)

    cols = st.columns(min(4, max(1, len(selected_pairs))))
    for index, (run, item) in enumerate(selected_pairs):
        result = item.get("result", {})
        with cols[index % len(cols)]:
            outcome = "PASS" if result.get("passed") else "FAIL"
            css_class = "status-pass" if result.get("passed") else "status-fail"
            st.markdown(
                f"<div class='soft-card'><h3>{html.escape(str(run.get('version')))}</h3>"
                f"<p><span class='{css_class}'>{outcome}</span><br>"
                f"{html.escape(tool_names(result.get('actual_tool_calls')))}</p></div>",
                unsafe_allow_html=True,
            )

    inspect_version = st.selectbox(
        "Inspect trace for version",
        [str(run.get("version")) for run, _ in selected_pairs],
    )
    inspected_run, inspected_item = next(
        (pair for pair in selected_pairs if str(pair[0].get("version")) == inspect_version),
        selected_pairs[0],
    )
    st.caption(
        f"{inspected_run.get('artifact_version')} · prompt {short_hash(inspected_run.get('prompt_hash'))} · tools {short_hash(inspected_run.get('tools_hash'))}"
    )
    render_eval_case(inspected_item)

with runs_tab:
    st.subheader("Run explorer")
    st.caption("Inspect any saved evaluation run, its artifact identity, metrics, cases, calls and execution results.")
    if not all_runs:
        st.warning("No run JSON files found.")
    else:
        run_options = {
            f"{run.get('generated_at', 'unknown')} · {run.get('version')} · {run.get('suite')} · {run.get('summary', {}).get('passed_cases', 0)}/{run.get('summary', {}).get('total_cases', 0)} · {run.get('_filename')}": run
            for run in reversed(all_runs)
        }
        selected_run_label = st.selectbox("Run", list(run_options))
        selected_run = run_options[selected_run_label]
        summary = selected_run.get("summary", {})
        metric_cols = st.columns(5)
        metric_cols[0].metric("Case accuracy", percent(summary.get("case_accuracy")))
        metric_cols[1].metric("Routing", percent(summary.get("tool_routing_accuracy")))
        metric_cols[2].metric("Arguments", percent(summary.get("argument_accuracy")))
        metric_cols[3].metric("Multi-turn", percent(summary.get("multiturn_accuracy")))
        metric_cols[4].metric("Provider errors", summary.get("provider_error_cases", 0))
        st.caption(
            f"Artifact {selected_run.get('artifact_version')} · model {selected_run.get('model')} · tool execution errors {tool_error_count(selected_run)}"
        )
        result_rows = []
        for item in selected_run.get("results", []):
            result = item.get("result", {})
            result_rows.append({
                "Case": item.get("id"),
                "Outcome": "PASS" if result.get("passed") else "FAIL",
                "Expected": expected_tool_names(item.get("expect", {})),
                "Actual": tool_names(result.get("actual_tool_calls")),
                "Mismatch": result.get("observed_mismatch") or "—",
                "Multi-turn": item.get("is_multiturn"),
            })
        st.dataframe(result_rows, width="stretch", hide_index=True)
        case_ids = [item.get("id") for item in selected_run.get("results", [])]
        selected_run_case = st.selectbox("Inspect case", case_ids)
        selected_item = run_case(selected_run, selected_run_case)
        if selected_item:
            render_eval_case(selected_item)
        st.download_button(
            "Download selected run JSON",
            data=json_text({key: value for key, value in selected_run.items() if not key.startswith("_")}),
            file_name=selected_run.get("_filename", "run.json"),
            mime="application/json",
        )

with artifacts_tab:
    st.subheader("Current artifact contract")
    st.caption("The exact prompt, tool declarations and version evidence that produced the current agent behavior.")
    artifact_cols = st.columns(3)
    artifact_cols[0].metric("Version", CURRENT_VERSION)
    artifact_cols[1].metric("Prompt hash", short_hash(artifact.prompt_hash))
    artifact_cols[2].metric("Tools hash", short_hash(artifact.tools_hash))

    tool_rows = [
        {
            "Tool": item.get("name"),
            "Purpose": item.get("description"),
            "Required args": ", ".join(item.get("parameters", {}).get("required", [])) or "—",
        }
        for item in declarations
    ]
    st.dataframe(tool_rows, width="stretch", hide_index=True)
    prompt_expander, yaml_expander = st.columns(2)
    with prompt_expander:
        with st.expander("System prompt", expanded=False):
            st.code(system_prompt, language="markdown")
    with yaml_expander:
        with st.expander("Tool declarations", expanded=False):
            st.code(yaml.safe_dump({"tools": declarations}, allow_unicode=True, sort_keys=False), language="yaml")

    version_rows = load_version_rows()
    st.markdown("#### Version evidence")
    st.dataframe(
        [{
            "Version": row.get("version"),
            "Changed": row.get("changed_artifact"),
            "Hypothesis": row.get("hypothesis"),
            "Before": row.get("metric_before") or "—",
            "After": row.get("metric_after") or "—",
            "Run": Path(row.get("run_file", "")).name,
        } for row in version_rows],
        width="stretch",
        hide_index=True,
    )
    st.info("Secrets are loaded from .env at runtime and are never rendered in this interface or written into transcripts.")
