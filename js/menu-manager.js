// ==================== MENU MANAGER ====================
class MenuManager {
  constructor() {
    this.selectedLanguage = 'english';
    this.init();
  }

  init() {
    this.setupRadioOptions();
    this.setupStartButton(); // 👈 C'EST CETTE LIGNE QUI FAIT TOUT !
  }

  setupRadioOptions() {
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const value = option.dataset.value;
        this.selectOption(value);
      });
    });
  }

  selectOption(language) {
    const allOptions = document.querySelectorAll('.radio-option');
    allOptions.forEach(option => option.classList.remove('selected'));
    const selectedOption = document.querySelector(`[data-value="${language}"]`);
    const radioInput = selectedOption.querySelector('input[type="radio"]');
    selectedOption.classList.add('selected');
    radioInput.checked = true;
    this.selectedLanguage = language;
  }

  setupStartButton() {
    const startBtn = document.getElementById('start-game');
    if (!startBtn) {
      console.error("❌ Bouton #start-game non trouvé !");
      return;
    }
    startBtn.addEventListener('click', () => {
      this.startGame();
    });
  }

  startGame() {
    this.transitionToGame();
  }

  transitionToGame() {
    const menu = document.getElementById('main-menu');
    const gameScreen = document.getElementById('game-screen');

    menu.classList.add('fade-out');
    setTimeout(() => {
      menu.style.display = 'none'; // 👈 IMPORTANT : on cache après l'animation
      gameScreen.classList.add('active', 'fade-in');
      this.updateGameColumns();
      window.gameEngine = new GameEngine(this.selectedLanguage);
    }, 500);
  }

  updateGameColumns() {
    const masterTitle = document.getElementById('master-header-title');
    const otherTitle = document.getElementById('other-header-title');

    if (this.selectedLanguage === 'english') {
      masterTitle.textContent = 'ENGLISH';
      otherTitle.textContent = 'SWAHILI';
    } else {
      masterTitle.textContent = 'SWAHILI';
      otherTitle.textContent = 'ENGLISH';
    }
  }
}