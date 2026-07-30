---
name: ask_for_missing_info
track: core
kind: control
requires_env: []
inputs: [question, response_type]
outputs: [question, response_type, awaiting_user]
side_effect: false
---
# ask_for_missing_info

Asks one free-text question for a required account, handle, URL, or other
research input, then pauses until the next user turn.
