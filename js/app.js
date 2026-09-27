// js/app.js - Main Application Orchestrator & Controller

import { CanvasManager } from './canvas.js';
import { NodeManager } from './nodes.js';
import { ConnectionManager } from './connections.js';
import { ExportManager } from './export.js';
import { autoArrangeLayout } from './layout.js';
import { TEMPLATES } from './templates.js';

class TreeFlowApp {
  constructor() {
    // State
    this.title = 'My Family Tree';
    this.mode = 'family'; // 'family' | 'flowchart'
    this.pageSize = 'a4';
    this.orientation = 'landscape';
    this.lineStyle = 'smooth';

    // History stack for Undo / Redo
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 40;
    this.isHistoryAction = false;

    // DOM References
    this.viewportEl = document.getElementById('canvasViewport');
    this.worldEl = document.getElementById('canvasWorld');
    this.pageSheetEl = document.getElementById('pageSheet');
    this.connectionsSvg = document.getElementById('connectionsSvg');
    this.connectionsGroup = document.getElementById('connectionsGroup');
    this.tempConnectionGroup = document.getElementById('tempConnectionGroup');
    this.nodesLayer = document.getElementById('nodesLayer');
    this.toastContainer = document.getElementById('toastContainer');

    // Drag connection rubber-band state
    this.pendingConnection = null;

    this.init();
  }

  init() {
    // 1. Initialize Subsystems
    this.canvasMgr = new CanvasManager(
      this.viewportEl,
      this.worldEl,
      this.pageSheetEl,
      (scale) => this.handleZoomChange(scale)
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
        getScale: () => this.canvasMgr.scale
      }
    );

    this.exportMgr = new ExportManager(
      this.pageSheetEl,
      this.connectionsSvg,
      () => this.getProjectData()
    );

    // 2. Wire UI Controls & Events
    this.bindHeaderControls();
    this.bindPaletteControls();
    this.bindInspectorControls();
    this.bindZoomControls();
    this.bindKeyboardShortcuts();
    this.bindConnectionDragEvents();

    // 3. Load Saved Project from LocalStorage or default template
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
  }

  // --- Data & History State ---

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

    // Truncate any redo branch ahead of current index
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

  // --- UI Bindings & Handlers ---

  bindHeaderControls() {
    // Title Input
    const titleInput = document.getElementById('documentTitleInput');
    titleInput.addEventListener('input', (e) => {
      this.title = e.target.value.trim() || 'Untitled Chart';
      this.triggerAutoSave();
    });

    // Mode Selector (Family Tree vs Flowchart)
    const btnModeFamily = document.getElementById('btnModeFamily');
    const btnModeFlow = document.getElementById('btnModeFlow');

    btnModeFamily.addEventListener('click', () => this.setMode('family'));
    btnModeFlow.addEventListener('click', () => this.setMode('flowchart'));

    // Page Size Selector
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    pageSizeSelect.addEventListener('change', (e) => {
      this.setPageSize(e.target.value);
    });

    // Orientation Buttons
    const btnPortrait = document.getElementById('btnOrientationPortrait');
    const btnLandscape = document.getElementById('btnOrientationLandscape');

    btnPortrait.addEventListener('click', () => this.setOrientation('portrait'));
    btnLandscape.addEventListener('click', () => this.setOrientation('landscape'));

    // Undo / Redo buttons
    document.getElementById('btnUndo').addEventListener('click', () => this.undo());
    document.getElementById('btnRedo').addEventListener('click', () => this.redo());

    // Auto Layout Button
    document.getElementById('btnAutoLayout').addEventListener('click', () => {
      const nodes = this.nodeMgr.getNodes();
      const conns = this.connectionMgr.getConnections();
      autoArrangeLayout(nodes, conns);
      this.nodeMgr.render();
      this.connectionMgr.render();
      this.canvasMgr.fitToScreen();
      this.saveHistorySnapshot();
      this.showToast('Rearranged automatically!', 'success');
    });

    // Templates Dropdown Menu
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

    // Export Dropdown Trigger
    const btnExportTrigger = document.getElementById('btnExportMenuTrigger');
    const exportDropdown = document.getElementById('exportDropdown');

    btnExportTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      exportDropdown.classList.toggle('show');
      templatesMenu.classList.remove('show');
    });

    // Close dropdowns on outside click
    window.addEventListener('click', () => {
      templatesMenu.classList.remove('show');
      exportDropdown.classList.remove('show');
    });

    // Export Actions
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

    // Load JSON File
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
          this.showToast(`Loaded "${file.name}"`, 'success');
        } catch (err) {
          this.showToast('Invalid project file format', 'danger');
        }
      };
      reader.readAsText(file);
      fileInput.value = '';
    });

    // Dark / Light Theme Toggle
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    btnThemeToggle.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      const isLight = document.body.classList.contains('theme-light');
      btnThemeToggle.querySelector('.icon-moon').style.display = isLight ? 'none' : 'block';
      btnThemeToggle.querySelector('.icon-sun').style.display = isLight ? 'block' : 'none';
      localStorage.setItem('treeflow_theme', isLight ? 'light' : 'dark');
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
    // Line style selectors
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
      // Flowchart items
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

  // --- Inspector Panel ---

  bindInspectorControls() {
    const closeBtn = document.getElementById('btnCloseInspector');
    const inspector = document.getElementById('nodeInspector');

    closeBtn.addEventListener('click', () => {
      this.nodeMgr.clearSelection();
    });

    // Title & Subtitle inputs
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

    // Avatar Choices
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

    // Flowchart Shape Choices
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

    // Theme Color Swatches
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

    // Delete Node
    document.getElementById('btnDeleteSelectedNode').addEventListener('click', () => {
      const selectedId = this.nodeMgr.selectedNodeId;
      if (selectedId) {
        this.nodeMgr.deleteNode(selectedId);
        this.showToast('Card deleted', 'info');
      }
    });

    // Duplicate Node
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

    // Update avatar buttons
    document.querySelectorAll('.avatar-choice-btn').forEach(b => {
      if (b.dataset.avatar === (node.avatar || 'none')) b.classList.add('active');
      else b.classList.remove('active');
    });

    // Update shape buttons
    document.querySelectorAll('.shape-btn').forEach(b => {
      if (b.dataset.shape === (node.shape || 'process')) b.classList.add('active');
      else b.classList.remove('active');
    });

    // Update color swatches
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

  handleConnectionSelect(connId) {
    // Show toast with option to delete connection
    this.showToast('Connection selected. Press Del or click trash to remove.', 'info');
  }

  // --- Drag Connection Line between nodes ---

  handleConnectionStart(sourceNodeId, portDir, event) {
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

      // Check if mouse released over another node or port
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
          // Connected directly to node card body
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

  // --- Zoom Controls ---

  bindZoomControls() {
    document.getElementById('btnZoomIn').addEventListener('click', () => this.canvasMgr.zoomIn());
    document.getElementById('btnZoomOut').addEventListener('click', () => this.canvasMgr.zoomOut());
    document.getElementById('btnZoomFit').addEventListener('click', () => this.canvasMgr.fitToScreen());
    document.getElementById('btnResetView').addEventListener('click', () => this.canvasMgr.resetZoom());
  }

  handleZoomChange(scale) {
    const display = document.getElementById('zoomLevelDisplay');
    if (display) {
      display.textContent = `${Math.round(scale * 100)}%`;
    }
  }

  // --- Keyboard Shortcuts ---

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || 
                      document.activeElement.getAttribute('contenteditable') === 'true';

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (!isInput) {
          e.preventDefault();
          this.undo();
        }
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
          ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')) {
        if (!isInput) {
          e.preventDefault();
          this.redo();
        }
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        if (this.nodeMgr.selectedNodeId) {
          this.nodeMgr.deleteNode(this.nodeMgr.selectedNodeId);
          this.showToast('Card deleted', 'info');
        } else if (this.connectionMgr.selectedConnectionId) {
          this.connectionMgr.removeConnection(this.connectionMgr.selectedConnectionId);
          this.showToast('Connection line removed', 'info');
        }
      }

      // Deselect on Escape
      if (e.key === 'Escape') {
        this.nodeMgr.clearSelection();
        this.connectionMgr.selectConnection(null);
      }
    });
  }

  // --- Templates ---

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
    this.saveHistorySnapshot();
    this.showToast(`Loaded ${tmpl.title}`, 'success');
  }

  // --- Toast Notification Helper ---

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

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TreeFlowApp();
});
