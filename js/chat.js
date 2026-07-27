// ============================================================
//  💬 CHAT.JS — Message board with localStorage
// ============================================================

const Chat = {

  init() {
    this.bindEvents();
    this.loadMessages();
  },

  bindEvents() {
    document.getElementById('chat-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('chat-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  },

  // ── Load messages from localStorage + owner replies ─────
  loadMessages() {
    const container = document.getElementById('chat-messages');
    container.innerHTML = '';

    // Combine owner replies from config + visitor messages from localStorage
    const visitorMessages = JSON.parse(localStorage.getItem('chat_messages') || '[]');

    const ownerMessages = (CONFIG.ownerReplies || []).map(r => ({
      name: CONFIG.owner.name,
      text: r.text,
      timestamp: r.timestamp,
      isOwner: true,
    }));

    // Merge and sort by timestamp
    const allMessages = [...ownerMessages, ...visitorMessages]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (allMessages.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-emoji">💬</div>
          <p class="empty-state-text">No messages yet. Be the first to say hi!</p>
        </div>
      `;
      return;
    }

    allMessages.forEach(msg => this.renderMessage(msg, false));
    this.scrollToBottom();
  },

  // ── Render a single message ─────────────────────────────
  renderMessage(msg, scroll = true) {
    const container = document.getElementById('chat-messages');

    // Remove empty state if present
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    const div = document.createElement('div');
    div.className = `chat-msg ${msg.isOwner ? 'owner' : 'visitor'}`;

    const timeStr = new Date(msg.timestamp).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });

    div.innerHTML = `
      <div class="chat-msg-name">${msg.isOwner ? '👑 ' : ''}${this.escapeHtml(msg.name)}</div>
      <div class="chat-msg-text">${this.escapeHtml(msg.text)}</div>
      <div class="chat-msg-time">${timeStr}</div>
    `;

    container.appendChild(div);
    if (scroll) this.scrollToBottom();
  },

  // ── Send a message ──────────────────────────────────────
  async sendMessage() {
    const nameInput = document.getElementById('chat-name');
    const textInput = document.getElementById('chat-input');
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name) {
      Utils.showToast('Please enter your name first!', 'warning');
      nameInput.focus();
      return;
    }

    if (!text) {
      Utils.showToast('Please type a message!', 'warning');
      textInput.focus();
      return;
    }

    const message = {
      name,
      text,
      timestamp: new Date().toISOString(),
      isOwner: false,
    };

    // Save to localStorage
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    messages.push(message);
    localStorage.setItem('chat_messages', JSON.stringify(messages));

    // Render
    this.renderMessage(message);

    // Send email notification
    await Notifications.sendChatNotification(name, text);

    // Clear input
    textInput.value = '';
    textInput.focus();
  },

  scrollToBottom() {
    const container = document.getElementById('chat-container');
    container.scrollTop = container.scrollHeight;
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
};
