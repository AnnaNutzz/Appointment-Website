// ============================================================
//  🍽️ PLACES.JS — Favorite places cards
// ============================================================

const Places = {

  init() {
    this.render();
  },

  render() {
    const grid = document.getElementById('places-grid');
    grid.innerHTML = '';

    if (!CONFIG.favoritePlaces || CONFIG.favoritePlaces.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-emoji">🍽️</div>
          <p class="empty-state-text">No favorite places added yet.</p>
        </div>
      `;
      return;
    }

    CONFIG.favoritePlaces.forEach(place => {
      const card = document.createElement('div');
      card.className = 'place-card';

      const linkHtml = place.link
        ? `<a class="place-link" href="${this.escapeAttr(place.link)}" target="_blank" rel="noopener">📍 View on Map</a>`
        : '';

      const tagsHtml = (place.tags || [])
        .map(t => `<span class="place-tag">${this.escapeHtml(t)}</span>`)
        .join('');

      card.innerHTML = `
        <div class="place-name">🏠 ${this.escapeHtml(place.name)}</div>
        ${linkHtml}
        <div class="place-good">"${this.escapeHtml(place.goodAbout)}"</div>
        <div class="place-tags">${tagsHtml}</div>
      `;

      grid.appendChild(card);
    });
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },
};
