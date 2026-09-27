// js/canvas.js - Viewport Pan, Zoom, Page Dimensions & Coordinate System

export const PAGE_DIMENSIONS = {
  // Dimensions in screen pixels at 96 DPI
  a4: { width: 1123, height: 794, label: 'A4 (210 × 297 mm)' },
  a3: { width: 1587, height: 1123, label: 'A3 (297 × 420 mm)' },
  letter: { width: 1056, height: 816, label: 'US Letter (8.5 × 11 in)' },
  legal: { width: 1344, height: 816, label: 'US Legal (8.5 × 14 in)' },
  screen169: { width: 1440, height: 810, label: 'Screen 16:9' },
  infinite: { width: 6000, height: 4000, label: 'Infinite Canvas' }
};

export class CanvasManager {
  constructor(viewportEl, worldEl, pageSheetEl, onTransformChange) {
    this.viewport = viewportEl;
    this.world = worldEl;
    this.pageSheet = pageSheetEl;
    this.onTransformChange = onTransformChange;

    // Viewport transform state
    this.scale = 1.0;
    this.panX = 0;
    this.panY = 0;

    this.minScale = 0.25;
    this.maxScale = 3.0;

    // Page settings
    this.pageSize = 'a4';
    this.orientation = 'landscape'; // 'portrait' | 'landscape'

    // Drag / Pan interaction state
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

    // Landscape vs Portrait
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

    this.pageSheet.style.width = `${w}px`;
    this.pageSheet.style.height = `${h}px`;

    // Update label tag
    const labelEl = document.getElementById('pageSheetLabel');
    if (labelEl) {
      const capitalized = this.orientation.charAt(0).toUpperCase() + this.orientation.slice(1);
      labelEl.textContent = `${this.pageSize.toUpperCase()} • ${capitalized}`;
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
    // Keyboard Space key detection for panning
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

    // Mouse Down on Viewport
    this.viewport.addEventListener('mousedown', (e) => {
      // Middle click or Space+Click or click on empty canvas/pageSheet background
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

    // Wheel Zoom towards mouse cursor
    this.viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      let newScale = this.scale * zoomFactor;

      // Clamp scale
      newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));

      if (newScale === this.scale) return;

      // Adjust pan so point under cursor stays invariant
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

  // Convert browser viewport Client coordinates to Page Sheet coordinates (accounting for pan & zoom)
  screenToCanvas(clientX, clientY) {
    const vpRect = this.viewport.getBoundingClientRect();
    const sheetRect = this.pageSheet.getBoundingClientRect();

    const worldX = (clientX - sheetRect.left) / this.scale;
    const worldY = (clientY - sheetRect.top) / this.scale;

    return { x: worldX, y: worldY };
  }
}
