import { useRef, useState } from 'react'

import type { DocumentSummary } from '../types'
import { Icon } from './Icon'

interface Props {
  documents: DocumentSummary[]
  activeId: string | null
  uploading: boolean
  onUpload: (file: File) => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function Sidebar({ documents, activeId, uploading, onUpload, onSelect, onDelete }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const takeFile = (files: FileList | null) => {
    const file = files?.[0]
    if (file) onUpload(file)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <span className="sidebar-title">Documents</span>
        <button
          className={`dropzone ${dragOver ? 'over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragOver(false)
            takeFile(event.dataTransfer.files)
          }}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <div className="spinner" style={{ margin: '0 auto 6px' }} />
              Processing PDF…
            </>
          ) : (
            <>
              <strong>Upload a PDF</strong>
              drag &amp; drop or click to browse
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(event) => {
            takeFile(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      <div className="doc-list">
        {documents.map((document) => (
          <div
            key={document.id}
            className={`doc-item ${document.id === activeId ? 'active' : ''}`}
            onClick={() => onSelect(document.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onSelect(document.id)
            }}
          >
            <Icon name="file" size={14} />
            <div className="doc-item-body">
              <div className="doc-item-name" title={document.filename}>
                {document.filename}
              </div>
              <div className="doc-item-meta">
                {document.page_count} pages · {formatSize(document.size_bytes)}
              </div>
            </div>
            <button
              className="btn-icon"
              title="Delete"
              onClick={(event) => {
                event.stopPropagation()
                onDelete(document.id)
              }}
            >
              <Icon name="trash" size={13} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  )
}
