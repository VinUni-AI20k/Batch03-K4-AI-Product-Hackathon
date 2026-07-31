---
name: citation_audit
track: core
kind: local_validator
provider: local
requires_env: []
inputs: [items, require_https]
outputs: [items, summary, duplicate_urls]
side_effect: false
---
# citation_audit

Audits citation metadata that has already been collected. It reports missing or
invalid URLs, non-HTTPS links, duplicate URLs, and missing titles. It does not
search the web, read URLs, or decide whether a factual claim is true.
