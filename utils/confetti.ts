// Confetti Animation
export const triggerConfetti = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const particles: HTMLDivElement[] = [];

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      particles.forEach(p => p.remove());
      return;
    }

    const particleCount = 50 * (timeLeft / duration);
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '10px';
      particle.style.height = '10px';
      particle.style.backgroundColor = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)];
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = '-10px';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '200';
      particle.style.opacity = '0.8';
      
      const xVelocity = (Math.random() - 0.5) * 6;
      const yVelocity = randomInRange(3, 8);
      let yPos = -10;
      let xPos = Math.random() * window.innerWidth;
      let rotation = 0;
      
      document.body.appendChild(particle);
      particles.push(particle);

      const animate = () => {
        yPos += yVelocity;
        xPos += xVelocity;
        rotation += 5;
        
        particle.style.top = yPos + 'px';
        particle.style.left = xPos + 'px';
        particle.style.transform = `rotate(${rotation}deg)`;
        particle.style.opacity = String(0.8 * (1 - yPos / window.innerHeight));

        if (yPos < window.innerHeight) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };

      requestAnimationFrame(animate);
    }
  }, 250);
};

