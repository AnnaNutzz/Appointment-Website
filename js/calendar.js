// ============================================================
//  📅 CALENDAR.JS — Calendar rendering & color logic
// ============================================================

const Calendar = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    document.getElementById('cal-prev').addEventListener('click', () => this.navigate(-1));
    document.getElementById('cal-next').addEventListener('click', () => this.navigate(1));
    document.getElementById('cal-today').addEventListener('click', () => this.goToToday());

    // Day popup
    document.getElementById('day-popup-close').addEventListener('click', () => this.closePopup());
    document.getElementById('day-popup').addEventListener('click', (e) => {
      if (e.target.id === 'day-popup') this.closePopup();
    });

    // Google Calendar toggle
    if (CONFIG.googleCalendarEmbedUrl) {
      document.getElementById('gcal-toggle').style.display = 'block';
      document.getElementById('gcal-iframe').src = CONFIG.googleCalendarEmbedUrl;
      document.getElementById('gcal-toggle-btn').addEventListener('click', () => {
        const frame = document.getElementById('gcal-frame');
        frame.classList.toggle('visible');
        const btn = document.getElementById('gcal-toggle-btn');
        btn.textContent = frame.classList.contains('visible') ? '📆 Hide Google Calendar' : '📆 Show Google Calendar';
      });
    }
  },

  navigate(direction) {
    this.currentMonth += direction;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.render();
  },

  goToToday() {
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.render();
  },

  render() {
    const grid = document.getElementById('calendar-grid');
    const today = new Date();
    const daysInMonth = Utils.getDaysInMonth(this.currentYear, this.currentMonth);
    const firstDay = Utils.getFirstDayOfMonth(this.currentYear, this.currentMonth);

    // Update month label
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('cal-month-label').textContent =
      `${monthNames[this.currentMonth]} ${this.currentYear}`;

    // Clear existing days (keep day labels)
    const dayLabels = grid.querySelectorAll('.calendar-day-label');
    grid.innerHTML = '';
    dayLabels.forEach(l => grid.appendChild(l));

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      grid.appendChild(empty);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const dateStr = Utils.formatDateISO(date);
      const { status, reason } = Utils.getDayStatus(this.currentYear, this.currentMonth, day);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = date.toDateString() === today.toDateString();

      const cell = document.createElement('div');
      cell.className = `calendar-day status-${status}${isPast ? ' past' : ''}${isToday ? ' today' : ''}`;
      cell.dataset.date = dateStr;
      cell.dataset.day = day;

      // Build event label for the cell
      let eventLabel = '';
      if (reason) {
        // Shorten reason for display: strip emojis at start, truncate
        const shortReason = reason.replace(/^[\p{Emoji}\s]+/u, '').substring(0, 18);
        eventLabel = shortReason;
      } else if (status === 'free') {
        eventLabel = Utils.isWeekend(date) ? 'Weekend' : 'Free';
      }

      cell.innerHTML = `
        <span class="day-number">${day}</span>
        ${eventLabel ? `<span class="day-event">${eventLabel}</span>` : ''}
      `;

      if (!isPast) {
        cell.addEventListener('click', () => this.showDayPopup(day, dateStr, status, reason, date));
      }

      grid.appendChild(cell);
    }

    // Update availability meter
    this.updateAvailability();
  },

  updateAvailability() {
    const percent = Utils.calculateAvailability(this.currentYear, this.currentMonth);
    document.getElementById('availability-percent').textContent = `${percent}%`;
    document.getElementById('availability-fill').style.width = `${percent}%`;
  },

  showDayPopup(day, dateStr, status, reason, date) {
    const popup = document.getElementById('day-popup');
    const statusInfo = Utils.STATUS_INFO[status];

    document.getElementById('day-popup-title').textContent = Utils.formatDate(date);

    const statusEl = document.getElementById('day-popup-status');
    statusEl.textContent = `${statusInfo.emoji} ${statusInfo.label}`;
    statusEl.style.background = statusInfo.color;

    document.getElementById('day-popup-reason').textContent = reason || 'No additional info for this day.';

    const bookBtn = document.getElementById('day-popup-book');
    if (status === 'taken') {
      bookBtn.disabled = true;
      bookBtn.textContent = '🔵 This day is already taken';
    } else if (status === 'blocked' || status === 'important') {
      bookBtn.disabled = true;
      bookBtn.textContent = status === 'blocked' ? '🟠 This day is blocked' : '🔴 Important day — not available';
    } else if (status === 'maybe') {
      bookBtn.disabled = false;
      bookBtn.textContent = '⚠️ Emergency booking only';
      bookBtn.onclick = () => {
        this.closePopup();
        Appointments.prefillDate(dateStr);
      };
    } else {
      bookBtn.disabled = false;
      bookBtn.textContent = '📝 Book this day';
      bookBtn.onclick = () => {
        this.closePopup();
        Appointments.prefillDate(dateStr);
      };
    }

    popup.classList.add('visible');
  },

  closePopup() {
    document.getElementById('day-popup').classList.remove('visible');
  },
};
