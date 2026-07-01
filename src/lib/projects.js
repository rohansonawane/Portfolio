export const PROJECT_THUMB_GRADIENTS = [
  'linear-gradient(135deg, #121b3c, #3564ff)',
  'linear-gradient(135deg, #132a50, #23c7ff)',
  'linear-gradient(135deg, #091322, #6966ff)',
  'linear-gradient(135deg, #1a1238, #8a57ff)',
  'linear-gradient(135deg, #0f2a1e, #38c98c)',
  'linear-gradient(135deg, #2a1208, #ff9f43)'
];

export const PROJECT_DEFS = [
  {
    slug: 'vr-classroom-eduvrsxr',
    title: 'VR Classroom',
    desc: 'Multiplayer VR classroom with AI avatar, whiteboard, experiments and more.',
    category: 'VR / XR',
    tags: ['Unity', 'C#', 'XR'],
    thumbnail: '/assets/projects/vr-classroom-eduvrsxr.webp',
    url: 'https://github.com/RohanBSonawane',
    demo: null,
    status: 'Research / Active',
    role: 'Lead VR Developer',
    timeline: '2023 – Present',
    overview:
      'An immersive multiplayer VR classroom designed for remote and hybrid learning. Students join a shared virtual space with interactive whiteboards, science experiments, and an AI teaching avatar that guides lessons in real time. The platform focuses on engagement, spatial collaboration, and scalable session management for education research at CSU Dominguez Hills.',
    features: [
      {
        title: 'Multiplayer VR sessions',
        desc: 'Synchronized classrooms with voice, avatars, and shared object interactions across Quest and PC VR.'
      },
      {
        title: 'AI teaching avatar',
        desc: 'NPC instructor with scripted and generative responses, lesson cues, and student Q&A support.'
      },
      {
        title: 'Interactive whiteboard',
        desc: 'Collaborative drawing, annotations, and slide-style lesson delivery inside the VR environment.'
      },
      {
        title: 'Science experiment modules',
        desc: 'Hands-on lab simulations with physics-based interactions and guided experiment flows.'
      }
    ],
    challenges: [
      {
        title: 'Low-latency multiplayer in VR',
        solution: 'Used Unity Netcode with optimized state replication, interest management, and client-side prediction for smooth interactions.'
      },
      {
        title: 'Onboarding non-technical users',
        solution: 'Built guided tutorial flows, spatial UI prompts, and controller-free fallback interactions for accessibility.'
      }
    ],
    outcomes: [
      'Deployed for CSUDH VR classroom research pilots with repeatable session templates.',
      'Reduced setup time for instructors through reusable lesson prefabs and scene configs.',
      'Improved student engagement metrics in controlled study sessions versus flat video calls.'
    ],
    techStack: ['Unity', 'C#', 'XR Interaction Toolkit', 'Unity Netcode', 'OpenAI API', 'Meta Quest', 'PC VR'],
    highlights: [
      { label: 'Platform', value: 'Meta Quest & PC VR' },
      { label: 'Architecture', value: 'Client-server multiplayer' },
      { label: 'Focus', value: 'Immersive education' }
    ]
  },
  {
    slug: 'ai-canvas-lab',
    title: 'AI Canvas Lab',
    desc: 'AI powered interactive canvas with math tools, AI panel and export.',
    category: 'Web',
    tags: ['React', 'Node.js', 'GPT'],
    thumbnail: '/assets/projects/ai-canvas-lab.webp',
    url: 'https://github.com/RohanBSonawane',
    demo: null,
    status: 'Completed',
    role: 'Full Stack Developer',
    timeline: '2024',
    overview:
      'AI Canvas Lab combines a freeform digital whiteboard with math tooling and an embedded AI assistant. Users sketch diagrams, write equations, and ask the AI panel for explanations, rewrites, or step-by-step breakdowns, then export sessions as images or structured notes for sharing.',
    features: [
      {
        title: 'Infinite canvas workspace',
        desc: 'Pan, zoom, draw, and place sticky notes with a responsive canvas built for long study sessions.'
      },
      {
        title: 'Math-aware tools',
        desc: 'LaTeX-style input, formula blocks, and geometry helpers for STEM-focused workflows.'
      },
      {
        title: 'Contextual AI panel',
        desc: 'GPT-powered side panel that reads canvas context and returns explanations, summaries, and edits.'
      },
      {
        title: 'Export & share',
        desc: 'One-click PNG/PDF export and shareable session snapshots for classrooms or portfolios.'
      }
    ],
    challenges: [
      {
        title: 'Keeping AI responses grounded in canvas context',
        solution: 'Serialized visible canvas elements into structured prompts with bounding regions and text extraction.'
      },
      {
        title: 'Smooth drawing performance',
        solution: 'Layered rendering with requestAnimationFrame batching and debounced persistence to the backend.'
      }
    ],
    outcomes: [
      'Delivered an end-to-end web app with auth-ready API structure and modular tool plugins.',
      'Validated AI-assisted study flows with faster note refinement versus manual rewriting.',
      'Established a reusable canvas + AI panel pattern for future ed-tech experiments.'
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'OpenAI API', 'Canvas API', 'Vite'],
    highlights: [
      { label: 'Type', value: 'Ed-tech web app' },
      { label: 'AI', value: 'GPT-assisted canvas' },
      { label: 'Delivery', value: 'Full stack' }
    ]
  },
  {
    slug: 'legal-doc-ai-assistant',
    title: 'Legal Doc AI Assistant',
    desc: 'AI assistant for legal documents with OCR, RAG, citations and semantic search.',
    category: 'AI / ML',
    tags: ['Python', 'PostgreSQL', 'pgvector'],
    thumbnail: '/assets/projects/legal-doc-ai-assistant.webp',
    url: 'https://github.com/RohanBSonawane',
    demo: null,
    status: 'Completed',
    role: 'AI Engineer',
    timeline: '2024',
    overview:
      'A retrieval-augmented assistant for legal document workflows. Users upload contracts and filings; the system runs OCR, chunks and embeds content into PostgreSQL with pgvector, and answers questions with cited passages. Semantic search surfaces relevant clauses before the LLM synthesizes a grounded response.',
    features: [
      {
        title: 'Document ingestion pipeline',
        desc: 'Upload PDFs and scans with OCR fallback for image-based legal documents.'
      },
      {
        title: 'RAG with citations',
        desc: 'Answers reference source chunks with page/section metadata for auditability.'
      },
      {
        title: 'Semantic clause search',
        desc: 'Vector search across embeddings to find related language across large corpora.'
      },
      {
        title: 'Session history',
        desc: 'Track prior questions and retrieved sources per matter or document set.'
      }
    ],
    challenges: [
      {
        title: 'Hallucination risk in legal contexts',
        solution: 'Enforced citation-only answers, similarity thresholds, and refusal when retrieval confidence is low.'
      },
      {
        title: 'Long PDF processing',
        solution: 'Streaming chunk pipeline with batched embeddings and incremental index updates.'
      }
    ],
    outcomes: [
      'Built a production-shaped RAG stack with Postgres + pgvector instead of a standalone vector DB.',
      'Cut manual clause lookup time in test document sets through semantic search.',
      'Documented evaluation prompts and retrieval tuning for legal-domain accuracy.'
    ],
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'OpenAI Embeddings', 'Tesseract OCR', 'LangChain'],
    highlights: [
      { label: 'Pattern', value: 'RAG + citations' },
      { label: 'Storage', value: 'Postgres / pgvector' },
      { label: 'Domain', value: 'Legal tech' }
    ]
  },
  {
    slug: 'agent-qa',
    title: 'Agent QA',
    desc: 'AI agent workflow for automated quality assurance, test planning and validation.',
    category: 'AI / ML',
    tags: ['Python', 'OpenAI', 'LangChain'],
    thumbnail: '/assets/projects/agent-qa.webp',
    url: 'https://github.com/RohanBSonawane',
    demo: null,
    status: 'Completed',
    role: 'AI Engineer',
    timeline: '2024',
    overview:
      'Agent QA orchestrates LLM-powered agents to generate test cases, run structured validations, and summarize software quality findings. The system combines prompt templates, tool use, and structured outputs so teams can automate repetitive QA checks while keeping human-readable reports.',
    features: [
      { title: 'Agent orchestration', desc: 'Multi-step QA flows with specialized agents for planning, execution, and reporting.' },
      { title: 'Structured test output', desc: 'JSON and markdown reports with severity, reproduction steps, and coverage notes.' },
      { title: 'Tool integrations', desc: 'Hooks for API testing, UI checks, and repository context ingestion.' },
      { title: 'Review dashboard', desc: 'Summarized findings with filters for priority, component, and regression risk.' }
    ],
    challenges: [
      { title: 'Keeping agents grounded in app context', solution: 'Fed repo metadata, API schemas, and prior test artifacts into retrieval-augmented prompts.' },
      { title: 'Balancing automation with trust', solution: 'Required explicit evidence fields and confidence scores before marking issues as confirmed.' }
    ],
    outcomes: [
      'Reduced manual test-plan drafting time for pilot feature sets.',
      'Produced repeatable QA agent templates reusable across web and API projects.',
      'Improved issue triage clarity through structured agent-generated summaries.'
    ],
    techStack: ['Python', 'FastAPI', 'OpenAI API', 'LangChain', 'PostgreSQL', 'React'],
    highlights: [
      { label: 'Pattern', value: 'Multi-agent QA' },
      { label: 'Focus', value: 'Test automation' },
      { label: 'Output', value: 'Structured reports' }
    ]
  },
  {
    slug: 'early-cancer-detection',
    title: 'Early Cancer Detection',
    desc: 'ML pipeline for medical imaging analysis and early-stage cancer screening support.',
    category: 'AI / ML',
    tags: ['Python', 'TensorFlow', 'Computer Vision'],
    thumbnail: '/assets/projects/early-cancer-detection.webp',
    url: 'https://github.com/RohanBSonawane',
    demo: null,
    status: 'Research',
    role: 'ML Engineer',
    timeline: '2024',
    overview:
      'An machine learning project focused on detecting early indicators in medical imaging datasets. The pipeline covers preprocessing, model training, evaluation metrics, and interpretability outputs to support research-oriented screening workflows.',
    features: [
      { title: 'Image preprocessing', desc: 'Normalization, augmentation, and dataset splitting for robust training.' },
      { title: 'Classification models', desc: 'CNN-based architectures tuned for sensitivity and false-positive control.' },
      { title: 'Evaluation suite', desc: 'ROC, precision-recall, confusion matrices, and threshold analysis.' },
      { title: 'Explainability views', desc: 'Grad-CAM style overlays to highlight model attention regions.' }
    ],
    challenges: [
      { title: 'Class imbalance in medical data', solution: 'Applied weighted losses, oversampling, and stratified validation splits.' },
      { title: 'Generalization across scans', solution: 'Used augmentation and held-out site splits to test domain shift.' }
    ],
    outcomes: [
      'Built an end-to-end training and evaluation notebook pipeline.',
      'Documented model trade-offs between sensitivity and specificity.',
      'Delivered visualization tools for research review sessions.'
    ],
    techStack: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'NumPy', 'Jupyter'],
    highlights: [
      { label: 'Domain', value: 'Healthcare ML' },
      { label: 'Task', value: 'Image classification' },
      { label: 'Focus', value: 'Early detection' }
    ]
  },
  {
    slug: 'incident-pilot',
    title: 'Incident Pilot',
    desc: 'Incident response copilot for triage, runbooks, and on-call workflow assistance.',
    category: 'Web',
    tags: ['React', 'Node.js', 'OpenAI'],
    thumbnail: '/assets/projects/incident-pilot.webp',
    url: 'https://github.com/RohanBSonawane',
    demo: null,
    status: 'Completed',
    role: 'Full Stack Developer',
    timeline: '2024',
    overview:
      'Incident Pilot helps engineering teams respond faster by combining alert context, runbook retrieval, and AI-generated triage suggestions in one workspace. Operators can log actions, track severity, and export post-incident summaries.',
    features: [
      { title: 'Incident workspace', desc: 'Timeline view for alerts, owners, status changes, and linked services.' },
      { title: 'Runbook assistant', desc: 'RAG-backed suggestions from internal docs and prior incident notes.' },
      { title: 'Action logging', desc: 'Structured updates with timestamps for postmortem generation.' },
      { title: 'Summary export', desc: 'One-click incident report drafts with root cause and follow-ups.' }
    ],
    challenges: [
      { title: 'Noisy alert context', solution: 'Clustered related alerts and summarized payloads before LLM prompts.' },
      { title: 'Safe operational guidance', solution: 'Surfaced runbook citations and flagged low-confidence recommendations.' }
    ],
    outcomes: [
      'Shortened time-to-first-action in simulated on-call drills.',
      'Created reusable incident templates for common failure modes.',
      'Improved post-incident documentation consistency across teams.'
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'OpenAI API', 'PostgreSQL'],
    highlights: [
      { label: 'Use case', value: 'On-call ops' },
      { label: 'AI', value: 'Triage copilot' },
      { label: 'Delivery', value: 'Full stack' }
    ]
  },
  {
    slug: 'interactive-hate-map',
    title: 'Interactive Hate Map',
    desc: 'Data visualization platform mapping hate speech trends with interactive geospatial views.',
    category: 'Web',
    tags: ['JavaScript', 'D3.js', 'Python'],
    thumbnail: '/assets/projects/interactive-hate-map.webp',
    url: 'https://github.com/RohanBSonawane',
    demo: null,
    status: 'Completed',
    role: 'Data Visualization Developer',
    timeline: '2023',
    overview:
      'An interactive map and analytics dashboard for exploring geospatial patterns in hate speech datasets. Users filter by region, time range, and category to inspect trends, hotspots, and comparative statistics.',
    features: [
      { title: 'Interactive map layers', desc: 'Zoomable choropleth and point layers with hover tooltips and legends.' },
      { title: 'Time-series filters', desc: 'Date range and category controls with animated transitions.' },
      { title: 'Analytics panels', desc: 'Top regions, trend deltas, and distribution charts synced to map state.' },
      { title: 'Export snapshots', desc: 'PNG exports of current map views for reports and presentations.' }
    ],
    challenges: [
      { title: 'Performance with large datasets', solution: 'Aggregated data server-side and used canvas/WebGL-friendly rendering paths.' },
      { title: 'Clear ethical presentation', solution: 'Added contextual notes, aggregation thresholds, and anonymized region buckets.' }
    ],
    outcomes: [
      'Delivered an explorable dashboard for research and policy review.',
      'Enabled faster regional comparison versus static spreadsheet analysis.',
      'Established a reusable visualization stack for social data projects.'
    ],
    techStack: ['JavaScript', 'D3.js', 'Leaflet', 'Python', 'Pandas', 'Flask'],
    highlights: [
      { label: 'Type', value: 'Data viz' },
      { label: 'View', value: 'Geospatial' },
      { label: 'Interaction', value: 'Filter + map sync' }
    ]
  },
  {
    slug: 'rohanverse-portfolio',
    title: 'RohanVerse Portfolio',
    desc: 'Interactive Three.js portfolio with rigged avatar, orbiting skills and glass UI.',
    category: 'Web / 3D',
    tags: ['Three.js', 'Vite', 'WebGL'],
    url: 'https://github.com/RohanBSonawane',
    demo: null,
    status: 'Live',
    role: 'Designer & Developer',
    timeline: '2025 – Present',
    overview:
      'RohanVerse is a personal portfolio that merges a rigged 3D avatar, orbiting skill badges, and glassmorphism UI into a single immersive landing experience. The site highlights projects, skills, and experience while keeping performance and accessibility in mind across desktop and mobile.',
    features: [
      {
        title: 'Rigged 3D avatar hero',
        desc: 'GLTF character with wave animation, camera choreography, and responsive layout scaling.'
      },
      {
        title: 'Orbiting skills scene',
        desc: 'Brand-icon skill badges in a Three.js background orbit with hover tooltips and theme sync.'
      },
      {
        title: 'Glass UI system',
        desc: 'Consistent panels, modals, filters, and dark/light theming with CSS variables.'
      },
      {
        title: 'Project detail pages',
        desc: 'Dedicated case-study pages with structured overview, features, and related work.'
      }
    ],
    challenges: [
      {
        title: 'WebGL on mobile without jank',
        solution: 'Reduced draw calls, capped pixel ratio, and progressive enhancement with CSS fallbacks.'
      },
      {
        title: 'Balancing spectacle with readability',
        solution: 'Kept content panels high-contrast and scrollable while the 3D scene stays atmospheric.'
      }
    ],
    outcomes: [
      'Shipped a distinctive portfolio experience that showcases VR, AI, and full-stack range.',
      'Modularized project data for reusable cards, filters, and detail pages.',
      'Achieved smooth intro sequence and theme persistence across sessions.'
    ],
    techStack: ['Three.js', 'WebGL', 'Vite', 'JavaScript', 'GLTF', 'CSS', 'Inter'],
    highlights: [
      { label: 'Stack', value: 'Vanilla JS + Vite' },
      { label: '3D', value: 'Three.js / WebGL' },
      { label: 'Status', value: 'Live portfolio' }
    ]
  },
  {
    slug: 'web-declutter-extension',
    title: 'Web Declutter Extension',
    desc: 'One-click tool to hide distracting page sections for a cleaner browsing experience.',
    category: 'Web',
    tags: ['JavaScript', 'Chrome', 'UX'],
    url: 'https://github.com/RohanBSonawane',
    demo: null,
    status: 'Completed',
    role: 'Solo Developer',
    timeline: '2022',
    overview:
      'A lightweight Chrome extension that lets users hide noisy page sections like sidebars, recommendation rails, and comment threads with one click. Rules can be saved per domain so returning visits automatically apply a cleaner reading layout.',
    features: [
      {
        title: 'One-click declutter',
        desc: 'Select and hide elements directly on the page with visual hover highlights.'
      },
      {
        title: 'Per-site rules',
        desc: 'Persist selectors by hostname so preferences survive reloads.'
      },
      {
        title: 'Toggle & undo',
        desc: 'Quickly restore hidden sections without losing configured rules.'
      },
      {
        title: 'Minimal permissions',
        desc: 'Uses activeTab-style access patterns focused on user-initiated actions.'
      }
    ],
    challenges: [
      {
        title: 'Fragile CSS selectors across site redesigns',
        solution: 'Stored multiple fallback selectors and semantic hints per hidden block where possible.'
      },
      {
        title: 'Non-destructive hiding',
        solution: 'Applied reversible display overrides instead of DOM removal to avoid breaking SPA routers.'
      }
    ],
    outcomes: [
      'Shipped a practical productivity tool used for focused reading on content-heavy sites.',
      'Demonstrated DOM interaction patterns reusable in other browser extension projects.',
      'Kept bundle size small with vanilla JavaScript and no framework overhead.'
    ],
    techStack: ['JavaScript', 'Chrome Extensions API', 'CSS', 'localStorage', 'Manifest V3'],
    highlights: [
      { label: 'Platform', value: 'Chrome extension' },
      { label: 'UX', value: 'Focus / readability' },
      { label: 'Scope', value: 'Solo build' }
    ]
  }
];

const PLACEHOLDER_COLORS = [
  ['#121b3c', '#3564ff'],
  ['#132a50', '#23c7ff'],
  ['#091322', '#6966ff'],
  ['#1a1238', '#8a57ff'],
  ['#0f2a1e', '#38c98c'],
  ['#2a1208', '#ff9f43']
];

export function getProjectThumbnail(project, index = 0) {
  if (project.thumbnail) return project.thumbnail;

  const [from, to] = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];
  const initials = project.title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase() || 'RV';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" role="img" aria-label="${project.title}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="240" height="240" rx="18" fill="url(#g)"/>
    <text x="120" y="132" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-size="54" font-family="Inter,system-ui,sans-serif" font-weight="600">${initials}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getProjectPageUrl(slug) {
  return `/project/${encodeURIComponent(slug)}`;
}

export function getProjectBySlug(slug) {
  return PROJECT_DEFS.find(project => project.slug === slug) || null;
}

export function getRelatedProjects(project, limit = 3) {
  return PROJECT_DEFS.filter(
    item => item.slug !== project.slug && item.category === project.category
  ).slice(0, limit);
}
