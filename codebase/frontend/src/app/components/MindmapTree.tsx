'use client';

import React, { useMemo, useRef, useState } from 'react';

// Node phẳng đúng shape MindmapNode ở backend (app/schemas.py): mỗi node trỏ về cha qua
// parent_id, có thể lồng nhiều cấp (không giới hạn 2 cấp như bản cũ).
export interface MindmapTreeNode {
  id: string;
  label: string;
  parent_id?: string | null;
}

interface Props {
  rootLabel: string;
  nodes: MindmapTreeNode[];
}

interface InternalNode {
  label: string;
  children: InternalNode[];
}

interface LaidOutNode {
  path: string;
  label: string;
  depth: number;
  x: number;
  y: number;
  hasChildren: boolean;
  isCollapsed: boolean;
  visibleChildren: LaidOutNode[];
}

interface Link {
  source: LaidOutNode;
  target: LaidOutNode;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 46;
const LEVEL_GAP = 230;
const SIBLING_GAP = 62;
const CANVAS_PADDING = 60;

// Cây đơn giản để demo khi chưa có dữ liệu thật từ backend.
const DEMO_TREE: InternalNode = {
  label: 'Control Flow',
  children: [
    {
      label: 'if / else',
      children: [
        { label: 'Điều kiện đúng/sai', children: [] },
        { label: 'Rẽ nhánh chương trình', children: [] },
      ],
    },
    {
      label: 'for loop',
      children: [
        { label: 'Lặp qua tập hợp', children: [] },
        { label: 'range(), list, string', children: [] },
      ],
    },
    {
      label: 'while loop',
      children: [
        { label: 'Lặp khi còn đúng', children: [] },
        { label: 'Cẩn thận vòng lặp vô hạn', children: [] },
      ],
    },
  ],
};

// Dựng cây lồng nhau (đa cấp) từ danh sách node phẳng root_label + nodes[parent_id].
function buildTree(rootLabel: string, nodes: MindmapTreeNode[]): InternalNode {
  const childrenByParent = new Map<string, MindmapTreeNode[]>();
  nodes.forEach((n) => {
    const key = n.parent_id || '__root__';
    const list = childrenByParent.get(key) || [];
    list.push(n);
    childrenByParent.set(key, list);
  });

  // Tránh vòng lặp vô hạn nếu dữ liệu backend lỡ có parent_id trỏ vòng.
  const build = (id: string, label: string, visited: Set<string>): InternalNode => {
    const children = (childrenByParent.get(id) || [])
      .filter((c) => !visited.has(c.id))
      .map((c) => build(c.id, c.label, new Set(visited).add(c.id)));
    return { label, children };
  };

  const rootChildren = (childrenByParent.get('__root__') || []).map((n) =>
    build(n.id, n.label, new Set([n.id]))
  );
  return { label: rootLabel, children: rootChildren };
}

export default function MindmapTree({ rootLabel, nodes }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: CANVAS_PADDING, y: CANVAS_PADDING });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const tree = useMemo(
    () => (nodes && nodes.length > 0 ? buildTree(rootLabel, nodes) : DEMO_TREE),
    [rootLabel, nodes]
  );

  const layout = useMemo(() => {
    const allNodes: LaidOutNode[] = [];
    const links: Link[] = [];
    let leafCursor = 0;

    const process = (node: InternalNode, depth: number, path: string): LaidOutNode => {
      const isCollapsed = collapsed.has(path);
      const laid: LaidOutNode = {
        path,
        label: node.label,
        depth,
        x: depth * LEVEL_GAP,
        y: 0,
        hasChildren: node.children.length > 0,
        isCollapsed,
        visibleChildren: [],
      };
      if (node.children.length > 0 && !isCollapsed) {
        laid.visibleChildren = node.children.map((child, i) =>
          process(child, depth + 1, `${path}-${i}`)
        );
      }
      return laid;
    };

    const root = process(tree, 0, '0');

    const assignPositions = (node: LaidOutNode) => {
      if (node.visibleChildren.length === 0) {
        node.y = leafCursor * SIBLING_GAP;
        leafCursor += 1;
      } else {
        node.visibleChildren.forEach(assignPositions);
        const first = node.visibleChildren[0].y;
        const last = node.visibleChildren[node.visibleChildren.length - 1].y;
        node.y = (first + last) / 2;
      }
      allNodes.push(node);
      node.visibleChildren.forEach((child) => links.push({ source: node, target: child }));
    };
    assignPositions(root);

    const maxX = Math.max(...allNodes.map((n) => n.x));
    const maxY = Math.max(...allNodes.map((n) => n.y));
    return { nodes: allNodes, links, width: maxX + NODE_WIDTH + CANVAS_PADDING, height: maxY + NODE_HEIGHT + CANVAS_PADDING };
  }, [tree, collapsed]);

  const toggleNode = (path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(0.4, s * delta), 2.2));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.mmtree-toggle') || target.closest('.mmtree-toolbar')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
  };

  const stopDragging = () => setIsDragging(false);

  const resetView = () => {
    setScale(1);
    setOffset({ x: CANVAS_PADDING, y: CANVAS_PADDING });
  };

  return (
    <div
      className="mmtree-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onWheel={handleWheel}
    >
      <div className="mmtree-toolbar">
        <button type="button" onClick={() => setScale((s) => Math.max(0.4, s - 0.15))} title="Thu nhỏ">−</button>
        <span>{Math.round(scale * 100)}%</span>
        <button type="button" onClick={() => setScale((s) => Math.min(2.2, s + 0.15))} title="Phóng to">+</button>
        <button type="button" onClick={resetView} title="Đặt lại vị trí">⤾</button>
      </div>

      <div
        className="mmtree-viewport"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <svg width={layout.width} height={layout.height} className="mmtree-svg">
          {layout.links.map((link) => {
            const startX = link.source.x + NODE_WIDTH;
            const startY = link.source.y + NODE_HEIGHT / 2;
            const endX = link.target.x;
            const endY = link.target.y + NODE_HEIGHT / 2;
            const midX = startX + (endX - startX) / 2;
            const d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
            return (
              <path
                key={`${link.source.path}-${link.target.path}`}
                d={d}
                fill="none"
                stroke={link.source.depth === 0 ? 'var(--accent)' : '#c7cbe0'}
                strokeWidth={2.5}
                strokeOpacity={0.7}
              />
            );
          })}
        </svg>

        {layout.nodes.map((node) => (
          <div
            key={node.path}
            className={`mmtree-node depth-${Math.min(node.depth, 2)}`}
            style={{ left: node.x, top: node.y, width: NODE_WIDTH, minHeight: NODE_HEIGHT }}
          >
            <span>{node.label}</span>
            {node.hasChildren && (
              <button
                type="button"
                className="mmtree-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.path);
                }}
                title={node.isCollapsed ? 'Mở nhánh' : 'Thu gọn nhánh'}
              >
                {node.isCollapsed ? '+' : '−'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
