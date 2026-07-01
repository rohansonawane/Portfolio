export const SKILL_DEFS = [
  { slug: 'react', color: '#61DAFB', label: 'React', iconHex: '000000' },
  { slug: 'typescript', color: '#3178C6', label: 'TypeScript' },
  { slug: 'nextdotjs', color: '#000000', iconHex: 'FFFFFF', label: 'Next.js' },
  { slug: 'javascript', color: '#F7DF1E', iconHex: '000000', label: 'JavaScript' },
  { slug: 'html5', color: '#E34F26', label: 'HTML5' },
  { slug: 'css3', color: '#1572B6', label: 'CSS3' },
  { slug: 'tailwindcss', color: '#06B6D4', label: 'Tailwind' },
  { slug: 'redux', color: '#764ABC', label: 'Redux' },
  { slug: 'vite', color: '#646CFF', label: 'Vite' },
  { slug: 'sass', color: '#CC6699', label: 'Sass' },
  { slug: 'vuedotjs', color: '#4FC08D', label: 'Vue.js' },
  { slug: 'svelte', color: '#FF3E00', label: 'Svelte' },
  { slug: 'angular', color: '#DD0031', label: 'Angular' },
  { slug: 'framermotion', iconSlug: 'framer', color: '#0055FF', label: 'Framer Motion' },
  { slug: 'zustand', color: '#44374B', iconHex: 'FFFFFF', label: 'Zustand' },
  { slug: 'wordpress', color: '#21759B', label: 'WordPress' },
  { slug: 'magento', color: '#EE672F', label: 'Magento' },
  { slug: 'figma', color: '#F24E1E', label: 'Figma' },
  { slug: 'bootstrap', color: '#7952B3', label: 'Bootstrap' },
  { slug: 'nodedotjs', color: '#339933', label: 'Node.js' },
  { slug: 'python', color: '#3776AB', label: 'Python' },
  { slug: 'fastapi', color: '#009688', label: 'FastAPI' },
  { slug: 'express', color: '#000000', iconHex: 'FFFFFF', label: 'Express' },
  { slug: 'django', color: '#092E20', label: 'Django' },
  { slug: 'postgresql', color: '#4169E1', label: 'PostgreSQL' },
  { slug: 'mongodb', color: '#47A248', label: 'MongoDB' },
  { slug: 'redis', color: '#DC382D', label: 'Redis' },
  { slug: 'graphql', color: '#E10098', label: 'GraphQL' },
  { slug: 'prisma', color: '#2D3748', iconHex: 'FFFFFF', label: 'Prisma' },
  { slug: 'nginx', color: '#009639', label: 'Nginx' },
  { slug: 'openai', color: '#412991', label: 'OpenAI / RAG' },
  { slug: 'tensorflow', color: '#FF6F00', label: 'TensorFlow' },
  { slug: 'pytorch', color: '#EE4C2C', label: 'PyTorch' },
  { slug: 'huggingface', color: '#FFD21E', iconHex: '000000', label: 'Hugging Face' },
  { slug: 'jupyter', color: '#F37626', label: 'Jupyter' },
  { slug: 'pandas', color: '#150458', label: 'Pandas' },
  { slug: 'scikitlearn', color: '#F7931E', label: 'scikit-learn' },
  { slug: 'amazonaws', color: '#FF9900', label: 'AWS' },
  { slug: 'googlecloud', color: '#4285F4', label: 'Google Cloud' },
  { slug: 'docker', color: '#2496ED', label: 'Docker' },
  { slug: 'kubernetes', color: '#326CE5', label: 'Kubernetes' },
  { slug: 'terraform', color: '#844FBA', label: 'Terraform' },
  { slug: 'githubactions', color: '#2088FF', label: 'GitHub Actions' },
  { slug: 'vercel', color: '#000000', iconHex: 'FFFFFF', label: 'Vercel' },
  { slug: 'netlify', color: '#00C7B7', label: 'Netlify' },
  { slug: 'git', color: '#F05032', label: 'Git' },
  { slug: 'github', color: '#181717', iconHex: 'FFFFFF', label: 'GitHub' },
  { slug: 'unity', color: '#222222', iconHex: 'FFFFFF', label: 'Unity' },
  { slug: 'unrealengine', color: '#0E1128', iconHex: 'FFFFFF', label: 'Unreal Engine' },
  { slug: 'threedotjs', color: '#049EF4', label: 'Three.js' },
  { slug: 'blender', color: '#F5792A', label: 'Blender' },
  { slug: 'csharp', color: '#512BD4', label: 'C#' },
  {
    slug: 'webxr',
    color: '#0045E6',
    label: 'WebXR',
    iconDataUri: `data:image/svg+xml,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img"><path fill="#0045E6" d="M4 10a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1.7l-1.3 2h-1.8l-1.1-1.5H11.9L10.8 17H9l-1.3-2H6a3 3 0 0 1-3-3v-2zm3-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1.2l.8 1.2h1.2l1-1.3h2.6l1 1.3h1.2l.8-1.2H18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H7z"/></svg>'
    )}`
  }
];

const TAG_ALIASES = {
  gpt: 'openai',
  'openai api': 'openai',
  'openai embeddings': 'openai',
  pgvector: 'postgresql',
  webgl: 'threedotjs',
  xr: 'webxr',
  'ai/ml': 'openai',
  'ml apis': 'openai',
  netcode: 'unity',
  'unity netcode': 'unity',
  'xr interaction toolkit': 'unity',
  'meta quest': 'unity',
  'pc vr': 'webxr',
  chrome: 'googlecloud',
  'chrome extensions api': 'googlecloud',
  'manifest v3': 'googlecloud',
  css: 'css3',
  'canvas api': 'javascript',
  langchain: 'openai',
  'tesseract ocr': 'python',
  json: 'javascript',
  localstorage: 'javascript',
  gltf: 'threedotjs',
  inter: 'css3',
  vue: 'vuedotjs',
  'vue.js': 'vuedotjs',
  'framer motion': 'framermotion',
  'material ui': 'bootstrap',
  mui: 'bootstrap'
};

const TAG_FALLBACK_COLORS = {
  chrome: '#4285F4',
  ux: '#8a57ff'
};

function hexToLuminance(hex) {
  const c = (hex || '').replace('#', '');
  if (c.length !== 6) return 0.5;
  const channels = [c.slice(0, 2), c.slice(2, 4), c.slice(4, 6)].map(part => parseInt(part, 16) / 255);
  const linear = channels.map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function isDarkHex(hex) {
  return hexToLuminance(hex) < 0.22;
}

export function getSkillByTagLabel(label) {
  const key = label.trim().toLowerCase();
  const aliasSlug = TAG_ALIASES[key];
  if (aliasSlug) return SKILL_DEFS.find(skill => skill.slug === aliasSlug);

  const exact = SKILL_DEFS.find(skill => skill.label.toLowerCase() === key);
  if (exact) return exact;

  return SKILL_DEFS.find(skill => {
    const skillLabel = skill.label.toLowerCase();
    return key.includes(skillLabel) || skillLabel.includes(key);
  });
}

export function getTagBrandColor(label) {
  const skill = getSkillByTagLabel(label);
  if (skill?.color) return skill.color;
  return TAG_FALLBACK_COLORS[label.trim().toLowerCase()] || '#4f55ff';
}

export function styleBrandTag(el, label, dark = document.documentElement.dataset.theme === 'dark') {
  const skill = getSkillByTagLabel(label);
  const brand = getTagBrandColor(label);
  const hex = brand.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  let textColor = brand;

  if (dark && isDarkHex(brand)) {
    textColor = skill?.iconHex
      ? `#${skill.iconHex.replace('#', '')}`
      : `rgb(${Math.min(r + 110, 255)}, ${Math.min(g + 110, 255)}, ${Math.min(b + 110, 255)})`;
  }

  el.style.color = textColor;
  el.style.background = `rgba(${r}, ${g}, ${b}, ${dark ? 0.2 : 0.12})`;
}

export function refreshBrandTags(root = document) {
  root.querySelectorAll('.tag[data-tag]').forEach(el => styleBrandTag(el, el.dataset.tag));
}
