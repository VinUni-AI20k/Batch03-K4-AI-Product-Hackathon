import { Fragment, type ReactNode } from 'react'

/**
 * Minimal renderer for the light markdown the model produces: paragraphs,
 * dash bullets, **bold** and `code`. Deliberately not a full parser — this
 * keeps the bundle small and avoids rendering arbitrary HTML.
 */
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`)/g

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }
    return <Fragment key={index}>{part}</Fragment>
  })
}

export function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  let bullets: string[] = []

  const flushBullets = () => {
    if (!bullets.length) return
    blocks.push(
      <ul key={`ul-${blocks.length}`}>
        {bullets.map((item, index) => (
          <li key={index}>{inline(item)}</li>
        ))}
      </ul>,
    )
    bullets = []
  }

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) {
      flushBullets()
      continue
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/)
    if (bullet) {
      bullets.push(bullet[1])
      continue
    }
    flushBullets()
    blocks.push(<p key={`p-${blocks.length}`}>{inline(line)}</p>)
  }
  flushBullets()

  return <div className="msg-body">{blocks}</div>
}
