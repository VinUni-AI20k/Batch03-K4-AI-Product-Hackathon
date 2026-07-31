"""HITL (human-in-the-loop) approval — list, approve, and reject items the
graph paused on at hitl_escalation (confidence < 0.85, see graph.py's
route_by_confidence).

No separate "pending approvals" table: interrupt_before=["hitl_escalation"]
already leaves each escalated thread paused mid-graph, and its checkpointer
(SqliteSaver) can enumerate every thread_id via checkpointer.list(None) —
confirmed this actually works (a quick script against a live paused thread)
before building anything on the assumption a new table was needed.
graph.get_state(config).next tells us which threads are still paused
(== ("hitl_escalation",)) vs. already resolved (== ()).

Approve/reject are per-item, not per-thread: a single ingestion call can
produce more than one hitl_item on the same thread (ai_extraction_node can
return several items from one message), so resuming the graph only happens
once every item on that thread has been explicitly approved or rejected —
handled item by item via graph.update_state(..., {"hitl_items": {"action":
"delete", "ids": [item_id]}}), using dedupe_list_reducer's own delete
action (see state.py) rather than resuming (and thereby finalizing) a
thread that still has unhandled siblings.

Approve bypasses dashboard_sync_node entirely (there's no graph edge from
hitl_escalation back to it — hitl_escalation is a terminal path, see
graph.py's route_after_hitl) — this module does what dashboard_sync_node
would have done (save + index) for the approved item.
"""

from __future__ import annotations

from typing import Any

from .graph import get_compiled_graph
from .storage import get_db
from .vector_store import get_vector_store


def _all_thread_ids() -> set[str]:
    graph = get_compiled_graph()
    return {
        c.config["configurable"]["thread_id"]
        for c in graph.checkpointer.list(None)
        if c.config.get("configurable", {}).get("thread_id")
    }


def list_pending() -> list[dict[str, Any]]:
    """Every hitl_item still awaiting review, across every paused thread —
    each with its thread_id attached, since approve()/reject() need it."""
    graph = get_compiled_graph()
    pending: list[dict[str, Any]] = []
    for thread_id in _all_thread_ids():
        snapshot = graph.get_state({"configurable": {"thread_id": thread_id}})
        if snapshot.next != ("hitl_escalation",):
            continue
        for item in snapshot.values.get("hitl_items", []):
            pending.append({**item, "thread_id": thread_id})
    return pending


def _resume(thread_id: str) -> None:
    """Let the paused thread finish (hitl_escalation -> response_formatter
    -> END) now that every item on it has been handled."""
    get_compiled_graph().invoke(None, config={"configurable": {"thread_id": thread_id}})


def _get_pending_item(thread_id: str, item_id: str):
    """Returns (graph, config, snapshot, item, remaining_items) for one
    pending item, or None if thread_id/item_id don't match a currently-
    paused item — the shared lookup approve()/reject() both need."""
    graph = get_compiled_graph()
    config = {"configurable": {"thread_id": thread_id}}
    snapshot = graph.get_state(config)
    if snapshot.next != ("hitl_escalation",):
        return None
    hitl_items = snapshot.values.get("hitl_items", [])
    item = next((i for i in hitl_items if i.get("id") == item_id), None)
    if item is None:
        return None
    remaining = [i for i in hitl_items if i.get("id") != item_id]
    return graph, config, item, remaining


def approve(thread_id: str, item_id: str, edits: dict[str, Any] | None = None) -> dict[str, Any] | None:
    """Save this item to SQLite/FAISS despite its low confidence (what
    dashboard_sync_node does for auto-approved items), remove it from the
    thread's pending set, and resume the thread once nothing's left on it.
    `edits` lets a reviewer fix the item (e.g. supply the due_date
    extraction couldn't confirm) before it's saved. Returns the saved item,
    or None if this thread_id/item_id doesn't match a pending item."""
    found = _get_pending_item(thread_id, item_id)
    if found is None:
        return None
    graph, config, item, remaining = found

    if edits:
        item = {**item, **edits}

    get_db().save_timeline_item(item)
    get_vector_store().index_timeline_items([item])

    graph.update_state(config, {"hitl_items": {"action": "delete", "ids": [item_id]}})
    if not remaining:
        _resume(thread_id)
    return item


def reject(thread_id: str, item_id: str) -> bool:
    """Discard this item (never saved), remove it from the thread's
    pending set, and resume the thread once nothing's left on it."""
    found = _get_pending_item(thread_id, item_id)
    if found is None:
        return False
    graph, config, _item, remaining = found

    graph.update_state(config, {"hitl_items": {"action": "delete", "ids": [item_id]}})
    if not remaining:
        _resume(thread_id)
    return True
