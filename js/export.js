// js/export.js - High-Res PNG, Vector SVG, PDF Print & JSON Project Serialization

import { AVATAR_ICONS } from './nodes.js';

export class ExportManager {
  constructor(pageSheetEl, connectionsSvgEl, getProjectDataFn) {
    this.pageSheet = pageSheetEl;
    this.connectionsSvg = connectionsSvgEl;
    this.getProjectData = getProjectDataFn;
  }

  // Download project as .treeflow JSON
  exportJSON(filename = 'my-chart.treeflow') {
    const data = this.getProjectData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    this.triggerDownload(blob, filename);
  }

  // Print or trigger browser Save as PDF dialog
  exportPDF() {
    window.print();
  }

  // Standalone Vector SVG Export
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

  // High-Resolution PNG Export (via Canvas rasterization)
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

        // Crisp rendering settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Background fill
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image scaled
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

    // Theme color hex map for standalone export
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

      // Shape styling
      let rx = 12;
      let ry = 12;
      if (n.shape === 'terminal') {
        rx = h / 2;
        ry = h / 2;
      }

      nodesSvgContent += `
        <g transform="translate(0, 0)">
          <!-- Node card background -->
          <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${ry}" fill="#171f30" stroke="${tColor.border}" stroke-width="2" />
          
          ${hasAvatar ? `
            <!-- Avatar Circle -->
            <circle cx="${x + 36}" cy="${y + h / 2}" r="18" fill="${tColor.avatar}" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5" />
            <text x="${x + 36}" y="${y + h / 2 + 6}" font-size="18" text-anchor="middle">${icon}</text>
          ` : ''}

          <!-- Title -->
          <text x="${textX}" y="${y + 28}" fill="#f8fafc" font-size="14" font-weight="bold" font-family="'Plus Jakarta Sans', sans-serif">${this.escapeXml(n.title)}</text>
          
          <!-- Subtitle -->
          ${n.subtitle ? `
            <text x="${textX}" y="${y + 46}" fill="${tColor.text}" font-size="12" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif">${this.escapeXml(n.subtitle)}</text>
          ` : ''}

          <!-- Details -->
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
  <!-- Background Canvas -->
  <rect width="100%" height="100%" fill="#0f172a" />
  
  <!-- Connections Layer -->
  <g id="exportConnections">
    ${connectionsSvgContent}
  </g>

  <!-- Nodes Layer -->
  <g id="exportNodes">
    ${nodesSvgContent}
  </g>
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

    // Default smooth curve
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
