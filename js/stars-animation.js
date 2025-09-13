// ==================== STARS ANIMATION ====================
class StarsAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.STARS_COUNT = typeof CONFIG !== 'undefined' && CONFIG.STARS_COUNT ? CONFIG.STARS_COUNT : 150;
    this.init();
  }

  init() {
    this.setupCanvas();
    this.createStars();
    this.animate();
    this.setupResize();
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createStars() {
    this.stars = [];
    for (let i = 0; i < this.STARS_COUNT; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.3,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let star of this.stars) {
      star.y += star.speed;
      if (star.y > this.canvas.height) {
        star.y = -5;
        star.x = Math.random() * this.canvas.width;
      }
      this.ctx.globalAlpha = star.opacity;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = '#ffffff';
      this.ctx.shadowBlur = 2;
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    requestAnimationFrame(() => this.animate());
  }

  setupResize() {
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.createStars();
    });
  }
}