// ==================== GAME ENGINE ====================
class GameEngine {
  constructor(masterLanguage) {
    this.masterLanguage = masterLanguage;
    this.wordsManager = new WordsManager();
    this.audioManager = new AudioManager();
    this.fallingWords = new Map();
    this.activePairs = new Map();
    this.usedNumbers = new Set();
    this.nextPairId = 1;
    this.waitingForMaster = true;
    this.selectedMasterNumber = null;

    this.gameState = {
      score: 0,
      level: 1,
      lives: 3,
      streak: 0,
      speed: 1
    };

    this.gameTime = 0;
    this.gameTimer = null;
    this.spawnInterval = null;
    this.isGameOver = false; // 👈 NOUVELLE VARIABLE CRUCIALE

    this.init();
  }

  init() {
    this.setupKeyboardEvents();
    this.startGameLoop();
    this.updateUI();
    this.updateSelectionIndicator();
  }

  setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      const number = parseInt(e.key);
      if (number >= 1 && number <= 9) {
        this.handleNumberPress(number);
      }
    });
  }

  handleNumberPress(number) {
    if (this.isGameOver) return; // 👈 BLOQUE TOUT SI GAME OVER
    this.handleWordClick(number);
  }

  handleWordClick(number) {
    if (this.isGameOver) return;

    const wordData = this.fallingWords.get(number);
    if (!wordData) return;

    if (this.waitingForMaster) {
      if (wordData.language !== this.masterLanguage) {
        this.showWrongColumnError(wordData.element);
        return;
      }
      this.selectMasterWord(number);
    } else {
      if (wordData.language === this.masterLanguage) {
        this.showWrongColumnError(wordData.element);
        return;
      }
      this.selectTranslationWord(number);
    }
  }

  selectMasterWord(number) {
    this.clearAllWordStates();
    const wordData = this.fallingWords.get(number);
    this.selectedMasterNumber = number;
    wordData.element.classList.add('waiting-master');
    this.audioManager.playSelectSound();
    this.waitingForMaster = false;
    this.updateSelectionIndicator();
  }

  selectTranslationWord(number) {
    const translationData = this.fallingWords.get(number);
    translationData.element.classList.add('checking-other');

    setTimeout(() => {
      this.checkMatch(this.selectedMasterNumber, number);
    }, 300);
  }

  checkMatch(masterNum, translationNum) {
    let matchedPairId = null;
    for (let [pairId, pairData] of this.activePairs.entries()) {
      if (
        (pairData.masterNum === masterNum && pairData.otherNum === translationNum) ||
        (pairData.masterNum === translationNum && pairData.otherNum === masterNum)
      ) {
        matchedPairId = pairId;
        break;
      }
    }

    if (matchedPairId) {
      this.handleCorrectMatch(masterNum, translationNum);
    } else {
      this.handleWrongMatch(masterNum, translationNum);
    }

    this.waitingForMaster = true;
    this.selectedMasterNumber = null;
    this.updateSelectionIndicator();
  }

  handleCorrectMatch(masterNum, translationNum) {
    const masterWord = this.fallingWords.get(masterNum);
    const translationWord = this.fallingWords.get(translationNum);

    this.audioManager.playFadeOutSound(); // 👈 Son de disparition douce
    this.audioManager.playSuccessSound();
    masterWord.element.classList.add('matched');
    translationWord.element.classList.add('matched');

    const masterRect = masterWord.element.getBoundingClientRect();
    const translationRect = translationWord.element.getBoundingClientRect();

    VisualEffects.createMatchParticles(
      masterRect.left + masterRect.width / 2,
      masterRect.top + masterRect.height / 2
    );
    VisualEffects.createMatchParticles(
      translationRect.left + translationRect.width / 2,
      translationRect.top + translationRect.height / 2
    );

    this.gameState.score += 10 * this.gameState.level;
    this.gameState.streak += 1;

    if (this.gameState.streak > 0 && this.gameState.streak % 5 === 0) {
      this.gameState.level += 1;
      this.gameState.speed += 0.2;
    }

    setTimeout(() => {
      this.removeWordPair(masterWord.pairId, masterNum, translationNum);
    }, 1000);
    this.updateUI();
  }

  handleWrongMatch(masterNum, translationNum) {
    const masterWord = this.fallingWords.get(masterNum);
    const translationWord = this.fallingWords.get(translationNum);

    this.audioManager.playErrorSound();
    masterWord.element.classList.add('error');
    translationWord.element.classList.add('error');
    this.gameState.streak = 0;

    setTimeout(() => {
      this.clearAllWordStates();
    }, 800);
    this.updateUI();
  }

  showWrongColumnError(element) {
    element.classList.add('error');
    this.audioManager.playErrorSound();
    setTimeout(() => {
      element.classList.remove('error');
    }, 800);
  }

  clearAllWordStates() {
    for (let [number, wordData] of this.fallingWords.entries()) {
      const element = wordData.element;
      element.classList.remove('waiting-master', 'checking-other', 'error');
    }
  }

  updateSelectionIndicator() {
    const indicator = document.getElementById('selection-indicator');
    if (this.waitingForMaster) {
      indicator.textContent = `Next: ${this.masterLanguage.toUpperCase()} word`;
      indicator.style.color = '#00ff41';
    } else {
      const otherLanguage = this.masterLanguage === 'english' ? 'SWAHILI' : 'ENGLISH';
      indicator.textContent = `Next: ${otherLanguage} word`;
      indicator.style.color = '#ffff00';
    }
  }

  getRandomAvailableNumber() {
    let number;
    let attempts = 0;
    do {
      number = Math.floor(Math.random() * 9) + 1;
      attempts++;
    } while (this.usedNumbers.has(number) && attempts < 20);

    if (attempts >= 20) {
      const oldestNumber = Math.min(...this.usedNumbers);
      this.usedNumbers.delete(oldestNumber);
      return oldestNumber;
    }
    return number;
  }

  spawnWordPair() {
    if (this.activePairs.size >= 4 || this.isGameOver) return; // 👈 BLOQUE SI GAME OVER

    const wordPair = this.wordsManager.getRandomPair();
    const pairId = this.nextPairId++;

    const masterNum = this.getRandomAvailableNumber();
    this.usedNumbers.add(masterNum);
    const otherNum = this.getRandomAvailableNumber();
    this.usedNumbers.add(otherNum);

    const masterWord = this.createFallingWord(
      this.masterLanguage === 'english' ? wordPair.english : wordPair.swahili,
      masterNum,
      'master',
      this.masterLanguage
    );

    const otherWord = this.createFallingWord(
      this.masterLanguage === 'english' ? wordPair.swahili : wordPair.english,
      otherNum,
      'other',
      this.masterLanguage === 'english' ? 'swahili' : 'english'
    );

    this.fallingWords.set(masterNum, {
      element: masterWord,
      text: this.masterLanguage === 'english' ? wordPair.english : wordPair.swahili,
      language: this.masterLanguage,
      pairId: pairId
    });

    this.fallingWords.set(otherNum, {
      element: otherWord,
      text: this.masterLanguage === 'english' ? wordPair.swahili : wordPair.english,
      language: this.masterLanguage === 'english' ? 'swahili' : 'english',
      pairId: pairId
    });

    this.activePairs.set(pairId, {
      masterNum: masterNum,
      otherNum: otherNum,
      wordPair: wordPair,
      elements: { master: masterWord, other: otherWord }
    });
  }

  createFallingWord(text, number, column, language) {
    const wordElement = document.createElement('div');
    wordElement.className = `falling-word ${column}-word`;
    const randomX = Math.random() * 60 + 20;
    wordElement.style.left = randomX + '%';
    wordElement.style.top = '-60px';
    wordElement.innerHTML = `
      <span class="word-number">${number}</span>
      <span class="word-text">${text}</span>
    `;

    const targetColumn = column === 'master' ?
      document.querySelector('#master-column .words-area') :
      document.querySelector('#other-column .words-area');

    targetColumn.appendChild(wordElement);

    // 🔒 Désactive les clics si game over
    const self = this;
    wordElement.addEventListener('click', () => {
      if (self.isGameOver) return;
      self.handleWordClick(number);
    });

    this.animateFallingWord(wordElement, number);
    return wordElement;
  }

  animateFallingWord(element, number) {
    let currentTop = -60;
    const speed = this.gameState.speed * 1.2;
    const fall = () => {
      if (!element.parentNode || this.isGameOver) return; // 👈 STOPPE L'ANIMATION SI GAME OVER
      currentTop += speed;
      element.style.top = currentTop + 'px';

      if (currentTop > window.innerHeight - 150) {
        this.handleWordMissed(number);
        return;
      }
      requestAnimationFrame(fall);
    };
    fall();
  }

  handleWordMissed(number) {
    if (!this.fallingWords.has(number)) return;
    const wordData = this.fallingWords.get(number);
    const pairId = wordData.pairId;

    let otherNumber = null;
    for (let [num, data] of this.fallingWords.entries()) {
      if (data.pairId === pairId && num !== number) {
        otherNumber = num;
        break;
      }
    }

    wordData.element.classList.add('error');
    if (otherNumber && this.fallingWords.has(otherNumber)) {
      this.fallingWords.get(otherNumber).element.classList.add('error');
    }

    this.gameState.lives -= 1;
    this.gameState.streak = 0;

    if (this.selectedMasterNumber === number || this.selectedMasterNumber === otherNumber) {
      this.waitingForMaster = true;
      this.selectedMasterNumber = null;
      this.updateSelectionIndicator();
    }

    setTimeout(() => {
      this.removeWordPair(pairId, number, otherNumber);
    }, 500);

    this.updateUI();

    if (this.gameState.lives <= 0) {
      this.gameOver();
    }
  }

  removeWordPair(pairId, num1, num2) {
    if (this.fallingWords.has(num1)) {
      this.fallingWords.get(num1).element.remove();
      this.fallingWords.delete(num1);
      this.usedNumbers.delete(num1);
    }
    if (num2 && this.fallingWords.has(num2)) {
      this.fallingWords.get(num2).element.remove();
      this.fallingWords.delete(num2);
      this.usedNumbers.delete(num2);
    }
    if (this.activePairs.has(pairId)) {
      this.activePairs.delete(pairId);
    }
  }

  calculateAccuracy() {
    const totalAttempts = this.gameState.score / 10;
    const correctMatches = Math.floor(totalAttempts);
    return totalAttempts > 0 ? Math.round((correctMatches / totalAttempts) * 100) : 0;
  }

  updateUI() {
    document.getElementById('game-score').textContent = this.gameState.score;
    document.getElementById('game-level').textContent = this.gameState.level;
    document.getElementById('game-lives').textContent = this.gameState.lives;
    document.getElementById('game-streak').textContent = this.gameState.streak;
  }

  startGameLoop() {
    const placeholders = document.querySelectorAll('.words-placeholder');
    placeholders.forEach(p => p.style.display = 'none');

    this.spawnInterval = setInterval(() => {
      this.spawnWordPair();
    }, Math.max(2000 - (this.gameState.level * 200), 1000));

    setInterval(() => {
      clearInterval(this.spawnInterval);
      this.spawnInterval = setInterval(() => {
        this.spawnWordPair();
      }, Math.max(2000 - (this.gameState.level * 200), 1000));
    }, 10000);

    this.gameTimer = setInterval(() => {
      this.gameTime += 1;
    }, 1000);
  }

gameOver() {
  // 🔴 STOP TOUTE ACTIVITÉ DU JEU
  clearInterval(this.spawnInterval);
  clearInterval(this.gameTimer);
  this.isGameOver = true;

  // 🌫️ Effet de disparition douce : fondre les mots
  const fallingWords = document.querySelectorAll('.falling-word');
  fallingWords.forEach(word => {
    word.style.opacity = '0';
    word.style.transition = 'opacity 0.6s ease-out'; // Doux et naturel
    // Supprime après l'animation
    setTimeout(() => {
      word.remove(); // 👈 Suppression définitive du DOM
    }, 600); // Légèrement plus long que la transition pour être sûr
  });

  // 🔴 Vide les maps internes pour éviter les fuites mémoire
  this.fallingWords.clear();
  this.activePairs.clear();
  this.usedNumbers.clear();

  // 🔴 Désactive les événements clavier
  document.removeEventListener('keydown', this.handleNumberPress.bind(this));

  // 🔊 Jouer le son de victoire
  this.audioManager.playSuccessSound();

  // 🔥 Sauvegarde le meilleur score
  const bestScore = localStorage.getItem('ztypeBestScore') || 0;
  if (this.gameState.score > bestScore) {
    localStorage.setItem('ztypeBestScore', this.gameState.score);
  }

  // 📊 Mettre à jour l'affichage du game-over
  document.getElementById('final-score').textContent = this.gameState.score;
  document.getElementById('final-level').textContent = this.gameState.level;
  document.getElementById('final-streak').textContent = this.gameState.streak;
  document.getElementById('final-accuracy').textContent = this.calculateAccuracy() + '%';
  document.getElementById('final-time').textContent = Math.round(this.gameTime) + 's';

  // 🖥️ Afficher l'écran de fin
  document.getElementById('game-over-screen').classList.add('active');
}
}