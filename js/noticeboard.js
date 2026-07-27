// ============================================================
//  📌 NOTICEBOARD.JS — Notice cards from config
// ============================================================

const NoticeBoard = {

  init() {
    this.render();
  },

  render() {
    const grid = document.getElementById('notice-grid');
    grid.innerHTML = '';

    // Also auto-generate notices from date overrides that have reasons
    const dateNotices = Object.entries(CONFIG.dates)
      .filter(([_, data]) => data.reason)
      .map(([date, data]) => ({
        date,
        text: `${Utils.STATUS_INFO[data.status]?.emoji || ''} ${data.reason}`,
        pinned: false,
        status: data.status,
      }));

    // Combine with manual notices
    const allNotices = [
      ...CONFIG.notices.map(n => ({ ...n, status: null })),
      ...dateNotices,
    ];

    // Sort: pinned first, then by date descending
    allNotices.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });

    if (allNotices.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-emoji">📌</div>
          <p class="empty-state-text">No notices yet. Check back later!</p>
        </div>
      `;
      return;
    }

    allNotices.forEach(notice => {
      const card = document.createElement('div');
      card.className = `notice-card${notice.pinned ? ' pinned' : ''}`;

      const dateObj = new Date(notice.date + 'T00:00:00');
      const dateStr = Utils.formatDateShort(dateObj);

      card.innerHTML = `
        <div class="notice-date">${dateStr}</div>
        <div class="notice-text">${this.escapeHtml(notice.text)}</div>
      `;

      grid.appendChild(card);
    });
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
};
