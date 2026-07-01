    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import {
      PROJECT_DEFS,
      PROJECT_THUMB_GRADIENTS,
      getProjectPageUrl,
      getProjectThumbnail
    } from './assets/projects.js';

    const root = document.documentElement;

    const SITE_LINKS = {
      github: 'https://github.com/RohanBSonawane',
      linkedin: 'https://www.linkedin.com/in/rohanbsonawane',
      email: 'mailto:rohanbsonawane@gmail.com',
      resume: 'assets/resume.html'
    };

    document.getElementById('brandHome')?.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    (function initMobileNav() {
      const mobileNav = document.getElementById('mobileNav');
      const openBtn = document.getElementById('mobileMenuBtn');
      const closeBtn = document.getElementById('mobileNavClose');
      const backdrop = document.getElementById('mobileNavBackdrop');
      const mobileLinks = [...document.querySelectorAll('#mobileNavLinks a[data-section]')];

      function setOpen(open) {
        mobileNav.classList.toggle('open', open);
        mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
        openBtn?.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('mobile-nav-open', open);
      }

      openBtn?.addEventListener('click', () => setOpen(true));
      closeBtn?.addEventListener('click', () => setOpen(false));
      backdrop?.addEventListener('click', () => setOpen(false));

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => setOpen(false));
      });

      window.addEventListener('keydown', e => {
        if (e.key === 'Escape') setOpen(false);
      });
    })();

    (function initNavSpy() {
      const navLinks = [...document.querySelectorAll('.nav-links a[data-section]')];
      const mobileLinks = [...document.querySelectorAll('#mobileNavLinks a[data-section]')];
      const allLinks = [...navLinks, ...mobileLinks];
      const scrollSections = ['about', 'skills', 'projects', 'experience', 'stats', 'contact'];
      let activeSection = '';

      function setActive(section) {
        if (section === activeSection) return;
        activeSection = section;
        allLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === section);
        });
      }

      function updateFromScroll() {
        if (window.scrollY < 80) {
          setActive('home');
          return;
        }

        const probe = window.scrollY + window.innerHeight * 0.22;
        let current = 'about';
        for (const id of scrollSections) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (probe >= top) current = id;
        }
        setActive(current);
      }

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          updateFromScroll();
          ticking = false;
        });
      }, { passive: true });

      allLinks.forEach(link => {
        link.addEventListener('click', e => {
          const section = link.dataset.section;
          if (section === 'home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActive('home');
            return;
          }
          if (scrollSections.includes(section)) {
            requestAnimationFrame(() => setActive(section));
          }
        });
      });

      updateFromScroll();
    })();

    (function initStatsReveal() {
      const stats = document.getElementById('stats');
      if (!stats) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        stats.classList.add('reveal');
        return;
      }
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.25 });
      observer.observe(stats);
    })();

    window.showToast = function(message) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
    };

    const MODEL_URL = 'assets/model/scene.gltf';
    const SIMPLE_ICONS_PKG = '11.14.0';
    const SIMPLE_ICONS_JSdelivr = slug =>
      `https://cdn.jsdelivr.net/npm/simple-icons@${SIMPLE_ICONS_PKG}/icons/${slug}.svg`;
    const SIMPLE_ICONS_CDN_MISSING = new Set(['amazonaws', 'openai']);

    function getSkillBrandHex(skill) {
      return (skill.color || '#4f55ff').replace('#', '');
    }

    function getSkillIconAssetUrl(skill) {
      if (skill.iconDataUri) return skill.iconDataUri;
      const slug = skill.iconSlug || skill.slug;
      return `https://cdn.simpleicons.org/${slug}/${getSkillBrandHex(skill)}`;
    }

    function tintMonochromeIcon(img, color) {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = color.startsWith('#') ? color : `#${color}`;
      ctx.fillRect(0, 0, size, size);
      return canvas.toDataURL('image/png');
    }

    function loadColoredSkillIconUrl(skill, dark = document.documentElement.dataset.theme === 'dark') {
      if (skill.iconDataUri) return Promise.resolve(skill.iconDataUri);

      const slug = skill.iconSlug || skill.slug;
      const iconHex = getSkillIconColorHex(skill, dark);
      const iconColor = `#${iconHex}`;
      const coloredCdn = `https://cdn.simpleicons.org/${slug}/${iconHex}`;

      return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          if (img.src.includes('simpleicons.org')) {
            resolve(coloredCdn);
            return;
          }
          resolve(tintMonochromeIcon(img, iconColor));
        };
        img.onerror = () => {
          const fallback = new Image();
          fallback.crossOrigin = 'anonymous';
          fallback.onload = () => resolve(tintMonochromeIcon(fallback, iconColor));
          fallback.onerror = () => resolve(coloredCdn);
          fallback.src = SIMPLE_ICONS_JSdelivr(slug);
        };
        img.src = coloredCdn;
      });
    }

    function applyColoredSkillIcon(img, skill) {
      loadColoredSkillIconUrl(skill).then(url => {
        img.src = url;
      });
      bindSkillIconFallback(img, skill);
    }

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

    function getSkillIconColorHex(skill, dark = document.documentElement.dataset.theme === 'dark') {
      const brand = (skill.color || '#888888').replace('#', '');
      const iconHex = skill.iconHex ? skill.iconHex.replace('#', '') : null;

      if (dark) {
        if (skill.iconHexDark) return skill.iconHexDark.replace('#', '');
        if (iconHex && !isDarkHex(iconHex)) return iconHex;
        if (isDarkHex(brand)) return 'FFFFFF';
        return brand;
      }

      if (skill.iconHexLight) return skill.iconHexLight.replace('#', '');
      if (isDarkHex(brand)) return brand;
      if (iconHex && !isDarkHex(iconHex)) return iconHex;
      return brand;
    }

    function getSkillPanelIconUrl(skill) {
      return getSkillIconAssetUrl(skill);
    }

    function bindSkillIconFallback(img, skill) {
      if (!img || img.dataset.fallbackBound) return;
      img.dataset.fallbackBound = '1';
      img.addEventListener('error', () => {
        if (img.dataset.fallbackStage === 'tinted') {
          img.replaceWith(Object.assign(document.createElement('span'), {
            className: 'skill-icon-fallback',
            textContent: (skill.label || skill.slug || '?')[0],
            style: `color: #${getSkillBrandHex(skill)}`
          }));
          return;
        }
        img.dataset.fallbackStage = 'tinted';
        img.removeAttribute('srcset');
        loadColoredSkillIconUrl(skill).then(url => {
          img.src = url;
        });
      }, { once: false });
    }

    const AVATAR_LAYOUT_DEFAULTS = {
      targetHeight: 16.5,
      floorY: -7,
      forwardZ: 0.68,
      stageOffsetX: -1.35,
      stageOffsetY: -0.49,
      viewHeight: 22,
      cameraLookY: -0.39,
      skillOrbitRadius: 6.1,
      skillOrbitCy: 1.6,
      skillBackgroundZ: -2.75,
      skillOrbitSpeed: 0.13,
      skillCardSize: 1.08,
      skillOpacity: 0.88,
      floorGlowY: -6.88,
      floorGlowRadius: 2.4,
      shockwaveY: -6.82,
      introStartScaleMul: 0.32
    };

    const avatarLayout = { ...AVATAR_LAYOUT_DEFAULTS };

    function roundRect(ctx, x, y, w, h, r) {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    }

    function loadSkillLogo(skill, dark = false) {
      const slug = skill.iconSlug || skill.slug;
      const brandColor = skill.color || '#4f55ff';
      const brandHex = getSkillBrandHex(skill);
      const iconColor = `#${getSkillIconColorHex(skill, dark)}`;
      const ringColor = dark && isDarkHex(brandHex) ? iconColor : brandColor;

      return new Promise(resolve => {
        loadColoredSkillIconUrl(skill, dark).then(iconUrl => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const c = document.createElement('canvas');
            c.width = c.height = 256;
            const ctx = c.getContext('2d');

            if (dark) {
              ctx.fillStyle = isDarkHex(brandHex) ? 'rgba(255, 255, 255, 0.1)' : brandColor;
              ctx.globalAlpha = isDarkHex(brandHex) ? 1 : 0.28;
            } else {
              ctx.fillStyle = brandColor;
              ctx.globalAlpha = 0.16;
            }
            ctx.beginPath();
            ctx.arc(128, 128, 118, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 7;
            ctx.shadowColor = ringColor;
            ctx.shadowBlur = dark ? 22 : 18;
            ctx.beginPath();
            ctx.arc(128, 128, 118, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            const iconSize = 148;
            const iconCanvas = document.createElement('canvas');
            iconCanvas.width = iconCanvas.height = iconSize;
            const iconCtx = iconCanvas.getContext('2d');
            iconCtx.drawImage(img, 0, 0, iconSize, iconSize);
            iconCtx.globalCompositeOperation = 'source-in';
            iconCtx.fillStyle = iconColor;
            iconCtx.fillRect(0, 0, iconSize, iconSize);

            const pad = 54;
            ctx.drawImage(iconCanvas, pad, pad, 256 - pad * 2, 256 - pad * 2);
            const tex = new THREE.CanvasTexture(c);
            tex.colorSpace = THREE.SRGBColorSpace;
            resolve(tex);
          };
          img.onerror = () => {
            const c = document.createElement('canvas');
            c.width = c.height = 256;
            const ctx = c.getContext('2d');
            ctx.fillStyle = dark ? 'rgba(255, 255, 255, 0.1)' : brandColor;
            ctx.beginPath();
            ctx.arc(128, 128, 118, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = iconColor;
            ctx.font = '900 72px Inter, Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((skill.label || slug || '?')[0].toUpperCase(), 128, 132);
            resolve(new THREE.CanvasTexture(c));
          };
          img.src = iconUrl;
        });
      });
    }

    const SKILL_GROUPS = [
      { id: 'frontend', label: 'Frontend' },
      { id: 'backend', label: 'Backend' },
      { id: 'aiml', label: 'AI / ML' },
      { id: 'cloud', label: 'Cloud' },
      { id: 'vrxr', label: 'VR / XR' }
    ];

    const SKILL_DEFS = [
      { slug: 'react', color: '#61DAFB', label: 'React', group: 'frontend', desc: 'Component-driven UI for fast, interactive web apps and design systems.' },
      { slug: 'typescript', color: '#3178C6', label: 'TypeScript', group: 'frontend', desc: 'Typed JavaScript for safer refactors and scalable production codebases.' },
      { slug: 'nextdotjs', color: '#000000', iconHex: 'FFFFFF', label: 'Next.js', group: 'frontend', desc: 'Full-stack React framework with SSR, routing, and optimized performance.' },
      { slug: 'javascript', color: '#F7DF1E', iconHex: '000000', label: 'JavaScript', group: 'frontend', desc: 'Core web language for dynamic interfaces, tooling, and full-stack JavaScript apps.' },
      { slug: 'html5', color: '#E34F26', label: 'HTML5', group: 'frontend', desc: 'Semantic markup for accessible, SEO-friendly, and structured web experiences.' },
      { slug: 'css3', color: '#1572B6', label: 'CSS3', group: 'frontend', desc: 'Modern styling with layout, animation, and responsive design techniques.' },
      { slug: 'tailwindcss', color: '#06B6D4', label: 'Tailwind', group: 'frontend', desc: 'Utility-first CSS for rapid UI development with consistent design tokens.' },
      { slug: 'redux', color: '#764ABC', label: 'Redux', group: 'frontend', desc: 'Predictable state management for complex React application data flows.' },
      { slug: 'vite', color: '#646CFF', label: 'Vite', group: 'frontend', desc: 'Lightning-fast dev server and build tooling for modern frontend projects.' },
      { slug: 'sass', color: '#CC6699', label: 'Sass', group: 'frontend', desc: 'CSS preprocessor for variables, nesting, and maintainable design systems.' },
      { slug: 'vuedotjs', color: '#4FC08D', label: 'Vue.js', group: 'frontend', desc: 'Progressive JavaScript framework for building reactive, component-based UIs.' },
      { slug: 'framermotion', iconSlug: 'framer', color: '#0055FF', label: 'Framer Motion', group: 'frontend', desc: 'Production-ready motion library for React animations, gestures, and page transitions.' },
      { slug: 'zustand', color: '#44374B', iconHex: 'FFFFFF', label: 'Zustand', group: 'frontend', desc: 'Lightweight state management for React with minimal boilerplate and great DX.', iconDataUri: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img"><path fill="#44374B" d="M12 3c-3.3 0-6 2.7-6 6 0 2.2 1.2 4.1 3 5.2V21h6v-6.8c1.8-1.1 3-3 3-5.2 0-3.3-2.7-6-6-6zm0 2.2c2.1 0 3.8 1.7 3.8 3.8S14.1 12.8 12 12.8 8.2 11.1 8.2 9 9.9 5.2 12 5.2z"/></svg>')}` },
      { slug: 'wordpress', color: '#21759B', label: 'WordPress', group: 'frontend', desc: 'CMS for building content-driven sites, themes, plugins, and client-ready marketing pages.' },
      { slug: 'magento', color: '#EE672F', label: 'Magento', group: 'frontend', desc: 'E-commerce platform for storefront customization, catalog UX, and scalable online retail experiences.' },
      { slug: 'figma', color: '#F24E1E', label: 'Figma', group: 'frontend', desc: 'Collaborative design tool for wireframes, prototypes, and design-to-code handoff.' },
      { slug: 'nodedotjs', color: '#339933', label: 'Node.js', group: 'backend', desc: 'Event-driven JavaScript runtime for APIs, services, and real-time apps.' },
      { slug: 'python', color: '#3776AB', label: 'Python', group: 'backend', desc: 'Versatile language for backends, automation, data pipelines, and AI tooling.' },
      { slug: 'fastapi', color: '#009688', label: 'FastAPI', group: 'backend', desc: 'High-performance Python APIs with async support and automatic OpenAPI docs.' },
      { slug: 'express', color: '#000000', iconHex: 'FFFFFF', label: 'Express', group: 'backend', desc: 'Minimal Node.js framework for REST APIs, middleware, and microservices.' },
      { slug: 'django', color: '#092E20', label: 'Django', group: 'backend', desc: 'Batteries-included Python framework for secure, scalable web applications.' },
      { slug: 'postgresql', color: '#4169E1', label: 'PostgreSQL', group: 'backend', desc: 'Reliable relational database with strong SQL, JSON, and extension support.' },
      { slug: 'mongodb', color: '#47A248', label: 'MongoDB', group: 'backend', desc: 'Flexible document database for rapid iteration and evolving product schemas.' },
      { slug: 'redis', color: '#DC382D', label: 'Redis', group: 'backend', desc: 'In-memory caching and pub/sub for speed, sessions, and real-time features.' },
      { slug: 'graphql', color: '#E10098', label: 'GraphQL', group: 'backend', desc: 'Precise API queries that reduce over-fetching and improve client flexibility.' },
      { slug: 'prisma', color: '#2D3748', iconHex: 'FFFFFF', label: 'Prisma', group: 'backend', desc: 'Type-safe ORM and migrations for Node.js and TypeScript backends.' },
      { slug: 'nginx', color: '#009639', label: 'Nginx', group: 'backend', desc: 'High-performance reverse proxy, load balancing, and static asset serving.' },
      { slug: 'openai', color: '#412991', label: 'OpenAI / RAG', group: 'aiml', desc: 'LLM integrations, retrieval-augmented generation, and intelligent product features.' },
      { slug: 'tensorflow', color: '#FF6F00', label: 'TensorFlow', group: 'aiml', desc: 'Deep learning framework for training and deploying ML models at scale.' },
      { slug: 'pytorch', color: '#EE4C2C', label: 'PyTorch', group: 'aiml', desc: 'Flexible ML framework for research, prototyping, and production inference.' },
      { slug: 'huggingface', color: '#FFD21E', iconHex: '000000', label: 'Hugging Face', group: 'aiml', desc: 'Transformers, model hubs, and NLP tooling for modern AI applications.' },
      { slug: 'jupyter', color: '#F37626', label: 'Jupyter', group: 'aiml', desc: 'Interactive notebooks for data exploration, ML experiments, and analysis.' },
      { slug: 'pandas', color: '#150458', label: 'Pandas', group: 'aiml', desc: 'Data manipulation and analysis library for cleaning and preparing datasets.' },
      { slug: 'scikitlearn', color: '#F7931E', label: 'scikit-learn', group: 'aiml', desc: 'Classical ML algorithms for classification, regression, and clustering.' },
      { slug: 'amazonaws', color: '#FF9900', label: 'AWS', group: 'cloud', desc: 'Cloud infrastructure for deployable, scalable, and secure production systems.' },
      { slug: 'googlecloud', color: '#4285F4', label: 'Google Cloud', group: 'cloud', desc: 'Managed cloud services for compute, storage, AI, and global deployments.' },
      { slug: 'docker', color: '#2496ED', label: 'Docker', group: 'cloud', desc: 'Containerized environments for consistent builds and portable deployments.' },
      { slug: 'kubernetes', color: '#326CE5', label: 'Kubernetes', group: 'cloud', desc: 'Orchestration for scaling, rolling updates, and resilient microservices.' },
      { slug: 'terraform', color: '#844FBA', label: 'Terraform', group: 'cloud', desc: 'Infrastructure as code for reproducible cloud provisioning and environments.' },
      { slug: 'githubactions', color: '#2088FF', label: 'GitHub Actions', group: 'cloud', desc: 'CI/CD pipelines for automated testing, builds, and deployments.' },
      { slug: 'vercel', color: '#000000', iconHex: 'FFFFFF', label: 'Vercel', group: 'cloud', desc: 'Edge hosting and serverless deployments optimized for modern web apps.' },
      { slug: 'netlify', color: '#00C7B7', label: 'Netlify', group: 'cloud', desc: 'Jamstack hosting with previews, forms, and serverless functions.' },
      { slug: 'git', color: '#F05032', label: 'Git', group: 'cloud', desc: 'Version control for branching workflows, code review, and team collaboration.' },
      { slug: 'github', color: '#181717', iconHex: 'FFFFFF', label: 'GitHub', group: 'cloud', desc: 'Code hosting, CI workflows, and open-source collaboration at scale.' },
      { slug: 'unity', color: '#222222', iconHex: 'FFFFFF', label: 'Unity', group: 'vrxr', desc: 'Real-time 3D engine for immersive VR/XR experiences and interactive worlds.' },
      { slug: 'unrealengine', color: '#0E1128', iconHex: 'FFFFFF', label: 'Unreal Engine', group: 'vrxr', desc: 'High-fidelity 3D engine for VR, AR, and cinematic interactive experiences.' },
      { slug: 'threedotjs', color: '#049EF4', label: 'Three.js', group: 'vrxr', desc: 'WebGL-powered 3D graphics for portfolios, visualizations, and WebXR.' },
      { slug: 'blender', color: '#F5792A', label: 'Blender', group: 'vrxr', desc: '3D modeling, animation, and asset creation for games and immersive media.' },
      { slug: 'csharp', color: '#512BD4', label: 'C#', group: 'vrxr', desc: 'Primary scripting language for Unity gameplay, XR interactions, and tooling.' },
      { slug: 'webxr', color: '#0045E6', label: 'WebXR', group: 'vrxr', desc: 'Browser-based VR/AR APIs for immersive experiences on the open web.' }
    ];

    const ORBIT_SKILL_SLUGS = [
      'react',
      'typescript',
      'nextdotjs',
      'nodedotjs',
      'python',
      'fastapi',
      'openai',
      'amazonaws',
      'docker',
      'unity',
      'threedotjs',
      'github'
    ];

    function getOrbitSkills() {
      return ORBIT_SKILL_SLUGS
        .map(slug => SKILL_DEFS.find(skill => skill.slug === slug))
        .filter(Boolean);
    }

    let skillPanelFilter = 'frontend';
    let skillsModalFilter = 'frontend';

    function getSkillGroupLabel(groupId) {
      return SKILL_GROUPS.find(group => group.id === groupId)?.label || groupId;
    }

    function getFilteredSkills(groupId) {
      return SKILL_DEFS.filter(skill => skill.group === groupId);
    }

    function renderSkillFilterBar(container, activeGroup, onSelect) {
      if (!container) return;
      container.replaceChildren();
      SKILL_GROUPS.forEach(group => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `skill-tab${group.id === activeGroup ? ' active' : ''}`;
        btn.textContent = group.label;
        btn.dataset.group = group.id;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', group.id === activeGroup ? 'true' : 'false');
        btn.addEventListener('click', () => onSelect(group.id));
        container.appendChild(btn);
      });
      container.querySelector('.skill-tab.active')?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    function createSkillGridItem(skill, index = 0) {
      const item = document.createElement('article');
      item.className = 'skill-grid-item';
      item.title = skill.desc;
      item.style.animationDelay = `${Math.min(index * 0.035, 0.35)}s`;

      const iconWrap = document.createElement('div');
      iconWrap.className = 'skill-icon';
      const img = document.createElement('img');
      img.width = 22;
      img.height = 22;
      img.loading = 'lazy';
      img.alt = '';
      applyColoredSkillIcon(img, skill);
      iconWrap.appendChild(img);

      const body = document.createElement('div');
      body.className = 'skill-grid-body';
      const label = document.createElement('span');
      label.className = 'skill-grid-label';
      label.textContent = skill.label;
      const desc = document.createElement('p');
      desc.className = 'skill-grid-desc';
      desc.textContent = skill.desc;
      body.append(label, desc);
      item.append(iconWrap, body);
      return item;
    }

    function createModalSkillCard(skill) {
      const card = document.createElement('article');
      card.className = 'modal-skill-card';
      const iconWrap = document.createElement('div');
      iconWrap.className = 'skill-icon';
      const img = document.createElement('img');
      img.width = 22;
      img.height = 22;
      img.alt = '';
      img.loading = 'lazy';
      applyColoredSkillIcon(img, skill);
      iconWrap.appendChild(img);
      const title = document.createElement('b');
      title.textContent = skill.label;
      const cat = document.createElement('small');
      cat.textContent = getSkillGroupLabel(skill.group);
      const desc = document.createElement('p');
      desc.textContent = skill.desc;
      card.append(iconWrap, title, cat, desc);
      return card;
    }

    const PROJECT_FILTER_ALL = 'All';
    let featuredProjectFilter = PROJECT_FILTER_ALL;
    let modalProjectFilter = PROJECT_FILTER_ALL;

    function getProjectCategories() {
      const categories = [...new Set(PROJECT_DEFS.map(project => project.category))];
      return [PROJECT_FILTER_ALL, ...categories];
    }

    function getFilteredProjects(category) {
      if (category === PROJECT_FILTER_ALL) return PROJECT_DEFS;
      return PROJECT_DEFS.filter(project => project.category === category);
    }

    function getSkillByTagLabel(label) {
      const key = label.trim().toLowerCase();
      const aliasSlug = {
        gpt: 'openai',
        pgvector: 'postgresql',
        webgl: 'threedotjs',
        xr: 'webxr',
        'ai/ml': 'openai',
        netcode: 'unity'
      }[key];
      if (aliasSlug) return SKILL_DEFS.find(skill => skill.slug === aliasSlug);
      return SKILL_DEFS.find(skill => skill.label.toLowerCase() === key);
    }

    function getTagBrandColor(label) {
      const skill = getSkillByTagLabel(label);
      if (skill?.color) return skill.color;
      const fallback = { chrome: '#4285F4', ux: '#8a57ff' };
      return fallback[label.trim().toLowerCase()] || '#4f55ff';
    }

    function createArrowIcon() {
      const icon = document.createElement('span');
      icon.className = 'arrow-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      return icon;
    }

    function styleBrandTag(el, label) {
      const skill = getSkillByTagLabel(label);
      const brand = getTagBrandColor(label);
      const hex = brand.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const dark = document.documentElement.dataset.theme === 'dark';
      let textColor = brand;

      if (dark && isDarkHex(brand)) {
        textColor = skill?.iconHex
          ? `#${skill.iconHex.replace('#', '')}`
          : `rgb(${Math.min(r + 110, 255)}, ${Math.min(g + 110, 255)}, ${Math.min(b + 110, 255)})`;
      }

      el.style.color = textColor;
      el.style.background = `rgba(${r}, ${g}, ${b}, ${dark ? 0.2 : 0.12})`;
    }

    function createProjectCard(project, projectIndex, variant = 'panel') {
      const card = document.createElement('a');
      card.className = variant === 'modal' ? 'modal-project-card' : 'project';
      card.href = getProjectPageUrl(project.slug);

      const media = document.createElement('div');
      media.className = variant === 'modal' ? 'modal-project-thumb' : 'project-media';

      const img = document.createElement('img');
      img.src = getProjectThumbnail(project, projectIndex);
      img.alt = `${project.title} preview`;
      img.loading = 'lazy';
      img.decoding = 'async';
      media.appendChild(img);

      const content = document.createElement('div');
      content.className = variant === 'modal' ? 'modal-project-body' : 'project-body';
      const title = document.createElement('b');
      title.textContent = project.title;
      const desc = document.createElement(variant === 'modal' ? 'span' : 'small');
      desc.textContent = project.desc;
      const tags = document.createElement('div');
      tags.className = 'tags';
      project.tags.forEach(tag => {
        const el = document.createElement('span');
        el.className = 'tag';
        el.textContent = tag;
        el.dataset.tag = tag;
        styleBrandTag(el, tag);
        tags.appendChild(el);
      });
      content.append(title, desc, tags);
      card.append(media, content);

      if (variant === 'modal') {
        const arrow = document.createElement('div');
        arrow.className = 'arrow';
        arrow.appendChild(createArrowIcon());
        card.appendChild(arrow);
      }

      return card;
    }

    function renderProjectFilterBar(container, activeFilter, onSelect) {
      if (!container) return;
      container.replaceChildren();
      getProjectCategories().forEach(category => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `project-filter${category === activeFilter ? ' active' : ''}`;
        btn.textContent = category;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', category === activeFilter ? 'true' : 'false');
        btn.setAttribute('aria-label', category);
        btn.addEventListener('click', () => onSelect(category));
        container.appendChild(btn);
      });
    }

    function syncFeaturedProjectsScroll(list) {
      const scroll = document.getElementById('projectsScroll');
      if (!list || !scroll) return;
      const cards = list.querySelectorAll('.project');
      const gap = 12;
      if (cards.length <= 3) {
        scroll.classList.remove('projects-scroll--active');
        scroll.style.maxHeight = '';
        return;
      }
      let height = 0;
      for (let i = 0; i < 3; i++) {
        height += cards[i].getBoundingClientRect().height;
        if (i < 2) height += gap;
      }
      scroll.style.maxHeight = `${Math.ceil(height) + 26}px`;
      scroll.classList.add('projects-scroll--active');
    }

    function renderFeaturedProjects(category = featuredProjectFilter) {
      featuredProjectFilter = category;
      const list = document.getElementById('projectsList');
      const filters = document.getElementById('projectFilters');
      if (!list) return;

      renderProjectFilterBar(filters, category, renderFeaturedProjects);
      list.replaceChildren();
      getFilteredProjects(category).forEach(project => {
        const projectIndex = PROJECT_DEFS.indexOf(project);
        list.appendChild(createProjectCard(project, projectIndex));
      });
      requestAnimationFrame(() => syncFeaturedProjectsScroll(list));
    }

    function initFeaturedProjects() {
      renderFeaturedProjects(PROJECT_FILTER_ALL);
    }

    function renderSkillsModal(group = skillsModalFilter) {
      const body = document.getElementById('panelModalBody');
      const descEl = document.getElementById('panelModalDesc');
      if (!body) return;
      skillsModalFilter = group;

      const wrap = document.createElement('div');
      const filters = document.createElement('div');
      filters.className = 'skill-tabs modal-skill-tabs';
      filters.setAttribute('role', 'tablist');
      filters.setAttribute('aria-label', 'Filter skills by category');
      renderSkillFilterBar(filters, group, renderSkillsModal);

      const grid = document.createElement('div');
      grid.className = 'modal-skills-grid';
      getFilteredSkills(group).forEach(skill => grid.appendChild(createModalSkillCard(skill)));

      wrap.append(filters, grid);
      body.replaceChildren(wrap);
      if (descEl) descEl.textContent = `${getFilteredSkills(group).length} in ${getSkillGroupLabel(group)}`;
    }

    function renderProjectsModal(category = modalProjectFilter) {
      const body = document.getElementById('panelModalBody');
      if (!body) return;
      modalProjectFilter = category;

      const wrap = document.createElement('div');
      const filters = document.createElement('div');
      filters.className = 'project-filters';
      filters.setAttribute('role', 'tablist');
      filters.setAttribute('aria-label', 'Filter projects');
      renderProjectFilterBar(filters, category, renderProjectsModal);

      const list = document.createElement('div');
      list.className = 'modal-projects-list';
      getFilteredProjects(category).forEach(project => {
        const projectIndex = PROJECT_DEFS.indexOf(project);
        list.appendChild(createProjectCard(project, projectIndex, 'modal'));
      });

      wrap.append(filters, list);
      body.replaceChildren(wrap);
    }

    (function initPanelModals() {
      const modal = document.getElementById('panelModal');
      const backdrop = document.getElementById('panelModalBackdrop');
      const closeBtn = document.getElementById('panelModalClose');
      const titleEl = document.getElementById('panelModalTitle');
      const descEl = document.getElementById('panelModalDesc');
      const configs = {
        skills: {
          title: 'All Skills',
          desc: `${SKILL_DEFS.length} technologies & tools`,
          render: () => renderSkillsModal(skillsModalFilter)
        },
        projects: {
          title: 'All Projects',
          desc: `${PROJECT_DEFS.length} featured builds`,
          render: renderProjectsModal
        }
      };

      function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('panel-modal-open');
      }

      function openModal(key) {
        const config = configs[key];
        if (!config) return;
        if (key === 'skills') skillsModalFilter = skillPanelFilter;
        titleEl.textContent = config.title;
        descEl.textContent = config.desc;
        config.render();
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('panel-modal-open');
        closeBtn.focus();
      }

      document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.modal));
      });
      closeBtn?.addEventListener('click', closeModal);
      backdrop?.addEventListener('click', closeModal);
      window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
      });
      window.addEventListener('rv-theme-change', () => {
        if (!modal.classList.contains('open')) return;
        const isSkills = titleEl.textContent === configs.skills.title;
        if (isSkills) renderSkillsModal(skillsModalFilter);
      });
    })();

    function initSkillPanelFilter() {
      const tabs = document.getElementById('skillPanelTabs');
      const grid = document.getElementById('skillsFilterGrid');
      if (!tabs || !grid) return;

      function render(group = skillPanelFilter) {
        skillPanelFilter = group;
        renderSkillFilterBar(tabs, group, render);
        grid.replaceChildren();
        getFilteredSkills(group).forEach(skill => grid.appendChild(createSkillGridItem(skill)));
      }
      render();
    }

    initSkillPanelFilter();
    initFeaturedProjects();
    window.addEventListener('resize', () => syncFeaturedProjectsScroll(document.getElementById('projectsList')));
    window.addEventListener('rv-theme-change', () => {
      initSkillPanelFilter();
      document.querySelectorAll('.tag[data-tag]').forEach(el => styleBrandTag(el, el.dataset.tag));
    });

    function getSkillCircleConfig(idx, total, layout = avatarLayout) {
      const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
      return {
        phaseShift: angle,
        orbitRadius: layout.skillOrbitRadius,
        orbitSpeed: layout.skillOrbitSpeed,
        orbitCx: 0,
        orbitCy: layout.skillOrbitCy,
        orbitZ: layout.skillBackgroundZ
      };
    }

    function faceSkillsForward(card) {
      card.rotation.set(0, 0, 0);
    }

    function makeColorfulOrbitRingTexture(segments = 200) {
      const size = 512;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      const cx = size / 2;
      const cy = size / 2;
      const outerR = size * 0.468;
      const innerR = size * 0.456;

      for (let i = 0; i < segments; i++) {
        const a0 = (i / segments) * Math.PI * 2;
        const a1 = ((i + 1) / segments) * Math.PI * 2;
        const hue = (i / segments) * 360;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, a0, a1);
        ctx.arc(cx, cy, innerR, a1, a0, true);
        ctx.closePath();
        ctx.fillStyle = `hsl(${hue}, 88%, 58%)`;
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    function makeRingTexture(dark = false) {
      const c = document.createElement('canvas');
      c.width = c.height = 512;
      const ctx = c.getContext('2d');
      ctx.clearRect(0,0,512,512);
      const grd = ctx.createRadialGradient(256,256,60,256,256,230);
      grd.addColorStop(0, dark ? 'rgba(90,118,255,.28)' : 'rgba(78,95,255,.18)');
      grd.addColorStop(.52, dark ? 'rgba(90,118,255,.08)' : 'rgba(82,105,255,.07)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grd; ctx.fillRect(0,0,512,512);
      return new THREE.CanvasTexture(c);
    }

    class RohanPrefabPortfolioScene {
      constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.options = options;
        this.theme = root.dataset.theme || 'light';
        this.pointer = new THREE.Vector2(0,0);
        this.targetPointer = new THREE.Vector2(.12,.1);
        this.clock = new THREE.Clock();
        this.interactive = [];
        this.techCards = [];
        this.avatarMeshes = [];
        this.themeMeshes = [];
        this.activeTech = null;
        this.hoveredSkill = null;
        this.selectedSkill = null;
        this.actions = {};
        this.currentAction = null;
        this.mixer = null;
        this.headBone = null;
        this.neckBone = null;
        this.spineBone = null;
        this.avatarReady = false;
        this.idleActions = ['waveHello', 'jumpUp', 'punch', 'jumpDown', 'walk'];
        this.avatarActionIdx = 0;
        this.nextIdleAt = 0;
        this.actionPlaying = false;
        this.introPhase = 'pending';
        this.introComplete = false;
        this.introInProgress = false;
        this.skillsStarted = false;
        this.userRotationY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragRotationStart = 0;
        this.animButtons = [...document.querySelectorAll('#animControls .anim-btn')];

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.08;

        this.camera = new THREE.OrthographicCamera(-3, 3, 2, -2, .1, 100);
        this.camera.position.set(0, .45, 6.5);
        this.camera.lookAt(avatarLayout.stageOffsetX * 0.65, avatarLayout.cameraLookY, 0);

        this.stageGroup = new THREE.Group();
        this.scene.add(this.stageGroup);

        this.skillsGroup = new THREE.Group();
        this.stageGroup.add(this.skillsGroup);
        this.skillOrbitRingMeshes = [];

        this.initLights();
        this.createEffects();
        this.techStackPromise = this.createTechStack();
        this.createLoadingAvatarPlaceholder();
        this.loadPrefabAvatar();
        this.bindAnimButtons();
        this.bindSkillInfoUI();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('rv-theme-change', e => this.setTheme(e.detail));
        this.canvas.addEventListener('pointermove', e => this.onPointerMove(e));
        this.canvas.addEventListener('pointerleave', () => {
          this.targetPointer.set(.04, .04);
          this.hoverObject = null;
          this.isDragging = false;
        });
        this.canvas.addEventListener('pointerdown', e => this.onPointerDown(e));
        this.canvas.addEventListener('pointerup', e => this.onPointerUp(e));
        this.canvas.addEventListener('click', e => this.onClick(e));

        this.resize();
        this.animate();
      }

      material(light, dark, opts = {}) {
        const mat = new THREE.MeshStandardMaterial({
          color: this.theme === 'dark' ? dark : light,
          roughness: opts.roughness ?? .55,
          metalness: opts.metalness ?? .06,
          transparent: opts.transparent ?? false,
          opacity: opts.opacity ?? 1,
          side: opts.side ?? THREE.FrontSide
        });
        this.themeMeshes.push({ mesh: null, mat, light, dark });
        return mat;
      }

      initLights() {
        this.scene.add(new THREE.AmbientLight(0xffffff, this.theme === 'dark' ? 1.2 : 1.4));
        const key = new THREE.DirectionalLight(0xffffff, 2.2);
        key.position.set(2.6, 4.4, 4.5);
        this.scene.add(key);
        const rim = new THREE.DirectionalLight(0x8cb2ff, 1.4);
        rim.position.set(-3, 2.8, 2.2);
        this.scene.add(rim);
        const fill = new THREE.PointLight(0x8f7cff, 2.4, 10);
        fill.position.set(0, .8, 2.8);
        this.scene.add(fill);
        this.avatarLight = new THREE.PointLight(0x00f0ff, 1.8, 6);
        this.avatarLight.position.set(0, 0.2, 1.2);
        this.stageGroup.add(this.avatarLight);
      }

      createEffects() {
        const dark = this.theme === 'dark';
        const neonViolet = 0x8a57ff;
        const neonCyan = 0x00f0ff;

        const glowTex = makeRingTexture(dark);
        this.glowMat = new THREE.MeshBasicMaterial({
          map: glowTex,
          color: neonViolet,
          transparent: true,
          opacity: dark ? .22 : .14,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        this.floorGlow = new THREE.Mesh(new THREE.CircleGeometry(avatarLayout.floorGlowRadius, 64), this.glowMat);
        this.floorGlow.rotation.x = -Math.PI / 2;
        this.floorGlow.position.set(0, avatarLayout.floorGlowY, .08);
        this.stageGroup.add(this.floorGlow);

        const positions = new Float32Array(220 * 3);
        const colors = new Float32Array(220 * 3);
        for (let i = 0; i < 220; i++) {
          positions[i * 3] = (Math.random() - .5) * 6;
          positions[i * 3 + 1] = Math.random() * 3.2 - .8;
          positions[i * 3 + 2] = (Math.random() - .5) * 3.5;
          const tint = Math.random() > .5 ? neonViolet : neonCyan;
          colors[i * 3] = ((tint >> 16) & 255) / 255;
          colors[i * 3 + 1] = ((tint >> 8) & 255) / 255;
          colors[i * 3 + 2] = (tint & 255) / 255;
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.particleMat = new THREE.PointsMaterial({
          size: .05,
          transparent: true,
          opacity: dark ? .6 : .42,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          vertexColors: true
        });
        this.particles = new THREE.Points(pGeo, this.particleMat);
        this.stageGroup.add(this.particles);

        this.shockwaveMat = new THREE.MeshBasicMaterial({
          color: neonCyan,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide
        });
        this.shockwave = new THREE.Mesh(new THREE.RingGeometry(.08, .14, 64), this.shockwaveMat);
        this.shockwave.rotation.x = -Math.PI / 2;
        this.shockwave.position.set(0, avatarLayout.shockwaveY, .1);
        this.stageGroup.add(this.shockwave);
        this.shockwaveTime = 0;
      }

      triggerShockwave() {
        this.shockwaveTime = 1;
        this.shockwave.scale.set(1, 1, 1);
        this.shockwaveMat.opacity = .55;
      }

      getAvatarLayout() {
        return avatarLayout;
      }

      getAvatarScale() {
        if (!this.avatarModelHeight) return avatarLayout.targetHeight;
        return avatarLayout.targetHeight / Math.max(.001, this.avatarModelHeight);
      }

      rebuildSkillOrbitRing() {
        if (!this.skillsGroup) return;
        this.skillOrbitRingMeshes?.forEach(mesh => {
          mesh.geometry?.dispose();
          mesh.material?.map?.dispose();
          mesh.material?.dispose();
          this.skillsGroup.remove(mesh);
        });
        this.skillOrbitRingMeshes = [];
        this.skillOrbitRingTexture?.dispose();

        const layout = this.getAvatarLayout();
        const radius = layout.skillOrbitRadius;
        const ringY = layout.skillOrbitCy;
        const ringZ = layout.skillBackgroundZ - 0.03;
        const ringHalfWidth = 0.002;
        const glowHalfWidth = radius * 0.003;

        this.skillOrbitRingTexture = makeColorfulOrbitRingTexture();

        const glow = new THREE.Mesh(
          new THREE.RingGeometry(radius - glowHalfWidth, radius + glowHalfWidth, 180),
          new THREE.MeshBasicMaterial({
            map: this.skillOrbitRingTexture,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
          })
        );
        glow.position.set(0, ringY, ringZ);
        glow.renderOrder = -12;

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(radius - ringHalfWidth, radius + ringHalfWidth, 180),
          new THREE.MeshBasicMaterial({
            map: this.skillOrbitRingTexture,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
          })
        );
        ring.position.set(0, ringY, ringZ);
        ring.renderOrder = -11;

        this.skillsGroup.add(glow, ring);
        this.skillOrbitRingMeshes.push(glow, ring);
      }

      updateOrbitingSkills(t) {
        this.techCards.forEach(card => {
          const ud = card.userData;
          const angle = t * ud.orbitSpeed + ud.phaseShift;
          card.position.set(
            ud.orbitCx + Math.cos(angle) * ud.orbitRadius,
            ud.orbitCy + Math.sin(angle) * ud.orbitRadius,
            ud.orbitZ
          );
          faceSkillsForward(card);
          const selected = this.selectedSkill === card;
          const hovered = this.hoveredSkill === card;
          const highlight = selected ? 1.14 : hovered ? 1.08 : 1;
          const pulse = (ud.baseScale ?? 1) * highlight * (1 + Math.sin(t * 2.2 + ud.idx * 0.45) * 0.04);
          card.scale.setScalar(pulse);
        });
      }

      bindSkillInfoUI() {
        this.skillGlassPop = document.getElementById('skillGlassPop');
        this.skillGlassIcon = document.getElementById('skillGlassIcon');
        this.skillGlassTitle = document.getElementById('skillGlassTitle');
        this.skillGlassDesc = document.getElementById('skillGlassDesc');
        this.skillGlassTag = document.getElementById('skillGlassTag');
        this.heroWrap = this.canvas.parentElement;

        document.getElementById('skillGlassClose')?.addEventListener('click', e => {
          e.stopPropagation();
          this.hideSkillInfo();
        });

        this.heroWrap?.addEventListener('click', e => {
          if (this.skillGlassPop?.contains(e.target)) return;
          if (e.target === this.canvas) return;
          if (this.skillGlassPop?.classList.contains('open')) this.hideSkillInfo();
        });
      }

      getSkillIconUrl(skill) {
        return getSkillIconAssetUrl(skill);
      }

      pickSkillCard(clientX, clientY) {
        if (!this.introComplete || !this.techCards.length) return null;
        const rect = this.canvas.getBoundingClientRect();
        let best = null;
        let bestDist = Infinity;

        this.techCards.forEach(card => {
          if (!card.visible || card.material.opacity < 0.15) return;
          const projected = new THREE.Vector3();
          card.getWorldPosition(projected);
          projected.project(this.camera);
          if (projected.z < -1 || projected.z > 1) return;

          const sx = rect.left + (projected.x * 0.5 + 0.5) * rect.width;
          const sy = rect.top + (-projected.y * 0.5 + 0.5) * rect.height;
          const radius = Math.max(18, card.scale.x * rect.width * 0.038);
          const dist = Math.hypot(clientX - sx, clientY - sy);
          if (dist <= radius && dist < bestDist) {
            bestDist = dist;
            best = card;
          }
        });

        return best;
      }

      showSkillInfo(card, clientX, clientY) {
        if (!this.skillGlassPop || !card?.userData) return;
        const ud = card.userData;
        this.selectedSkill = card;
        this.activeTech = card;

        const skill = SKILL_DEFS.find(s => s.slug === ud.slug);
        this.skillGlassIcon.style.background = ud.color || '#4f55ff';
        if (skill) {
          loadColoredSkillIconUrl(skill).then(url => {
            this.skillGlassIcon.innerHTML = `<img src="${url}" alt="" />`;
          });
        } else {
          this.skillGlassIcon.innerHTML = `<img src="${SIMPLE_ICONS_JSdelivr(ud.slug)}" alt="" />`;
        }
        this.skillGlassTitle.textContent = ud.label;
        this.skillGlassDesc.textContent = ud.desc || '';
        this.skillGlassTag.textContent = ud.category || 'Skill';

        const wrapRect = this.heroWrap.getBoundingClientRect();
        const pad = 108;
        let left = clientX - wrapRect.left;
        let top = clientY - wrapRect.top - 24;
        left = Math.min(wrapRect.width - pad, Math.max(pad, left));
        top = Math.min(wrapRect.height - pad, Math.max(pad, top));

        this.skillGlassPop.style.left = `${left}px`;
        this.skillGlassPop.style.top = `${top}px`;
        this.skillGlassPop.classList.add('open');
        this.skillGlassPop.setAttribute('aria-hidden', 'false');
      }

      hideSkillInfo() {
        this.selectedSkill = null;
        this.activeTech = null;
        this.skillGlassPop?.classList.remove('open');
        this.skillGlassPop?.setAttribute('aria-hidden', 'true');
      }

      getClipDuration(name) {
        return this.actions[name]?.getClip()?.duration || .8;
      }

      bindAnimButtons() {
        this.animButtons.forEach(btn => {
          btn.addEventListener('click', e => {
            e.stopPropagation();
            if (!this.introComplete) return;
            const anim = btn.dataset.anim;
            if (!this.actions[anim]) return;
            this.playAction(anim, anim !== 'stand' && anim !== 'run' && anim !== 'walk');
            this.animButtons.forEach(b => b.classList.toggle('active', b === btn));
            if (anim === 'stand' || anim === 'run' || anim === 'walk') {
              this.actionPlaying = false;
            }
          });
        });
      }

      easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

      easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      }

      startIntroSequence() {
        const { floorY, forwardZ, introStartScaleMul } = this.getAvatarLayout();
        const scale = this.getAvatarScale();
        this.introFinal = {
          floorY,
          forwardZ,
          scale,
          startZ: -1.75,
          startScale: scale * introStartScaleMul
        };

        this.modelPivot.position.set(0, floorY, this.introFinal.startZ);
        this.modelPivot.scale.setScalar(this.introFinal.startScale);
        this.modelPivot.rotation.set(0, 0, 0);

        this.introPhase = 'running';
        this.introRunElapsed = 0;
        this.introRunDuration = 1.85;
        this.introInProgress = true;
        this.introComplete = false;
        this.skillsStarted = false;
        this.landingShockwaveDone = false;
        this.introPhaseElapsed = 0;

        this.playAction('run');

        this.techCards.forEach(card => {
          card.visible = false;
          card.scale.set(.001, .001, .001);
          card.material.opacity = 0;
        });

        showToast('Avatar incoming…');
      }

      updateIntro(delta) {
        if (!this.introFinal) return;

        const { floorY, forwardZ } = this.introFinal;

        if (this.introPhase === 'running') {
          this.introRunElapsed += delta;
          const t = Math.min(1, this.introRunElapsed / this.introRunDuration);
          const eased = this.easeOutCubic(t);
          const { startZ, startScale, scale } = this.introFinal;
          const runEndZ = forwardZ - .28;

          this.modelPivot.position.set(0, floorY, THREE.MathUtils.lerp(startZ, runEndZ, eased));
          this.modelPivot.scale.setScalar(THREE.MathUtils.lerp(startScale, scale, eased));

          if (t >= 1) {
            this.introPhase = 'jumpUp';
            this.introPhaseElapsed = 0;
            this.introPhaseDuration = this.getClipDuration('jumpUp');
            this.playAction('jumpUp', true);
          }
          return;
        }

        if (this.introPhase === 'jumpUp') {
          this.introPhaseElapsed += delta;
          const t = Math.min(1, this.introPhaseElapsed / this.introPhaseDuration);
          const arc = Math.sin(t * Math.PI) * .55;
          const runEndZ = forwardZ - .28;
          this.modelPivot.position.set(0, floorY + arc, THREE.MathUtils.lerp(runEndZ, forwardZ, t));
          this.modelPivot.scale.setScalar(this.introFinal.scale * (1 + Math.sin(t * Math.PI) * .04));

          if (t >= 1) {
            this.introPhase = 'landing';
            this.introPhaseElapsed = 0;
            this.introPhaseDuration = this.getClipDuration('jumpDown');
            this.playAction('jumpDown', true);
          }
          return;
        }

        if (this.introPhase === 'landing') {
          this.introPhaseElapsed += delta;
          const t = Math.min(1, this.introPhaseElapsed / this.introPhaseDuration);
          const squash = Math.sin(t * Math.PI) * .06;

          this.modelPivot.position.set(0, floorY - squash * .25, forwardZ);
          this.modelPivot.scale.setScalar(this.introFinal.scale * (1 - squash * .03));

          if (this.introPhaseElapsed > this.introPhaseDuration * .45 && !this.landingShockwaveDone) {
            this.landingShockwaveDone = true;
            this.triggerShockwave();
          }

          if (this.introPhaseElapsed > this.introPhaseDuration * .5 && !this.skillsStarted) {
            this.skillsStarted = true;
            this.introPhase = 'skills';
            this.modelPivot.scale.setScalar(this.getAvatarScale());
            this.techCards.forEach((card, i) => {
              card.visible = true;
              card.userData.fadeElapsed = -i * .06;
              card.userData.fadeDuration = .75;
            });
          }
          return;
        }

        if (this.introPhase === 'skills') {
          let allDone = true;
          const layout = this.getAvatarLayout();
          this.techCards.forEach(card => {
            card.userData.fadeElapsed += delta;
            if (card.userData.fadeElapsed < 0) { allDone = false; return; }

            const t = Math.min(1, card.userData.fadeElapsed / card.userData.fadeDuration);
            const eased = this.easeOutCubic(Math.max(0, t));
            card.material.opacity = eased * (layout.skillOpacity ?? 0.88);
            card.userData.baseScale = THREE.MathUtils.lerp(0.15, 1, eased);

            if (t < 1) allDone = false;
            else card.userData.fadeDone = true;
          });

          if (allDone) this.finishIntro();
        }
      }

      finishIntro() {
        this.introComplete = true;
        this.introInProgress = false;
        this.introPhase = 'done';
        clearTimeout(this.__returnStand);
        this.actionPlaying = false;
        this.playAction('stand');

        const { floorY, forwardZ } = this.getAvatarLayout();
        if (this.modelPivot) {
          this.modelPivot.scale.setScalar(this.getAvatarScale());
          this.modelPivot.position.set(0, floorY, forwardZ);
          if (this.introFinal) this.introFinal.scale = this.getAvatarScale();
        }

        const layout = this.getAvatarLayout();
        this.techCards.forEach(card => {
          faceSkillsForward(card);
          card.material.opacity = layout.skillOpacity ?? 0.88;
          card.userData.baseScale = 1;
        });

        document.getElementById('animControls')?.classList.add('visible');
        this.nextIdleAt = performance.now() + 3000;
      }

      fitAvatarModel(model, pivot) {
        const { targetHeight } = this.getAvatarLayout();

        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);
        pivot.position.set(0, 0, 0);
        pivot.scale.setScalar(1);
        model.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        model.position.set(-center.x, -box.min.y, -center.z);
        pivot.scale.setScalar(targetHeight / Math.max(.001, size.y));
        this.avatarModelHeight = size.y;
        model.updateMatrixWorld(true);
      }

      createLoadingAvatarPlaceholder() {
        this.loadingGroup = new THREE.Group();
        this.loadingGroup.position.set(0, -.18, .2);
        const mat = new THREE.MeshBasicMaterial({ color: 0x4f55ff, transparent: true, opacity: .18 });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(.32, 36, 24), mat);
        this.loadingGroup.add(sphere);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(.4, .015, 10, 80), new THREE.MeshBasicMaterial({ color: 0x4f55ff, transparent: true, opacity: .35 }));
        ring.rotation.x = Math.PI/2; this.loadingGroup.add(ring);
        this.stageGroup.add(this.loadingGroup);
      }

      loadPrefabAvatar() {
        const loader = new GLTFLoader();
        loader.load(MODEL_URL, async gltf => {
          await this.techStackPromise;
          this.modelPivot = new THREE.Group();
          if (this.loadingGroup) {
            this.stageGroup.remove(this.loadingGroup);
            this.loadingGroup.traverse(child => {
              child.geometry?.dispose();
              child.material?.dispose();
            });
            this.loadingGroup = null;
          }

          const model = gltf.scene;
          model.traverse(obj => {
            if (obj.isMesh) {
              obj.frustumCulled = false;
              obj.castShadow = false;
              obj.receiveShadow = false;
              obj.userData.type = 'avatar';
              this.avatarMeshes.push(obj);
              if (obj.material) {
                const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                mats.forEach(m => {
                  m.roughness = .58;
                  m.metalness = .02;
                  if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
                  else m.color = new THREE.Color(0xd8dce8);
                  m.needsUpdate = true;
                });
              }
            }
          });

          this.modelPivot.add(model);
          this.fitAvatarModel(model, this.modelPivot);
          this.stageGroup.add(this.modelPivot);
          this.avatarModel = model;

          this.headBone = model.getObjectByName('mixamorig:Head_06');
          this.neckBone = model.getObjectByName('mixamorig:Neck_05');
          this.spineBone = model.getObjectByName('mixamorig:Spine2_04');

          if (gltf.animations && gltf.animations.length) {
            this.mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach(clip => this.actions[clip.name] = this.mixer.clipAction(clip));
          }

          this.interactive = this.avatarMeshes.slice();
          this.avatarReady = true;
          this.startIntroSequence();
        }, undefined, err => {
          console.error(err);
          showToast('Could not load the uploaded 3D model. Run this with npm run dev or a local server.');
        });
      }

      async createTechStack() {
        const orbitSkills = getOrbitSkills();
        const total = orbitSkills.length;
        const textures = await Promise.all(
          orbitSkills.map(s => loadSkillLogo(s, this.theme === 'dark'))
        );

        this.rebuildSkillOrbitRing();

        const cardSize = avatarLayout.skillCardSize ?? 0.84;
        orbitSkills.forEach((skill, idx) => {
          const orbit = getSkillCircleConfig(idx, total);
          const material = new THREE.MeshBasicMaterial({
            map: textures[idx],
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            depthWrite: false
          });
          const card = new THREE.Mesh(new THREE.PlaneGeometry(cardSize, cardSize), material);
          card.renderOrder = -2;
          faceSkillsForward(card);
          card.userData = {
            type: 'tech',
            slug: skill.slug,
            label: skill.label,
            color: skill.color,
            iconHex: skill.iconHex,
            category: getSkillGroupLabel(skill.group),
            desc: skill.desc,
            idx,
            baseScale: 0.15,
            ...orbit
          };
          card.visible = false;
          this.skillsGroup.add(card);
          this.techCards.push(card);
        });
      }

      async setTheme(theme) {
        this.theme = theme;
        this.themeMeshes.forEach(item => {
          if (item.mat) item.mat.color.setHex(theme === 'dark' ? item.dark : item.light);
        });
        if (this.particleMat) this.particleMat.opacity = theme === 'dark' ? .6 : .42;
        if (this.glowMat) {
          this.glowMat.map?.dispose();
          this.glowMat.map = makeRingTexture(theme === 'dark');
          this.glowMat.opacity = theme === 'dark' ? .22 : .14;
          this.glowMat.needsUpdate = true;
        }
        if (this.avatarLight) this.avatarLight.intensity = theme === 'dark' ? 2.2 : 1.6;
        const orbitSkills = getOrbitSkills();
        const textures = await Promise.all(
          orbitSkills.map(s => loadSkillLogo(s, theme === 'dark'))
        );
        this.techCards.forEach((card, i) => {
          card.material.map?.dispose();
          card.material.map = textures[i];
          card.material.needsUpdate = true;
        });
      }

      resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = Math.max(1, rect.width);
        this.height = Math.max(1, rect.height);
        this.renderer.setSize(this.width, this.height, false);
        const aspect = this.width / this.height;
        const viewHeight = avatarLayout.viewHeight;
        this.camera.top = viewHeight / 2;
        this.camera.bottom = -viewHeight / 2;
        this.camera.left = -viewHeight * aspect / 2;
        this.camera.right = viewHeight * aspect / 2;
        this.camera.updateProjectionMatrix();
        this.stageGroup.position.x = avatarLayout.stageOffsetX;
        this.stageGroup.position.y = avatarLayout.stageOffsetY;
      }

      playAction(name, once = false) {
        if (!this.mixer || !Object.keys(this.actions).length) return;
        const action = this.actions[name] || this.actions.stand || Object.values(this.actions)[0];
        if (!action || (action === this.currentAction && !once)) return;
        if (this.currentAction) this.currentAction.fadeOut(.15);
        action.reset();
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
        if (once) {
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          this.actionPlaying = true;
        } else {
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.clampWhenFinished = false;
          this.actionPlaying = false;
        }
        action.fadeIn(.15).play();
        this.currentAction = action;
        this.animButtons.forEach(b => b.classList.toggle('active', b.dataset.anim === name));
        clearTimeout(this.__returnStand);
        if (once) {
          this.__returnStand = setTimeout(() => {
            this.actionPlaying = false;
            if (!this.introInProgress) {
              this.playAction('stand');
              this.nextIdleAt = performance.now() + 3000;
            }
          }, Math.max(.9, action.getClip().duration) * 1000);
        }
      }

      triggerFunAction(preferred) {
        const pool = preferred ? [preferred] : this.idleActions;
        const name = pool[Math.floor(Math.random() * pool.length)];
        if (this.actions[name]) this.playAction(name, true);
      }

      onPointerDown(e) {
        if (!this.introComplete) return;
        this.isDragging = true;
        this.dragMoved = false;
        this.dragStartX = e.clientX;
        this.dragRotationStart = this.userRotationY;
        this.canvas.setPointerCapture(e.pointerId);
      }

      onPointerUp(e) {
        if (this.canvas.hasPointerCapture(e.pointerId)) {
          this.canvas.releasePointerCapture(e.pointerId);
        }
        this.isDragging = false;
      }

      onPointerMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        this.targetPointer.set(x, y);

        if (this.isDragging && this.introComplete) {
          const dx = e.clientX - this.dragStartX;
          if (Math.abs(dx) > 3) this.dragMoved = true;
          this.userRotationY = this.dragRotationStart + dx * 0.012;
        }

        if (!this.introComplete) return;

        const skillHover = this.pickSkillCard(e.clientX, e.clientY);
        this.hoveredSkill = skillHover;
        this.heroWrap?.classList.toggle('skill-hover', !!skillHover);

        const mouse = new THREE.Vector2(x, y);
        const ray = new THREE.Raycaster();
        ray.setFromCamera(mouse, this.camera);
        const hit = ray.intersectObjects(this.avatarMeshes, true)[0];
        this.hoverObject = hit?.object || null;
      }

      onClick(e) {
        if (!this.introComplete || this.dragMoved) return;

        const skillHit = this.pickSkillCard(e.clientX, e.clientY);
        if (skillHit) {
          e.stopPropagation();
          if (this.selectedSkill === skillHit && this.skillGlassPop?.classList.contains('open')) {
            this.hideSkillInfo();
          } else {
            this.showSkillInfo(skillHit, e.clientX, e.clientY);
          }
          return;
        }

        this.hideSkillInfo();
        const rect = this.canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const ray = new THREE.Raycaster();
        ray.setFromCamera(mouse, this.camera);
        const hit = ray.intersectObjects(this.avatarMeshes, true)[0];
        if (!hit) return;
        e.stopPropagation();
        this.playAction('waveHello', true);
        this.triggerShockwave();
      }

      animate() {
        requestAnimationFrame(() => this.animate());
        const delta = Math.min(this.clock.getDelta(), .035);
        const t = this.clock.elapsedTime;
        this.pointer.lerp(this.targetPointer, .12);
        if (this.mixer) this.mixer.update(delta);

        if (this.introInProgress) {
          this.updateIntro(delta);
        } else if (this.introComplete) {
          if (this.headBone) {
            this.headBone.rotation.y += (this.pointer.x * .38 - this.headBone.rotation.y) * .12;
            this.headBone.rotation.x += (this.pointer.y * .14 - this.headBone.rotation.x) * .12;
          }
          if (this.neckBone) {
            this.neckBone.rotation.y += (this.pointer.x * .18 - this.neckBone.rotation.y) * .1;
          }

          if (this.modelPivot) {
            const { floorY, forwardZ } = this.getAvatarLayout();
            const targetRotY = this.userRotationY + this.pointer.x * .08;
            this.modelPivot.rotation.y += (targetRotY - this.modelPivot.rotation.y) * .1;
            this.modelPivot.rotation.x += (-this.pointer.y * .04 - this.modelPivot.rotation.x) * .05;
            this.modelPivot.position.x += (this.pointer.x * .08 - this.modelPivot.position.x) * .05;
            this.modelPivot.position.y = floorY + Math.sin(t * 1.4) * .01;
            this.modelPivot.position.z += (forwardZ - this.modelPivot.position.z) * .05;
          }

          if (this.skillsGroup) {
            this.skillsGroup.rotation.y = 0;
          }

          if (!this.actionPlaying && performance.now() >= this.nextIdleAt) {
            this.triggerFunAction();
          }
        }

        if (this.loadingGroup) {
          this.loadingGroup.rotation.y += delta * 1.1;
          this.loadingGroup.position.y = -.18 + Math.sin(t * 2) * .035;
        }

        if (this.particles) {
          this.particles.rotation.y += delta * .05;
          const pos = this.particles.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            pos.array[i * 3 + 1] += Math.sin(t * .8 + i * .07) * .00035;
          }
          pos.needsUpdate = true;
        }
        if (this.glowMat) {
          this.glowMat.opacity = (.16 + Math.sin(t * 1.8) * .08) * (this.theme === 'dark' ? 1.25 : 1);
        }
        if (this.avatarLight) {
          this.avatarLight.intensity = (this.theme === 'dark' ? 2.2 : 1.6) + Math.sin(t * 3) * .4;
        }
        if (this.shockwaveTime > 0) {
          this.shockwaveTime -= delta * 1.6;
          const p = 1 - Math.max(0, this.shockwaveTime);
          this.shockwave.scale.set(1 + p * 5.5, 1 + p * 5.5, 1);
          this.shockwaveMat.opacity = Math.max(0, .55 * (1 - p));
        }

        if (this.introComplete || this.introPhase === 'skills') {
          this.updateOrbitingSkills(t);
        }

        this.renderer.render(this.scene, this.camera);
      }
    }

    new RohanPrefabPortfolioScene(document.getElementById('threeStage'));
  </script>
