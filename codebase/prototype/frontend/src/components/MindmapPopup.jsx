import { useEffect, useMemo, useState } from 'react'
import Tree from 'react-d3-tree'
import ChatboxPanel from './ChatboxPanel'
import { getSummary, explain } from '../api'
import { scrollToPageAndHighlight } from '../scrollToPage'

function convertNode(node) {
  return {
    id: node.id,
    title: node.title,
    children: (node.children || []).map(convertNode),
  }
}

function buildFullTree(treeArray) {
  const converted = treeArray.map(convertNode)
  if (converted.length === 1) return converted[0]
  return { id: '__root__', title: 'Summary', children: converted }
}

function toDisplayTree(node, collapsedIds) {
  const hasChildren = (node.children || []).length > 0
  const isCollapsed = collapsedIds.has(node.id)
  return {
    name: node.title,
    attributes: { id: node.id, hasChildren },
    children: isCollapsed ? [] : node.children.map((child) => toDisplayTree(child, collapsedIds)),
  }
}

const NODE_WIDTH = 180
const NODE_HEIGHT = 40

function MindmapNode({ nodeDatum, onExplainNode, onToggle, loadingNodeId, isExplaining }) {
  const { id, hasChildren } = nodeDatum.attributes
  const isCollapsed = hasChildren && (!nodeDatum.children || nodeDatum.children.length === 0)
  const isLoading = loadingNodeId === id
  const isBlocked = isExplaining && !isLoading

  const boxClass = [
    'mindmap-node-box',
    hasChildren ? 'parent' : 'leaf',
    isLoading ? 'loading' : '',
    isBlocked ? 'blocked' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <g>
      <rect
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        x={-NODE_WIDTH / 2}
        y={-NODE_HEIGHT / 2}
        rx={10}
        className={boxClass}
        onClick={(e) => {
          e.stopPropagation()
          if (isExplaining) return
          onExplainNode(id, nodeDatum.name)
        }}
      />
      <text textAnchor="middle" dy={4} style={{ pointerEvents: 'none' }}>
        {nodeDatum.name.length > 24 ? `${nodeDatum.name.slice(0, 24)}...` : nodeDatum.name}
      </text>
      {hasChildren && (
        <>
          <circle
            cx={NODE_WIDTH / 2}
            cy={0}
            r={9}
            className="mindmap-toggle-icon"
            onClick={(e) => {
              e.stopPropagation()
              onToggle(id)
            }}
          />
          <text
            x={NODE_WIDTH / 2}
            y={0}
            dy={3}
            textAnchor="middle"
            className="mindmap-toggle-label"
            transform={`rotate(${isCollapsed ? 0 : 90}, ${NODE_WIDTH / 2}, 0)`}
            style={{ pointerEvents: 'none' }}
          >
            ▶
          </text>
        </>
      )}
    </g>
  )
}

export default function MindmapPopup({ documentId, sessionId, chatHistory, setChatHistory, onClose }) {
  const [rawTree, setRawTree] = useState(null)
  const [collapsedNodeIds, setCollapsedNodeIds] = useState(new Set())
  const [loadingNodeId, setLoadingNodeId] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSummary(documentId)
      .then((res) => setRawTree(res.tree))
      .catch((err) => setError(err.message))
  }, [documentId])

  async function handleRefresh() {
    setRefreshing(true)
    setError(null)
    try {
      const res = await getSummary(documentId, true)
      setRawTree(res.tree)
      setCollapsedNodeIds(new Set())
    } catch (err) {
      setError(err.message)
    } finally {
      setRefreshing(false)
    }
  }

  const fullTree = useMemo(() => (rawTree ? buildFullTree(rawTree) : null), [rawTree])
  const displayTree = useMemo(
    () => (fullTree ? toDisplayTree(fullTree, collapsedNodeIds) : null),
    [fullTree, collapsedNodeIds],
  )

  function toggleCollapse(nodeId) {
    setCollapsedNodeIds((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  async function handleExplainNode(nodeId, nodeTitle) {
    if (loadingNodeId) return
    setLoadingNodeId(nodeId)
    try {
      const res = await explain({ documentId, sessionId, mode: 'node', nodeId })
      setChatHistory((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          kind: 'node',
          label: nodeTitle,
          explanation: res.explanation,
          relatedPages: res.related_pages || [],
        },
      ])
    } finally {
      setLoadingNodeId(null)
    }
  }

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button type="button" className="popup-close" onClick={onClose}>
          ×
        </button>
        <div className="popup-title-row">
          <h2 className="popup-title">Tóm tắt / Mindmap</h2>
          <button type="button" className="mindmap-refresh-button" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? 'Đang tạo lại...' : '🔄 Tạo lại tóm tắt'}
          </button>
        </div>
        <div className="popup-body">
          <div className="mindmap-area">
            {error && <p className="error-banner">{error}</p>}
            {loadingNodeId && <p className="mindmap-loading">Đang giải thích...</p>}
            {displayTree && (
              <Tree
                data={displayTree}
                orientation="horizontal"
                renderCustomNodeElement={(props) => (
                  <MindmapNode
                    {...props}
                    onExplainNode={handleExplainNode}
                    onToggle={toggleCollapse}
                    loadingNodeId={loadingNodeId}
                    isExplaining={loadingNodeId !== null}
                  />
                )}
                collapsible={false}
                enableLegacyTransitions
                transitionDuration={450}
                translate={{ x: 150, y: 700 }}
                nodeSize={{ x: 220, y: 80 }}
                separation={{ siblings: 1, nonSiblings: 1.2 }}
              />
            )}
          </div>
          <ChatboxPanel
            history={chatHistory}
            pendingSelection={null}
            loading={false}
            onExplainPending={async () => {}}
            onRelatedPageClick={scrollToPageAndHighlight}
          />
        </div>
      </div>
    </div>
  )
}
