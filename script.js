const localVideoPath = "Demo.mp4";

const playerRoot = document.getElementById("demo-player");
const particlesCanvas = document.getElementById("section-particles");
const demoSection = document.getElementById("demo");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderPlayer() {
  if (!playerRoot) return;

  if (localVideoPath.trim()) {
    const video = document.createElement("video");
    video.src = localVideoPath;
    video.poster = "6 слайд.jpeg";
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("controlsList", "nodownload");
    video.setAttribute("aria-label", "RIR gameplay demo");
    playerRoot.replaceChildren(video);
    return;
  }

  const placeholder = document.createElement("div");
  placeholder.className = "player-placeholder";
  placeholder.innerHTML = `
    <div class="player-placeholder-inner">
      <div class="player-play" aria-hidden="true">&#9654;</div>
      <h3>Gameplay demo placeholder</h3>
      <p>
        Add your local video file in <code>script.js</code> and this block will become the live demo player.
      </p>
    </div>
  `;

  playerRoot.replaceChildren(placeholder);
}

renderPlayer();

function initSectionParticles() {
  if (!particlesCanvas || !demoSection) return;

  const ctx = particlesCanvas.getContext("2d");
  if (!ctx) return;

  const particles = [];
  let viewportWidth = 0;
  let canvasHeight = 0;
  let animationFrame = 0;
  let count = 0;
  let linkDistance = 220;

  function createParticle() {
    return {
      x: Math.random() * viewportWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      r: Math.random() * 2.2 + 0.9
    };
  }

  function resizeCanvas() {
    const rectTop = demoSection.offsetTop;
    const totalHeight = document.body.scrollHeight - rectTop;
    viewportWidth = window.innerWidth;
    canvasHeight = Math.max(totalHeight, window.innerHeight);

    particlesCanvas.style.top = `${rectTop}px`;
    particlesCanvas.style.height = `${canvasHeight}px`;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    particlesCanvas.width = Math.floor(viewportWidth * dpr);
    particlesCanvas.height = Math.floor(canvasHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    count = viewportWidth < 520 ? 58 : viewportWidth < 900 ? 92 : 148;
    linkDistance = viewportWidth < 520 ? 148 : viewportWidth < 900 ? 182 : 240;

    particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      particles.push(createParticle());
    }
  }

  function step() {
    ctx.clearRect(0, 0, viewportWidth, canvasHeight);

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = viewportWidth + 20;
      if (particle.x > viewportWidth + 20) particle.x = -20;
      if (particle.y < -20) particle.y = canvasHeight + 20;
      if (particle.y > canvasHeight + 20) particle.y = -20;
    }

    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i];

      ctx.beginPath();
      ctx.fillStyle = "rgba(128, 233, 255, 0.98)";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(128, 233, 255, 0.35)";
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);

        if (distance > linkDistance) continue;

        const alpha = (1 - distance / linkDistance) * 0.44;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(128, 233, 255, ${alpha})`;
        ctx.lineWidth = 1.1;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    animationFrame = window.requestAnimationFrame(step);
  }

  resizeCanvas();

  if (prefersReducedMotion) {
    step();
    window.cancelAnimationFrame(animationFrame);
  } else {
    step();
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resizeCanvas, 120);
  });
}

initSectionParticles();
