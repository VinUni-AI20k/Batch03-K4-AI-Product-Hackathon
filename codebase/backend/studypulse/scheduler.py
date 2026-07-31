"""
=============================================================================
STUDYPULSE AI — BACKGROUND DEADLINE SCHEDULER (CRON/SCHEDULER AGENT)
=============================================================================
Polls SQLite database for deadlines exactly 10 minutes (0 to 10 min window)
from now and triggers high-urgency notifications using LangGraph.
=============================================================================
"""

import threading
import time
import logging
from datetime import datetime
from typing import Any, Dict, Optional

from .storage import get_db
from .state import StudyPulseState

logger = logging.getLogger(__name__)


class DeadlineScheduler:
    """
    Cron / Scheduler Agent that runs in a background thread.
    Polls SQLite database for items with deadlines due in 10 minutes.
    """

    def __init__(self, app: Any, poll_interval_sec: float = 10.0):
        self.app = app
        self.poll_interval_sec = poll_interval_sec
        self._stop_event = threading.Event()
        self._thread: Optional[threading.Thread] = None

    def start(self):
        """Start the background scheduler thread."""
        if self._thread is not None and self._thread.is_alive():
            logger.warning("Scheduler is already running.")
            return

        self._stop_event.clear()
        self._thread = threading.Thread(target=self._poll_loop, daemon=True)
        self._thread.start()
        logger.info(f"Deadline background scheduler started (interval: {self.poll_interval_sec}s)")

    def stop(self):
        """Stop the background scheduler thread."""
        if self._thread is None:
            return
        self._stop_event.set()
        self._thread.join(timeout=2.0)
        self._thread = None
        logger.info("Deadline background scheduler stopped")

    def _poll_loop(self):
        """Periodically polls DB for upcoming deadlines."""
        db = get_db()
        while not self._stop_event.is_set():
            try:
                # Find items due in <= 10 minutes that haven't been alerted yet
                upcoming_items = db.get_pending_alerts(window_minutes=10)
                for item in upcoming_items:
                    item_id = item.get("id")
                    if not item_id:
                        continue

                    logger.info(f"Triggering 10-minute alert for item {item_id}: {item.get('title')}")
                    
                    # Prepare state for LangGraph emergency_alert flow
                    state = {
                        "flow_type": "emergency_alert",
                        "dashboard_timeline": [item],
                        "language": item.get("language_detected", "vi"),
                    }
                    
                    config = {"configurable": {"thread_id": f"emergency_alert_{item_id}"}}
                    final_state = self.app.invoke(state, config=config)
                    
                    # Print response (acting as sending notification)
                    alert_msg = final_state.get("final_response", "")
                    print(f"\n--- EMERGENCY NOTIFICATION BROADCAST ---")
                    print(alert_msg)
                    print(f"----------------------------------------\n")
                    
                    # Mark alert sent in DB to prevent duplicate notification triggers
                    db.mark_alert_sent(item_id)
            except Exception as e:
                logger.error(f"Error in scheduler poll loop: {e}", exc_info=True)

            # Sleep in small increments to check stop event responsiveness
            sleep_elapsed = 0.0
            while sleep_elapsed < self.poll_interval_sec:
                if self._stop_event.is_set():
                    break
                time.sleep(0.5)
                sleep_elapsed += 0.5
