// js/connections.js - SVG Connection Lines, Curves, Orthogonal Steps & Routing

export class ConnectionManager {
  constructor(svgGroupEl, tempSvgGroupEl, getNodesFn, onConnectionSelect) {
    this.svgGroup = svgGroupEl;
    this.tempGroup = tempSvgGroupEl;
    this.getNodes = getNodesFn;
    this.onConnectionSelect = onConnectionSelect;

    this.connections = [];
    this.selectedConnectionId = null;
    this.lineStyle = 'smooth'; // 'smooth' | 'orthogonal' | 'straight'
  }

  setConnections(connections) {
    this.connections = connections;
    this.render();
  }

  getConnections() {
    return this.connections;
  }

  setLineStyle(style) {
    this.lineStyle = style;
    this.render();
  }

  addConnection(conn) {
    // Prevent duplicate connections between same nodes and ports
    const exists = this.connections.some(c => 
      (c.from === conn.from && c.to === conn.to) ||
      (c.from === conn.to && c.to === conn.from)
    );
    if (exists) return null;

    if (!conn.id) conn.id = 'conn-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    this.connections.push(conn);
    this.render();
    return conn;
  }

  removeConnection(connId) {
    this.connections = this.connections.filter(c => c.id !== connId);
    if (this.selectedConnectionId === connId) {
      this.selectedConnectionId = null;
    }
    this.render();
  }

  removeConnectionsForNode(nodeId) {
    this.connections = this.connections.filter(c => c.from !== nodeId && c.to !== nodeId);
    this.render();
  }

  selectConnection(connId) {
    this.selectedConnectionId = connId;
    this.render();
    if (this.onConnectionSelect) {
      this.onConnectionSelect(connId);
    }
  }

  getNodePortCoordinates(nodeId, port = 'auto', targetCoords = null) {
    const nodes = this.getNodes();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    const nodeEl = document.getElementById(nodeId);
    const width = nodeEl ? nodeEl.offsetWidth : 210;
    const height = nodeEl ? nodeEl.offsetHeight : 70;

    const left = node.x;
    const top = node.y;
    const right = left + width;
    const bottom = top + height;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    if (port === 'top') return { x: centerX, y: top, dir: 'up' };
    if (port === 'bottom') return { x: centerX, y: bottom, dir: 'down' };
    if (port === 'left') return { x: left, y: centerY, dir: 'left' };
    if (port === 'right') return { x: right, y: centerY, dir: 'right' };

    // Auto calculate closest port to target
    if (targetCoords) {
      const dx = targetCoords.x - centerX;
      const dy = targetCoords.y - centerY;

      if (Math.abs(dy) > Math.abs(dx)) {
        return dy > 0 
          ? { x: centerX, y: bottom, dir: 'down' }
          : { x: centerX, y: top, dir: 'up' };
      } else {
        return dx > 0
          ? { x: right, y: centerY, dir: 'right' }
          : { x: left, y: centerY, dir: 'left' };
      }
    }

    return { x: centerX, y: bottom, dir: 'down' };
  }

  render() {
    this.svgGroup.innerHTML = '';
    const nodes = this.getNodes();

    this.connections.forEach(conn => {
      const sourceNode = nodes.find(n => n.id === conn.from);
      const targetNode = nodes.find(n => n.id === conn.to);
      if (!sourceNode || !targetNode) return;

      const p1 = this.getNodePortCoordinates(conn.from, conn.fromPort || 'bottom', { x: targetNode.x, y: targetNode.y });
      const p2 = this.getNodePortCoordinates(conn.to, conn.toPort || 'top', { x: sourceNode.x, y: sourceNode.y });

      const d = this.calculatePathD(p1, p2, this.lineStyle);

      // Wrapper group for click hit area and visual line
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.dataset.id = conn.id;

      // Hit area (invisible thicker path for easy clicking/tapping)
      const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hitPath.setAttribute('d', d);
      hitPath.setAttribute('fill', 'none');
      hitPath.setAttribute('stroke', 'transparent');
      hitPath.setAttribute('stroke-width', '16');
      hitPath.style.cursor = 'pointer';

      // Visual line
      const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      linePath.setAttribute('d', d);
      linePath.setAttribute('class', `connection-path ${this.selectedConnectionId === conn.id ? 'selected' : ''}`);
      linePath.setAttribute('marker-end', this.selectedConnectionId === conn.id ? 'url(#arrowhead-selected)' : 'url(#arrowhead)');

      g.appendChild(hitPath);
      g.appendChild(linePath);

      // Connection Label (e.g. "Yes", "No") if provided
      if (conn.label) {
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY - 6);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'var(--text-muted)');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', '700');
        text.textContent = conn.label;
        g.appendChild(text);
      }

      // Event listener for selecting or deleting connection
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectConnection(conn.id);
      });

      this.svgGroup.appendChild(g);
    });
  }

  calculatePathD(p1, p2, style) {
    if (style === 'straight') {
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    }

    if (style === 'orthogonal') {
      // Stepped right-angle orthogonal path
      const midY = (p1.y + p2.y) / 2;
      const midX = (p1.x + p2.x) / 2;

      if (p1.dir === 'down' || p1.dir === 'up') {
        return `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
      } else {
        return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
      }
    }

    // Default: 'smooth' cubic Bezier
    const dx = Math.abs(p2.x - p1.x);
    const dy = Math.abs(p2.y - p1.y);
    const curvature = Math.max(30, Math.min(120, Math.max(dx, dy) * 0.45));

    let cp1x = p1.x;
    let cp1y = p1.y;
    let cp2x = p2.x;
    let cp2y = p2.y;

    if (p1.dir === 'down') cp1y += curvature;
    else if (p1.dir === 'up') cp1y -= curvature;
    else if (p1.dir === 'right') cp1x += curvature;
    else if (p1.dir === 'left') cp1x -= curvature;

    if (p2.dir === 'down') cp2y += curvature;
    else if (p2.dir === 'up') cp2y -= curvature;
    else if (p2.dir === 'right') cp2x += curvature;
    else if (p2.dir === 'left') cp2x -= curvature;

    return `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  // Draw temporary dragging line from a port to current cursor
  drawTempLine(p1, cursorX, cursorY) {
    this.tempGroup.innerHTML = '';
    const p2 = { x: cursorX, y: cursorY, dir: 'up' };
    const d = this.calculatePathD(p1, p2, this.lineStyle);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'temp-connection-path');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    this.tempGroup.appendChild(path);
  }

  clearTempLine() {
    this.tempGroup.innerHTML = '';
  }
}
