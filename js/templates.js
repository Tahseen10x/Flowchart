// js/templates.js - Predefined starter layouts for Family Tree & Flowchart

export const TEMPLATES = {
  'family-3gen': {
    title: 'Royal 3-Generation Family Tree',
    mode: 'family',
    pageSize: 'a4',
    orientation: 'landscape',
    lineStyle: 'smooth',
    nodes: [
      // Grandparents (Level 0)
      {
        id: 'node-gp1',
        x: 240,
        y: 80,
        title: 'Arthur Pendelton',
        subtitle: 'Grandfather (Paternal)',
        details: '1940 – 2018',
        avatar: 'elder-m',
        theme: 'blue',
        shape: 'process'
      },
      {
        id: 'node-gp2',
        x: 480,
        y: 80,
        title: 'Eleanor Pendelton',
        subtitle: 'Grandmother (Paternal)',
        details: '1944 – Present',
        avatar: 'elder-f',
        theme: 'rose',
        shape: 'process'
      },
      // Parents & In-laws (Level 1)
      {
        id: 'node-p1',
        x: 360,
        y: 280,
        title: 'James Pendelton',
        subtitle: 'Father',
        details: '1970 – Present',
        avatar: 'man',
        theme: 'blue',
        shape: 'process'
      },
      {
        id: 'node-p2',
        x: 640,
        y: 280,
        title: 'Clara Jenkins',
        subtitle: 'Mother',
        details: '1973 – Present',
        avatar: 'woman',
        theme: 'rose',
        shape: 'process'
      },
      // Children (Level 2)
      {
        id: 'node-c1',
        x: 280,
        y: 500,
        title: 'Lucas Pendelton',
        subtitle: 'Son (Firstborn)',
        details: '2001 – Present',
        avatar: 'man',
        theme: 'emerald',
        shape: 'process'
      },
      {
        id: 'node-c2',
        x: 520,
        y: 500,
        title: 'Sophia Pendelton',
        subtitle: 'Daughter',
        details: '2005 – Present',
        avatar: 'woman',
        theme: 'purple',
        shape: 'process'
      },
      {
        id: 'node-c3',
        x: 760,
        y: 500,
        title: 'Oliver Pendelton',
        subtitle: 'Son',
        details: '2010 – Present',
        avatar: 'child',
        theme: 'amber',
        shape: 'process'
      }
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
      {
        id: 'flow-1',
        x: 280,
        y: 60,
        title: 'Start Process',
        subtitle: 'User opens login page',
        details: 'Trigger: HTTP GET /login',
        avatar: 'none',
        theme: 'emerald',
        shape: 'terminal'
      },
      {
        id: 'flow-2',
        x: 280,
        y: 190,
        title: 'Input Credentials',
        subtitle: 'Email and password',
        details: 'Form Validation',
        avatar: 'none',
        theme: 'blue',
        shape: 'process'
      },
      {
        id: 'flow-3',
        x: 280,
        y: 330,
        title: 'Valid Credentials?',
        subtitle: 'Verify bcrypt hash in DB',
        details: 'Condition Check',
        avatar: 'none',
        theme: 'amber',
        shape: 'decision'
      },
      {
        id: 'flow-4',
        x: 520,
        y: 330,
        title: 'Show Error Alert',
        subtitle: 'Invalid login notice',
        details: 'Increment failed attempts',
        avatar: 'none',
        theme: 'rose',
        shape: 'process'
      },
      {
        id: 'flow-5',
        x: 280,
        y: 490,
        title: 'Create Session JWT',
        subtitle: 'Issue cookie token',
        details: 'Expiry: 7 Days',
        avatar: 'none',
        theme: 'purple',
        shape: 'process'
      },
      {
        id: 'flow-6',
        x: 280,
        y: 630,
        title: 'Redirect to Dashboard',
        subtitle: 'Access Granted',
        details: 'End Flow',
        avatar: 'none',
        theme: 'cyan',
        shape: 'terminal'
      }
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
      {
        id: 'org-1',
        x: 440,
        y: 80,
        title: 'Chief Executive Officer',
        subtitle: 'Executive Leadership',
        details: 'Oversees strategy & operations',
        avatar: 'man',
        theme: 'emerald',
        shape: 'process'
      },
      {
        id: 'org-2',
        x: 180,
        y: 260,
        title: 'VP of Technology',
        subtitle: 'Engineering & R&D',
        details: 'Infrastructure, Cloud, AI',
        avatar: 'woman',
        theme: 'blue',
        shape: 'process'
      },
      {
        id: 'org-3',
        x: 440,
        y: 260,
        title: 'VP of Product',
        subtitle: 'Design & Customer UX',
        details: 'Roadmap & Feature Delivery',
        avatar: 'man',
        theme: 'purple',
        shape: 'process'
      },
      {
        id: 'org-4',
        x: 700,
        y: 260,
        title: 'VP of Growth',
        subtitle: 'Marketing & Global Sales',
        details: 'Revenue & Partnerships',
        avatar: 'woman',
        theme: 'amber',
        shape: 'process'
      }
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
      {
        id: 'node-root',
        x: 420,
        y: 240,
        title: 'Root Member / Step',
        subtitle: 'Click + to expand',
        details: 'Primary Node',
        avatar: 'man',
        theme: 'blue',
        shape: 'process'
      }
    ],
    connections: []
  }
};
