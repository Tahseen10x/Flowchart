// TreeFlow Studio - Standalone Universal Bundle with Smart Auto-Alignment & Scale Rulers

(function () {
  'use strict';

  // ==========================================================================
  // 1. Templates Definition
  // ==========================================================================
  const TEMPLATES = {
    'family-3gen': {
      title: 'Royal 3-Generation Family Tree',
      mode: 'family',
      pageSize: 'a4',
      orientation: 'landscape',
      lineStyle: 'smooth',
      nodes: [
        { id: 'node-gp1', x: 240, y: 80, title: 'Arthur Pendelton', subtitle: 'Grandfather (Paternal)', details: '1940 – 2018', avatar: 'elder-m', theme: 'blue', shape: 'process' },
        { id: 'node-gp2', x: 500, y: 80, title: 'Eleanor Pendelton', subtitle: 'Grandmother (Paternal)', details: '1944 – Present', avatar: 'elder-f', theme: 'rose', shape: 'process' },
        { id: 'node-p1', x: 370, y: 260, title: 'James Pendelton', subtitle: 'Father', details: '1970 – Present', avatar: 'man', theme: 'blue', shape: 'process' },
        { id: 'node-p2', x: 650, y: 260, title: 'Clara Jenkins', subtitle: 'Mother', details: '1973 – Present', avatar: 'woman', theme: 'rose', shape: 'process' },
        { id: 'node-c1', x: 260, y: 460, title: 'Lucas Pendelton', subtitle: 'Son (Firstborn)', details: '2001 – Present', avatar: 'man', theme: 'emerald', shape: 'process' },
        { id: 'node-c2', x: 510, y: 460, title: 'Sophia Pendelton', subtitle: 'Daughter', details: '2005 – Present', avatar: 'woman', theme: 'purple', shape: 'process' },
        { id: 'node-c3', x: 760, y: 460, title: 'Oliver Pendelton', subtitle: 'Son', details: '2010 – Present', avatar: 'child', theme: 'amber', shape: 'process' }
      ],
      connections: [
        { id: 'c-1', from: 'node-gp1', to: 'node-p1', fromPort: 'bottom', toPort: 'top' },
        { id: 'c-2', from: 'node-gp2', to: 'node-p1', fromPort: 'bottom', toPort: 'top' },
        { id: 'c-3', from: 'node-p1', to: 'node-p2', fromPort: 'right', toPort: 'left' },
        { id: 'c-4', from: 'node-p1', to: 'node-c1', fromPort: 'bottom', toPort: 'top' },
        { id: 'c-5', from: 'node-p1', to: 'node-c2', fromPort: 'bottom', toPort: 'top' },
        { id: 'c-6', from: 'node-p2', to: 'node-c3', fromPort: 'bottom', toPort: 'top' }
      ]
    },
    'flowchart-standard': {
      title: 'User Authentication Flow',
      mode: 'flowchart',
      pageSize: 'a4',
      orientation: 'portrait',
      lineStyle: 'orthogonal',
      nodes: [
        { id: 'flow-1', x: 280, y: 60, title: 'Start Process', subtitle: 'User opens login page', details: 'Trigger: HTTP GET /login', avatar: 'none', theme: 'emerald', shape: 'terminal' },
        { id: 'flow-2', x: 280, y: 190, title: 'Input Credentials', subtitle: 'Email and password', details: 'Form Validation', avatar: 'none', theme: 'blue', shape: 'process' },
        { id: 'flow-3', x: 280, y: 330, title: 'Valid Credentials?', subtitle: 'Verify bcrypt hash in DB', details: 'Condition Check', avatar: 'none', theme: 'amber', shape: 'decision' },
        { id: 'flow-4', x: 520, y: 330, title: 'Show Error Alert', subtitle: 'Invalid login notice', details: 'Increment failed attempts', avatar: 'none', theme: 'rose', shape: 'process' },
        { id: 'flow-5', x: 280, y: 490, title: 'Create Session JWT', subtitle: 'Issue cookie token', details: 'Expiry: 7 Days', avatar: 'none', theme: 'purple', shape: 'process' },
        { id: 'flow-6', x: 280, y: 630, title: 'Redirect to Dashboard', subtitle: 'Access Granted', details: 'End Flow', avatar: 'none', theme: 'cyan', shape: 'terminal' }
      ],
      connections: [
        { id: 'fc-1', from: 'flow-1', to: 'flow-2', fromPort: 'bottom', toPort: 'top' },
        { id: 'fc-2', from: 'flow-2', to: 'flow-3', fromPort: 'bottom', toPort: 'top' },
        { id: 'fc-3', from: 'flow-3', to: 'flow-4', fromPort: 'right', toPort: 'left', label: 'No' },
        { id: 'fc-4', from: 'flow-3', to: 'flow-5', fromPort: 'bottom', toPort: 'top', label: 'Yes' },
        { id: 'fc-5', from: 'flow-5', to: 'flow-6', fromPort: 'bottom', toPort: 'top' }
      ]
    },
    'org-chart': {
      title: 'Company Executive Structure',
      mode: 'flowchart',
      pageSize: 'a4',
      orientation: 'landscape',
      lineStyle: 'orthogonal',
      nodes: [
        { id: 'org-1', x: 440, y: 80, title: 'Chief Executive Officer', subtitle: 'Executive Leadership', details: 'Oversees strategy & operations', avatar: 'man', theme: 'emerald', shape: 'process' },
        { id: 'org-2', x: 180, y: 260, title: 'VP of Technology', subtitle: 'Engineering & R&D', details: 'Infrastructure, Cloud, AI', avatar: 'woman', theme: 'blue', shape: 'process' },
        { id: 'org-3', x: 440, y: 260, title: 'VP of Product', subtitle: 'Design & Customer UX', details: 'Roadmap & Feature Delivery', avatar: 'man', theme: 'purple', shape: 'process' },
        { id: 'org-4', x: 700, y: 260, title: 'VP of Growth', subtitle: 'Marketing & Global Sales', details: 'Revenue & Partnerships', avatar: 'woman', theme: 'amber', shape: 'process' }
      ],
      connections: [
        { id: 'oc-1', from: 'org-1', to: 'org-2', fromPort: 'bottom', toPort: 'top' },
        { id: 'oc-2', from: 'org-1', to: 'org-3', fromPort: 'bottom', toPort: 'top' },
        { id: 'oc-3', from: 'org-1', to: 'org-4', fromPort: 'bottom', toPort: 'top' }
      ]
    },
    'blank': {
      title: 'Untitled Chart',
      mode: 'family',
      pageSize: 'a4',
      orientation: 'landscape',
      lineStyle: 'smooth',
      nodes: [
        { id: 'node-root', x: 420, y: 240, title: 'Root Member / Step', subtitle: 'Click + to expand', details: 'Primary Node', avatar: 'man', theme: 'blue', shape: 'process' }
      ],
      connections: []
    }
  };

  // ==========================================================================
  // 2. Constants & Helpers
  // ==========================================================================
  const AVATAR_ICONS = {
    'man': '👨',
    'woman': '👩',
    'child': '👶',
    'elder-m': '👴',
    'elder-f': '👵',
    'none': '◽'
  };

  const PAGE_DIMENSIONS = {
    a4: { width: 1123, height: 794, label: 'A4 (210 × 297 mm)' },
    a3: { width: 1587, height: 1123, label: 'A3 (297 × 420 mm)' },
    letter: { width: 1056, height: 816, label: 'US Letter (8.5 × 11 in)' },
    legal: { width: 1344, height: 816, label: 'US Legal (8.5 × 14 in)' },
    screen169: { width: 1440, height: 810, label: 'Screen 16:9' },
    infinite: { width: 6000, height: 4000, label: 'Infinite Canvas' }
  };

  // ==========================================================================
  // 3. CanvasManager
  // ==========================================================================
  class CanvasManager {
    constructor(viewportEl, worldEl, pageSheetEl, onTransformChange) {
      this.viewport = viewportEl;
      this.world = worldEl;
      this.pageSheet = pageSheetEl;
      this.onTransformChange = onTransformChange;

      this.scale = 1.0;
      this.panX = 0;
      this.panY = 0;

      this.minScale = 0.25;
      this.maxScale = 3.0;

      this.pageSize = 'a4';
      this.orientation = 'landscape';

      this.isPanning = false;
      this.startX = 0;
      this.startY = 0;
      this.spacePressed = false;

      this.init();
    }

    init() {
      this.updatePageDimensions();
      this.centerView();
      this.attachEvents();
    }

    updatePageDimensions() {
      const isInfinite = this.pageSize === 'infinite';

      if (isInfinite) {
        this.pageSheet.classList.add('infinite');
        const labelEl = document.getElementById('pageSheetLabel');
        if (labelEl) labelEl.textContent = 'Infinite Canvas';
        return;
      }

      this.pageSheet.classList.remove('infinite');
      const base = PAGE_DIMENSIONS[this.pageSize] || PAGE_DIMENSIONS.a4;
      let w = base.width;
      let h = base.height;

      if (this.orientation === 'portrait') {
        const minDim = Math.min(w, h);
        const maxDim = Math.max(w, h);
        w = minDim;
        h = maxDim;
      } else {
        const minDim = Math.min(w, h);
        const maxDim = Math.max(w, h);
        w = maxDim;
        h = minDim;
      }

      this.pageSheet.style.width = w + 'px';
      this.pageSheet.style.height = h + 'px';

      const labelEl = document.getElementById('pageSheetLabel');
      if (labelEl) {
        const capitalized = this.orientation.charAt(0).toUpperCase() + this.orientation.slice(1);
        labelEl.textContent = this.pageSize.toUpperCase() + ' • ' + capitalized;
      }
    }

    setPageSize(size) {
      this.pageSize = size;
      this.updatePageDimensions();
    }

    setOrientation(orientation) {
      this.orientation = orientation;
      this.updatePageDimensions();
    }

    attachEvents() {
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          this.spacePressed = true;
          this.viewport.style.cursor = 'grab';
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
          this.spacePressed = false;
          if (!this.isPanning) {
            this.viewport.style.cursor = 'default';
          }
        }
      });

      this.viewport.addEventListener('mousedown', (e) => {
        const isMiddleClick = e.button === 1;
        const isLeftOnBackground = e.button === 0 && (
          e.target === this.viewport || 
          e.target === this.world || 
          e.target === this.pageSheet || 
          e.target.id === 'connectionsSvg'
        );

        if (isMiddleClick || this.spacePressed || isLeftOnBackground) {
          this.isPanning = true;
          this.startX = e.clientX - this.panX;
          this.startY = e.clientY - this.panY;
          this.viewport.classList.add('panning');
          e.preventDefault();
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isPanning) return;
        this.panX = e.clientX - this.startX;
        this.panY = e.clientY - this.startY;
        this.applyTransform();
      });

      window.addEventListener('mouseup', () => {
        if (this.isPanning) {
          this.isPanning = false;
          this.viewport.classList.remove('panning');
          this.viewport.style.cursor = this.spacePressed ? 'grab' : 'default';
        }
      });

      this.viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = this.viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
        let newScale = this.scale * zoomFactor;

        newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
        if (newScale === this.scale) return;

        this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
        this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
        this.scale = newScale;

        this.applyTransform();
      }, { passive: false });
    }

    applyTransform() {
      this.world.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
      if (this.onTransformChange) {
        this.onTransformChange(this.scale, this.panX, this.panY);
      }
    }

    centerView() {
      const vpRect = this.viewport.getBoundingClientRect();
      const sheetWidth = parseFloat(this.pageSheet.style.width) || 1123;
      const sheetHeight = parseFloat(this.pageSheet.style.height) || 794;

      this.scale = 0.85;
      this.panX = (vpRect.width - sheetWidth * this.scale) / 2;
      this.panY = (vpRect.height - sheetHeight * this.scale) / 2;

      this.applyTransform();
    }

    resetZoom() {
      const vpRect = this.viewport.getBoundingClientRect();
      const sheetWidth = parseFloat(this.pageSheet.style.width) || 1123;
      const sheetHeight = parseFloat(this.pageSheet.style.height) || 794;

      this.scale = 1.0;
      this.panX = (vpRect.width - sheetWidth) / 2;
      this.panY = (vpRect.height - sheetHeight) / 2;

      this.applyTransform();
    }

    zoomIn() {
      this.scale = Math.min(this.maxScale, this.scale * 1.2);
      this.applyTransform();
    }

    zoomOut() {
      this.scale = Math.max(this.minScale, this.scale / 1.2);
      this.applyTransform();
    }

    fitToScreen() {
      const vpRect = this.viewport.getBoundingClientRect();
      const sheetWidth = parseFloat(this.pageSheet.style.width) || 1123;
      const sheetHeight = parseFloat(this.pageSheet.style.height) || 794;

      const scaleX = (vpRect.width - 80) / sheetWidth;
      const scaleY = (vpRect.height - 80) / sheetHeight;
      this.scale = Math.max(this.minScale, Math.min(1.5, Math.min(scaleX, scaleY)));

      this.panX = (vpRect.width - sheetWidth * this.scale) / 2;
      this.panY = (vpRect.height - sheetHeight * this.scale) / 2;

      this.applyTransform();
    }

    screenToCanvas(clientX, clientY) {
      const sheetRect = this.pageSheet.getBoundingClientRect();
      const worldX = (clientX - sheetRect.left) / this.scale;
      const worldY = (clientY - sheetRect.top) / this.scale;
      return { x: worldX, y: worldY };
    }
  }

  // ==========================================================================
  // 4. Interactive Canvas Ruler & Scale Manager
  // ==========================================================================
  class RulerManager {
    constructor(horizontalCanvas, verticalCanvas, cornerEl, getTransformFn) {
      this.hCanvas = horizontalCanvas;
      this.vCanvas = verticalCanvas;
      this.corner = cornerEl;
      this.getTransform = getTransformFn;
      this.visible = true;

      window.addEventListener('resize', () => this.draw());
    }

    setVisible(visible) {
      this.visible = visible;
      if (this.hCanvas) this.hCanvas.classList.toggle('hidden', !visible);
      if (this.vCanvas) this.vCanvas.classList.toggle('hidden', !visible);
      if (this.corner) this.corner.classList.toggle('hidden', !visible);
      if (visible) this.draw();
    }

    draw() {
      if (!this.visible || !this.hCanvas || !this.vCanvas) return;

      const { scale, panX, panY } = this.getTransform();
      const dpr = window.devicePixelRatio || 1;

      // 1. Horizontal Ruler
      const hWidth = this.hCanvas.parentElement.clientWidth - 22;
      const hHeight = 22;
      if (hWidth <= 0) return;

      this.hCanvas.width = hWidth * dpr;
      this.hCanvas.height = hHeight * dpr;
      this.hCanvas.style.width = hWidth + 'px';
      this.hCanvas.style.height = hHeight + 'px';

      const hCtx = this.hCanvas.getContext('2d');
      hCtx.scale(dpr, dpr);
      hCtx.clearRect(0, 0, hWidth, hHeight);

      let step = 100;
      if (scale < 0.4) step = 500;
      else if (scale < 0.7) step = 200;
      else if (scale > 1.8) step = 50;

      const startWorldX = Math.floor((-panX) / scale / step) * step;
      const endWorldX = Math.ceil((hWidth - panX) / scale / step) * step;

      hCtx.font = '9px JetBrains Mono, monospace';
      hCtx.fillStyle = '#94a3b8';
      hCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      hCtx.lineWidth = 1;

      for (let wx = startWorldX; wx <= endWorldX; wx += step) {
        const sx = wx * scale + panX;
        if (sx < 0 || sx > hWidth) continue;

        hCtx.beginPath();
        hCtx.moveTo(sx, 12);
        hCtx.lineTo(sx, 22);
        hCtx.stroke();

        hCtx.fillText(String(wx), sx + 3, 11);

        const subStep = step / 5;
        for (let i = 1; i < 5; i++) {
          const subSx = (wx + i * subStep) * scale + panX;
          if (subSx >= 0 && subSx <= hWidth) {
            hCtx.beginPath();
            hCtx.moveTo(subSx, 17);
            hCtx.lineTo(subSx, 22);
            hCtx.stroke();
          }
        }
      }

      // 2. Vertical Ruler
      const vWidth = 22;
      const vHeight = this.vCanvas.parentElement.clientHeight - 22;
      if (vHeight <= 0) return;

      this.vCanvas.width = vWidth * dpr;
      this.vCanvas.height = vHeight * dpr;
      this.vCanvas.style.width = vWidth + 'px';
      this.vCanvas.style.height = vHeight + 'px';

      const vCtx = this.vCanvas.getContext('2d');
      vCtx.scale(dpr, dpr);
      vCtx.clearRect(0, 0, vWidth, vHeight);

      const startWorldY = Math.floor((-panY) / scale / step) * step;
      const endWorldY = Math.ceil((vHeight - panY) / scale / step) * step;

      vCtx.font = '9px JetBrains Mono, monospace';
      vCtx.fillStyle = '#94a3b8';
      vCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      vCtx.lineWidth = 1;

      for (let wy = startWorldY; wy <= endWorldY; wy += step) {
        const sy = wy * scale + panY;
        if (sy < 0 || sy > vHeight) continue;

        vCtx.beginPath();
        vCtx.moveTo(12, sy);
        vCtx.lineTo(22, sy);
        vCtx.stroke();

        vCtx.save();
        vCtx.translate(10, sy + 3);
        vCtx.rotate(-Math.PI / 2);
        vCtx.fillText(String(wy), 0, 0);
        vCtx.restore();

        const subStep = step / 5;
        for (let i = 1; i < 5; i++) {
          const subSy = (wy + i * subStep) * scale + panY;
          if (subSy >= 0 && subSy <= vHeight) {
            vCtx.beginPath();
            vCtx.moveTo(17, subSy);
            vCtx.lineTo(22, subSy);
            vCtx.stroke();
          }
        }
      }
    }
  }

  // ==========================================================================
  // 5. ConnectionManager
  // ==========================================================================
  class ConnectionManager {
    constructor(svgGroupEl, tempSvgGroupEl, getNodesFn, onConnectionSelect) {
      this.svgGroup = svgGroupEl;
      this.tempGroup = tempSvgGroupEl;
      this.getNodes = getNodesFn;
      this.onConnectionSelect = onConnectionSelect;

      this.connections = [];
      this.selectedConnectionId = null;
      this.lineStyle = 'smooth';
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

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.dataset.id = conn.id;

        const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hitPath.setAttribute('d', d);
        hitPath.setAttribute('fill', 'none');
        hitPath.setAttribute('stroke', 'transparent');
        hitPath.setAttribute('stroke-width', '16');
        hitPath.style.cursor = 'pointer';

        const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        linePath.setAttribute('d', d);
        linePath.setAttribute('class', `connection-path ${this.selectedConnectionId === conn.id ? 'selected' : ''}`);
        linePath.setAttribute('marker-end', this.selectedConnectionId === conn.id ? 'url(#arrowhead-selected)' : 'url(#arrowhead)');

        g.appendChild(hitPath);
        g.appendChild(linePath);

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
        const midY = (p1.y + p2.y) / 2;
        const midX = (p1.x + p2.x) / 2;

        if (p1.dir === 'down' || p1.dir === 'up') {
          return `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
        } else {
          return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
        }
      }

      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      const curvature = Math.max(30, Math.min(120, Math.max(dx, dy) * 0.45));

      let cp1x = p1.x, cp1y = p1.y, cp2x = p2.x, cp2y = p2.y;

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

  // ==========================================================================
  // 6. NodeManager with Magnetic Auto-Alignment & Smart Guides
  // ==========================================================================
  class NodeManager {
    constructor(nodesContainerEl, callbacks) {
      this.container = nodesContainerEl;
      this.callbacks = callbacks;

      this.nodes = [];
      this.selectedNodeId = null;

      this.draggingNode = null;
      this.dragStartPos = { x: 0, y: 0 };
      this.nodeStartPos = { x: 0, y: 0 };
      this.mode = 'family';

      this.init();
    }

    init() {
      window.addEventListener('mousemove', (e) => this.handleDragMove(e));
      window.addEventListener('mouseup', (e) => this.handleDragEnd(e));
    }

    setMode(mode) {
      this.mode = mode;
    }

    setNodes(nodes) {
      this.nodes = nodes;
      this.render();
    }

    getNodes() {
      return this.nodes;
    }

    getNode(id) {
      return this.nodes.find(n => n.id === id);
    }

    selectNode(id) {
      this.selectedNodeId = id;
      this.nodes.forEach(n => {
        const el = document.getElementById(n.id);
        if (el) {
          if (n.id === id) el.classList.add('selected');
          else el.classList.remove('selected');
        }
      });

      if (this.callbacks.onNodeSelect) {
        this.callbacks.onNodeSelect(this.getNode(id));
      }
    }

    clearSelection() {
      this.selectedNodeId = null;
      this.nodes.forEach(n => {
        const el = document.getElementById(n.id);
        if (el) el.classList.remove('selected');
      });
      if (this.callbacks.onNodeSelect) {
        this.callbacks.onNodeSelect(null);
      }
    }

    addNode(nodeData) {
      if (!nodeData.id) {
        nodeData.id = 'node-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      }
      this.nodes.push(nodeData);
      this.render();
      this.selectNode(nodeData.id);
      if (this.callbacks.onStateChange) this.callbacks.onStateChange();
      return nodeData;
    }

    updateNode(id, updates) {
      const node = this.getNode(id);
      if (!node) return;
      Object.assign(node, updates);
      this.renderNode(node);
      if (this.callbacks.onStateChange) this.callbacks.onStateChange();
    }

    deleteNode(id) {
      this.nodes = this.nodes.filter(n => n.id !== id);
      if (this.selectedNodeId === id) {
        this.selectedNodeId = null;
        if (this.callbacks.onNodeSelect) this.callbacks.onNodeSelect(null);
      }
      this.render();
      if (this.callbacks.onDeleteNode) {
        this.callbacks.onDeleteNode(id);
      }
      if (this.callbacks.onStateChange) this.callbacks.onStateChange();
    }

    render() {
      this.container.innerHTML = '';
      this.nodes.forEach(node => {
        const nodeEl = this.createNodeElement(node);
        this.container.appendChild(nodeEl);
      });
    }

    renderNode(node) {
      const existing = document.getElementById(node.id);
      if (existing) {
        const newEl = this.createNodeElement(node);
        this.container.replaceChild(newEl, existing);
      } else {
        this.container.appendChild(this.createNodeElement(node));
      }
    }

    createNodeElement(node) {
      const el = document.createElement('div');
      el.id = node.id;
      el.className = `flow-node theme-${node.theme || 'blue'} shape-${node.shape || 'process'} ${this.selectedNodeId === node.id ? 'selected' : ''}`;
      el.style.left = `${node.x}px`;
      el.style.top = `${node.y}px`;

      const avatarIcon = AVATAR_ICONS[node.avatar] || '👤';
      const showAvatar = node.avatar !== 'none' && avatarIcon !== '◽';

      el.innerHTML = `
        <div class="node-card-content">
          ${showAvatar ? `<div class="node-avatar">${avatarIcon}</div>` : ''}
          <div class="node-text-area">
            <div class="node-title" contenteditable="true" spellcheck="false" title="Double click to edit">${this.escapeHtml(node.title || 'Untitled')}</div>
            ${node.subtitle ? `<div class="node-subtitle" contenteditable="true" spellcheck="false" title="Double click to edit">${this.escapeHtml(node.subtitle)}</div>` : ''}
            ${node.details ? `<div class="node-details" contenteditable="true" spellcheck="false" title="Double click to edit">${this.escapeHtml(node.details)}</div>` : ''}
          </div>
        </div>

        <!-- 4-Direction Quick Add (+) Port Buttons -->
        <div class="node-port port-top" data-port="top" data-tooltip="${this.mode === 'family' ? '+ Add Parent' : '+ Add Step Above'}">+</div>
        <div class="node-port port-bottom" data-port="bottom" data-tooltip="${this.mode === 'family' ? '+ Add Child' : '+ Add Next Step'}">+</div>
        <div class="node-port port-left" data-port="left" data-tooltip="${this.mode === 'family' ? '+ Add Sibling' : '+ Add Branch (No)'}">+</div>
        <div class="node-port port-right" data-port="right" data-tooltip="${this.mode === 'family' ? '+ Add Partner' : '+ Add Branch (Yes)'}">+</div>
      `;

      this.attachNodeListeners(el, node);
      return el;
    }

    attachNodeListeners(el, node) {
      el.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('node-port') || e.target.getAttribute('contenteditable') === 'true') {
          return;
        }
        if (e.button !== 0) return;

        e.stopPropagation();
        this.selectNode(node.id);

        this.draggingNode = node;
        this.dragStartPos = { x: e.clientX, y: e.clientY };
        this.nodeStartPos = { x: node.x, y: node.y };
        el.classList.add('dragging');
      });

      const titleEl = el.querySelector('.node-title');
      const subtitleEl = el.querySelector('.node-subtitle');
      const detailsEl = el.querySelector('.node-details');

      const handleTextBlur = () => {
        node.title = titleEl ? titleEl.innerText.trim() : node.title;
        if (subtitleEl) node.subtitle = subtitleEl.innerText.trim();
        if (detailsEl) node.details = detailsEl.innerText.trim();
        if (this.callbacks.onNodeSelect && this.selectedNodeId === node.id) {
          this.callbacks.onNodeSelect(node);
        }
        if (this.callbacks.onStateChange) this.callbacks.onStateChange();
      };

      if (titleEl) titleEl.addEventListener('blur', handleTextBlur);
      if (subtitleEl) subtitleEl.addEventListener('blur', handleTextBlur);
      if (detailsEl) detailsEl.addEventListener('blur', handleTextBlur);

      [titleEl, subtitleEl, detailsEl].forEach(tEl => {
        if (tEl) {
          tEl.addEventListener('mousedown', (e) => e.stopPropagation());
        }
      });

      const ports = el.querySelectorAll('.node-port');
      ports.forEach(portEl => {
        const portDir = portEl.getAttribute('data-port');

        portEl.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleQuickAdd(node, portDir);
        });

        portEl.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          if (this.callbacks.onConnectionStart) {
            this.callbacks.onConnectionStart(node.id, portDir, e);
          }
        });
      });
    }

    handleQuickAdd(parentNode, direction) {
      const OFFSET_X = 260;
      const OFFSET_Y = 160;

      let targetX = parentNode.x;
      let targetY = parentNode.y;
      let targetPort = 'top';
      let sourcePort = direction;
      let newTitle = '';
      let newSubtitle = '';
      let newDetails = '';
      let newAvatar = 'none';
      let newTheme = parentNode.theme || 'blue';
      let newShape = parentNode.shape || 'process';

      if (direction === 'bottom') {
        targetY += OFFSET_Y;
        targetPort = 'top';
        if (this.mode === 'family') {
          newTitle = 'New Child';
          newSubtitle = 'Son / Daughter';
          newDetails = 'Birth Year';
          newAvatar = 'child';
          newTheme = 'emerald';
        } else {
          newTitle = 'Next Step';
          newSubtitle = 'Execute Task';
          newDetails = 'Action description';
          newTheme = 'blue';
        }
      } else if (direction === 'top') {
        targetY -= OFFSET_Y;
        targetPort = 'bottom';
        if (this.mode === 'family') {
          newTitle = 'New Parent';
          newSubtitle = 'Father / Mother';
          newDetails = 'Birth – Death';
          newAvatar = 'elder-m';
          newTheme = 'purple';
        } else {
          newTitle = 'Preceding Step';
          newSubtitle = 'Prerequisite';
          newDetails = 'Validation';
          newTheme = 'amber';
        }
      } else if (direction === 'right') {
        targetX += OFFSET_X;
        targetPort = 'left';
        if (this.mode === 'family') {
          newTitle = 'New Partner';
          newSubtitle = 'Spouse / Wife / Husband';
          newDetails = 'Marriage Year';
          newAvatar = 'woman';
          newTheme = 'rose';
        } else {
          newTitle = 'Branch Condition';
          newSubtitle = 'Alternative Path';
          newDetails = 'Branch details';
          newTheme = 'cyan';
        }
      } else if (direction === 'left') {
        targetX -= OFFSET_X;
        targetPort = 'right';
        if (this.mode === 'family') {
          newTitle = 'New Sibling';
          newSubtitle = 'Brother / Sister';
          newDetails = 'Birth Year';
          newAvatar = 'man';
          newTheme = 'amber';
        } else {
          newTitle = 'Alternative Step';
          newSubtitle = 'Fallback Path';
          newDetails = 'Error Handler';
          newTheme = 'rose';
        }
      }

      while (this.isOccupied(targetX, targetY)) {
        if (direction === 'bottom' || direction === 'top') {
          targetX += 60;
        } else {
          targetY += 50;
        }
      }

      const newNodeData = {
        id: 'node-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        x: Math.max(20, targetX),
        y: Math.max(20, targetY),
        title: newTitle,
        subtitle: newSubtitle,
        details: newDetails,
        avatar: newAvatar,
        theme: newTheme,
        shape: newShape
      };

      this.nodes.push(newNodeData);
      this.render();
      this.selectNode(newNodeData.id);

      if (this.callbacks.onQuickConnect) {
        this.callbacks.onQuickConnect({
          from: parentNode.id,
          to: newNodeData.id,
          fromPort: sourcePort,
          toPort: targetPort
        });
      }

      if (this.callbacks.onStateChange) this.callbacks.onStateChange();
    }

    isOccupied(x, y) {
      return this.nodes.some(n => Math.abs(n.x - x) < 120 && Math.abs(n.y - y) < 70);
    }

    // Drag move with magnetic snapping to other nodes and guideline emission
    handleDragMove(e) {
      if (!this.draggingNode) return;

      const scale = this.callbacks.getScale ? this.callbacks.getScale() : 1.0;
      const dx = (e.clientX - this.dragStartPos.x) / scale;
      const dy = (e.clientY - this.dragStartPos.y) / scale;

      let rawX = Math.round(this.nodeStartPos.x + dx);
      let rawY = Math.round(this.nodeStartPos.y + dy);

      const isAutoSnapEnabled = this.callbacks.isAutoSnapEnabled ? this.callbacks.isAutoSnapEnabled() : true;
      const activeGuides = [];

      if (isAutoSnapEnabled) {
        const SNAP_THRESHOLD = 12; // snapping tolerance in pixels
        const draggedEl = document.getElementById(this.draggingNode.id);
        const currW = draggedEl ? draggedEl.offsetWidth : 210;
        const currH = draggedEl ? draggedEl.offsetHeight : 80;

        const currCenterX = rawX + currW / 2;
        const currCenterY = rawY + currH / 2;
        const currLeft = rawX;
        const currRight = rawX + currW;
        const currTop = rawY;
        const currBottom = rawY + currH;

        let snappedX = false;
        let snappedY = false;

        const otherNodes = this.nodes.filter(n => n.id !== this.draggingNode.id);

        for (const other of otherNodes) {
          const oEl = document.getElementById(other.id);
          const oW = oEl ? oEl.offsetWidth : 210;
          const oH = oEl ? oEl.offsetHeight : 80;

          const oCenterX = other.x + oW / 2;
          const oCenterY = other.y + oH / 2;
          const oLeft = other.x;
          const oRight = other.x + oW;
          const oTop = other.y;
          const oBottom = other.y + oH;

          // X Alignment Snapping
          if (!snappedX) {
            // 1. Center X Alignment
            if (Math.abs(currCenterX - oCenterX) <= SNAP_THRESHOLD) {
              rawX = Math.round(oCenterX - currW / 2);
              snappedX = true;
              activeGuides.push({
                type: 'vertical',
                pos: oCenterX,
                minY: Math.min(rawY, other.y),
                maxY: Math.max(rawY + currH, other.y + oH),
                label: 'ALIGN CENTER X'
              });
            }
            // 2. Left Edge Alignment
            else if (Math.abs(currLeft - oLeft) <= SNAP_THRESHOLD) {
              rawX = oLeft;
              snappedX = true;
              activeGuides.push({
                type: 'vertical',
                pos: oLeft,
                minY: Math.min(rawY, other.y),
                maxY: Math.max(rawY + currH, other.y + oH),
                label: 'ALIGN LEFT'
              });
            }
            // 3. Right Edge Alignment
            else if (Math.abs(currRight - oRight) <= SNAP_THRESHOLD) {
              rawX = oRight - currW;
              snappedX = true;
              activeGuides.push({
                type: 'vertical',
                pos: oRight,
                minY: Math.min(rawY, other.y),
                maxY: Math.max(rawY + currH, other.y + oH),
                label: 'ALIGN RIGHT'
              });
            }
          }

          // Y Alignment Snapping
          if (!snappedY) {
            // 1. Center Y Alignment
            if (Math.abs(currCenterY - oCenterY) <= SNAP_THRESHOLD) {
              rawY = Math.round(oCenterY - currH / 2);
              snappedY = true;
              activeGuides.push({
                type: 'horizontal',
                pos: oCenterY,
                minX: Math.min(rawX, other.x),
                maxX: Math.max(rawX + currW, other.x + oW),
                label: 'ALIGN CENTER Y'
              });
            }
            // 2. Top Edge Alignment
            else if (Math.abs(currTop - oTop) <= SNAP_THRESHOLD) {
              rawY = oTop;
              snappedY = true;
              activeGuides.push({
                type: 'horizontal',
                pos: oTop,
                minX: Math.min(rawX, other.x),
                maxX: Math.max(rawX + currW, other.x + oW),
                label: 'ALIGN TOP'
              });
            }
            // 3. Bottom Edge Alignment
            else if (Math.abs(currBottom - oBottom) <= SNAP_THRESHOLD) {
              rawY = oBottom - currH;
              snappedY = true;
              activeGuides.push({
                type: 'horizontal',
                pos: oBottom,
                minX: Math.min(rawX, other.x),
                maxX: Math.max(rawX + currW, other.x + oW),
                label: 'ALIGN BOTTOM'
              });
            }
          }
        }
      }

      this.draggingNode.x = rawX;
      this.draggingNode.y = rawY;

      // Draw alignment guides
      if (this.callbacks.onShowGuides) {
        this.callbacks.onShowGuides(activeGuides);
      }

      const el = document.getElementById(this.draggingNode.id);
      if (el) {
        el.style.left = `${this.draggingNode.x}px`;
        el.style.top = `${this.draggingNode.y}px`;
      }

      if (this.callbacks.onNodeMove) {
        this.callbacks.onNodeMove(this.draggingNode.id);
      }
    }

    handleDragEnd() {
      if (!this.draggingNode) return;

      const el = document.getElementById(this.draggingNode.id);
      if (el) el.classList.remove('dragging');

      if (this.callbacks.onClearGuides) {
        this.callbacks.onClearGuides();
      }

      this.draggingNode = null;
      if (this.callbacks.onStateChange) this.callbacks.onStateChange();
    }

    escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }

  // ==========================================================================
  // 7. Layout Engine
  // ==========================================================================
  function autoArrangeLayout(nodes, connections, options = {}) {
    if (!nodes || nodes.length === 0) return nodes;

    const nodeWidth = options.nodeWidth || 220;
    const nodeHeight = options.nodeHeight || 80;
    const horizontalGap = options.horizontalGap || 70;
    const verticalGap = options.verticalGap || 110;

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

    let roots = nodes.filter(n => inDegree.get(n.id) === 0);
    if (roots.length === 0) {
      roots = [nodes[0]];
    }

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

    nodes.forEach(n => {
      if (!levelMap.has(n.id)) {
        levelMap.set(n.id, 0);
      }
    });

    const levels = [];
    nodes.forEach(n => {
      const lvl = levelMap.get(n.id);
      if (!levels[lvl]) levels[lvl] = [];
      levels[lvl].push(n);
    });

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

  // ==========================================================================
  // 8. ExportManager
  // ==========================================================================
  class ExportManager {
    constructor(pageSheetEl, connectionsSvgEl, getProjectDataFn) {
      this.pageSheet = pageSheetEl;
      this.connectionsSvg = connectionsSvgEl;
      this.getProjectData = getProjectDataFn;
    }

    exportJSON(filename = 'my-chart.treeflow') {
      const data = this.getProjectData();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      this.triggerDownload(blob, filename);
    }

    exportPDF() {
      window.print();
    }

    exportSVG(filename = 'my-chart.svg') {
      const data = this.getProjectData();
      const bounds = this.calculateContentBounds(data.nodes);
      const padding = 60;
      const width = bounds.width + padding * 2;
      const height = bounds.height + padding * 2;
      const offsetX = bounds.minX - padding;
      const offsetY = bounds.minY - padding;

      const svgContent = this.generateStandaloneSvgString(data, width, height, offsetX, offsetY);
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      this.triggerDownload(blob, filename);
    }

    async exportPNG(filename = 'my-chart.png', scale = 2) {
      const data = this.getProjectData();
      const bounds = this.calculateContentBounds(data.nodes);
      const padding = 60;
      const width = bounds.width + padding * 2;
      const height = bounds.height + padding * 2;
      const offsetX = bounds.minX - padding;
      const offsetY = bounds.minY - padding;

      const svgString = this.generateStandaloneSvgString(data, width, height, offsetX, offsetY);
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      return new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width * scale;
          canvas.height = height * scale;
          const ctx = canvas.getContext('2d');

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);

          canvas.toBlob((blob) => {
            if (blob) {
              this.triggerDownload(blob, filename);
              resolve();
            } else {
              reject(new Error('Canvas rasterization failed'));
            }
          }, 'image/png');
        };

        img.onerror = (err) => {
          URL.revokeObjectURL(url);
          reject(err);
        };

        img.src = url;
      });
    }

    calculateContentBounds(nodes) {
      if (!nodes || nodes.length === 0) {
        return { minX: 0, minY: 0, width: 800, height: 600 };
      }

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      nodes.forEach(n => {
        const el = document.getElementById(n.id);
        const w = el ? el.offsetWidth : 220;
        const h = el ? el.offsetHeight : 80;

        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + w);
        maxY = Math.max(maxY, n.y + h);
      });

      return {
        minX: Math.max(0, minX),
        minY: Math.max(0, minY),
        width: Math.max(400, maxX - minX),
        height: Math.max(300, maxY - minY)
      };
    }

    generateStandaloneSvgString(data, width, height, offsetX, offsetY) {
      const nodes = data.nodes || [];
      const connections = data.connections || [];
      const lineStyle = data.lineStyle || 'smooth';

      const themeColors = {
        emerald: { bg: '#064e3b', border: '#10b981', text: '#34d399', avatar: '#059669' },
        blue: { bg: '#1e3a8a', border: '#3b82f6', text: '#60a5fa', avatar: '#2563eb' },
        purple: { bg: '#581c87', border: '#a855f7', text: '#c084fc', avatar: '#9333ea' },
        rose: { bg: '#881337', border: '#f43f5e', text: '#fb7185', avatar: '#e11d48' },
        amber: { bg: '#78350f', border: '#f59e0b', text: '#fbbf24', avatar: '#d97706' },
        cyan: { bg: '#164e63', border: '#06b6d4', text: '#22d3ee', avatar: '#0891b2' },
        dark: { bg: '#1e293b', border: '#475569', text: '#94a3b8', avatar: '#334155' }
      };

      let connectionsSvgContent = '';
      connections.forEach(c => {
        const src = nodes.find(n => n.id === c.from);
        const tgt = nodes.find(n => n.id === c.to);
        if (!src || !tgt) return;

        const p1 = this.getNodePortCoords(src, c.fromPort || 'bottom', offsetX, offsetY);
        const p2 = this.getNodePortCoords(tgt, c.toPort || 'top', offsetX, offsetY);
        const d = this.buildPathD(p1, p2, lineStyle);

        connectionsSvgContent += `
          <path d="${d}" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#arrowhead-export)" />
        `;

        if (c.label) {
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2 - 6;
          connectionsSvgContent += `
            <text x="${midX}" y="${midY}" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">${c.label}</text>
          `;
        }
      });

      let nodesSvgContent = '';
      nodes.forEach(n => {
        const el = document.getElementById(n.id);
        const w = el ? el.offsetWidth : 220;
        const h = el ? el.offsetHeight : 80;
        const x = n.x - offsetX;
        const y = n.y - offsetY;

        const tColor = themeColors[n.theme] || themeColors.blue;
        const icon = AVATAR_ICONS[n.avatar] || '';
        const hasAvatar = n.avatar !== 'none' && icon !== '◽';
        const textX = hasAvatar ? x + 62 : x + 18;

        let rx = 12;
        let ry = 12;
        if (n.shape === 'terminal') {
          rx = h / 2;
          ry = h / 2;
        }

        nodesSvgContent += `
          <g transform="translate(0, 0)">
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${ry}" fill="#171f30" stroke="${tColor.border}" stroke-width="2" />
            
            ${hasAvatar ? `
              <circle cx="${x + 36}" cy="${y + h / 2}" r="18" fill="${tColor.avatar}" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5" />
              <text x="${x + 36}" y="${y + h / 2 + 6}" font-size="18" text-anchor="middle">${icon}</text>
            ` : ''}

            <text x="${textX}" y="${y + 28}" fill="#f8fafc" font-size="14" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">${this.escapeXml(n.title)}</text>
            
            ${n.subtitle ? `
              <text x="${textX}" y="${y + 46}" fill="${tColor.text}" font-size="12" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif">${this.escapeXml(n.subtitle)}</text>
            ` : ''}

            ${n.details ? `
              <text x="${textX}" y="${y + 64}" fill="#94a3b8" font-size="11" font-family="'Plus Jakarta Sans', sans-serif">${this.escapeXml(n.details)}</text>
            ` : ''}
          </g>
        `;
      });

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <marker id="arrowhead-export" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
      <polygon points="0 0, 8 3.5, 0 7" fill="#64748b" />
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="#0f172a" />
  <g id="exportConnections">${connectionsSvgContent}</g>
  <g id="exportNodes">${nodesSvgContent}</g>
</svg>`;
    }

    getNodePortCoords(node, port, offsetX, offsetY) {
      const el = document.getElementById(node.id);
      const w = el ? el.offsetWidth : 220;
      const h = el ? el.offsetHeight : 80;

      const x = node.x - offsetX;
      const y = node.y - offsetY;

      if (port === 'top') return { x: x + w / 2, y: y, dir: 'up' };
      if (port === 'bottom') return { x: x + w / 2, y: y + h, dir: 'down' };
      if (port === 'left') return { x: x, y: y + h / 2, dir: 'left' };
      if (port === 'right') return { x: x + w, y: y + h / 2, dir: 'right' };

      return { x: x + w / 2, y: y + h, dir: 'down' };
    }

    buildPathD(p1, p2, style) {
      if (style === 'straight') {
        return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
      }

      if (style === 'orthogonal') {
        const midY = (p1.y + p2.y) / 2;
        return `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
      }

      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      const curvature = Math.max(30, Math.min(100, Math.max(dx, dy) * 0.45));

      let cp1x = p1.x, cp1y = p1.y, cp2x = p2.x, cp2y = p2.y;
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

    triggerDownload(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    escapeXml(unsafe) {
      return String(unsafe || '').replace(/[<>&'"]/g, c => {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
        }
      });
    }
  }

  // ==========================================================================
  // 9. Main TreeFlowApp Controller
  // ==========================================================================
  class TreeFlowApp {
    constructor() {
      this.title = 'My Family Tree';
      this.mode = 'family';
      this.pageSize = 'a4';
      this.orientation = 'landscape';
      this.lineStyle = 'smooth';

      this.history = [];
      this.historyIndex = -1;
      this.maxHistory = 40;
      this.isHistoryAction = false;

      // Smart Auto-Alignment State
      this.autoSnap = true;

      this.viewportEl = document.getElementById('canvasViewport');
      this.worldEl = document.getElementById('canvasWorld');
      this.pageSheetEl = document.getElementById('pageSheet');
      this.connectionsSvg = document.getElementById('connectionsSvg');
      this.connectionsGroup = document.getElementById('connectionsGroup');
      this.tempConnectionGroup = document.getElementById('tempConnectionGroup');
      this.smartGuidesGroup = document.getElementById('smartGuidesGroup');
      this.nodesLayer = document.getElementById('nodesLayer');
      this.toastContainer = document.getElementById('toastContainer');

      this.pendingConnection = null;

      this.init();
    }

    init() {
      this.canvasMgr = new CanvasManager(
        this.viewportEl,
        this.worldEl,
        this.pageSheetEl,
        (scale, panX, panY) => {
          this.handleZoomChange(scale);
          if (this.rulerMgr) this.rulerMgr.draw();
        }
      );

      // Initialize Interactive Scale Rulers
      const hRuler = document.getElementById('rulerHorizontal');
      const vRuler = document.getElementById('rulerVertical');
      const cornerRuler = document.getElementById('rulerCorner');
      this.rulerMgr = new RulerManager(
        hRuler,
        vRuler,
        cornerRuler,
        () => ({ scale: this.canvasMgr.scale, panX: this.canvasMgr.panX, panY: this.canvasMgr.panY })
      );

      this.connectionMgr = new ConnectionManager(
        this.connectionsGroup,
        this.tempConnectionGroup,
        () => this.nodeMgr.getNodes(),
        (connId) => this.handleConnectionSelect(connId)
      );

      this.nodeMgr = new NodeManager(
        this.nodesLayer,
        {
          onNodeMove: (nodeId) => this.connectionMgr.render(),
          onNodeSelect: (node) => this.handleNodeSelect(node),
          onDeleteNode: (nodeId) => this.connectionMgr.removeConnectionsForNode(nodeId),
          onQuickConnect: (connData) => {
            this.connectionMgr.addConnection(connData);
            this.saveHistorySnapshot();
          },
          onConnectionStart: (nodeId, port, event) => this.handleConnectionStart(nodeId, port, event),
          onStateChange: () => this.handleDataChange(),
          getScale: () => this.canvasMgr.scale,
          isAutoSnapEnabled: () => this.autoSnap,
          onShowGuides: (guides) => this.renderSmartGuides(guides),
          onClearGuides: () => this.clearSmartGuides()
        }
      );

      this.exportMgr = new ExportManager(
        this.pageSheetEl,
        this.connectionsSvg,
        () => this.getProjectData()
      );

      this.bindHeaderControls();
      this.bindPaletteControls();
      this.bindInspectorControls();
      this.bindZoomControls();
      this.bindKeyboardShortcuts();
      this.bindConnectionDragEvents();

      const saved = localStorage.getItem('treeflow_project');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.loadProjectData(parsed, false);
        } catch (err) {
          this.loadTemplate('family-3gen');
        }
      } else {
        this.loadTemplate('family-3gen');
      }

      // Initial ruler render
      setTimeout(() => {
        if (this.rulerMgr) this.rulerMgr.draw();
      }, 100);

      console.log('TreeFlow Studio initialized successfully with Auto-Align and Scale!');
    }

    renderSmartGuides(guides) {
      if (!this.smartGuidesGroup) return;
      this.smartGuidesGroup.innerHTML = '';

      if (!guides || guides.length === 0) return;

      guides.forEach(g => {
        if (g.type === 'vertical') {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', g.pos);
          line.setAttribute('y1', Math.max(0, g.minY - 60));
          line.setAttribute('x2', g.pos);
          line.setAttribute('y2', g.maxY + 60);
          line.setAttribute('class', 'smart-guide-line');
          this.smartGuidesGroup.appendChild(line);

          const midY = (g.minY + g.maxY) / 2;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', g.pos - 42);
          rect.setAttribute('y', midY - 9);
          rect.setAttribute('width', 84);
          rect.setAttribute('height', 18);
          rect.setAttribute('class', 'smart-guide-badge');
          this.smartGuidesGroup.appendChild(rect);

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', g.pos);
          text.setAttribute('y', midY + 4);
          text.setAttribute('class', 'smart-guide-text');
          text.setAttribute('text-anchor', 'middle');
          text.textContent = g.label;
          this.smartGuidesGroup.appendChild(text);

        } else if (g.type === 'horizontal') {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', Math.max(0, g.minX - 60));
          line.setAttribute('y1', g.pos);
          line.setAttribute('x2', g.maxX + 60);
          line.setAttribute('y2', g.pos);
          line.setAttribute('class', 'smart-guide-line');
          this.smartGuidesGroup.appendChild(line);

          const midX = (g.minX + g.maxX) / 2;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', midX - 42);
          rect.setAttribute('y', g.pos - 9);
          rect.setAttribute('width', 84);
          rect.setAttribute('height', 18);
          rect.setAttribute('class', 'smart-guide-badge');
          this.smartGuidesGroup.appendChild(rect);

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', midX);
          text.setAttribute('y', g.pos + 4);
          text.setAttribute('class', 'smart-guide-text');
          text.setAttribute('text-anchor', 'middle');
          text.textContent = g.label;
          this.smartGuidesGroup.appendChild(text);
        }
      });
    }

    clearSmartGuides() {
      if (this.smartGuidesGroup) {
        this.smartGuidesGroup.innerHTML = '';
      }
    }

    getProjectData() {
      return {
        version: 1,
        title: this.title,
        mode: this.mode,
        pageSize: this.pageSize,
        orientation: this.orientation,
        lineStyle: this.lineStyle,
        nodes: JSON.parse(JSON.stringify(this.nodeMgr.getNodes())),
        connections: JSON.parse(JSON.stringify(this.connectionMgr.getConnections()))
      };
    }

    loadProjectData(data, saveToHistory = true) {
      if (!data) return;

      this.title = data.title || 'Untitled Chart';
      document.getElementById('documentTitleInput').value = this.title;

      this.setMode(data.mode || 'family', false);
      this.setPageSize(data.pageSize || 'a4', false);
      this.setOrientation(data.orientation || 'landscape', false);
      this.setLineStyle(data.lineStyle || (data.mode === 'flowchart' ? 'orthogonal' : 'smooth'), false);

      this.nodeMgr.setNodes(data.nodes || []);
      this.connectionMgr.setConnections(data.connections || []);

      if (saveToHistory) {
        this.saveHistorySnapshot();
      }
      this.triggerAutoSave();
    }

    saveHistorySnapshot() {
      if (this.isHistoryAction) return;

      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }

      const snapshot = JSON.stringify(this.getProjectData());
      this.history.push(snapshot);

      if (this.history.length > this.maxHistory) {
        this.history.shift();
      } else {
        this.historyIndex++;
      }

      this.updateUndoRedoButtons();
      this.triggerAutoSave();
    }

    undo() {
      if (this.historyIndex > 0) {
        this.isHistoryAction = true;
        this.historyIndex--;
        const snapshot = JSON.parse(this.history[this.historyIndex]);
        this.loadProjectData(snapshot, false);
        this.isHistoryAction = false;
        this.updateUndoRedoButtons();
        this.showToast('Undo performed', 'info');
      }
    }

    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.isHistoryAction = true;
        this.historyIndex++;
        const snapshot = JSON.parse(this.history[this.historyIndex]);
        this.loadProjectData(snapshot, false);
        this.isHistoryAction = false;
        this.updateUndoRedoButtons();
        this.showToast('Redo performed', 'info');
      }
    }

    updateUndoRedoButtons() {
      const btnUndo = document.getElementById('btnUndo');
      const btnRedo = document.getElementById('btnRedo');

      if (btnUndo) btnUndo.disabled = this.historyIndex <= 0;
      if (btnRedo) btnRedo.disabled = this.historyIndex >= this.history.length - 1;
    }

    handleDataChange() {
      this.saveHistorySnapshot();
    }

    triggerAutoSave() {
      try {
        const data = this.getProjectData();
        localStorage.setItem('treeflow_project', JSON.stringify(data));
        const statusEl = document.getElementById('saveStatusIndicator');
        if (statusEl) {
          statusEl.textContent = 'Saved';
          statusEl.style.opacity = '1';
        }
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
    }

    bindHeaderControls() {
      const titleInput = document.getElementById('documentTitleInput');
      titleInput.addEventListener('input', (e) => {
        this.title = e.target.value.trim() || 'Untitled Chart';
        this.triggerAutoSave();
      });

      const btnModeFamily = document.getElementById('btnModeFamily');
      const btnModeFlow = document.getElementById('btnModeFlow');

      btnModeFamily.addEventListener('click', () => this.setMode('family'));
      btnModeFlow.addEventListener('click', () => this.setMode('flowchart'));

      const pageSizeSelect = document.getElementById('pageSizeSelect');
      pageSizeSelect.addEventListener('change', (e) => {
        this.setPageSize(e.target.value);
        if (this.rulerMgr) this.rulerMgr.draw();
      });

      const btnPortrait = document.getElementById('btnOrientationPortrait');
      const btnLandscape = document.getElementById('btnOrientationLandscape');

      btnPortrait.addEventListener('click', () => {
        this.setOrientation('portrait');
        if (this.rulerMgr) this.rulerMgr.draw();
      });
      btnLandscape.addEventListener('click', () => {
        this.setOrientation('landscape');
        if (this.rulerMgr) this.rulerMgr.draw();
      });

      // Auto Snap Toggle Button
      const btnToggleSnap = document.getElementById('btnToggleSnap');
      if (btnToggleSnap) {
        btnToggleSnap.addEventListener('click', () => {
          this.autoSnap = !this.autoSnap;
          btnToggleSnap.classList.toggle('active', this.autoSnap);
          this.showToast(`Auto Alignment: ${this.autoSnap ? 'ON (Magnetic Snapping)' : 'OFF'}`, 'info');
        });
      }

      // Scale Rulers Toggle Button
      const btnToggleRulers = document.getElementById('btnToggleRulers');
      if (btnToggleRulers) {
        btnToggleRulers.addEventListener('click', () => {
          const newState = !this.rulerMgr.visible;
          this.rulerMgr.setVisible(newState);
          btnToggleRulers.classList.toggle('active', newState);
          this.showToast(`Scale Rulers: ${newState ? 'VISIBLE' : 'HIDDEN'}`, 'info');
        });
      }

      document.getElementById('btnUndo').addEventListener('click', () => this.undo());
      document.getElementById('btnRedo').addEventListener('click', () => this.redo());

      document.getElementById('btnAutoLayout').addEventListener('click', () => {
        const nodes = this.nodeMgr.getNodes();
        const conns = this.connectionMgr.getConnections();
        autoArrangeLayout(nodes, conns);
        this.nodeMgr.render();
        this.connectionMgr.render();
        this.canvasMgr.fitToScreen();
        if (this.rulerMgr) this.rulerMgr.draw();
        this.saveHistorySnapshot();
        this.showToast('Rearranged automatically!', 'success');
      });

      const btnTemplates = document.getElementById('btnTemplates');
      const templatesMenu = document.getElementById('templatesMenu');

      btnTemplates.addEventListener('click', (e) => {
        e.stopPropagation();
        templatesMenu.classList.toggle('show');
        document.getElementById('exportDropdown').classList.remove('show');
      });

      templatesMenu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
          const tmplKey = item.dataset.template;
          if (tmplKey) {
            this.loadTemplate(tmplKey);
            templatesMenu.classList.remove('show');
          }
        });
      });

      const btnExportTrigger = document.getElementById('btnExportMenuTrigger');
      const exportDropdown = document.getElementById('exportDropdown');

      btnExportTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        exportDropdown.classList.toggle('show');
        templatesMenu.classList.remove('show');
      });

      window.addEventListener('click', () => {
        templatesMenu.classList.remove('show');
        exportDropdown.classList.remove('show');
      });

      document.getElementById('btnExportPNG').addEventListener('click', async () => {
        exportDropdown.classList.remove('show');
        this.showToast('Generating high-res PNG...', 'info');
        try {
          const safeTitle = this.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'chart';
          await this.exportMgr.exportPNG(`${safeTitle}.png`, 2);
          this.showToast('PNG downloaded successfully!', 'success');
        } catch (err) {
          this.showToast('Export failed: ' + err.message, 'danger');
        }
      });

      document.getElementById('btnExportSVG').addEventListener('click', () => {
        exportDropdown.classList.remove('show');
        const safeTitle = this.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'chart';
        this.exportMgr.exportSVG(`${safeTitle}.svg`);
        this.showToast('Vector SVG downloaded!', 'success');
      });

      document.getElementById('btnPrintPDF').addEventListener('click', () => {
        exportDropdown.classList.remove('show');
        this.exportMgr.exportPDF();
      });

      document.getElementById('btnSaveJSON').addEventListener('click', () => {
        exportDropdown.classList.remove('show');
        const safeTitle = this.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'chart';
        this.exportMgr.exportJSON(`${safeTitle}.treeflow`);
        this.showToast('Project file saved!', 'success');
      });

      const fileInput = document.getElementById('fileInputJSON');
      document.getElementById('btnLoadJSON').addEventListener('click', () => {
        exportDropdown.classList.remove('show');
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            this.loadProjectData(parsed, true);
            this.canvasMgr.fitToScreen();
            if (this.rulerMgr) this.rulerMgr.draw();
            this.showToast(`Loaded "${file.name}"`, 'success');
          } catch (err) {
            this.showToast('Invalid project file format', 'danger');
          }
        };
        reader.readAsText(file);
        fileInput.value = '';
      });

      const btnThemeToggle = document.getElementById('btnThemeToggle');
      btnThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('theme-light');
        const isLight = document.body.classList.contains('theme-light');
        btnThemeToggle.querySelector('.icon-moon').style.display = isLight ? 'none' : 'block';
        btnThemeToggle.querySelector('.icon-sun').style.display = isLight ? 'block' : 'none';
        localStorage.setItem('treeflow_theme', isLight ? 'light' : 'dark');
        if (this.rulerMgr) this.rulerMgr.draw();
      });

      if (localStorage.getItem('treeflow_theme') === 'light') {
        document.body.classList.add('theme-light');
        btnThemeToggle.querySelector('.icon-moon').style.display = 'none';
        btnThemeToggle.querySelector('.icon-sun').style.display = 'block';
      }
    }

    setMode(mode, saveHistory = true) {
      this.mode = mode;
      this.nodeMgr.setMode(mode);

      const btnFamily = document.getElementById('btnModeFamily');
      const btnFlow = document.getElementById('btnModeFlow');

      if (mode === 'family') {
        btnFamily.classList.add('active');
        btnFlow.classList.remove('active');
      } else {
        btnFlow.classList.add('active');
        btnFamily.classList.remove('active');
      }

      this.updatePaletteButtons();
      this.updateInspectorFields();

      if (saveHistory) {
        this.saveHistorySnapshot();
      }
    }

    setPageSize(size, saveHistory = true) {
      this.pageSize = size;
      const select = document.getElementById('pageSizeSelect');
      if (select) select.value = size;

      const orientationGroup = document.getElementById('orientationControlGroup');
      if (orientationGroup) {
        orientationGroup.style.display = size === 'infinite' ? 'none' : 'flex';
      }

      this.canvasMgr.setPageSize(size);

      if (saveHistory) {
        this.saveHistorySnapshot();
      }
    }

    setOrientation(orientation, saveHistory = true) {
      this.orientation = orientation;
      const btnPortrait = document.getElementById('btnOrientationPortrait');
      const btnLandscape = document.getElementById('btnOrientationLandscape');

      if (orientation === 'portrait') {
        btnPortrait.classList.add('active');
        btnLandscape.classList.remove('active');
      } else {
        btnLandscape.classList.add('active');
        btnPortrait.classList.remove('active');
      }

      this.canvasMgr.setOrientation(orientation);

      if (saveHistory) {
        this.saveHistorySnapshot();
      }
    }

    setLineStyle(style, saveHistory = true) {
      this.lineStyle = style;
      this.connectionMgr.setLineStyle(style);

      const buttons = [
        { id: 'btnLineSmooth', style: 'smooth' },
        { id: 'btnLineOrtho', style: 'orthogonal' },
        { id: 'btnLineStraight', style: 'straight' }
      ];

      buttons.forEach(b => {
        const el = document.getElementById(b.id);
        if (el) {
          if (b.style === style) el.classList.add('active');
          else el.classList.remove('active');
        }
      });

      if (saveHistory) {
        this.saveHistorySnapshot();
      }
    }

    bindPaletteControls() {
      document.getElementById('btnLineSmooth').addEventListener('click', () => this.setLineStyle('smooth'));
      document.getElementById('btnLineOrtho').addEventListener('click', () => this.setLineStyle('orthogonal'));
      document.getElementById('btnLineStraight').addEventListener('click', () => this.setLineStyle('straight'));

      this.updatePaletteButtons();
    }

    updatePaletteButtons() {
      const grid = document.getElementById('nodeTypeGrid');
      grid.innerHTML = '';

      if (this.mode === 'family') {
        const items = [
          { label: 'Father / Male', avatar: 'man', theme: 'blue', desc: 'Add Male Relative' },
          { label: 'Mother / Female', avatar: 'woman', theme: 'rose', desc: 'Add Female Relative' },
          { label: 'Child / Youth', avatar: 'child', theme: 'emerald', desc: 'Add Son or Daughter' },
          { label: 'Grandparent', avatar: 'elder-m', theme: 'purple', desc: 'Add Elder' }
        ];

        items.forEach(item => {
          const btn = document.createElement('button');
          btn.className = 'tool-add-btn';
          btn.innerHTML = `
            <div class="tool-icon-wrap">${item.avatar === 'man' ? '👨' : item.avatar === 'woman' ? '👩' : item.avatar === 'child' ? '👶' : '👴'}</div>
            <span>${item.label}</span>
          `;
          btn.addEventListener('click', () => {
            this.addNewNodeAtCenter({
              title: item.label,
              subtitle: item.desc,
              details: 'Birth Year',
              avatar: item.avatar,
              theme: item.theme,
              shape: 'process'
            });
          });
          grid.appendChild(btn);
        });

      } else {
        const items = [
          { label: 'Start / End', shape: 'terminal', theme: 'emerald', icon: '🟢', desc: 'Terminal pill' },
          { label: 'Process Step', shape: 'process', theme: 'blue', icon: '⚡', desc: 'Action rectangle' },
          { label: 'Decision Rule', shape: 'decision', theme: 'amber', icon: '🔷', desc: 'Branch condition' },
          { label: 'Data I/O', shape: 'data', theme: 'cyan', icon: '📄', desc: 'Input / Output' }
        ];

        items.forEach(item => {
          const btn = document.createElement('button');
          btn.className = 'tool-add-btn';
          btn.innerHTML = `
            <div class="tool-icon-wrap">${item.icon}</div>
            <span>${item.label}</span>
          `;
          btn.addEventListener('click', () => {
            this.addNewNodeAtCenter({
              title: item.label,
              subtitle: item.desc,
              details: 'Condition / Detail',
              avatar: 'none',
              theme: item.theme,
              shape: item.shape
            });
          });
          grid.appendChild(btn);
        });
      }
    }

    addNewNodeAtCenter(data) {
      const center = this.canvasMgr.screenToCanvas(
        window.innerWidth / 2,
        window.innerHeight / 2
      );

      const node = this.nodeMgr.addNode({
        x: Math.max(40, Math.round(center.x - 100)),
        y: Math.max(40, Math.round(center.y - 40)),
        ...data
      });

      this.showToast(`Added ${node.title}`, 'info');
    }

    bindInspectorControls() {
      const closeBtn = document.getElementById('btnCloseInspector');
      closeBtn.addEventListener('click', () => {
        this.nodeMgr.clearSelection();
      });

      const inputTitle = document.getElementById('inputNodeTitle');
      const inputSubtitle = document.getElementById('inputNodeSubtitle');
      const inputDetails = document.getElementById('inputNodeDetails');

      const updateSelectedNode = () => {
        const selectedId = this.nodeMgr.selectedNodeId;
        if (!selectedId) return;

        this.nodeMgr.updateNode(selectedId, {
          title: inputTitle.value,
          subtitle: inputSubtitle.value,
          details: inputDetails.value
        });
      };

      inputTitle.addEventListener('input', updateSelectedNode);
      inputSubtitle.addEventListener('input', updateSelectedNode);
      inputDetails.addEventListener('input', updateSelectedNode);

      const avatarBtns = document.querySelectorAll('.avatar-choice-btn');
      avatarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedId = this.nodeMgr.selectedNodeId;
          if (!selectedId) return;

          avatarBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          this.nodeMgr.updateNode(selectedId, {
            avatar: btn.dataset.avatar
          });
        });
      });

      const shapeBtns = document.querySelectorAll('.shape-btn');
      shapeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedId = this.nodeMgr.selectedNodeId;
          if (!selectedId) return;

          shapeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          this.nodeMgr.updateNode(selectedId, {
            shape: btn.dataset.shape
          });
        });
      });

      const colorSwatches = document.querySelectorAll('.color-swatch-btn');
      colorSwatches.forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedId = this.nodeMgr.selectedNodeId;
          if (!selectedId) return;

          colorSwatches.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          this.nodeMgr.updateNode(selectedId, {
            theme: btn.dataset.theme
          });
        });
      });

      document.getElementById('btnDeleteSelectedNode').addEventListener('click', () => {
        const selectedId = this.nodeMgr.selectedNodeId;
        if (selectedId) {
          this.nodeMgr.deleteNode(selectedId);
          this.showToast('Card deleted', 'info');
        }
      });

      document.getElementById('btnDuplicateNode').addEventListener('click', () => {
        const selectedId = this.nodeMgr.selectedNodeId;
        if (!selectedId) return;

        const node = this.nodeMgr.getNode(selectedId);
        if (node) {
          this.nodeMgr.addNode({
            ...node,
            id: undefined,
            x: node.x + 40,
            y: node.y + 40,
            title: node.title + ' (Copy)'
          });
          this.showToast('Card duplicated', 'success');
        }
      });
    }

    handleNodeSelect(node) {
      const emptyState = document.getElementById('inspectorEmptyState');
      const formState = document.getElementById('inspectorForm');

      if (!node) {
        emptyState.style.display = 'block';
        formState.style.display = 'none';
        return;
      }

      emptyState.style.display = 'none';
      formState.style.display = 'flex';

      document.getElementById('inputNodeTitle').value = node.title || '';
      document.getElementById('inputNodeSubtitle').value = node.subtitle || '';
      document.getElementById('inputNodeDetails').value = node.details || '';

      document.querySelectorAll('.avatar-choice-btn').forEach(b => {
        if (b.dataset.avatar === (node.avatar || 'none')) b.classList.add('active');
        else b.classList.remove('active');
      });

      document.querySelectorAll('.shape-btn').forEach(b => {
        if (b.dataset.shape === (node.shape || 'process')) b.classList.add('active');
        else b.classList.remove('active');
      });

      document.querySelectorAll('.color-swatch-btn').forEach(b => {
        if (b.dataset.theme === (node.theme || 'blue')) b.classList.add('active');
        else b.classList.remove('active');
      });

      this.updateInspectorFields();
    }

    updateInspectorFields() {
      const groupAvatar = document.getElementById('groupAvatarSelect');
      const groupShape = document.getElementById('groupFlowShape');
      const lblTitle = document.getElementById('lblNodeTitle');
      const lblSubtitle = document.getElementById('lblNodeSubtitle');

      if (this.mode === 'family') {
        if (groupAvatar) groupAvatar.style.display = 'block';
        if (groupShape) groupShape.style.display = 'none';
        if (lblTitle) lblTitle.textContent = 'Person Full Name';
        if (lblSubtitle) lblSubtitle.textContent = 'Relation (e.g. Mother, Son)';
      } else {
        if (groupAvatar) groupAvatar.style.display = 'none';
        if (groupShape) groupShape.style.display = 'block';
        if (lblTitle) lblTitle.textContent = 'Step / Process Name';
        if (lblSubtitle) lblSubtitle.textContent = 'Action Description';
      }
    }

    handleConnectionSelect() {
      this.showToast('Connection selected. Press Del or Backspace to remove.', 'info');
    }

    handleConnectionStart(sourceNodeId, portDir) {
      const p1 = this.connectionMgr.getNodePortCoordinates(sourceNodeId, portDir);
      this.pendingConnection = {
        sourceNodeId,
        sourcePort: portDir,
        startCoords: p1
      };
    }

    bindConnectionDragEvents() {
      window.addEventListener('mousemove', (e) => {
        if (!this.pendingConnection) return;
        const targetCanvas = this.canvasMgr.screenToCanvas(e.clientX, e.clientY);
        this.connectionMgr.drawTempLine(this.pendingConnection.startCoords, targetCanvas.x, targetCanvas.y);
      });

      window.addEventListener('mouseup', (e) => {
        if (!this.pendingConnection) return;

        this.connectionMgr.clearTempLine();

        const targetEl = document.elementFromPoint(e.clientX, e.clientY);
        if (targetEl) {
          const portEl = targetEl.closest('.node-port');
          const nodeEl = targetEl.closest('.flow-node');

          if (portEl && nodeEl && nodeEl.id !== this.pendingConnection.sourceNodeId) {
            const targetPort = portEl.getAttribute('data-port');
            this.connectionMgr.addConnection({
              from: this.pendingConnection.sourceNodeId,
              to: nodeEl.id,
              fromPort: this.pendingConnection.sourcePort,
              toPort: targetPort
            });
            this.saveHistorySnapshot();
            this.showToast('Connected nodes!', 'success');
          } else if (nodeEl && nodeEl.id !== this.pendingConnection.sourceNodeId) {
            this.connectionMgr.addConnection({
              from: this.pendingConnection.sourceNodeId,
              to: nodeEl.id,
              fromPort: this.pendingConnection.sourcePort,
              toPort: 'top'
            });
            this.saveHistorySnapshot();
            this.showToast('Connected nodes!', 'success');
          }
        }

        this.pendingConnection = null;
      });
    }

    bindZoomControls() {
      document.getElementById('btnZoomIn').addEventListener('click', () => {
        this.canvasMgr.zoomIn();
        if (this.rulerMgr) this.rulerMgr.draw();
      });
      document.getElementById('btnZoomOut').addEventListener('click', () => {
        this.canvasMgr.zoomOut();
        if (this.rulerMgr) this.rulerMgr.draw();
      });
      document.getElementById('btnZoomFit').addEventListener('click', () => {
        this.canvasMgr.fitToScreen();
        if (this.rulerMgr) this.rulerMgr.draw();
      });
      document.getElementById('btnResetView').addEventListener('click', () => {
        this.canvasMgr.resetZoom();
        if (this.rulerMgr) this.rulerMgr.draw();
      });
    }

    handleZoomChange(scale) {
      const display = document.getElementById('zoomLevelDisplay');
      if (display) {
        display.textContent = `${Math.round(scale * 100)}%`;
      }
    }

    bindKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || 
                        document.activeElement.getAttribute('contenteditable') === 'true';

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
          if (!isInput) {
            e.preventDefault();
            this.undo();
          }
        }

        if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
            ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')) {
          if (!isInput) {
            e.preventDefault();
            this.redo();
          }
        }

        if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
          if (this.nodeMgr.selectedNodeId) {
            this.nodeMgr.deleteNode(this.nodeMgr.selectedNodeId);
            this.showToast('Card deleted', 'info');
          } else if (this.connectionMgr.selectedConnectionId) {
            this.connectionMgr.removeConnection(this.connectionMgr.selectedConnectionId);
            this.showToast('Connection line removed', 'info');
          }
        }

        if (e.key === 'Escape') {
          this.nodeMgr.clearSelection();
          this.connectionMgr.selectConnection(null);
        }
      });
    }

    loadTemplate(templateKey) {
      const tmpl = TEMPLATES[templateKey];
      if (!tmpl) return;

      this.title = tmpl.title;
      document.getElementById('documentTitleInput').value = this.title;

      this.setMode(tmpl.mode || 'family', false);
      this.setPageSize(tmpl.pageSize || 'a4', false);
      this.setOrientation(tmpl.orientation || 'landscape', false);
      this.setLineStyle(tmpl.lineStyle || 'smooth', false);

      this.nodeMgr.setNodes(JSON.parse(JSON.stringify(tmpl.nodes)));
      this.connectionMgr.setConnections(JSON.parse(JSON.stringify(tmpl.connections)));

      this.canvasMgr.centerView();
      if (this.rulerMgr) this.rulerMgr.draw();
      this.saveHistorySnapshot();
      this.showToast(`Loaded ${tmpl.title}`, 'success');
    }

    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      let icon = 'ℹ️';
      if (type === 'success') icon = '✓';
      if (type === 'danger') icon = '⚠️';

      toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
      this.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
      }, 2800);
    }
  }

  // Self-executing initialization guaranteed to run immediately on both file:/// and http://
  function startApp() {
    try {
      window.app = new TreeFlowApp();
    } catch (err) {
      console.error('TreeFlow initialization error:', err);
      alert('Error initializing TreeFlow Studio: ' + err.message);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }

})();
