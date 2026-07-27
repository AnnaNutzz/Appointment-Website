// ============================================================
//  🚀 APP.JS — Main app controller, tab routing & theme
// ============================================================

const App = {

  init() {
    // Set owner info in header
    document.getElementById('owner-name').textContent = CONFIG.owner.name;
    document.getElementById('owner-tagline').textContent = CONFIG.owner.tagline || '';
    document.title = `Book with ${CONFIG.owner.name}`;

    // Initialize theme
    this.initTheme();

    // Initialize tab navigation
    this.initTabs();

    // Initialize all modules
    Notifications.init();
    Calendar.init();
    Appointments.init();
    Chat.init();
    NoticeBoard.init();
    Places.init();

    console.log('🚀 App initialized!');
  },

  // ── Theme Toggle ────────────────────────────────────────
  initTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateThemeIcon(saved);

    document.getElementById('theme-toggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      this.updateThemeIcon(next);
    });
  },

  updateThemeIcon(theme) {
    document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
  },

  // ── Tab Navigation ──────────────────────────────────────
  initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });
  },

  switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabName}`);
    });
  },
};

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
