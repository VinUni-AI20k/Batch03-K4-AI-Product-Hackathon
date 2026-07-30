---
name: search_social_topic
track: core
kind: live_api
provider: RapidAPI Twitter API45
requires_env: [RAPIDAPI_KEY, RAPIDAPI_TWITTER_HOST]
inputs: [query, search_type, limit]
outputs: [items]
side_effect: false
---
# search_social_topic

Searches posts about a topic when social/X is active. Explicit random/ngẫu nhiên
requests use `query="random"` and `random_mode=true`; the implementation chooses
one configured safe discovery topic and reports it as `selected_topic`.
`search_type` is `Latest` or `Top`.
