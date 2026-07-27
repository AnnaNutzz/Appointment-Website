// ============================================================
//  🛠️ UTILS.JS — Shared helper functions
// ============================================================

const Utils = {

  // ── Date Formatting ────────────────────────────────────
  formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  },

  formatDateShort(date) {
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  },

  formatDateISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  formatTime12h(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
  },

  // ── Date Calculations ──────────────────────────────────
  daysBetween(date1, date2) {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  },

  isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  },

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  },

  getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  },

  // ── Exam Proximity Logic ───────────────────────────────
  // Returns the exam-based status for a given date, or null
  getExamStatus(dateStr) {
    for (const exam of CONFIG.exams) {
      const examDate = new Date(exam.date + 'T00:00:00');
      const checkDate = new Date(dateStr + 'T00:00:00');
      const daysBefore = this.daysBetween(checkDate, examDate);

      // Exam day itself
      if (daysBefore === 0) {
        return { status: 'important', reason: `📝 Exam: ${exam.name}` };
      }
      // 1-7 days before → blocked (orange)
      if (daysBefore >= 1 && daysBefore <= 7) {
        return { status: 'blocked', reason: `📝 ${daysBefore} day${daysBefore > 1 ? 's' : ''} before exam: ${exam.name}` };
      }
      // 8-14 days before → maybe (yellow)
      if (daysBefore >= 8 && daysBefore <= 14) {
        return { status: 'maybe', reason: `📝 ${daysBefore} days before exam: ${exam.name} — could change for emergency` };
      }
    }
    return null;
  },

  // ── Resolve Day Status ─────────────────────────────────
  // Priority: config override > exam logic > weekend > available
  getDayStatus(year, month, day) {
    const dateStr = this.formatDateISO(new Date(year, month, day));
    const date = new Date(year, month, day);

    // 1. Config override takes highest priority
    if (CONFIG.dates[dateStr]) {
      return {
        status: CONFIG.dates[dateStr].status,
        reason: CONFIG.dates[dateStr].reason || '',
      };
    }

    // 2. Exam proximity
    const examStatus = this.getExamStatus(dateStr);
    if (examStatus) return examStatus;

    // 3. Weekend
    if (this.isWeekend(date)) {
      return { status: 'free', reason: 'Weekend — I\'m free!' };
    }

    // 4. Default: available
    return { status: 'available', reason: '' };
  },

  // ── Status Metadata ────────────────────────────────────
  STATUS_INFO: {
    free:      { label: 'Free',          emoji: '🟢', bookable: true,  color: 'var(--cal-free)' },
    available: { label: 'Available',     emoji: '⚪', bookable: true,  color: 'var(--cal-available)' },
    taken:     { label: 'Taken',         emoji: '🔵', bookable: false, color: 'var(--cal-taken)' },
    maybe:     { label: 'Maybe',         emoji: '🟡', bookable: true,  color: 'var(--cal-maybe)', warning: true },
    blocked:   { label: 'Blocked',       emoji: '🟠', bookable: false, color: 'var(--cal-blocked)' },
    important: { label: 'Important',     emoji: '🔴', bookable: false, color: 'var(--cal-important)' },
  },

  isBookable(status) {
    return this.STATUS_INFO[status]?.bookable || false;
  },

  needsHardCaptcha(status) {
    return status === 'blocked' || status === 'important';
  },

  // ── .ICS File Generation ───────────────────────────────
  generateICS(appointment) {
    const { name, date, time, locationName, locationLink, goodAbout, tag } = appointment;

    // Parse date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hour, minute);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour default

    const formatICSDate = (d) => {
      return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const location = locationLink ? `${locationName} (${locationLink})` : locationName;
    const description = `Appointment with ${CONFIG.owner.name}\\n` +
      `Tag: ${tag}\\n` +
      `Location: ${locationName}\\n` +
      `What's good: ${goodAbout}\\n` +
      `Booked by: ${name}`;

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Appointment Booking//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:Appointment with ${CONFIG.owner.name} — ${tag}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `STATUS:CONFIRMED`,
      `UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}@appointment`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    return ics;
  },

  downloadICS(appointment) {
    const icsContent = this.generateICS(appointment);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${appointment.date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // ── Availability Meter ─────────────────────────────────
  calculateAvailability(year, month) {
    const daysInMonth = this.getDaysInMonth(year, month);
    let available = 0;
    let total = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = this.formatDateISO(new Date(year, month, day));
      const checkDate = new Date(year, month, day);

      // Skip past dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkDate < today) continue;

      total++;
      const { status } = this.getDayStatus(year, month, day);
      if (this.isBookable(status)) available++;
    }

    return total > 0 ? Math.round((available / total) * 100) : 0;
  },

  // ── Cooldown Management ────────────────────────────────
  setCooldown() {
    const expiry = Date.now() + CONFIG.captchaCooldownMinutes * 60 * 1000;
    localStorage.setItem('appt_cooldown', expiry.toString());
  },

  getCooldownRemaining() {
    const expiry = parseInt(localStorage.getItem('appt_cooldown') || '0');
    const remaining = expiry - Date.now();
    return remaining > 0 ? remaining : 0;
  },

  formatCooldown(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  },

  // ── Toast Notification ─────────────────────────────────
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span class="toast-message">${message}</span>
    `;
    document.getElementById('toast-container').appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('toast-show'));

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },
};
