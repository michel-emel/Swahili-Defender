// ==================== main.js — FINAL VERSION ====================

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-game');
  const restartBtn = document.getElementById('restart-game');
  const menuBtn = document.getElementById('return-to-menu');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      document.getElementById('main-menu').classList.add('fade-out');
      setTimeout(() => {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('game-screen').classList.add('active');
        const lang = document.querySelector('.radio-option.selected')?.getAttribute('data-value') || 'english';
        window.gameEngine = new GameEngine(lang);
      }, 500);
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      document.getElementById('game-over-screen').classList.remove('active');
      const lang = document.querySelector('.radio-option.selected')?.getAttribute('data-value') || 'english';
      window.gameEngine = new GameEngine(lang);
    });
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.getElementById('game-over-screen').classList.remove('active');
      document.getElementById('game-screen').classList.remove('active');
      document.getElementById('main-menu').style.display = 'flex';
      document.getElementById('main-menu').classList.remove('fade-out');
    });
  }

  // 📌 AFFICHER LE MEILLEUR SCORE AU DÉMARRAGE
  const bestScore = localStorage.getItem('ztypeBestScore') || 0;
  document.getElementById('best-score').textContent = bestScore;
});