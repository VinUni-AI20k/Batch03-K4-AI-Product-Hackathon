---
name: confirm_action
track: core
kind: control
requires_env: []
inputs: [question, response_type]
outputs: [question, response_type, awaiting_user]
side_effect: false
---
# confirm_action

Asks a yes/no question before an external write action, then pauses until the
next user turn. It never performs the action itself.
