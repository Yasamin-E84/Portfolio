// ============================================
// Projects JavaScript - Filtering and Display
// ============================================

let allProjects = [];
let currentFilter = 'all';
let currentSearch = '';

// Load projects from JSON
async function loadProjects() {
  try {
    const response = await fetch('data/projects.json');
    allProjects = await response.json();
    return allProjects;
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

// Filter projects by category
function filterProjects(projects, category) {
  if (category === 'all') {
    return projects;
  }
  return projects.filter(project => project.category === category);
}

// Search projects
function searchProjects(projects, searchTerm) {
  if (!searchTerm) {
    return projects;
  }
  const term = searchTerm.toLowerCase();
  return projects.filter(project => {
    return (
      project.title.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.tags.some(tag => tag.toLowerCase().includes(term))
    );
  });
}

// Render project card
function renderProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card';
  
  const thumbnail = document.createElement('div');
  thumbnail.className = 'project-card__thumbnail';
  thumbnail.textContent = '📁';
  
  const content = document.createElement('div');
  content.className = 'project-card__content';
  
  const title = document.createElement('h3');
  title.className = 'project-card__title';
  title.textContent = project.title;
  
  const description = document.createElement('p');
  description.className = 'project-card__description';
  description.textContent = project.description;
  
  const tags = document.createElement('div');
  tags.className = 'project-card__tags';
  project.tags.forEach(tag => {
    const tagEl = document.createElement('span');
    tagEl.className = 'project-card__tag';
    tagEl.textContent = tag;
    tags.appendChild(tagEl);
  });
  
  const actions = document.createElement('div');
  actions.className = 'project-card__actions';
  
  if (project.live) {
    const liveBtn = document.createElement('a');
    liveBtn.href = project.live;
    liveBtn.target = '_blank';
    liveBtn.rel = 'noopener noreferrer';
    liveBtn.className = 'btn btn--small btn--primary';
    liveBtn.textContent = 'Live';
    actions.appendChild(liveBtn);
  }
  
  if (project.github) {
    const githubBtn = document.createElement('a');
    githubBtn.href = project.github;
    githubBtn.target = '_blank';
    githubBtn.rel = 'noopener noreferrer';
    githubBtn.className = 'btn btn--small btn--secondary';
    githubBtn.textContent = 'GitHub';
    actions.appendChild(githubBtn);
  }
  
  if (project.caseStudy) {
    const caseBtn = document.createElement('button');
    caseBtn.className = 'btn btn--small btn--secondary';
    caseBtn.textContent = 'Case Study';
    caseBtn.addEventListener('click', () => {
      alert(project.caseStudy);
    });
    actions.appendChild(caseBtn);
  }
  
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(tags);
  content.appendChild(actions);
  
  card.appendChild(thumbnail);
  card.appendChild(content);
  
  return card;
}

// Render motion card (for motion page)
function renderMotionCard(project) {
  const card = document.createElement('article');
  card.className = 'motion-card';
  
  const videoContainer = document.createElement('div');
  videoContainer.className = 'motion-card__video';
  
  if (project.youtube) {
    const videoId = extractYouTubeId(project.youtube);
    if (videoId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      videoContainer.appendChild(iframe);
    } else {
      videoContainer.textContent = '🎬';
    }
  } else {
    videoContainer.textContent = '🎬';
  }
  
  const content = document.createElement('div');
  content.className = 'project-card__content';
  
  const title = document.createElement('h3');
  title.className = 'project-card__title';
  title.textContent = project.title;
  
  const description = document.createElement('p');
  description.className = 'project-card__description';
  description.textContent = project.description;
  
  const tags = document.createElement('div');
  tags.className = 'project-card__tags';
  project.tags.forEach(tag => {
    const tagEl = document.createElement('span');
    tagEl.className = 'project-card__tag';
    tagEl.textContent = tag;
    tags.appendChild(tagEl);
  });
  
  const actions = document.createElement('div');
  actions.className = 'project-card__actions';
  
  if (project.youtube) {
    const youtubeBtn = document.createElement('a');
    youtubeBtn.href = project.youtube;
    youtubeBtn.target = '_blank';
    youtubeBtn.rel = 'noopener noreferrer';
    youtubeBtn.className = 'btn btn--small btn--primary';
    youtubeBtn.textContent = 'Watch';
    actions.appendChild(youtubeBtn);
  }
  
  if (project.github) {
    const githubBtn = document.createElement('a');
    githubBtn.href = project.github;
    githubBtn.target = '_blank';
    githubBtn.rel = 'noopener noreferrer';
    githubBtn.className = 'btn btn--small btn--secondary';
    githubBtn.textContent = 'GitHub';
    actions.appendChild(githubBtn);
  }
  
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(tags);
  content.appendChild(actions);
  
  card.appendChild(videoContainer);
  card.appendChild(content);
  
  return card;
}

// Extract YouTube video ID from URL
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Display projects
function displayProjects(projects, container, useMotionCard = false) {
  container.innerHTML = '';
  
  if (projects.length === 0) {
    const noResults = document.createElement('p');
    noResults.className = 'text-center';
    noResults.style.color = 'var(--text2)';
    noResults.style.padding = '3rem';
    noResults.textContent = 'No projects found.';
    container.appendChild(noResults);
    return;
  }
  
  projects.forEach(project => {
    const card = useMotionCard ? renderMotionCard(project) : renderProjectCard(project);
    container.appendChild(card);
  });
  
  // Trigger scroll reveal after a short delay
  setTimeout(() => {
    const cards = container.querySelectorAll('.project-card, .motion-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      cards.forEach(card => card.classList.add('visible'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      cards.forEach(card => observer.observe(card));
    }
  }, 100);
}

// Initialize filter buttons
function initFilters(container, onFilterChange) {
  const filterButtons = container.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      // Get filter value
      const filter = btn.dataset.filter || 'all';
      onFilterChange(filter);
    });
  });
}

// Initialize search
function initSearch(input, onSearchChange) {
  input.addEventListener('input', (e) => {
    onSearchChange(e.target.value);
  });
}

// Main function to initialize projects page
async function initProjectsPage(category = null, useMotionCard = false) {
  const projects = await loadProjects();
  const container = document.querySelector('.projects-grid, .motion-grid');
  const filterContainer = document.querySelector('.work-filters');
  const searchInput = document.querySelector('.work-search__input');
  
  if (!container) return;
  
  let filteredProjects = projects;
  
  // If category is specified (for field pages), filter by it
  if (category) {
    filteredProjects = filterProjects(projects, category);
  }
  
  // Initialize filters if they exist
  if (filterContainer) {
    initFilters(filterContainer, (filter) => {
      currentFilter = filter;
      updateDisplay();
    });
  }
  
  // Initialize search if it exists
  if (searchInput) {
    initSearch(searchInput, (searchTerm) => {
      currentSearch = searchTerm;
      updateDisplay();
    });
  }
  
  function updateDisplay() {
    let result = category ? filterProjects(projects, category) : filterProjects(projects, currentFilter);
    result = searchProjects(result, currentSearch);
    displayProjects(result, container, useMotionCard);
  }
  
  // Initial display
  displayProjects(filteredProjects, container, useMotionCard);
}

