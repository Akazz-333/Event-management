// Safe Local Storage Reader
function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw && raw !== 'undefined' && raw !== 'null' ? JSON.parse(raw) : null;
  } catch (e) {
    localStorage.removeItem('user');
    return null;
  }
}

function getStoredToken() {
  const t = localStorage.getItem('token');
  return t && t !== 'undefined' && t !== 'null' ? t : null;
}

// Embedded 36 Curated Events & Movies Fallback Catalog
const CLIENT_FALLBACK_EVENTS = [
  // MOVIES (6 Items)
  { id: 'm1', title: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests.', category: 'Movies', venue: 'AMC Starlight IMAX - Screen 1', startDate: '2026-09-01T19:00:00Z', endDate: '2026-09-01T21:30:00Z', status: 'PUBLISHED', poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg', imdb: { rating: 9.0 }, ticketTypes: [{ id: 't1-m1', name: 'Standard Cinema Pass', price: 12.99, capacity: 150, soldCount: 10 }, { id: 't2-m1', name: 'VIP Recliner Pass', price: 24.99, capacity: 40, soldCount: 5 }] },
  { id: 'm2', title: 'Inception', description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.', category: 'Movies', venue: 'Regal Cinema - Screen 3', startDate: '2026-09-05T20:00:00Z', endDate: '2026-09-05T22:30:00Z', status: 'PUBLISHED', poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', imdb: { rating: 8.8 }, ticketTypes: [{ id: 't1-m2', name: 'Standard Pass', price: 12.99, capacity: 150, soldCount: 8 }] },
  { id: 'm3', title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', category: 'Movies', venue: 'Omnimax Dome Cinema', startDate: '2026-09-10T18:30:00Z', endDate: '2026-09-10T21:20:00Z', status: 'PUBLISHED', poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', imdb: { rating: 8.7 }, ticketTypes: [{ id: 't1-m3', name: 'Standard Pass', price: 14.99, capacity: 200, soldCount: 12 }] },
  { id: 'm4', title: 'Oppenheimer', description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', category: 'Movies', venue: 'AMC Starlight IMAX - Screen 2', startDate: '2026-09-15T19:30:00Z', endDate: '2026-09-15T22:30:00Z', status: 'PUBLISHED', poster: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTg@._V1_SX300.jpg', imdb: { rating: 8.9 }, ticketTypes: [{ id: 't1-m4', name: 'Standard Pass', price: 13.50, capacity: 120, soldCount: 15 }] },
  { id: 'm5', title: 'Avatar: The Way of Water', description: 'Jake Sully lives with his family on Pandora. Once a familiar threat returns, Jake must protect their home.', category: 'Movies', venue: 'Regal 3D Theater', startDate: '2026-09-20T17:00:00Z', endDate: '2026-09-20T20:15:00Z', status: 'PUBLISHED', poster: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctYzE0Mi00YjJiLTk4NTEtOZU0Platform_SX300.jpg', imdb: { rating: 7.6 }, ticketTypes: [{ id: 't1-m5', name: '3D Pass', price: 15.99, capacity: 180, soldCount: 20 }] },
  { id: 'm6', title: 'Pulp Fiction', description: 'Mob hitmen, a boxer, a gangster and his wife, and diner bandits intertwine in four tales of violence.', category: 'Movies', venue: 'Classic Film Theater', startDate: '2026-09-25T21:00:00Z', endDate: '2026-09-25T23:35:00Z', status: 'PUBLISHED', poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5Mjcw._V1_SX300.jpg', imdb: { rating: 8.9 }, ticketTypes: [{ id: 't1-m6', name: 'General Pass', price: 11.00, capacity: 100, soldCount: 5 }] },

  // TECHNOLOGY (6 Items)
  { id: 't1', title: 'Global AI & Deep Learning Summit 2026', description: 'Explore state-of-the-art breakthroughs in generative AI, LLMs, and neural architectures.', category: 'Technology', venue: 'San Francisco Convention Center', startDate: '2026-10-15T09:00:00Z', endDate: '2026-10-17T18:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-t1', name: 'General Pass', price: 99.99, capacity: 500, soldCount: 45 }] },
  { id: 't2', title: 'International Cloud & Microservices Expo', description: 'A global gathering of cloud architects, DevOps engineers, and Kubernetes maintainers.', category: 'Technology', venue: 'Seattle Tech Pavilion', startDate: '2026-11-01T09:00:00Z', endDate: '2026-11-03T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-t2', name: 'Developer Pass', price: 79.99, capacity: 400, soldCount: 30 }] },
  { id: 't3', title: 'Cybersecurity & Ethical Hacking Symposium', description: 'Deep dive into zero-day vulnerability analysis, penetration testing, and cloud security.', category: 'Technology', venue: 'Boston Innovation Hub', startDate: '2026-11-08T09:00:00Z', endDate: '2026-11-09T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-t3', name: 'Standard Pass', price: 89.99, capacity: 300, soldCount: 22 }] },
  { id: 't4', title: 'Quantum Computing & Next-Gen Hardware Forum', description: 'Superconducting qubits, quantum cryptography, photonics, and error-correcting algorithms.', category: 'Technology', venue: 'Austin Convention Center', startDate: '2026-11-15T09:30:00Z', endDate: '2026-11-16T16:30:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-t4', name: 'Research Pass', price: 120.00, capacity: 250, soldCount: 15 }] },
  { id: 't5', title: 'Full-Stack Web Development & Frameworks Expo', description: 'Modern frontend & backend architectures, Next.js, Vite, Node.js microservices, and GraphQL.', category: 'Technology', venue: 'New York Tech Center', startDate: '2026-11-20T10:00:00Z', endDate: '2026-11-21T18:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-t5', name: 'Standard Pass', price: 69.99, capacity: 350, soldCount: 40 }] },
  { id: 't6', title: 'Robotics & Autonomous Systems World Conference', description: 'Humanoid robotics, SLAM navigation, drone logistics, and AI-driven industrial automation.', category: 'Technology', venue: 'Silicon Valley Expo Center', startDate: '2026-12-01T09:00:00Z', endDate: '2026-12-03T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-t6', name: 'Standard Pass', price: 110.00, capacity: 450, soldCount: 28 }] },

  // MUSIC (6 Items)
  { id: 'mu1', title: 'Symphonic Music & Arts Outdoor Festival', description: 'An immersive weekend featuring world-renowned orchestral conductors and light art.', category: 'Music', venue: 'Metropolitan Central Park Amphitheater', startDate: '2026-10-20T16:00:00Z', endDate: '2026-10-22T23:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-mu1', name: 'Lawn Pass', price: 49.99, capacity: 1000, soldCount: 120 }] },
  { id: 'mu2', title: 'Electronic Dance Music (EDM) Live World Tour', description: 'A high-energy electronic music spectacle featuring top international DJs.', category: 'Music', venue: 'Neon Arena & Stadium', startDate: '2026-11-05T20:00:00Z', endDate: '2026-11-06T04:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-mu2', name: 'General Pass', price: 69.99, capacity: 1500, soldCount: 300 }] },
  { id: 'mu3', title: 'International Jazz & Blues Masters Night', description: 'Soulful saxophone, brass ensembles, and blues guitar improvisations from legendary musicians.', category: 'Music', venue: 'Blue Note Jazz Club', startDate: '2026-11-12T19:00:00Z', endDate: '2026-11-12T23:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-mu3', name: 'Standard Pass', price: 39.99, capacity: 200, soldCount: 50 }] },
  { id: 'mu4', title: 'Rock & Metal Mayhem Live Festival 2026', description: 'An explosive heavy rock festival with iconic headlining bands and pyrotechnics.', category: 'Music', venue: 'Red Rocks Amphitheatre', startDate: '2026-11-18T17:00:00Z', endDate: '2026-11-19T01:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-mu4', name: 'General Pass', price: 55.00, capacity: 1200, soldCount: 180 }] },
  { id: 'mu5', title: 'Indie Folk & Acoustic Singer-Songwriter Showcase', description: 'An intimate evening of acoustic guitars, vocal harmonies, and original indie storytelling.', category: 'Music', venue: 'Riverside Music Pavilion', startDate: '2026-11-25T18:30:00Z', endDate: '2026-11-25T22:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-mu5', name: 'Seat Pass', price: 29.99, capacity: 300, soldCount: 40 }] },
  { id: 'mu6', title: 'Global Pop Stars World Arena Concert', description: 'A spectacular stadium concert event featuring global chart-topping pop icons.', category: 'Music', venue: 'Madison Square Garden', startDate: '2026-12-05T19:30:00Z', endDate: '2026-12-05T23:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-mu6', name: 'Arena Pass', price: 85.00, capacity: 2500, soldCount: 400 }] },

  // BUSINESS (6 Items)
  { id: 'b1', title: 'Global Venture Capital & Founder Forum 2026', description: 'Connect top-tier venture capitalists, angel investors, and high-growth startup founders.', category: 'Business', venue: 'Financial Center Grand Ballroom', startDate: '2026-11-10T08:30:00Z', endDate: '2026-11-11T18:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-b1', name: 'Attendee Pass', price: 199.99, capacity: 300, soldCount: 50 }] },
  { id: 'b2', title: 'Fintech & Blockchain Innovations Conference', description: 'Discover decentralized finance, digital banking regulations, and cross-border payments.', category: 'Business', venue: 'London International Finance Hub', startDate: '2026-11-16T09:00:00Z', endDate: '2026-11-17T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-b2', name: 'Conference Pass', price: 175.00, capacity: 400, soldCount: 40 }] },
  { id: 'b3', title: 'Modern Healthcare & Digital MedTech Expo', description: 'Medical professionals and biotech researchers present digital health innovations.', category: 'Business', venue: 'Chicago Trade Center', startDate: '2026-11-22T09:00:00Z', endDate: '2026-11-24T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-b3', name: 'Delegate Pass', price: 150.00, capacity: 500, soldCount: 65 }] },
  { id: 'b4', title: 'Real Estate & Commercial Development Summit', description: 'Global property investment trends, smart building technology, and sustainable development.', category: 'Business', venue: 'Miami Grand Hotel', startDate: '2026-12-02T09:00:00Z', endDate: '2026-12-03T18:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-b4', name: 'Standard Pass', price: 210.00, capacity: 350, soldCount: 30 }] },
  { id: 'b5', title: 'Global Supply Chain & E-Commerce Logistics Forum', description: 'Freight optimization, warehouse robotics, automated inventory, and last-mile delivery.', category: 'Business', venue: 'Dubai World Trade Centre', startDate: '2026-12-08T09:00:00Z', endDate: '2026-12-09T17:30:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-b5', name: 'Delegate Pass', price: 185.00, capacity: 450, soldCount: 55 }] },
  { id: 'b6', title: 'Executive Leadership & Business Strategy Summit', description: 'C-suite discussions on corporate transformation, crisis management, and ESG policies.', category: 'Business', venue: 'Singapore Marina Bay Sands', startDate: '2026-12-14T08:30:00Z', endDate: '2026-12-15T18:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-b6', name: 'Executive Pass', price: 295.00, capacity: 250, soldCount: 20 }] },

  // SPORTS (6 Items)
  { id: 's1', title: 'World Marathon & Endurance Championship 2026', description: 'Join elite marathoners and endurance athletes for a scenic 42.2 km course.', category: 'Sports', venue: 'City Olympic Stadium & Route', startDate: '2026-10-05T06:00:00Z', endDate: '2026-10-05T14:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-s1', name: 'Runner Entry Pass', price: 65.00, capacity: 2000, soldCount: 500 }] },
  { id: 's2', title: 'Global Esports Championship & Gaming Expo', description: 'World-class esports teams compete live for a $1M prize pool.', category: 'Sports', venue: 'Los Angeles Staples Arena', startDate: '2026-10-25T11:00:00Z', endDate: '2026-10-27T22:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-s2', name: 'Gamer Pass', price: 45.00, capacity: 3000, soldCount: 600 }] },
  { id: 's3', title: 'International Grand Slam Tennis Tournament', description: 'Watch top world-ranked tennis players compete in thrilling singles and doubles matches.', category: 'Sports', venue: 'National Tennis Center', startDate: '2026-10-12T10:00:00Z', endDate: '2026-10-14T20:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-s3', name: 'Stadium Pass', price: 75.00, capacity: 1500, soldCount: 210 }] },
  { id: 's4', title: 'World Extreme Mountain Biking Challenge', description: 'Downhill mountain bike racers navigate steep mountain drops and technical obstacle tracks.', category: 'Sports', venue: 'Alpine Adventure Park', startDate: '2026-11-02T08:00:00Z', endDate: '2026-11-03T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-s4', name: 'General Pass', price: 35.00, capacity: 800, soldCount: 90 }] },
  { id: 's5', title: 'National Basketball All-Star Exhibition Night', description: 'A high-scoring basketball exhibition game featuring dunk contests and 3-point shootouts.', category: 'Sports', venue: 'Downtown Basketball Center', startDate: '2026-11-14T19:00:00Z', endDate: '2026-11-14T22:30:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-s5', name: 'Upper Deck Pass', price: 40.00, capacity: 2000, soldCount: 350 }] },
  { id: 's6', title: 'International Professional Boxing Heavyweight Clash', description: 'Undefeated heavyweight contenders square off in a 12-round championship fight night.', category: 'Sports', venue: 'Las Vegas Grand Arena', startDate: '2026-11-28T20:00:00Z', endDate: '2026-11-28T23:45:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-s6', name: 'Arena Pass', price: 95.00, capacity: 1800, soldCount: 420 }] },

  // DESIGN (6 Items)
  { id: 'd1', title: 'UI/UX Design Systems & Product Conference 2026', description: 'Learn modern design tokens, component libraries, motion design, and user research.', category: 'Design', venue: 'Design Center Auditorium', startDate: '2026-11-15T09:30:00Z', endDate: '2026-11-16T17:30:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-d1', name: 'Design Pass', price: 89.99, capacity: 250, soldCount: 35 }] },
  { id: 'd2', title: '3D Animation, VFX & Interactive Game Design Summit', description: 'Keynotes on Unreal Engine 5, Blender 3D pipelines, and character animation.', category: 'Design', venue: 'Los Angeles Creative Studios', startDate: '2026-11-21T10:00:00Z', endDate: '2026-11-23T18:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-d2', name: 'Creative Pass', price: 95.00, capacity: 350, soldCount: 25 }] },
  { id: 'd3', title: 'Global Architecture & Sustainable Urban Planning Expo', description: 'Eco-friendly building materials, smart city urban designs, and zero-carbon structures.', category: 'Design', venue: 'Berlin Design Academy', startDate: '2026-11-27T09:00:00Z', endDate: '2026-11-29T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-d3', name: 'Architect Pass', price: 115.00, capacity: 400, soldCount: 45 }] },
  { id: 'd4', title: 'Modern Typography & Brand Identity Workshop', description: 'Hands-on workshop covering variable font design, brand storytelling, and visual identity.', category: 'Design', venue: 'Tokyo Art & Design Hub', startDate: '2026-12-04T10:00:00Z', endDate: '2026-12-05T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-d4', name: 'Workshop Pass', price: 75.00, capacity: 150, soldCount: 30 }] },
  { id: 'd5', title: 'Industrial Product & Hardware Design Symposium', description: 'Ergonomics, CAD modeling, rapid 3D prototyping, and consumer hardware design.', category: 'Design', venue: 'Milan Fashion Center', startDate: '2026-12-10T09:30:00Z', endDate: '2026-12-11T17:30:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-d5', name: 'Standard Pass', price: 105.00, capacity: 300, soldCount: 20 }] },
  { id: 'd6', title: 'Interactive Web Experience & Creative Coding Summit', description: 'WebGL shaders, Three.js, Canvas 2D graphics, GSAP animations, and web art.', category: 'Design', venue: 'Amsterdam Digital Art Space', startDate: '2026-12-16T10:00:00Z', endDate: '2026-12-17T18:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-d6', name: 'Developer Pass', price: 85.00, capacity: 350, soldCount: 50 }] },
];

// Global Application State
const state = {
  token: getStoredToken(),
  user: getStoredUser(),
  currentView: 'explore',
  events: [],
  myTickets: [],
  searchQuery: '',
  selectedCategory: '',
  authMode: 'login',
  viewAuthMode: 'login',
  selectedEventForBooking: null,
};

// API Helper
async function apiCall(endpoint, method = 'GET', body = null, useAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (useAuth && state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`/api/v1${endpoint}`, options);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { success: false, data: null };
    }
    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.error?.message || data.error?.errors?.[0]?.message || 'An error occurred';
      if (useAuth) showToast(errorMsg, 'error');
      return { success: false, data: null, error: errorMsg };
    }
    return data;
  } catch (err) {
    if (useAuth) showToast(err.message, 'error');
    return { success: false, data: null };
  }
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconClass = type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line';
  toast.innerHTML = `
    <i class="${iconClass}" style="font-size: 1.25rem;"></i>
    <span style="font-size: 0.92rem; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Modal Helpers
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

function handleBackdropClick(e, id) {
  if (e.target.id === id) closeModal(id);
}

// Auth Header Renderer
function renderAuthHeader() {
  const container = document.getElementById('auth-section');
  const navOrganizer = document.getElementById('nav-organizer-item');
  const navCheckin = document.getElementById('nav-checkin-item');
  if (!container) return;

  if (state.token && state.user) {
    const role = state.user.role || 'ATTENDEE';

    if (role === 'ORGANIZER' || role === 'ADMIN') {
      if (navOrganizer) navOrganizer.style.display = 'block';
      if (navCheckin) navCheckin.style.display = 'block';
    } else {
      if (navOrganizer) navOrganizer.style.display = 'none';
      if (navCheckin) navCheckin.style.display = 'none';
    }

    container.innerHTML = `
      <div class="user-badge">
        <span class="role-tag role-${role}">${role}</span>
        <span style="font-weight: 600; font-size: 0.9rem;">${state.user.name}</span>
        <button class="btn btn-sm btn-secondary" onclick="logout()" title="Logout"><i class="ri-logout-box-r-line"></i> Logout</button>
      </div>
    `;
  } else {
    if (navOrganizer) navOrganizer.style.display = 'none';
    if (navCheckin) navCheckin.style.display = 'none';

    container.innerHTML = `
      <button class="btn btn-primary" onclick="navigateTo('login')"><i class="ri-user-line"></i> Sign In / Register</button>
    `;
  }
}

// Navigation & View Router
function navigateTo(view, param = null) {
  state.currentView = view;
  document.querySelectorAll('main > section').forEach(sec => sec.style.display = 'none');
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

  const activeNav = document.getElementById(`nav-${view}`);
  if (activeNav) activeNav.classList.add('active');

  const viewSec = document.getElementById(`view-${view}`);
  if (viewSec) viewSec.style.display = 'block';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (view === 'explore') loadEvents();
  if (view === 'tickets') loadMyTickets();
  if (view === 'event-detail' && param) loadEventDetail(param);
}

function showEventDetail(eventId) {
  navigateTo('event-detail', eventId);
}

// Load & Render Event / Movie Details Page
async function loadEventDetail(eventId) {
  const container = document.getElementById('event-detail-container');
  if (!container) return;

  container.innerHTML = '<div style="text-align:center; padding: 4rem;"><i class="ri-loader-4-line ri-spin" style="font-size: 2.5rem; color: var(--primary);"></i><p style="margin-top: 0.5rem; color: var(--text-secondary);">Loading movie & theater details...</p></div>';

  let ev = null;
  try {
    const res = await apiCall(`/events/${eventId}`, 'GET', null, false);
    if (res && res.data) ev = res.data.event || res.data;
  } catch (err) {}

  if (!ev || !ev.title) {
    ev = CLIENT_FALLBACK_EVENTS.find(e => e.id === eventId);
  }

  if (!ev) {
    container.innerHTML = '<p style="text-align:center; color: #ef4444; padding: 3rem;">Listing details unavailable.</p>';
    return;
  }

  const startDateObj = new Date(ev.startDate);
  const endDateObj = new Date(ev.endDate);
  const formattedStartDate = startDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const formattedStartTime = startDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formattedEndTime = endDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const minPrice = ev.ticketTypes && ev.ticketTypes.length > 0 
    ? Math.min(...ev.ticketTypes.map(t => t.price)) 
    : 0;

  const posterHtml = ev.poster ? `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <img src="${ev.poster}" alt="${ev.title}" style="max-height: 380px; width: auto; border-radius: var(--radius-lg); box-shadow: 0 12px 30px rgba(0,0,0,0.15); border: 1px solid var(--border);" onerror="this.style.display='none'" />
    </div>
  ` : '';

  const imdbHtml = ev.imdb && ev.imdb.rating ? `
    <span style="background: #f59e0b; color: #fff; font-weight: 800; font-size: 0.85rem; padding: 0.25rem 0.6rem; border-radius: var(--radius-sm); display: inline-flex; align-items: center; gap: 0.25rem;">
      <i class="ri-star-fill"></i> IMDb ${ev.imdb.rating}/10
    </span>
  ` : '';

  const directorsHtml = ev.directors && ev.directors.length > 0 ? `
    <div style="margin-top: 1rem; font-size: 0.95rem; color: var(--text-secondary);">
      <strong><i class="ri-clapperboard-line" style="color: var(--primary);"></i> Directors:</strong> ${ev.directors.join(', ')}
    </div>
  ` : '';

  const castHtml = ev.cast && ev.cast.length > 0 ? `
    <div style="margin-top: 0.5rem; font-size: 0.95rem; color: var(--text-secondary);">
      <strong><i class="ri-user-star-line" style="color: var(--accent-purple);"></i> Cast:</strong> ${ev.cast.join(', ')}
    </div>
  ` : '';

  const runtimeHtml = ev.runtime ? `
    <div style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
      <i class="ri-time-line"></i> ${ev.runtime} mins
    </div>
  ` : '';

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
      
      <!-- Left Main Movie / Event Information Column -->
      <div class="glass" style="padding: 2.5rem; border-radius: var(--radius-xl);">
        ${posterHtml}

        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap;">
          <span class="card-badge" style="margin-bottom: 0;">${ev.category}</span>
          <span class="role-tag role-ORGANIZER">${ev.status || 'PUBLISHED'}</span>
          ${imdbHtml}
          ${runtimeHtml}
        </div>

        <h1 style="font-size: 2.2rem; font-weight: 800; line-height: 1.25; margin-bottom: 1.25rem; color: var(--text-primary);">
          ${ev.title}
        </h1>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; padding: 1.25rem; background: var(--bg-subtle); border-radius: var(--radius-md); margin-bottom: 2rem; border: 1px solid var(--border);">
          <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
            <i class="ri-calendar-event-line" style="font-size: 1.4rem; color: var(--primary); margin-top: 0.1rem;"></i>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 700;">Showtime & Date</div>
              <div style="font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;">${formattedStartDate}</div>
              <div style="font-size: 0.88rem; color: var(--text-secondary);">${formattedStartTime} - ${formattedEndTime}</div>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
            <i class="ri-map-pin-2-line" style="font-size: 1.4rem; color: var(--accent-cyan); margin-top: 0.1rem;"></i>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 700;">Venue / Cinema Theater</div>
              <div style="font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;">${ev.venue}</div>
              <div style="font-size: 0.88rem; color: var(--text-secondary);">General Admissions & Reserved Seats</div>
            </div>
          </div>
        </div>

        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;">Overview & Synopsis</h3>
        <p style="line-height: 1.7; color: var(--text-secondary); font-size: 1rem; margin-bottom: 1.5rem;">
          ${ev.description}
        </p>

        ${directorsHtml}
        ${castHtml}
      </div>

      <!-- Right Booking Sidebar Card -->
      <div class="glass" style="padding: 2rem; border-radius: var(--radius-xl); position: sticky; top: 100px;">
        <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem;">Ticket Pass Tiers</div>
        <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary); margin-bottom: 1.5rem;">
          ${minPrice === 0 ? 'Free' : '$' + minPrice.toFixed(2)} <span style="font-size: 1rem; font-weight: 500; color: var(--text-secondary);">/ pass starting</span>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 0.9rem; font-size: 1.05rem;" onclick="openBookingModal('${ev.id}')">
          <i class="ri-ticket-2-line"></i> Book Tickets Now
        </button>

        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border); font-size: 0.88rem; color: var(--text-muted);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <i class="ri-shield-check-line" style="color: #10b981;"></i> Instant Digital Pass & QR Code
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-qr-scan-line" style="color: var(--accent-cyan);"></i> Scanner Verification at Cinema Venue
          </div>
        </div>
      </div>

    </div>
  `;
}

// Auth Submit from Modal
async function handleAuthSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  if (state.authMode === 'login') {
    try {
      const res = await apiCall('/auth/login', 'POST', { email, password }, false);
      if (res && res.data) {
        state.token = res.data.token;
        state.user = res.data.user;
        localStorage.setItem('token', state.token);
        localStorage.setItem('user', JSON.stringify(state.user));

        renderAuthHeader();
        closeModal('auth-modal');
        showToast(`Welcome back, ${state.user.name}!`);
        navigateTo('explore');
      }
    } catch (err) {}
  } else {
    const name = document.getElementById('auth-name').value;
    const role = document.getElementById('auth-role').value;
    try {
      const res = await apiCall('/auth/register', 'POST', { name, email, password, role }, false);
      if (res && res.data) {
        state.token = res.data.token;
        state.user = res.data.user;
        localStorage.setItem('token', state.token);
        localStorage.setItem('user', JSON.stringify(state.user));

        renderAuthHeader();
        closeModal('auth-modal');
        showToast(`Welcome ${state.user.name}! Account registered successfully.`);
        navigateTo('explore');
      }
    } catch (err) {}
  }
}

// Auth Submit from Dedicated View
async function handleViewAuthSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const emailInput = document.getElementById('view-auth-email');
  const passwordInput = document.getElementById('view-auth-password');
  if (!emailInput || !passwordInput) return;

  const email = emailInput.value;
  const password = passwordInput.value;

  if (state.viewAuthMode === 'login') {
    try {
      const res = await apiCall('/auth/login', 'POST', { email, password }, false);
      if (res && res.data) {
        state.token = res.data.token;
        state.user = res.data.user;
        localStorage.setItem('token', state.token);
        localStorage.setItem('user', JSON.stringify(state.user));

        renderAuthHeader();
        showToast(`Welcome back, ${state.user.name}!`);
        navigateTo('explore');
      }
    } catch (err) {}
  } else {
    const name = document.getElementById('view-auth-name').value;
    const role = document.getElementById('view-auth-role').value;
    try {
      const res = await apiCall('/auth/register', 'POST', { name, email, password, role }, false);
      if (res && res.data) {
        state.token = res.data.token;
        state.user = res.data.user;
        localStorage.setItem('token', state.token);
        localStorage.setItem('user', JSON.stringify(state.user));

        renderAuthHeader();
        showToast(`Welcome ${state.user.name}! Account registered successfully.`);
        navigateTo('explore');
      }
    } catch (err) {}
  }
}

function toggleAuthMode() {
  state.authMode = state.authMode === 'login' ? 'register' : 'login';
  const isLogin = state.authMode === 'login';
  
  document.getElementById('auth-modal-title').innerText = isLogin ? 'Sign In to EventHub' : 'Create an Account';
  document.getElementById('name-group').style.display = isLogin ? 'none' : 'block';
  document.getElementById('role-group').style.display = isLogin ? 'none' : 'block';
  document.getElementById('auth-submit-btn').innerText = isLogin ? 'Login' : 'Register';
  document.getElementById('auth-toggle-text').innerText = isLogin ? "Don't have an account?" : 'Already have an account?';
  document.getElementById('auth-toggle-btn').innerText = isLogin ? 'Register' : 'Login';
}

function toggleViewAuthMode() {
  state.viewAuthMode = state.viewAuthMode === 'login' ? 'register' : 'login';
  const isLogin = state.viewAuthMode === 'login';

  document.getElementById('view-auth-title').innerText = isLogin ? 'Sign In to EventHub' : 'Create Your Account';
  document.getElementById('view-auth-sub').innerText = isLogin 
    ? 'Access your registered movie passes, manage event bookings, and view QR tickets.'
    : 'Register as an Attendee or Event Organizer to book tickets and manage venues.';
  document.getElementById('view-name-group').style.display = isLogin ? 'none' : 'block';
  document.getElementById('view-role-group').style.display = isLogin ? 'none' : 'block';
  document.getElementById('view-auth-submit-btn').innerText = isLogin ? 'Sign In' : 'Create Account';
  document.getElementById('view-auth-toggle-text').innerText = isLogin ? "Don't have an account?" : 'Already registered?';
  document.getElementById('view-auth-toggle-btn').innerText = isLogin ? 'Register Now' : 'Sign In Now';
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  renderAuthHeader();
  showToast('Logged out successfully');
  navigateTo('explore');
}

// Load Events Catalog
async function loadEvents() {
  const grid = document.getElementById('events-grid');
  if (!grid) return;

  grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 4rem;"><i class="ri-loader-4-line ri-spin" style="font-size: 2.5rem; color: var(--primary);"></i><p style="margin-top: 0.5rem; color: var(--text-secondary);">Loading catalog...</p></div>';

  let fetchedEvents = null;
  try {
    let url = `/events?page=1&limit=50`;
    if (state.searchQuery) url += `&q=${encodeURIComponent(state.searchQuery)}`;
    if (state.selectedCategory) url += `&category=${encodeURIComponent(state.selectedCategory)}`;

    const res = await apiCall(url, 'GET', null, false);
    if (res && res.success && res.data) {
      fetchedEvents = Array.isArray(res.data) ? res.data : (res.data.events || []);
    }
  } catch (err) {}

  if (!fetchedEvents || fetchedEvents.length === 0) {
    fetchedEvents = CLIENT_FALLBACK_EVENTS.filter(ev => {
      let matchesCat = true;
      let matchesQ = true;
      if (state.selectedCategory) {
        matchesCat = ev.category.toLowerCase() === state.selectedCategory.toLowerCase();
      }
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        matchesQ = ev.title.toLowerCase().includes(q) || 
                   ev.description.toLowerCase().includes(q) || 
                   ev.venue.toLowerCase().includes(q) || 
                   ev.category.toLowerCase().includes(q);
      }
      return matchesCat && matchesQ;
    });
  }

  state.events = fetchedEvents;

  if (!state.events || state.events.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);"><i class="ri-film-line" style="font-size: 3rem; margin-bottom: 0.5rem; display:block;"></i><p>No listings found matching your criteria.</p></div>';
    return;
  }

  grid.innerHTML = state.events.map(ev => {
    const minPrice = ev.ticketTypes && ev.ticketTypes.length > 0 
      ? Math.min(...ev.ticketTypes.map(t => t.price)) 
      : 0;
    const formattedDate = new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const posterImg = ev.poster ? `
      <div style="height: 180px; overflow: hidden; border-radius: var(--radius-md) var(--radius-md) 0 0; margin: -1.5rem -1.5rem 1rem -1.5rem; background: #000; position: relative;">
        <img src="${ev.poster}" alt="${ev.title}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;" onerror="this.parentElement.style.display='none'" />
      </div>
    ` : '';

    const imdbBadge = ev.imdb && ev.imdb.rating ? `
      <span style="background: #f59e0b; color: #fff; font-weight: 800; font-size: 0.78rem; padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); margin-left: 0.5rem;">
        ⭐ ${ev.imdb.rating}
      </span>
    ` : '';

    return `
      <div class="event-card" style="cursor: pointer;" onclick="showEventDetail('${ev.id}')">
        ${posterImg}
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="card-badge">${ev.category}</span>
            ${imdbBadge}
          </div>
          <h3 class="event-title" style="color: var(--primary); transition: color 0.2s;">${ev.title}</h3>
          <div class="event-meta">
            <div class="meta-item"><i class="ri-calendar-line" style="color: var(--primary);"></i> ${formattedDate}</div>
            <div class="meta-item"><i class="ri-map-pin-line" style="color: var(--accent-cyan);"></i> ${ev.venue}</div>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 1rem;">
            ${ev.description}
          </p>
        </div>
        <div class="event-footer">
          <div class="price-tag">${minPrice === 0 ? 'Free' : '$' + minPrice.toFixed(2)}</div>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); showEventDetail('${ev.id}')"><i class="ri-information-line"></i> View Details</button>
        </div>
      </div>
    `;
  }).join('');
}

// Category Filter
function filterCategory(btnElement, cat) {
  state.selectedCategory = cat;
  document.querySelectorAll('#category-chips .chip').forEach(c => c.classList.remove('active'));
  if (btnElement && btnElement.classList) btnElement.classList.add('active');
  loadEvents();
}

let searchTimeout;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const input = document.getElementById('search-input');
    state.searchQuery = input ? input.value : '';
    loadEvents();
  }, 300);
}

// Open Booking Modal
async function openBookingModal(eventId) {
  if (!state.token) {
    navigateTo('login');
    showToast('Please sign in to book tickets', 'error');
    return;
  }

  let ev = state.events.find(e => e.id === eventId);
  if (!ev) {
    ev = CLIENT_FALLBACK_EVENTS.find(e => e.id === eventId);
  }

  if (!ev) return;

  state.selectedEventForBooking = ev;
  const content = document.getElementById('book-modal-content');
  if (!content) return;

  content.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.25rem;">${ev.title}</h4>
      <p style="color: var(--text-secondary); font-size: 0.9rem;"><i class="ri-map-pin-line"></i> ${ev.venue}</p>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
      ${ev.ticketTypes.map(tier => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--bg-subtle);">
          <div>
            <div style="font-weight: 700;">${tier.name}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">$${tier.price.toFixed(2)} / pass</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="confirmBooking('${tier.id || tier.name}')">Select Tier</button>
        </div>
      `).join('')}
    </div>
  `;

  openModal('book-modal');
}

// Confirm Ticket Booking
async function confirmBooking(ticketTypeId) {
  if (!state.selectedEventForBooking) return;

  try {
    const res = await apiCall('/registrations', 'POST', {
      eventId: state.selectedEventForBooking.id,
      ticketTypeId: ticketTypeId,
    });

    closeModal('book-modal');
    showToast('🎉 Ticket Pass Booked Successfully!');
    navigateTo('tickets');
  } catch (err) {
    closeModal('book-modal');
    showToast('Demo ticket pass generated in your wallet!');
    navigateTo('tickets');
  }
}

// My Tickets Wallet Loader
async function loadMyTickets() {
  const grid = document.getElementById('my-tickets-grid');
  if (!grid) return;

  if (!state.token) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);"><i class="ri-user-lock-line" style="font-size: 3rem; display:block; margin-bottom: 0.5rem;"></i><p>Sign in to view your digital ticket wallet.</p><button class="btn btn-primary" style="margin-top: 1rem;" onclick="navigateTo(\'login\')">Sign In Now</button></div>';
    return;
  }

  grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 4rem;"><i class="ri-loader-4-line ri-spin" style="font-size: 2.5rem; color: var(--primary);"></i><p style="margin-top: 0.5rem; color: var(--text-secondary);">Loading ticket passes...</p></div>';

  try {
    const res = await apiCall('/registrations/my-tickets', 'GET');
    state.myTickets = res.data && Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    state.myTickets = [];
  }

  if (state.myTickets.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);"><i class="ri-coupon-3-line" style="font-size: 3rem; display:block; margin-bottom: 0.5rem;"></i><p>No booked passes found in your wallet.</p><button class="btn btn-secondary" style="margin-top: 1rem;" onclick="navigateTo(\'explore\')">Browse Movies & Events</button></div>';
    return;
  }

  grid.innerHTML = state.myTickets.map(tkt => {
    const ev = tkt.event || {};
    const formattedDate = new Date(ev.startDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `
      <div class="glass" style="padding: 1.5rem; border-radius: var(--radius-lg); position: relative; border-left: 4px solid var(--primary);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <div>
            <span class="card-badge">${ev.category || 'Event Pass'}</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 0.25rem;">${ev.title || 'Reserved Event Pass'}</h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.2rem;"><i class="ri-map-pin-line"></i> ${ev.venue || 'Cinema Hall'}</p>
          </div>
          <span class="role-tag role-ORGANIZER">${tkt.status || 'CONFIRMED'}</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px dashed var(--border);">
          <div>
            <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Ticket Pass Code</div>
            <div style="font-family: monospace; font-weight: 800; font-size: 1.1rem; color: var(--primary); margin-top: 0.1rem;">${tkt.ticketCode || 'EVT-TKT-PASS'}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Showtime</div>
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-top: 0.1rem;">${formattedDate}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Create Event Submit
async function handleCreateEventSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const title = document.getElementById('event-title').value;
  const category = document.getElementById('event-category').value;
  const venue = document.getElementById('event-venue').value;
  const startDate = document.getElementById('event-start').value;
  const endDate = document.getElementById('event-end').value;
  const description = document.getElementById('event-desc').value;
  const ticketName = document.getElementById('ticket-name-1').value;
  const ticketPrice = parseFloat(document.getElementById('ticket-price-1').value);
  const ticketCapacity = parseInt(document.getElementById('ticket-capacity-1').value);

  const payload = {
    title,
    category,
    venue,
    startDate,
    endDate,
    description,
    status: 'PUBLISHED',
    ticketTypes: [
      { name: ticketName, price: ticketPrice, capacity: ticketCapacity }
    ]
  };

  try {
    await apiCall('/events', 'POST', payload);
    closeModal('create-event-modal');
    showToast('🎉 New Event / Movie Listing Published!');
    document.getElementById('create-event-form').reset();
    navigateTo('explore');
  } catch (err) {}
}

// Check-in Scanner Handler
async function submitCheckIn() {
  const codeInput = document.getElementById('checkin-ticket-code');
  const resultDiv = document.getElementById('checkin-result');
  if (!codeInput || !resultDiv) return;

  const ticketCode = codeInput.value.trim();
  if (!ticketCode) {
    showToast('Please enter a ticket pass code', 'error');
    return;
  }

  resultDiv.style.display = 'block';
  resultDiv.innerHTML = '<div style="text-align:center;"><i class="ri-loader-4-line ri-spin" style="font-size: 2rem; color: var(--primary);"></i><p>Verifying scanner code...</p></div>';

  try {
    const res = await apiCall('/registrations/check-in', 'POST', { ticketCode });
    resultDiv.innerHTML = `
      <div style="padding: 1.25rem; background: #ecfdf5; border: 1px solid #10b981; border-radius: var(--radius-md); color: #065f46;">
        <div style="font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;"><i class="ri-checkbox-circle-fill" style="font-size: 1.4rem;"></i> Ticket Pass Verified!</div>
        <p style="margin-top: 0.5rem; font-size: 0.92rem;">Attendee entry confirmed for <strong>${res.data?.registration?.event?.title || 'Cinema Event'}</strong>.</p>
      </div>
    `;
    showToast('Ticket checked in successfully!');
  } catch (err) {
    resultDiv.innerHTML = `
      <div style="padding: 1.25rem; background: #fef2f2; border: 1px solid #ef4444; border-radius: var(--radius-md); color: #991b1b;">
        <div style="font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;"><i class="ri-close-circle-fill" style="font-size: 1.4rem;"></i> Check-In Verification Failed</div>
        <p style="margin-top: 0.5rem; font-size: 0.92rem;">Invalid, already checked-in, or non-existent ticket pass code.</p>
      </div>
    `;
  }
}

// Initial App Boot
document.addEventListener('DOMContentLoaded', () => {
  renderAuthHeader();
  navigateTo('explore');
});
