// ==================== AUDIO MANAGER ====================
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.init();
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      // Silent fail — no audio support
    }
  }

  playSuccessSound() {
    if (!this.audioContext) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime); // Do
    oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1); // Mi
    oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2); // Sol
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  playErrorSound() {
    if (!this.audioContext) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  playSelectSound() {
    if (!this.audioContext) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playFadeOutSound() {
  if (!this.audioContext) return;

  const oscillator = this.audioContext.createOscillator();
  const gainNode = this.audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(this.audioContext.destination);

  oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

  gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);

  oscillator.start(this.audioContext.currentTime);
  oscillator.stop(this.audioContext.currentTime + 0.8);
}
}

