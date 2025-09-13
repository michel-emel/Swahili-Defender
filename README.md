# ZType Swahili Challenge

A fun, fast-paced language matching game where you match English and Swahili words using number keys!

## 🚀 How to Use

1. **Download** the entire `ztype-swahili-challenge/` folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge).
3. Choose your master language (**English First** or **Swahili First**) using the radio buttons.
4. Click **▶ START MISSION**.
5. Press number keys **1-9** on your keyboard to match words appearing on screen.
6. Match the correct translation before they fall off the bottom!
7. Earn points, climb levels, and beat your high score!

## 📁 Project Structure

- `index.html`: Main page structure.
- `style/style.css`: All visual styling.
- `js/`: JavaScript modules split by functionality:
  - `config.js`: Global settings.
  - `audio-manager.js`: Sound effects.
  - `visual-effects.js`: Particle explosions.
  - `stars-animation.js`: Animated background stars.
  - `words-manager.js`: Dictionary of English-Swahili pairs.
  - `game-engine.js`: Core gameplay logic.
  - `menu-manager.js`: Menu UI and transitions.
  - `main.js`: Starts the app.

## 💡 Notes

- Requires a modern browser with support for `AudioContext` and ES6+.
- The dictionary can be easily expanded by editing `words-manager.js`.
- For best experience, use a keyboard with a numpad.