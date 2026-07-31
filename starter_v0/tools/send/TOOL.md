---
name: send
track: bonus
kind: action
provider: Telegram Bot API
requires_env: [TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID]
inputs: [text, confirmed]
outputs: [status]
side_effect: true
---
# send

Posts exact content from an earlier conversation turn to the configured Telegram chat. A direct user request authorizes the model to call this tool once with `confirmed=true`; the implementation returns `action_completed` so the agent loop cannot send it twice. Low-level calls with `confirmed=false` remain blocked.
