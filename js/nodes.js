// js/nodes.js - Node UI Elements, Dragging, Inline Editing & 4-Direction '+' Quick Add

export const AVATAR_ICONS = {
  'man': '👨',
  'woman': '👩',
  'child': '👶',
  'elder-m': '👴',
  'elder-f': '👵',
  'none': '◽'
};

export class NodeManager {
  constructor(nodesContainerEl, callbacks) {
    this.container = nodesContainerEl;
    this.callbacks = callbacks; 
    // callbacks: { onNodeMove, onNodeSelect, onAddChild, onConnectionStart, onConnectionEnd, onStateChange }

    this.nodes = [];
    this.selectedNodeId = null;

    // Dragging state
    this.draggingNode = null;
    this.dragStartPos = { x: 0, y: 0 };
    this.nodeStartPos = { x: 0, y: 0 };
    this.mode = 'family'; // 'family' | 'flowchart'

    this.init();
  }

  init() {
    // Window-level mouse move & mouse up for smooth dragging
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
      <div class="node-port port-top" data-port="top" data-tooltip="${this.mode === 'family' ? '+ Add Parent' : '+ Add Input / Step Above'}">+</div>
      <div class="node-port port-bottom" data-port="bottom" data-tooltip="${this.mode === 'family' ? '+ Add Child' : '+ Add Next Step'}">+</div>
      <div class="node-port port-left" data-port="left" data-tooltip="${this.mode === 'family' ? '+ Add Sibling' : '+ Add Branch (No)'}">+</div>
      <div class="node-port port-right" data-port="right" data-tooltip="${this.mode === 'family' ? '+ Add Partner' : '+ Add Branch (Yes)'}">+</div>
    `;

    this.attachNodeListeners(el, node);
    return el;
  }

  attachNodeListeners(el, node) {
    // Select and drag start
    el.addEventListener('mousedown', (e) => {
      // Don't drag if clicking a port or editing text
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

    // Content Editable Text Changes
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

    // Stop drag propagation on text focus
    [titleEl, subtitleEl, detailsEl].forEach(tEl => {
      if (tEl) {
        tEl.addEventListener('mousedown', (e) => e.stopPropagation());
      }
    });

    // Quick Add (+) Button Clicks
    const ports = el.querySelectorAll('.node-port');
    ports.forEach(portEl => {
      const portDir = portEl.getAttribute('data-port');

      portEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleQuickAdd(node, portDir);
      });

      // Drag connection support
      portEl.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        if (this.callbacks.onConnectionStart) {
          this.callbacks.onConnectionStart(node.id, portDir, e);
        }
      });
    });
  }

  // Handle Quick Add (+) click: Spawns connected new node instantly
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

    // Shift coordinates if a node is already overlapping near target position
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

    // Call back to create the connection line between the two nodes
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
      const SNAP_THRESHOLD = 12; // pixels threshold for snap
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
          } else if (Math.abs(currLeft - oLeft) <= SNAP_THRESHOLD) {
            rawX = oLeft;
            snappedX = true;
            activeGuides.push({
              type: 'vertical',
              pos: oLeft,
              minY: Math.min(rawY, other.y),
              maxY: Math.max(rawY + currH, other.y + oH),
              label: 'ALIGN LEFT'
            });
          } else if (Math.abs(currRight - oRight) <= SNAP_THRESHOLD) {
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
          } else if (Math.abs(currTop - oTop) <= SNAP_THRESHOLD) {
            rawY = oTop;
            snappedY = true;
            activeGuides.push({
              type: 'horizontal',
              pos: oTop,
              minX: Math.min(rawX, other.x),
              maxX: Math.max(rawX + currW, other.x + oW),
              label: 'ALIGN TOP'
            });
          } else if (Math.abs(currBottom - oBottom) <= SNAP_THRESHOLD) {
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

    if (this.callbacks.onShowGuides) {
      this.callbacks.onShowGuides(activeGuides);
    }

    // Live update element position
    const el = document.getElementById(this.draggingNode.id);
    if (el) {
      el.style.left = `${this.draggingNode.x}px`;
      el.style.top = `${this.draggingNode.y}px`;
    }

    // Live update connections during drag
    if (this.callbacks.onNodeMove) {
      this.callbacks.onNodeMove(this.draggingNode.id);
    }
  }

  handleDragEnd(e) {
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
