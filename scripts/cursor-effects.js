// Pink + gold glitter trail. No circles, no chain — just lots of tiny twinkles.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hoverable = window.matchMedia("(hover: hover)").matches;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  if (reduceMotion || !hoverable || isCoarse) return;

  // pink + gold + soft warm white — leans more pink than gold
  const palette = [
    "#ffb3c1",
    "#ff8fa3",
    "#f4c2c2",
    "#f9d9d9",
    "#ffd9e3",
    "#d4af37",
    "#e8c468",
    "#f4d57e",
    "#fff5e0",
  ];

  // glittery shapes — 4-pt sparkle, 6-pt star, plus/cross, tiny diamond, twinkle
  const SHAPES = [
    (c) =>
      `<path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" fill="${c}"/>`,
    (c) =>
      `<path d="M6 0.5 L7.1 4.6 L11.4 4.6 L7.9 7.1 L9.2 11.2 L6 8.7 L2.8 11.2 L4.1 7.1 L0.6 4.6 L4.9 4.6 Z" fill="${c}"/>`,
    (c) =>
      `<path d="M6 1 L6 11 M1 6 L11 6" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<path d="M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5" stroke="${c}" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>`,
    (c) => `<path d="M6 0 L11 6 L6 12 L1 6 Z" fill="${c}"/>`,
    (c) =>
      `<g fill="${c}"><circle cx="6" cy="6" r="0" opacity="0"/><path d="M6 0 L6.5 5.5 L12 6 L6.5 6.5 L6 12 L5.5 6.5 L0 6 L5.5 5.5 Z"/></g>`,
  ];

  const root = document.body;
  const sparkles = [];
  const SPARKLE_MAX = 110;
  const SPAWN_PER_MOVE = 3;
  const MIN_DIST = 4;

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function spawnSparkle(x, y) {
    if (sparkles.length >= SPARKLE_MAX) return;
    const el = document.createElement("div");
    const color = pick(palette);
    const shape = pick(SHAPES);
    const size = rand(4, 11);
    const ox = rand(-12, 12);
    const oy = rand(-10, 10);
    Object.assign(el.style, {
      position: "fixed",
      left: `${x + ox}px`,
      top: `${y + oy}px`,
      width: `${size}px`,
      height: `${size}px`,
      pointerEvents: "none",
      zIndex: "9997",
      transform: "translate(-50%, -50%) rotate(0deg) scale(0)",
      filter: `drop-shadow(0 0 2px ${color}aa)`,
      willChange: "transform, opacity, left, top",
    });
    el.innerHTML = `<svg viewBox="0 0 12 12" width="100%" height="100%" aria-hidden="true">${shape(color)}</svg>`;
    root.appendChild(el);
    sparkles.push({
      el,
      x: x + ox,
      y: y + oy,
      vx: rand(-0.4, 0.4),
      vy: rand(0.05, 1.4),
      rot: rand(0, 360),
      vrot: rand(-5, 5),
      life: 0,
      max: rand(50, 110),
      twinkle: rand(0.6, 1.2),
    });
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let lastX = mouseX;
  let lastY = mouseY;

  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      if (dx * dx + dy * dy > MIN_DIST * MIN_DIST) {
        for (let i = 0; i < SPAWN_PER_MOVE; i++) spawnSparkle(mouseX, mouseY);
        lastX = mouseX;
        lastY = mouseY;
      }
    },
    { passive: true }
  );

  // idle drip: keep glitter falling around the cursor even when it's still
  let idleFrame = 0;
  const IDLE_EVERY = 6; // ~10 sparkles/sec at 60fps

  function tick() {
    // idle spawn — quieter than movement, but never fully silent
    if (++idleFrame % IDLE_EVERY === 0) {
      spawnSparkle(mouseX, mouseY);
    }

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.life++;
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.vrot;
      s.vy += 0.015; // tiny gravity

      const t = s.life / s.max;
      // twinkle: scale up quickly, then ease out
      const grow = Math.min(1, s.life / 8);
      const shrink = t > 0.5 ? 1 - (t - 0.5) * 2 : 1;
      const scale = grow * shrink * s.twinkle;
      const opacity = (1 - t * t) * 0.95;

      s.el.style.left = `${s.x}px`;
      s.el.style.top = `${s.y}px`;
      s.el.style.opacity = `${opacity}`;
      s.el.style.transform = `translate(-50%, -50%) rotate(${s.rot}deg) scale(${scale})`;

      if (s.life >= s.max) {
        s.el.remove();
        sparkles.splice(i, 1);
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
