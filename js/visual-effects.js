// ==================== VISUAL EFFECTS ====================
class VisualEffects {
  static createMatchParticles(x, y) {
    const container = document.createElement('div');
    container.className = 'match-particles';
    container.style.position = 'absolute';
    container.style.left = x + 'px';
    container.style.top = y + 'px';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '100';

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.position = 'absolute';
      particle.style.left = '0';
      particle.style.top = '0';
      const angle = (i * 30) * Math.PI / 180;
      const distance = Math.random() * 100 + 50;
      const finalX = Math.cos(angle) * distance;
      const finalY = Math.sin(angle) * distance;
      particle.style.transform = `translate(${finalX}px, ${finalY}px) scale(0)`;
      particle.style.opacity = '0';
      particle.style.animation = 'particleExplosion 1s ease-out forwards';
      particle.style.animationDelay = `${Math.random() * 0.1}s`;
      container.appendChild(particle);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 1500);
  }
}