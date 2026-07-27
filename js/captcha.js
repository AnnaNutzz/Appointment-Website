// ============================================================
//  🧩 CAPTCHA.JS — Fun & hard captcha system
// ============================================================

const Captcha = {
  currentAnswer: null,
  timerInterval: null,
  resolveCallback: null,

  // ── Emoji sets for fun captcha ──────────────────────────
  emojiSets: [
    { items: ['🍕', '🍔', '🌮', '🍣', '🍩'], category: 'food' },
    { items: ['🐱', '🐶', '🐰', '🦊', '🐼'], category: 'animals' },
    { items: ['⚽', '🏀', '🎾', '🏐', '🎱'], category: 'sports' },
    { items: ['🌸', '🌻', '🌹', '🌺', '🌷'], category: 'flowers' },
    { items: ['🎸', '🎹', '🥁', '🎺', '🎻'], category: 'music' },
  ],

  // ── Math operations ─────────────────────────────────────
  operations: [
    { symbol: '+', fn: (a, b) => a + b },
    { symbol: '−', fn: (a, b) => a - b },
    { symbol: '×', fn: (a, b) => a * b },
  ],

  // ── Hard captcha phrases ────────────────────────────────
  hardPhrases: [
    "I understand this is a busy day",
    "This day is important to them",
    "I will only book if it is urgent",
    "Please consider my request carefully",
  ],

  // ── Show fun captcha (for normal bookings) ──────────────
  showFunCaptcha() {
    return new Promise((resolve) => {
      this.resolveCallback = resolve;
      const set = this.emojiSets[Math.floor(Math.random() * this.emojiSets.length)];
      const op = this.operations[Math.floor(Math.random() * this.operations.length)];

      // Pick two emojis with assigned values (1-5)
      const emoji1 = set.items[Math.floor(Math.random() * set.items.length)];
      let emoji2 = set.items[Math.floor(Math.random() * set.items.length)];
      while (emoji2 === emoji1) {
        emoji2 = set.items[Math.floor(Math.random() * set.items.length)];
      }

      const val1 = Math.floor(Math.random() * 5) + 1;
      const val2 = Math.floor(Math.random() * 5) + 1;
      const answer = op.fn(val1, val2);

      // Build question
      document.getElementById('captcha-emoji').textContent = '🧩';
      document.getElementById('captcha-title').textContent = 'Quick Puzzle!';
      document.getElementById('captcha-subtitle').textContent =
        `If ${emoji1} = ${val1} and ${emoji2} = ${val2}, solve:`;
      document.getElementById('captcha-question').textContent =
        `${emoji1} ${op.symbol} ${emoji2} = ?`;

      // Generate options (4 choices including correct)
      const options = this.generateOptions(answer, 4);
      this.renderOptions(options, answer);

      // Hide phrase input, show options
      document.getElementById('captcha-phrase-input').style.display = 'none';
      document.getElementById('captcha-phrase-submit').style.display = 'none';
      document.getElementById('captcha-options').style.display = 'grid';

      // Start timer
      this.startTimer(CONFIG.funCaptchaTimeLimit);

      // Show overlay
      document.getElementById('captcha-overlay').classList.add('visible');
    });
  },

  // ── Show hard captcha (for blocked/important day attempts) ─
  showHardCaptcha() {
    return new Promise((resolve) => {
      this.resolveCallback = resolve;
      const phrase = this.hardPhrases[Math.floor(Math.random() * this.hardPhrases.length)];

      document.getElementById('captcha-emoji').textContent = '🔒';
      document.getElementById('captcha-title').textContent = 'Are you sure?';
      document.getElementById('captcha-subtitle').textContent =
        'This day is restricted. Type the phrase below exactly to proceed:';
      document.getElementById('captcha-question').innerHTML =
        `<em>"${phrase}"</em>`;

      // Show phrase input, hide options
      document.getElementById('captcha-options').style.display = 'none';
      const phraseInput = document.getElementById('captcha-phrase-input');
      const phraseSubmit = document.getElementById('captcha-phrase-submit');
      phraseInput.style.display = 'block';
      phraseSubmit.style.display = 'flex';
      phraseInput.value = '';

      // Handle submission
      const submitHandler = () => {
        const input = phraseInput.value.trim().toLowerCase();
        if (input === phrase.toLowerCase()) {
          this.onCorrect();
        } else {
          phraseInput.style.borderColor = 'var(--cherry)';
          phraseInput.classList.add('wrong');
          setTimeout(() => {
            phraseInput.style.borderColor = 'var(--border)';
            phraseInput.classList.remove('wrong');
          }, 800);
        }
      };

      phraseSubmit.onclick = submitHandler;
      phraseInput.onkeydown = (e) => {
        if (e.key === 'Enter') submitHandler();
      };

      // Start timer
      this.startTimer(CONFIG.hardCaptchaTimeLimit);

      // Show overlay
      document.getElementById('captcha-overlay').classList.add('visible');
    });
  },

  // ── Generate multiple choice options ────────────────────
  generateOptions(correct, count) {
    const options = new Set([correct]);
    while (options.size < count) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const fake = correct + (offset === 0 ? 1 : offset);
      options.add(fake);
    }
    return [...options].sort(() => Math.random() - 0.5);
  },

  // ── Render clickable options ────────────────────────────
  renderOptions(options, correctAnswer) {
    const container = document.getElementById('captcha-options');
    container.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'captcha-option';
      btn.textContent = opt;
      btn.type = 'button';
      btn.addEventListener('click', () => {
        if (opt === correctAnswer) {
          btn.classList.add('correct');
          setTimeout(() => this.onCorrect(), 500);
        } else {
          btn.classList.add('wrong');
          setTimeout(() => {
            this.onFail();
          }, 600);
        }
      });
      container.appendChild(btn);
    });
  },

  // ── Timer ───────────────────────────────────────────────
  startTimer(seconds) {
    let remaining = seconds;
    const timerEl = document.getElementById('captcha-timer');
    timerEl.textContent = `⏱️ ${remaining}s remaining`;
    timerEl.classList.remove('urgent');

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      remaining--;
      timerEl.textContent = `⏱️ ${remaining}s remaining`;

      if (remaining <= 10) timerEl.classList.add('urgent');

      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        this.onFail();
      }
    }, 1000);
  },

  // ── Callbacks ───────────────────────────────────────────
  onCorrect() {
    clearInterval(this.timerInterval);
    document.getElementById('captcha-overlay').classList.remove('visible');
    Utils.showToast('Captcha passed! ✅', 'success');
    if (this.resolveCallback) this.resolveCallback(true);
    this.resolveCallback = null;
  },

  onFail() {
    clearInterval(this.timerInterval);
    document.getElementById('captcha-overlay').classList.remove('visible');
    Utils.showToast('Captcha failed. Please try again.', 'error');
    if (this.resolveCallback) this.resolveCallback(false);
    this.resolveCallback = null;
  },
};
