# Memory Match Card Game

A browser-based memory match game with card flip animations, match logic, win state, and optional difficulty levels. Ready to host on **GitHub Pages**.

## Features

- **Card flip animation** — 3D flip when you click a card
- **Match logic** — Flip two cards; matches stay face-up, non-matches flip back after a short delay
- **Win state** — Victory overlay with move count, time, and star rating, plus a simple confetti effect
- **Moves & timer** — Move counter and elapsed time (timer starts on first click)
- **Star rating** — 1–3 stars based on how many moves you use (fewer moves = more stars)
- **Difficulty levels** — Easy (4×3), Medium (4×4), Hard (4×6)
- **New game** — Restart or change grid size anytime
- **Keyboard friendly** — Cards are focusable; use Enter/Space to flip
- **Responsive** — Works on small screens

## Run locally

Open `index.html` in a browser, or use a local server:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000` (or the port shown).

## Deploy to GitHub Pages

1. **Create a new repo** on GitHub (e.g. `memory-match-game`).

2. **Push this project** into that repo:
   ```bash
   cd "Memory Match Card Game"
   git init
   git add index.html styles.css script.js README.md
   git commit -m "Add memory match card game"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/memory-match-game.git
   git push -u origin main
   ```

3. **Turn on GitHub Pages**  
   - Repo → **Settings** → **Pages**  
   - Under **Source**, choose **Deploy from a branch**  
   - Branch: **main**, folder: **/ (root)**  
   - Save.

4. Your game will be at:  
   `https://YOUR_USERNAME.github.io/memory-match-game/`

If the repo name is exactly `YOUR_USERNAME.github.io`, the site is at:  
`https://YOUR_USERNAME.github.io/`.

## Project structure

```
Memory Match Card Game/
├── index.html   # Markup and layout
├── styles.css   # Layout, card flip, responsive styles
├── script.js    # Game logic, timer, win/confetti
└── README.md    # This file
```

No build step or dependencies—plain HTML, CSS, and JavaScript.
