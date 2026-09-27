# TreeFlow Studio 🌳⚡

A modern, high-aesthetic web application for designing **Family Trees** and **Flowcharts** with intuitive one-click node branching, paper orientation, size customization, and instant multi-format export.

---

## ✨ Key Features

1. **One-Click Quick Branching with `+` Icons**:
   - Hover over any card to reveal directional small `+` icons:
     - **Bottom `+`**: Adds a child generation (Family Tree) or next step (Flowchart).
     - **Top `+`**: Adds a parent generation or preceding prerequisite step.
     - **Right `+`**: Adds a partner/spouse or decision branch ("Yes").
     - **Left `+`**: Adds a sibling or alternate branch ("No").
   - Nodes are automatically created, smartly offset, and seamlessly linked with dynamic bezier or orthogonal lines.

2. **Page Settings & Orientations**:
   - **Orientations**: Switch between **Portrait** and **Landscape** with a single click.
   - **Page Sizes**:
     - `A4 (210 × 297 mm)`
     - `A3 (297 × 420 mm)`
     - `US Letter (8.5 × 11 in)`
     - `US Legal (8.5 × 14 in)`
     - `Screen 16:9 (HD)`
     - `Infinite Canvas`
   - Real-time sheet boundary guides with shadows to preview printable areas.

3. **Export & Save Capabilities**:
   - **Export as PNG (High Resolution)**: Rasterizes at 2x DPI with crystal-clear edges.
   - **Export as SVG Vector**: Infinite-zoom vector format ready for Illustrator, Inkscape, or Figma.
   - **Print / Save as PDF**: Formatted print preview conforming to selected page size and orientation.
   - **Save & Open `.treeflow` JSON**: Save your work to disk and reload anytime.
   - **Local Storage Auto-Save**: Never lose your edits.

4. **Modes & Templates**:
   - **Family Tree Mode**: Avatars (Male, Female, Child, Elders), generation relationships, birth/death years, color tags.
   - **Flowchart Mode**: Process rectangles, Decision diamonds, Terminal pills (Start/End), and Data parallelograms.
   - **Preloaded Templates**:
     - *Royal 3-Generation Family Tree*
     - *User Authentication & Decision Flow*
     - *Executive Org Chart*
     - *Blank Canvas*

5. **Canvas Ergonomics**:
   - Smooth mouse wheel zoom (centered on cursor) and pan (middle-click, space + drag, or background drag).
   - Fit-to-screen and 1:1 view shortcuts.
   - One-click **Auto Arrange** button to organize tree hierarchies.
   - Full Undo (`Ctrl + Z`) and Redo (`Ctrl + Y`) history.
   - Dark / Light theme toggle.

---

## 🚀 How to Run

1. Open `index.html` directly in your browser, or double-click `start.bat`.
2. Or run via local server:
   ```bash
   python -m http.server 5173
   ```
   and visit `http://localhost:5173`.
