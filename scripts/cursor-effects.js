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
  const lowPower =
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4);
  const isLanding = document.body.classList.contains("landing");
  const particles = [];
  const PARTICLE_POOL = isLanding ? (lowPower ? 130 : 190) : (lowPower ? 64 : 92);
  const MIN_DIST = 4;
  const TRAIL_SPACING = isLanding ? (lowPower ? 11 : 7) : (lowPower ? 18 : 14);
  const MAX_TRAIL_PER_SEGMENT = isLanding ? (lowPower ? 24 : 42) : (lowPower ? 10 : 16);
  const MAX_TRAIL_SPAWNS_PER_FRAME = isLanding ? (lowPower ? 34 : 68) : (lowPower ? 12 : 22);
  const MAX_LEAD_SPAWNS_PER_FRAME = isLanding ? (lowPower ? 8 : 16) : (lowPower ? 3 : 5);
  const IDLE_EVERY = isLanding ? (lowPower ? 14 : 8) : (lowPower ? 34 : 24);
  const IDLE_MS = isLanding ? (lowPower ? 1600 : 2600) : (lowPower ? 450 : 700);
  const FRAME_MS = 1000 / 60;
  const SPRITES = palette.flatMap((color, colorIndex) =>
    SHAPES.map((shape, shapeIndex) => ({
      color,
      id: `${colorIndex}-${shapeIndex}`,
      markup: `<svg viewBox="0 0 12 12" width="100%" height="100%" aria-hidden="true">${shape(color)}</svg>`,
    }))
  );

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function createParticle(index) {
    const sprite = SPRITES[index % SPRITES.length];
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: "8px",
      height: "8px",
      opacity: "0",
      pointerEvents: "none",
      zIndex: "9997",
      transform: "translate3d(-9999px, -9999px, 0)",
      filter: `drop-shadow(0 0 2px ${sprite.color}aa)`,
      willChange: "transform, opacity",
      contain: "layout paint style",
    });
    el.innerHTML = sprite.markup;
    root.appendChild(el);

    return {
      el,
      active: false,
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      rot: 0,
      vrot: 0,
      life: 0,
      max: 1,
      phase: 0,
      twinkle: 1,
    };
  }

  for (let i = 0; i < PARTICLE_POOL; i++) {
    particles.push(createParticle(i));
  }

  let nextParticle = 0;
  let activeCount = 0;
  let trailSpawnsThisFrame = 0;
  let leadSpawnsThisFrame = 0;

  function retireParticle(particle) {
    if (!particle.active) return;
    particle.active = false;
    activeCount--;
    particle.el.style.opacity = "0";
    particle.el.style.transform = "translate3d(-9999px, -9999px, 0)";
  }

  function spawnSparkle(x, y, lead = false) {
    if (document.hidden) return false;

    if (lead) {
      if (leadSpawnsThisFrame >= MAX_LEAD_SPAWNS_PER_FRAME) return false;
      leadSpawnsThisFrame++;
    } else {
      if (trailSpawnsThisFrame >= MAX_TRAIL_SPAWNS_PER_FRAME) return false;
      trailSpawnsThisFrame++;
    }

    const particle = particles[nextParticle];
    nextParticle = (nextParticle + 1) % PARTICLE_POOL;

    if (!particle.active) {
      activeCount++;
    }

    const size = lead ? rand(6, 14) : rand(4, 11);
    const ox = lead ? rand(-8, 8) : rand(-14, 14);
    const oy = lead ? rand(-8, 8) : rand(-12, 12);

    particle.active = true;
    particle.x = x + ox;
    particle.y = y + oy;
    particle.vx = lead ? rand(-1.05, 1.05) : rand(-0.92, 0.92);
    particle.vy = lead ? rand(0.18, 1.65) : rand(0.34, 2.1);
    particle.rot = rand(0, 360);
    particle.vrot = lead ? rand(-4.8, 4.8) : rand(-3.8, 3.8);
    particle.life = 0;
    particle.max = lead ? rand(62, 116) : rand(78, 146);
    particle.phase = rand(0, Math.PI * 2);
    particle.twinkle = lead ? rand(0.9, 1.45) : rand(0.65, 1.25);

    const { el } = particle;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.opacity = "0";
    el.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0) translate(-50%, -50%) rotate(${particle.rot}deg) scale(0)`;
    ensureTicking();
    return true;
  }

  function spawnTrail(fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const dist = Math.hypot(dx, dy);
    if (dist < MIN_DIST) return false;

    const count = Math.min(
      MAX_TRAIL_PER_SEGMENT,
      Math.max(3, Math.ceil(dist / TRAIL_SPACING))
    );

    for (let i = 1; i <= count; i++) {
      const t = i / count;
      if (!spawnSparkle(fromX + dx * t, fromY + dy * t)) break;
    }

    return true;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let lastX = mouseX;
  let lastY = mouseY;
  let hasPointer = false;
  let lastMoveAt = 0;

  function handlePoint(point, isLatest) {
    mouseX = point.clientX;
    mouseY = point.clientY;
    lastMoveAt = performance.now();

    if (!hasPointer) {
      hasPointer = true;
      lastX = mouseX;
      lastY = mouseY;
      for (let i = 0; i < (lowPower ? 4 : 7); i++) spawnSparkle(mouseX, mouseY, true);
      return;
    }

    if (spawnTrail(lastX, lastY, mouseX, mouseY)) {
      lastX = mouseX;
      lastY = mouseY;
    }

    if (isLatest) {
      for (let i = 0; i < (lowPower ? 2 : 3); i++) {
        spawnSparkle(mouseX, mouseY, true);
      }
    }
  }

  function handleMove(e) {
    if (document.hidden) return;
    const points =
      typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [e];

    points.forEach((point, index) => handlePoint(point, index === points.length - 1));
  }

  const moveEvent = "PointerEvent" in window ? "pointermove" : "mousemove";
  window.addEventListener(moveEvent, handleMove, { passive: true });

  // Click / tap = small celebratory burst.
  function handleBurst(e) {
    if (document.hidden) return;
    const x = e.clientX;
    const y = e.clientY;
    if (typeof x !== "number" || typeof y !== "number") return;
    const burstCount = lowPower ? 14 : 22;
    // Temporarily lift the per-frame cap so the burst actually shows up.
    const prevTrail = trailSpawnsThisFrame;
    const prevLead = leadSpawnsThisFrame;
    trailSpawnsThisFrame = -burstCount;
    leadSpawnsThisFrame = -burstCount;
    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2 + rand(-0.18, 0.18);
      const radius = rand(6, lowPower ? 22 : 34);
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (!spawnSparkle(px, py, true)) break;
      // Bias outward velocity for a popping firework feel.
      const last = particles[(nextParticle - 1 + PARTICLE_POOL) % PARTICLE_POOL];
      if (last && last.active) {
        const speed = rand(0.9, 2.1);
        last.vx = Math.cos(angle) * speed;
        last.vy = Math.sin(angle) * speed - rand(0.1, 0.7);
        last.max = rand(80, 130);
      }
    }
    trailSpawnsThisFrame = prevTrail;
    leadSpawnsThisFrame = prevLead;
  }

  window.addEventListener("pointerdown", handleBurst, { passive: true });

  // idle drip: keep glitter falling around the cursor even when it's still
  let idleFrame = 0;
  let rafId = 0;
  let lastFrameAt = 0;

  function ensureTicking() {
    if (!rafId && !document.hidden) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function tick(now) {
    rafId = 0;
    if (document.hidden) return;
    const elapsed = lastFrameAt ? now - lastFrameAt : FRAME_MS;
    const frameStep = Math.max(0.5, Math.min(18, elapsed / FRAME_MS));
    lastFrameAt = now;
    trailSpawnsThisFrame = 0;
    leadSpawnsThisFrame = 0;

    // idle spawn — quieter than movement, but never fully silent
    const recentlyMoved = hasPointer && performance.now() - lastMoveAt < IDLE_MS;
    idleFrame += frameStep;
    if (recentlyMoved && idleFrame >= IDLE_EVERY) {
      idleFrame = 0;
      spawnSparkle(mouseX, mouseY);
    }

    for (let i = 0; i < particles.length; i++) {
      const s = particles[i];
      if (!s.active) continue;

      s.life += frameStep;
      s.x += s.vx * frameStep;
      s.y += s.vy * frameStep;
      s.rot += s.vrot * frameStep;
      s.vx *= Math.pow(0.988, frameStep);
      s.vy = s.vy * Math.pow(0.996, frameStep) + 0.018 * frameStep;

      const t = s.life / s.max;
      const grow = Math.min(1, s.life / 10);
      const fadeProgress = Math.max(0, Math.min(1, (t - 0.36) / 0.64));
      const fade = 1 - fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
      const twinkle = 0.86 + Math.sin(s.life * 0.22 + s.phase) * 0.14;
      const shrink = 1 - Math.max(0, (t - 0.62) / 0.38) * 0.36;
      const scale = grow * shrink * s.twinkle;
      const opacity = fade * twinkle * 0.92;

      s.el.style.opacity = `${opacity}`;
      s.el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) rotate(${s.rot}deg) scale(${scale})`;

      if (s.life >= s.max) {
        retireParticle(s);
      }
    }

    if (activeCount > 0 || recentlyMoved) {
      ensureTicking();
    }
  }

  document.addEventListener("visibilitychange", () => {
    lastFrameAt = 0;
    if (!document.hidden && activeCount > 0) {
      ensureTicking();
    }
  });

  window.addEventListener("scroll", ensureTicking, { passive: true });
  window.addEventListener("wheel", ensureTicking, { passive: true });
})();
