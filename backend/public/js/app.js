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
    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.error?.message || data.error?.errors?.[0]?.message || 'An error occurred';
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    showToast(err.message, 'error');
    throw err;
  }
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="${type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
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

  try {
    const res = await apiCall(`/events/${eventId}`, 'GET', null, false);
    const ev = res.data && res.data.event ? res.data.event : res.data;

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
              <i class="ri-calendar-event-line" style="font-size: 1.5rem; color: var(--primary);"></i>
              <div>
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Showtime / Date</div>
                <div style="font-weight: 700; font-size: 0.95rem;">${formattedStartDate}</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">${formattedStartTime} - ${formattedEndTime}</div>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
              <i class="ri-map-pin-2-line" style="font-size: 1.5rem; color: var(--accent-cyan);"></i>
              <div>
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Theater & Cinema Venue</div>
                <div style="font-weight: 700; font-size: 0.95rem;">${ev.venue}</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.75rem;"><i class="ri-film-line" style="color: var(--primary);"></i> Storyline & Synopsis</h3>
            <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; white-space: pre-line;">
              ${ev.description}
            </p>
            ${directorsHtml}
            ${castHtml}
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 1.5rem; display: flex; align-items: center; gap: 1rem;">
            <div style="width: 48px; height: 48px; background: var(--primary-light); color: var(--primary); border-radius: 50%; display:flex; align-items:center; justify-content:center; font-size: 1.3rem; font-weight: 800;">
              <i class="ri-movie-2-line"></i>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Cinema Provider</div>
              <div style="font-weight: 700; font-size: 1rem;">${ev.organizer ? ev.organizer.name : 'Sample MFlix Network'}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">${ev.organizer ? ev.organizer.email : 'support@mflix.com'}</div>
            </div>
          </div>
        </div>

        <!-- Right Column Ticket Pass Booking Sidebar -->
        <div class="glass" style="padding: 2rem; border-radius: var(--radius-xl); position: sticky; top: 90px;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Cinema Ticket Price</div>
          <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.25rem;">
            ${minPrice === 0 ? 'Free' : '$' + minPrice.toFixed(2)}
          </div>

          <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Select Ticket Pass</h4>

          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
            ${ev.ticketTypes && ev.ticketTypes.length > 0 ? ev.ticketTypes.map(tier => {
              const isSoldOut = tier.soldCount >= tier.capacity;
              const remaining = tier.capacity - tier.soldCount;
              return `
                <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-weight: 700; font-size: 1rem;">${tier.name}</span>
                    <span style="font-weight: 800; font-size: 1.1rem; color: var(--primary);">$${tier.price.toFixed(2)}</span>
                  </div>
                  <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.75rem;">${remaining} seats available</div>
                  <button class="btn btn-primary btn-sm" style="width: 100%;" ${isSoldOut ? 'disabled' : ''} onclick="submitTicketBooking('${ev.id}', '${tier.id}')">
                    ${isSoldOut ? 'Sold Out' : 'Book Ticket Pass'}
                  </button>
                </div>
              `;
            }).join('') : '<p style="color: var(--text-muted);">No ticket passes published.</p>'}
          </div>

          <p style="font-size: 0.8rem; color: var(--text-muted); text-align: center;">
            <i class="ri-shield-check-line" style="color: var(--accent-emerald);"></i> Instant Digital QR Code Pass delivered to your ticket wallet upon booking.
          </p>
        </div>

      </div>
    `;
  } catch (err) {
    container.innerHTML = '<div style="text-align:center; padding: 3rem; color: #ef4444;"><p>Failed to load details.</p></div>';
  }
}

// Render Auth Header in Navbar
function renderAuthHeader() {
  const container = document.getElementById('auth-section');
  const navOrganizer = document.getElementById('nav-organizer-item');
  const navCheckin = document.getElementById('nav-checkin-item');
  if (!container) return;

  if (state.user && state.token) {
    const role = state.user.role;
    if (navOrganizer) navOrganizer.style.display = (role === 'ORGANIZER' || role === 'ADMIN') ? 'block' : 'none';
    if (navCheckin) navCheckin.style.display = (role === 'ORGANIZER' || role === 'ADMIN') ? 'block' : 'none';

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

// Auth Submit from Modal
async function handleAuthSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  if (state.authMode === 'login') {
    try {
      const res = await apiCall('/auth/login', 'POST', { email, password }, false);
      state.token = res.data.token;
      state.user = res.data.user;
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));

      renderAuthHeader();
      closeModal('auth-modal');
      showToast(`Welcome back, ${state.user.name}!`);
      navigateTo('explore');
    } catch (err) {}
  } else {
    const name = document.getElementById('auth-name').value;
    const role = document.getElementById('auth-role').value;
    try {
      const res = await apiCall('/auth/register', 'POST', { name, email, password, role }, false);
      state.token = res.data.token;
      state.user = res.data.user;
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));

      renderAuthHeader();
      closeModal('auth-modal');
      showToast(`Welcome ${state.user.name}! Account registered successfully.`);
      navigateTo('explore');
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
      state.token = res.data.token;
      state.user = res.data.user;
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));

      renderAuthHeader();
      showToast(`Welcome back, ${state.user.name}!`);
      navigateTo('explore');
    } catch (err) {}
  } else {
    const nameInput = document.getElementById('view-auth-name');
    const roleInput = document.getElementById('view-auth-role');
    const name = nameInput ? nameInput.value : '';
    const role = roleInput ? roleInput.value : 'ATTENDEE';

    try {
      const res = await apiCall('/auth/register', 'POST', { name, email, password, role }, false);
      state.token = res.data.token;
      state.user = res.data.user;
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));

      renderAuthHeader();
      showToast(`Welcome ${state.user.name}! Account registered successfully.`);
      navigateTo('explore');
    } catch (err) {}
  }
}

function toggleViewAuthMode() {
  state.viewAuthMode = state.viewAuthMode === 'login' ? 'register' : 'login';
  const mode = state.viewAuthMode;
  document.getElementById('view-auth-title').innerText = mode === 'login' ? 'Sign In to EventHub' : 'Create an Account';
  document.getElementById('view-auth-sub').innerText = mode === 'login' ? 'Access your tickets, manage events, and view QR passes.' : 'Register to book tickets or organize events.';
  document.getElementById('view-auth-submit-btn').innerText = mode === 'login' ? 'Sign In' : 'Register Account';
  document.getElementById('view-name-group').style.display = mode === 'login' ? 'none' : 'block';
  document.getElementById('view-role-group').style.display = mode === 'login' ? 'none' : 'block';
  document.getElementById('view-auth-toggle-text').innerText = mode === 'login' ? "Don't have an account?" : "Already have an account?";
  document.getElementById('view-auth-toggle-btn').innerText = mode === 'login' ? 'Register Now' : 'Sign In';
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  renderAuthHeader();
  showToast('Logged out');
  navigateTo('explore');
}

// Load & Render Events / Movies Catalog
async function loadEvents() {
  const grid = document.getElementById('events-grid');
  if (!grid) return;
  grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem;"><i class="ri-loader-4-line ri-spin" style="font-size: 2rem; color: var(--primary);"></i><p style="margin-top: 0.5rem; color: var(--text-secondary);">Loading catalog...</p></div>';

  try {
    let url = `/events?page=1&limit=50`;
    if (state.searchQuery) url += `&q=${encodeURIComponent(state.searchQuery)}`;
    if (state.selectedCategory) url += `&category=${encodeURIComponent(state.selectedCategory)}`;

    const res = await apiCall(url, 'GET', null, false);
    state.events = Array.isArray(res.data) ? res.data : (res.data && res.data.events ? res.data.events : []);

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
  } catch (err) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: #ef4444;">Failed to load catalog.</p>';
  }
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

  try {
    const res = await apiCall(`/events/${eventId}`, 'GET', null, false);
    const event = res.data;
    state.selectedEventForBooking = event;

    const modalContent = document.getElementById('book-modal-content');
    modalContent.innerHTML = `
      <h4 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.25rem;">${event.title}</h4>
      <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.25rem;">Venue: ${event.venue}</p>
      
      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
        ${event.ticketTypes.map(tier => {
          const isSoldOut = tier.soldCount >= tier.capacity;
          const remaining = tier.capacity - tier.soldCount;
          return `
            <div class="glass" style="padding: 1rem; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; font-size: 1rem;">${tier.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">${remaining} seats remaining of ${tier.capacity}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 1.1rem; font-weight: 800; color: var(--accent-emerald);">$${tier.price.toFixed(2)}</span>
                <button class="btn btn-primary btn-sm" ${isSoldOut ? 'disabled' : ''} onclick="submitTicketBooking('${event.id}', '${tier.id}')">
                  ${isSoldOut ? 'Sold Out' : 'Select Pass'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('book-modal').classList.add('active');
  } catch (e) {}
}

// Submit Ticket Booking
async function submitTicketBooking(eventId, ticketTypeId) {
  if (!state.token) {
    navigateTo('login');
    showToast('Please sign in to book tickets', 'error');
    return;
  }

  try {
    await apiCall('/registrations', 'POST', { eventId, ticketTypeId });
    closeModal('book-modal');
    showToast('🎟️ Ticket pass booked successfully!');
    navigateTo('tickets');
  } catch (e) {}
}

// Load User Tickets
async function loadMyTickets() {
  if (!state.token) {
    navigateTo('login');
    return;
  }

  const grid = document.getElementById('my-tickets-grid');
  if (!grid) return;
  grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem;"><i class="ri-loader-4-line ri-spin" style="font-size: 2rem; color: var(--primary);"></i><p style="margin-top: 0.5rem; color: var(--text-secondary);">Loading your digital ticket wallet...</p></div>';

  try {
    const res = await apiCall('/registrations/my-tickets', 'GET');
    state.myTickets = res.data;

    if (!state.myTickets || state.myTickets.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);"><i class="ri-ticket-2-line" style="font-size: 3rem; margin-bottom: 0.5rem; display:block;"></i><p>You have not registered for any events or movies yet.</p></div>';
      return;
    }

    grid.innerHTML = state.myTickets.map(reg => {
      const isCancelled = reg.status === 'CANCELLED';
      const isAttended = reg.status === 'ATTENDED';
      const badgeClass = isAttended ? 'role-ATTENDEE' : (isCancelled ? 'role-ADMIN' : 'role-ORGANIZER');

      return `
        <div class="ticket-card">
          <div class="ticket-header">
            <div>
              <span class="role-tag ${badgeClass}">${reg.status}</span>
              <h3 style="font-size: 1.15rem; font-weight: 700; margin-top: 0.5rem;">${reg.event.title}</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">${reg.ticketType ? reg.ticketType.name : 'Standard'} Pass</p>
            </div>
            <div class="ticket-code">${reg.ticketCode}</div>
          </div>

          ${reg.qrCodeUrl ? `
            <div class="qr-container">
              <img src="${reg.qrCodeUrl}" alt="QR Code Ticket" class="qr-image" />
            </div>
          ` : ''}

          <div style="font-size: 0.85rem; color: var(--text-secondary); border-top: 1px dashed var(--border); padding-top: 0.75rem; display:flex; justify-content: space-between;">
            <span><i class="ri-map-pin-line"></i> ${reg.event.venue}</span>
            <span><i class="ri-time-line"></i> ${new Date(reg.event.startDate).toLocaleDateString()}</span>
          </div>

          ${!isCancelled && !isAttended ? `
            <button class="btn btn-danger btn-sm" style="width:100%; margin-top: 0.5rem;" onclick="cancelRegistration('${reg.id}')">
              <i class="ri-close-circle-line"></i> Cancel Ticket
            </button>
          ` : ''}
        </div>
      `;
    }).join('');
  } catch (err) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: #ef4444;">Failed to load tickets.</p>';
  }
}

// Cancel Ticket
async function cancelRegistration(registrationId) {
  if (!confirm('Are you sure you want to cancel this ticket registration?')) return;
  try {
    await apiCall(`/registrations/${registrationId}/cancel`, 'POST');
    showToast('Registration cancelled');
    loadMyTickets();
  } catch (e) {}
}

// Check-In Scanner Submission
async function submitCheckIn() {
  const ticketCodeInput = document.getElementById('checkin-ticket-code');
  const ticketCode = ticketCodeInput ? ticketCodeInput.value.trim() : '';
  const resultDiv = document.getElementById('checkin-result');
  if (!resultDiv) return;
  resultDiv.style.display = 'none';

  if (!ticketCode) {
    showToast('Please enter a ticket code', 'error');
    return;
  }

  try {
    const res = await apiCall('/registrations/check-in', 'POST', { ticketCode });
    const reg = res.data;

    resultDiv.className = 'glass';
    resultDiv.style.padding = '1.25rem';
    resultDiv.style.borderRadius = 'var(--radius-md)';
    resultDiv.style.border = '1px solid var(--accent-emerald)';
    resultDiv.style.display = 'block';

    resultDiv.innerHTML = `
      <div style="color: var(--accent-emerald); font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">
        <i class="ri-checkbox-circle-fill"></i> CHECK-IN VERIFIED!
      </div>
      <p><strong>Attendee:</strong> ${reg.user.name} (${reg.user.email})</p>
      <p><strong>Event/Movie:</strong> ${reg.event.title}</p>
      <p><strong>Ticket Tier:</strong> ${reg.ticketType.name}</p>
      <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">Checked-in at: ${new Date(reg.checkedInAt).toLocaleTimeString()}</p>
    `;
    showToast('Check-in confirmed!');
  } catch (e) {
    resultDiv.className = 'glass';
    resultDiv.style.padding = '1.25rem';
    resultDiv.style.borderRadius = 'var(--radius-md)';
    resultDiv.style.border = '1px solid var(--accent-rose)';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<div style="color: var(--accent-rose); font-weight: 700;"><i class="ri-error-warning-fill"></i> CHECK-IN FAILED: ${e.message}</div>`;
  }
}

// Create Event Submit
async function handleCreateEventSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const title = document.getElementById('event-title').value;
  const category = document.getElementById('event-category').value;
  const venue = document.getElementById('event-venue').value;
  const startDate = new Date(document.getElementById('event-start').value).toISOString();
  const endDate = new Date(document.getElementById('event-end').value).toISOString();
  const description = document.getElementById('event-desc').value;

  const ticketName = document.getElementById('ticket-name-1').value;
  const ticketPrice = parseFloat(document.getElementById('ticket-price-1').value);
  const ticketCapacity = parseInt(document.getElementById('ticket-capacity-1').value, 10);

  const payload = {
    title,
    category,
    venue,
    startDate,
    endDate,
    description,
    ticketTypes: [{ name: ticketName, price: ticketPrice, capacity: ticketCapacity }]
  };

  try {
    await apiCall('/events', 'POST', payload);
    closeModal('create-event-modal');
    showToast('🚀 Published successfully!');
    navigateTo('explore');
  } catch (e) {}
}

// Modal Helpers
function openAuthModal(mode = 'login') {
  state.authMode = mode;
  document.getElementById('auth-modal-title').innerText = mode === 'login' ? 'Sign In to EventHub' : 'Create an Account';
  document.getElementById('auth-submit-btn').innerText = mode === 'login' ? 'Login' : 'Register Account';
  document.getElementById('name-group').style.display = mode === 'login' ? 'none' : 'block';
  document.getElementById('role-group').style.display = mode === 'login' ? 'none' : 'block';
  document.getElementById('auth-toggle-text').innerText = mode === 'login' ? "Don't have an account?" : "Already have an account?";
  document.getElementById('auth-toggle-btn').innerText = mode === 'login' ? 'Register' : 'Login';
  document.getElementById('auth-modal').classList.add('active');
}

function toggleAuthMode() {
  openAuthModal(state.authMode === 'login' ? 'register' : 'login');
}

function openCreateEventModal() {
  document.getElementById('create-event-modal').classList.add('active');
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('active');
}

function handleBackdropClick(e, modalId) {
  if (e && e.target && e.target.id === modalId) {
    closeModal(modalId);
  }
}

// EXPLICITLY BIND ALL GLOBAL FUNCTIONS TO WINDOW SCOPE
window.navigateTo = navigateTo;
window.showEventDetail = showEventDetail;
window.loadEventDetail = loadEventDetail;
window.renderAuthHeader = renderAuthHeader;
window.handleAuthSubmit = handleAuthSubmit;
window.handleViewAuthSubmit = handleViewAuthSubmit;
window.toggleViewAuthMode = toggleViewAuthMode;
window.logout = logout;
window.loadEvents = loadEvents;
window.filterCategory = filterCategory;
window.handleSearch = handleSearch;
window.openBookingModal = openBookingModal;
window.submitTicketBooking = submitTicketBooking;
window.loadMyTickets = loadMyTickets;
window.cancelRegistration = cancelRegistration;
window.submitCheckIn = submitCheckIn;
window.handleCreateEventSubmit = handleCreateEventSubmit;
window.openAuthModal = openAuthModal;
window.toggleAuthMode = toggleAuthMode;
window.openCreateEventModal = openCreateEventModal;
window.closeModal = closeModal;
window.handleBackdropClick = handleBackdropClick;

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderAuthHeader();
  loadEvents();
});
