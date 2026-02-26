(function () {
  'use strict';

  const ICONS = ['🌟', '🎸', '🚀', '🎨', '🎭', '🔮', '🎪', '🎯', '⚡', '🌈', '🎲', '🎷'];
  const DIFFICULTY = {
    easy: { pairs: 6, class: 'easy' },
    medium: { pairs: 8, class: 'medium' },
    hard: { pairs: 12, class: 'hard' }
  };
  const STAR_THRESHOLDS = { easy: [8, 14], medium: [12, 20], hard: [18, 28] };

  const boardEl = document.getElementById('board');
  const movesEl = document.getElementById('moves');
  const timerEl = document.getElementById('timer');
  const starsEl = document.getElementById('stars');
  const difficultyEl = document.getElementById('difficulty');
  const restartBtn = document.getElementById('restart');
  const winOverlay = document.getElementById('win-overlay');
  const winMovesEl = document.getElementById('win-moves');
  const winTimeEl = document.getElementById('win-time');
  const winStarsEl = document.getElementById('win-stars');
  const playAgainBtn = document.getElementById('play-again');

  let state = {
    cards: [],
    flipped: [],
    moves: 0,
    matched: 0,
    timerInterval: null,
    seconds: 0,
    locked: false
  };

  function getDeck(pairCount) {
    const icons = ICONS.slice(0, pairCount);
    const deck = [...icons, ...icons];
    return shuffle(deck);
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startTimer() {
    if (state.timerInterval) return;
    state.timerInterval = setInterval(() => {
      state.seconds++;
      const m = Math.floor(state.seconds / 60);
      const s = state.seconds % 60;
      timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function getStars() {
    const key = difficultyEl.value;
    const [twoStar, oneStar] = STAR_THRESHOLDS[key];
    if (state.moves <= twoStar) return 3;
    if (state.moves <= oneStar) return 2;
    return 1;
  }

  function updateStarsDisplay(container, count) {
    const stars = container.querySelectorAll('.star');
    stars.forEach((star, i) => {
      star.classList.toggle('filled', i < count);
    });
  }

  function createCard(id, icon, index) {
    const wrap = document.createElement('div');
    wrap.className = 'card-wrap';
    wrap.dataset.index = index;
    wrap.setAttribute('role', 'gridcell');
    wrap.setAttribute('tabindex', '0');
    wrap.innerHTML = `
      <div class="card">
        <div class="card-inner card-back"></div>
        <div class="card-inner card-front">
          <span class="card-icon" aria-hidden="true">${icon}</span>
        </div>
      </div>
    `;
    wrap.addEventListener('click', () => handleCardClick(index));
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick(index);
      }
    });
    return wrap;
  }

  function handleCardClick(index) {
    if (state.locked) return;
    const card = state.cards[index];
    if (!card || card.matched || card.element.classList.contains('flipped')) return;

    startTimer();
    card.element.classList.add('flipped');
    state.flipped.push(index);

    if (state.flipped.length === 2) {
      state.moves++;
      movesEl.textContent = state.moves;
      updateStarsDisplay(starsEl, getStars());
      const [a, b] = state.flipped;
      if (state.cards[a].icon === state.cards[b].icon) {
        state.cards[a].matched = true;
        state.cards[b].matched = true;
        state.matched += 2;
        state.flipped = [];
        state.cards[a].element.classList.add('matched');
        state.cards[b].element.classList.add('matched');
        if (state.matched === state.cards.length) {
          setTimeout(showWin, 400);
        }
      } else {
        state.locked = true;
        setTimeout(() => {
          state.cards[a].element.classList.remove('flipped');
          state.cards[b].element.classList.remove('flipped');
          state.flipped = [];
          state.locked = false;
        }, 700);
      }
    }
  }

  function showWin() {
    stopTimer();
    winMovesEl.textContent = state.moves;
    winTimeEl.textContent = formatTime(state.seconds);
    const stars = getStars();
    winStarsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    winStarsEl.setAttribute('aria-label', `${stars} stars`);
    winOverlay.hidden = false;
    confetti();
  }

  function confetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#7c5cff', '#4ade80', '#fbbf24', '#f472b6', '#38bdf8'];
    const pieces = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    let frame = 0;
    const maxFrames = 180;
    function draw() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.rotation += p.rotationSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      if (frame < maxFrames) requestAnimationFrame(draw);
      else canvas.remove();
    }
    requestAnimationFrame(draw);
  }

  function initGame() {
    stopTimer();
    const key = difficultyEl.value;
    const { pairs, class: boardClass } = DIFFICULTY[key];
    state = {
      cards: [],
      flipped: [],
      moves: 0,
      matched: 0,
      timerInterval: null,
      seconds: 0,
      locked: false
    };

    movesEl.textContent = '0';
    timerEl.textContent = '0:00';
    updateStarsDisplay(starsEl, 3);
    boardEl.className = 'board ' + boardClass;
    boardEl.innerHTML = '';

    const deck = getDeck(pairs);
    state.cards = deck.map((icon, index) => {
      const el = createCard(index, icon, index);
      boardEl.appendChild(el);
      return { icon, element: el.querySelector('.card'), matched: false };
    });

    winOverlay.hidden = true;
  }

  restartBtn.addEventListener('click', initGame);
  playAgainBtn.addEventListener('click', initGame);
  difficultyEl.addEventListener('change', initGame);

  initGame();
})();
