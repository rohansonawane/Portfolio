import {
  PROJECT_DEFS,
  PROJECT_THUMB_GRADIENTS,
  getProjectBySlug,
  getProjectPageUrl,
  getRelatedProjects,
  getProjectThumbnail
} from './projects.js';
import { styleBrandTag, refreshBrandTags } from './skill-brand.js';

window.addEventListener('rv-theme-change', () => refreshBrandTags());

function createTag(text) {
  const el = document.createElement('span');
  el.className = 'tag';
  el.textContent = text;
  el.dataset.tag = text;
  styleBrandTag(el, text);
  return el;
}

function createMetaItem(label, value) {
  const item = document.createElement('div');
  item.className = 'project-meta-item';
  const key = document.createElement('span');
  key.textContent = label;
  const val = document.createElement('strong');
  val.textContent = value;
  item.append(key, val);
  return item;
}

function createFeatureCard(feature) {
  const card = document.createElement('article');
  card.className = 'project-feature-card';
  const title = document.createElement('h3');
  title.textContent = feature.title;
  const desc = document.createElement('p');
  desc.textContent = feature.desc;
  card.append(title, desc);
  return card;
}

function createChallengeCard(challenge) {
  const card = document.createElement('article');
  card.className = 'project-challenge-card';
  const title = document.createElement('h3');
  title.textContent = challenge.title;
  const solution = document.createElement('p');
  solution.innerHTML = `<span>Solution</span>${challenge.solution}`;
  card.append(title, solution);
  return card;
}

function createRelatedCard(project, index) {
  const card = document.createElement('a');
  card.className = 'project-related-card';
  card.href = getProjectPageUrl(project.slug);

  const thumb = document.createElement('div');
  thumb.className = 'project-related-thumb';
  const thumbImg = document.createElement('img');
  thumbImg.src = getProjectThumbnail(project, index);
  thumbImg.alt = `${project.title} preview`;
  thumbImg.loading = 'lazy';
  thumb.appendChild(thumbImg);

  const body = document.createElement('div');
  const title = document.createElement('b');
  title.textContent = project.title;
  const desc = document.createElement('span');
  desc.textContent = project.desc;
  body.append(title, desc);

  card.append(thumb, body);
  return card;
}

function initProjectTabs(tabNav, panels) {
  const buttons = [...tabNav.querySelectorAll('.project-tab-btn')];

  function activate(tabId) {
    buttons.forEach(btn => {
      const active = btn.dataset.tab === tabId;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(panel => {
      const active = panel.dataset.tabPanel === tabId;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => activate(btn.dataset.tab));
  });

  activate(buttons[0]?.dataset.tab || 'overview');
}

function renderNotFound(slug) {
  document.title = 'Project Not Found | RohanVerse';
  const app = document.getElementById('projectApp');
  if (!app) return;

  // NOTE: `slug` comes from the URL and must never be interpolated into
  // innerHTML — set it via textContent to avoid DOM-based XSS.
  app.innerHTML = `
    <section class="project-empty">
      <p class="project-eyebrow">404</p>
      <h1>Project not found</h1>
      <p>We couldn't find a project for <code class="project-empty-slug"></code>.</p>
      <a class="project-btn project-btn-primary" href="/#projects">← Back to projects</a>
    </section>
  `;
  const slugEl = app.querySelector('.project-empty-slug');
  if (slugEl) slugEl.textContent = slug || 'this link';
}

function renderProject(project) {
  const index = PROJECT_DEFS.indexOf(project);
  const gradient = PROJECT_THUMB_GRADIENTS[index % PROJECT_THUMB_GRADIENTS.length];
  const related = getRelatedProjects(project);

  document.title = `${project.title} | RohanVerse`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = project.overview;

  const app = document.getElementById('projectApp');
  if (!app) return;

  app.replaceChildren();

  const hero = document.createElement('section');
  hero.className = 'project-hero';
  hero.innerHTML = `
    <a class="project-back" href="/#projects">← All projects</a>
    <div class="project-hero-grid">
      <div class="project-hero-copy">
        <p class="project-eyebrow">${project.category}</p>
        <h1>${project.title}</h1>
        <p class="project-lead project-lead-short">${project.desc}</p>
        <p class="project-lead project-lead-full">${project.overview}</p>
        <div class="project-hero-tags"></div>
        <div class="project-hero-actions"></div>
      </div>
      <div class="project-hero-visual"></div>
    </div>
  `;

  const heroVisual = hero.querySelector('.project-hero-visual');
  const heroImg = document.createElement('img');
  heroImg.src = getProjectThumbnail(project, index);
  heroImg.alt = `${project.title} preview`;
  heroVisual.appendChild(heroImg);
  if (!project.thumbnail) {
    heroVisual.style.background = gradient;
  }

  const tagWrap = hero.querySelector('.project-hero-tags');
  project.tags.forEach(tag => tagWrap.appendChild(createTag(tag)));

  const actions = hero.querySelector('.project-hero-actions');
  const githubBtn = document.createElement('a');
  githubBtn.className = 'project-btn project-btn-primary';
  githubBtn.href = project.url;
  githubBtn.target = '_blank';
  githubBtn.rel = 'noreferrer';
  githubBtn.textContent = 'View on GitHub';
  actions.appendChild(githubBtn);

  if (project.demo) {
    const demoBtn = document.createElement('a');
    demoBtn.className = 'project-btn project-btn-secondary';
    demoBtn.href = project.demo;
    demoBtn.target = '_blank';
    demoBtn.rel = 'noreferrer';
    demoBtn.textContent = 'Live demo';
    actions.appendChild(demoBtn);
  }

  const layout = document.createElement('section');
  layout.className = 'project-content-layout';

  const tabNav = document.createElement('nav');
  tabNav.className = 'project-tab-nav';
  tabNav.setAttribute('role', 'tablist');
  tabNav.setAttribute('aria-label', 'Project sections');
  [
    ['overview', 'Overview'],
    ['features', 'Key features'],
    ['challenges', 'Challenges'],
    ['outcomes', 'Outcomes']
  ].forEach(([id, label], i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `project-tab-btn${i === 0 ? ' active' : ''}`;
    btn.dataset.tab = id;
    btn.textContent = label;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tabNav.appendChild(btn);
  });

  const tabPanels = document.createElement('div');
  tabPanels.className = 'project-tab-panels';

  const overviewPanel = document.createElement('article');
  overviewPanel.className = 'project-section project-tab-panel active';
  overviewPanel.dataset.tabPanel = 'overview';
  overviewPanel.innerHTML = '<h2>Overview</h2>';
  const overviewText = document.createElement('p');
  overviewText.className = 'project-body-text';
  overviewText.textContent = project.overview;
  overviewPanel.appendChild(overviewText);

  const featuresPanel = document.createElement('article');
  featuresPanel.className = 'project-section project-tab-panel';
  featuresPanel.dataset.tabPanel = 'features';
  featuresPanel.hidden = true;
  featuresPanel.innerHTML = '<h2>Key features</h2>';
  const featureGrid = document.createElement('div');
  featureGrid.className = 'project-feature-grid';
  project.features.forEach(feature => featureGrid.appendChild(createFeatureCard(feature)));
  featuresPanel.appendChild(featureGrid);

  const challengesPanel = document.createElement('article');
  challengesPanel.className = 'project-section project-tab-panel';
  challengesPanel.dataset.tabPanel = 'challenges';
  challengesPanel.hidden = true;
  challengesPanel.innerHTML = '<h2>Challenges & solutions</h2>';
  const challengeGrid = document.createElement('div');
  challengeGrid.className = 'project-challenge-grid';
  project.challenges.forEach(item => challengeGrid.appendChild(createChallengeCard(item)));
  challengesPanel.appendChild(challengeGrid);

  const outcomesPanel = document.createElement('article');
  outcomesPanel.className = 'project-section project-tab-panel';
  outcomesPanel.dataset.tabPanel = 'outcomes';
  outcomesPanel.hidden = true;
  outcomesPanel.innerHTML = '<h2>Outcomes</h2>';
  const outcomeList = document.createElement('ul');
  outcomeList.className = 'project-outcome-list';
  project.outcomes.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    outcomeList.appendChild(li);
  });
  outcomesPanel.appendChild(outcomeList);

  tabPanels.append(overviewPanel, featuresPanel, challengesPanel, outcomesPanel);

  const sidebar = document.createElement('aside');
  sidebar.className = 'project-sidebar';

  const metaCard = document.createElement('article');
  metaCard.className = 'project-side-card';
  metaCard.innerHTML = '<h3>Project details</h3>';
  const metaList = document.createElement('div');
  metaList.className = 'project-meta-list';
  [
    ['Role', project.role],
    ['Timeline', project.timeline],
    ['Status', project.status],
    ['Category', project.category]
  ].forEach(([label, value]) => metaList.appendChild(createMetaItem(label, value)));
  project.highlights.forEach(item => metaList.appendChild(createMetaItem(item.label, item.value)));
  metaCard.appendChild(metaList);

  const stackCard = document.createElement('article');
  stackCard.className = 'project-side-card';
  stackCard.innerHTML = '<h3>Tech stack</h3>';
  const stack = document.createElement('div');
  stack.className = 'project-stack';
  project.techStack.forEach(tag => stack.appendChild(createTag(tag)));
  stackCard.appendChild(stack);

  sidebar.append(metaCard, stackCard);
  layout.append(tabNav, tabPanels, sidebar);
  initProjectTabs(tabNav, [...tabPanels.children]);

  app.append(hero, layout);

  if (related.length) {
    const relatedSection = document.createElement('section');
    relatedSection.className = 'project-related';
    relatedSection.innerHTML = '<h2>Related projects</h2>';
    const relatedGrid = document.createElement('div');
    relatedGrid.className = 'project-related-grid';
    related.forEach((item, i) => relatedGrid.appendChild(createRelatedCard(item, PROJECT_DEFS.indexOf(item))));
    relatedSection.appendChild(relatedGrid);
    app.appendChild(relatedSection);
  }
}

export function initProjectPage(slug) {
  const project = getProjectBySlug(slug);
  if (project) renderProject(project);
  else renderNotFound(slug);
}
