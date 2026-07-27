// ============================================================
//  📝 APPOINTMENTS.JS — Booking form, validation, submission
// ============================================================

const Appointments = {
  selectedTag: null,
  cooldownTimer: null,

  init() {
    this.renderTags();
    this.bindEvents();
    this.checkCooldown();
  },

  // ── Render tag buttons ──────────────────────────────────
  renderTags() {
    const grid = document.getElementById('tag-grid');
    grid.innerHTML = '';

    CONFIG.tags.forEach(tag => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag-option';
      btn.textContent = `${tag.emoji} ${tag.name}`;
      btn.dataset.tag = tag.name;

      btn.addEventListener('click', () => this.selectTag(tag));
      grid.appendChild(btn);
    });
  },

  selectTag(tag) {
    // Deselect all
    document.querySelectorAll('.tag-option').forEach(b => b.classList.remove('selected'));

    // Select this one
    const btn = document.querySelector(`.tag-option[data-tag="${tag.name}"]`);
    btn.classList.add('selected');
    this.selectedTag = tag.name;
    document.getElementById('appt-tag').value = tag.name;

    // Show/hide caption
    const captionEl = document.getElementById('tag-caption');
    if (tag.caption) {
      captionEl.textContent = tag.caption;
      captionEl.classList.add('visible');
    } else {
      captionEl.classList.remove('visible');
    }
  },

  // ── Bind form events ────────────────────────────────────
  bindEvents() {
    // Link toggle
    document.getElementById('link-toggle').addEventListener('click', () => {
      const wrapper = document.getElementById('link-wrapper');
      const btn = document.getElementById('link-toggle');
      wrapper.classList.toggle('visible');
      btn.textContent = wrapper.classList.contains('visible') ? '− Remove link' : '+ Add a link';
    });

    // Date change → show warning
    document.getElementById('appt-date').addEventListener('change', (e) => {
      this.onDateChange(e.target.value);
    });

    // Cancel button
    document.getElementById('appt-cancel').addEventListener('click', () => {
      this.resetForm();
    });

    // Form submit
    document.getElementById('appointment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // ICS modal close
    document.getElementById('ics-modal-close').addEventListener('click', () => {
      document.getElementById('ics-modal').classList.remove('visible');
    });

    // ICS platform tabs
    document.querySelectorAll('.ics-platform-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ics-platform-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.ics-platform-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`.ics-platform-content[data-platform="${tab.dataset.platform}"]`).classList.add('active');
      });
    });

    // Set min date to today
    const today = Utils.formatDateISO(new Date());
    document.getElementById('appt-date').min = today;
  },

  // ── Date change handler ─────────────────────────────────
  onDateChange(dateStr) {
    if (!dateStr) return;

    const date = new Date(dateStr + 'T00:00:00');
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const { status, reason } = Utils.getDayStatus(year, month, day);
    const warningEl = document.getElementById('date-warning');

    if (status === 'taken') {
      warningEl.className = 'date-warning visible error';
      warningEl.innerHTML = `🔵 <strong>This day is already taken.</strong> ${reason ? `<br>${reason}` : ''} Please pick another day.`;
    } else if (status === 'important') {
      warningEl.className = 'date-warning visible error';
      warningEl.innerHTML = `🔴 <strong>This is a very important day — not available.</strong> ${reason ? `<br>${reason}` : ''}`;
    } else if (status === 'blocked') {
      warningEl.className = 'date-warning visible error';
      warningEl.innerHTML = `🟠 <strong>This day is completely blocked.</strong> ${reason ? `<br>${reason}` : ''}`;
    } else if (status === 'maybe') {
      warningEl.className = 'date-warning visible warning';
      warningEl.innerHTML = `🟡 <strong>This day isn't ideal.</strong> ${reason ? `<br>${reason}` : ''}<br>Only book if it's an emergency!`;
    } else {
      warningEl.className = 'date-warning';
    }
  },

  // ── Prefill date (from calendar popup) ──────────────────
  prefillDate(dateStr) {
    // Switch to appointment tab
    App.switchTab('appointment');

    // Set date
    document.getElementById('appt-date').value = dateStr;
    this.onDateChange(dateStr);

    // Scroll to form
    document.getElementById('panel-appointment').scrollIntoView({ behavior: 'smooth' });
  },

  // ── Handle form submission ──────────────────────────────
  async handleSubmit() {
    // Check cooldown
    const cooldown = Utils.getCooldownRemaining();
    if (cooldown > 0) {
      Utils.showToast(`Please wait ${Utils.formatCooldown(cooldown)} before submitting again.`, 'warning');
      return;
    }

    // Validate required fields
    const name = document.getElementById('appt-name').value.trim();
    const date = document.getElementById('appt-date').value;
    const time = document.getElementById('appt-time').value;
    const locationName = document.getElementById('appt-location').value.trim();
    const locationLink = document.getElementById('appt-location-link').value.trim();
    const goodAbout = document.getElementById('appt-good-about').value.trim();
    const tag = this.selectedTag;

    if (!name || !date || !time || !locationName || !goodAbout || !tag) {
      Utils.showToast('Please fill in all required fields and select a tag.', 'error');
      return;
    }

    // Check date status
    const dateObj = new Date(date + 'T00:00:00');
    const { status } = Utils.getDayStatus(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    if (status === 'taken') {
      Utils.showToast('This day is already taken! Please choose another.', 'error');
      return;
    }

    // Determine captcha type
    let captchaResult = false;

    if (Utils.needsHardCaptcha(status)) {
      // Hard captcha for blocked/important days
      captchaResult = await Captcha.showHardCaptcha();
    } else {
      // Fun captcha for normal/free/maybe days
      captchaResult = await Captcha.showFunCaptcha();
    }

    if (!captchaResult) return;

    // Build appointment object
    const appointment = {
      name, date, time, locationName, locationLink, goodAbout, tag,
      timestamp: new Date().toISOString(),
    };

    // Send email notification
    await Notifications.sendAppointmentNotification(appointment);

    // Download .ics file
    Utils.downloadICS(appointment);

    // Set cooldown
    Utils.setCooldown();
    this.startCooldownDisplay();

    // Show ICS instructions modal
    document.getElementById('ics-modal').classList.add('visible');

    // Save to localStorage
    this.saveAppointment(appointment);

    // Reset form
    this.resetForm();

    Utils.showToast('Appointment requested! Check your downloads for the .ics file 📅', 'success');
  },

  // ── Save appointment to localStorage ────────────────────
  saveAppointment(appointment) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
  },

  // ── Reset form ──────────────────────────────────────────
  resetForm() {
    document.getElementById('appointment-form').reset();
    this.selectedTag = null;
    document.querySelectorAll('.tag-option').forEach(b => b.classList.remove('selected'));
    document.getElementById('tag-caption').classList.remove('visible');
    document.getElementById('date-warning').className = 'date-warning';
    document.getElementById('link-wrapper').classList.remove('visible');
    document.getElementById('link-toggle').textContent = '+ Add a link';
  },

  // ── Cooldown display ────────────────────────────────────
  checkCooldown() {
    const remaining = Utils.getCooldownRemaining();
    if (remaining > 0) {
      this.startCooldownDisplay();
    }
  },

  startCooldownDisplay() {
    const display = document.getElementById('cooldown-display');
    const timeEl = document.getElementById('cooldown-time');

    display.classList.add('visible');

    clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(() => {
      const remaining = Utils.getCooldownRemaining();
      if (remaining <= 0) {
        display.classList.remove('visible');
        clearInterval(this.cooldownTimer);
        return;
      }
      timeEl.textContent = Utils.formatCooldown(remaining);
    }, 1000);
  },
};
