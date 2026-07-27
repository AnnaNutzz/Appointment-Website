// ============================================================
//  📧 NOTIFICATIONS.JS — EmailJS integration
// ============================================================

const Notifications = {

  initialized: false,

  init() {
    // Initialize EmailJS with public key
    if (CONFIG.emailjs.publicKey && CONFIG.emailjs.publicKey !== 'YOUR_PUBLIC_KEY') {
      try {
        emailjs.init(CONFIG.emailjs.publicKey);
        this.initialized = true;
        console.log('📧 EmailJS initialized');
      } catch (e) {
        console.warn('📧 EmailJS failed to initialize:', e);
      }
    } else {
      console.info('📧 EmailJS not configured — notifications will be simulated.');
    }
  },

  // ── Send appointment notification ───────────────────────
  async sendAppointmentNotification(appointment) {
    if (!this.initialized) {
      console.log('📧 [SIMULATED] Appointment notification:', appointment);
      Utils.showToast('Notification sent (simulated — configure EmailJS for real emails)', 'info');
      return true;
    }

    try {
      await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.appointmentTemplateId, {
        from_name: appointment.name,
        date: appointment.date,
        time: Utils.formatTime12h(appointment.time),
        location: appointment.locationName,
        location_link: appointment.locationLink || 'No link provided',
        good_about: appointment.goodAbout,
        tag: appointment.tag,
        to_email: CONFIG.owner.email,
      });
      Utils.showToast('Email notification sent! 📧', 'success');
      return true;
    } catch (error) {
      console.error('📧 Email send failed:', error);
      Utils.showToast('Failed to send email notification. The appointment was still recorded.', 'warning');
      return false;
    }
  },

  // ── Send chat message notification ──────────────────────
  async sendChatNotification(name, message) {
    if (!this.initialized) {
      console.log('📧 [SIMULATED] Chat notification:', { name, message });
      return true;
    }

    try {
      await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.chatTemplateId, {
        from_name: name,
        message: message,
        to_email: CONFIG.owner.email,
        timestamp: new Date().toLocaleString(),
      });
      return true;
    } catch (error) {
      console.error('📧 Chat notification failed:', error);
      return false;
    }
  },
};
