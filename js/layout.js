// js/layout.js - Automatic Hierarchical Tree & Flowchart Layout Engine

export function autoArrangeLayout(nodes, connections, options = {}) {
  if (!nodes || nodes.length === 0) return nodes;

  const nodeWidth = options.nodeWidth || 220;
  const nodeHeight = options.nodeHeight || 80;
  const horizontalGap = options.horizontalGap || 70;
  const verticalGap = options.verticalGap || 110;

  // Build adjacency graph
  const inDegree = new Map();
  const childrenMap = new Map();

  nodes.forEach(n => {
    inDegree.set(n.id, 0);
    childrenMap.set(n.id, []);
  });

  connections.forEach(c => {
    if (childrenMap.has(c.from)) {
      childrenMap.get(c.from).push(c.to);
    }
    if (inDegree.has(c.to)) {
      inDegree.set(c.to, inDegree.get(c.to) + 1);
    }
  });

  // Find root nodes (inDegree === 0)
  let roots = nodes.filter(n => inDegree.get(n.id) === 0);
  if (roots.length === 0) {
    roots = [nodes[0]]; // fallback for cyclic graphs
  }

  // Assign levels via BFS
  const levelMap = new Map();
  const visited = new Set();
  const queue = [];

  roots.forEach(r => {
    queue.push({ id: r.id, level: 0 });
    levelMap.set(r.id, 0);
    visited.add(r.id);
  });

  while (queue.length > 0) {
    const { id, level } = queue.shift();
    const children = childrenMap.get(id) || [];

    children.forEach(childId => {
      const currentLevel = levelMap.get(childId);
      const newLevel = level + 1;

      if (currentLevel === undefined || newLevel > currentLevel) {
        levelMap.set(childId, newLevel);
      }

      if (!visited.has(childId)) {
        visited.add(childId);
        queue.push({ id: childId, level: newLevel });
      }
    });
  }

  // Handle any disconnected nodes
  nodes.forEach(n => {
    if (!levelMap.has(n.id)) {
      levelMap.set(n.id, 0);
    }
  });

  // Group nodes by level
  const levels = [];
  nodes.forEach(n => {
    const lvl = levelMap.get(n.id);
    if (!levels[lvl]) levels[lvl] = [];
    levels[lvl].push(n);
  });

  // Position nodes layer by layer
  const startY = 80;
  const maxRowWidth = Math.max(...levels.map(row => (row.length * (nodeWidth + horizontalGap)) - horizontalGap));
  const centerX = Math.max(500, maxRowWidth / 2 + 100);

  levels.forEach((row, lvlIndex) => {
    const rowWidth = (row.length * (nodeWidth + horizontalGap)) - horizontalGap;
    const startX = centerX - (rowWidth / 2);
    const y = startY + lvlIndex * (nodeHeight + verticalGap);

    row.forEach((node, colIndex) => {
      node.x = Math.round(startX + colIndex * (nodeWidth + horizontalGap));
      node.y = Math.round(y);
    });
  });

  return nodes;
}
