// ───────── Leadership & Impact — the leadership map + how she leads ─────────
// Turning a single node over lives in main.js (every .flip-card). This file adds:
//   1. the map — dotted connector lines from the centre diamond to each seat,
//      measured from the real layout and redrawn on resize; a seat's line lights
//      while it is hovered, focused or turned over. Thread chips (All six /
//      Translate / Organize / Sustain) keep one chip pressed (aria-pressed) and
//      dim the seats whose data-threads don't include that thread;
//   2. "How she leads" — three accordions (aria-expanded), one open at a time.
//      The hero's habit links open their card, and "Trace it on the map" presses
//      the matching chip and scrolls back up to the map.
// Without JavaScript the chips stay hidden, every card stays open and the map
// shows all six seats without lines.

// 1 · The leadership map
(() => {
  const map = document.querySelector("[data-impact-map]");
  if (!map) return;

  const orbit = map.querySelector("[data-orbit]");
  const web = map.querySelector("[data-web]");
  const core = map.querySelector("[data-core]");
  const nodes = orbit ? Array.from(orbit.querySelectorAll(".impact-node")) : [];
  if (!web || !core || !nodes.length) return;

  // ── connector lines ──
  const SVG = "http://www.w3.org/2000/svg";
  const links = nodes.map((node) => {
    const group = document.createElementNS(SVG, "g");
    group.setAttribute("class", "impact-web-link");
    const line = document.createElementNS(SVG, "line");
    line.setAttribute("class", "impact-web-line");
    const dot = document.createElementNS(SVG, "circle");
    dot.setAttribute("class", "impact-web-dot");
    dot.setAttribute("r", "3.5");
    group.append(line, dot);
    web.appendChild(group);
    return { node, group, line, dot, hover: false, focus: false };
  });

  // offset* ignores the tilt / rotate transforms, so the geometry stays stable
  const box = (el) => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });

  const draw = () => {
    if (getComputedStyle(web).display === "none") return;
    web.setAttribute("viewBox", `0 0 ${orbit.clientWidth} ${orbit.clientHeight}`);

    const c = box(core);
    const cx = c.x + c.w / 2;
    const cy = c.y + c.h / 2;
    const reach = (c.w * Math.SQRT2) / 2 + 16; // half the diamond's diagonal + its halo

    links.forEach(({ node, line, dot }) => {
      const n = box(node);
      const nx = n.x + n.w / 2;
      const ny = n.y + n.h / 2;
      const dx = cx - nx;
      const dy = cy - ny;
      const len = Math.hypot(dx, dy) || 1;
      // the line leaves the diamond's halo and stops at the seat's nearest edge
      const t = Math.min(n.w / 2 / Math.max(Math.abs(dx), 0.001), n.h / 2 / Math.max(Math.abs(dy), 0.001));
      const ex = nx + dx * t;
      const ey = ny + dy * t;
      const sx = cx - (dx / len) * reach;
      const sy = cy - (dy / len) * reach;
      line.setAttribute("x1", sx.toFixed(1));
      line.setAttribute("y1", sy.toFixed(1));
      line.setAttribute("x2", ex.toFixed(1));
      line.setAttribute("y2", ey.toFixed(1));
      dot.setAttribute("cx", ex.toFixed(1));
      dot.setAttribute("cy", ey.toFixed(1));
    });
  };

  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      draw();
    });
  };
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(orbit);
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule, { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  schedule();

  // a seat's line lights while it is hovered, focused or turned over
  const refresh = (link) => {
    const on = link.hover || link.focus || link.node.classList.contains("is-flipped");
    link.group.classList.toggle("is-active", on);
  };
  links.forEach((link) => {
    const { node } = link;
    node.addEventListener("pointerenter", () => { link.hover = true; refresh(link); });
    node.addEventListener("pointerleave", () => { link.hover = false; refresh(link); });
    node.addEventListener("focus", () => { link.focus = true; refresh(link); });
    node.addEventListener("blur", () => { link.focus = false; refresh(link); });
    new MutationObserver(() => refresh(link)).observe(node, { attributes: true, attributeFilter: ["class"] });
  });

  // ── thread chips ──
  const toolbar = map.querySelector("[data-impact-threads]");
  const chips = toolbar ? Array.from(toolbar.querySelectorAll("[data-thread]")) : [];
  if (!chips.length) return;

  const status = map.querySelector("[data-thread-status]");
  const coreLabel = core.querySelector("small");
  const coreDefault = coreLabel ? coreLabel.textContent : "";
  const total = nodes.length;
  const words = ["no", "one", "two", "three", "four", "five", "six"];
  const notes = {
    translate: "making technical detail clear",
    organize: "building the workflow",
    sustain: "staying, and being trusted with more",
  };
  const threadsOf = (node) => (node.dataset.threads || "").split(/\s+/).filter(Boolean);

  const applyThread = (thread) => {
    let shown = 0;
    links.forEach(({ node, group }) => {
      const match = thread === "all" || threadsOf(node).includes(thread);
      const lit = match && thread !== "all";
      node.classList.toggle("is-dim", !match);
      node.classList.toggle("is-lit", lit);
      group.classList.toggle("is-dim", !match);
      group.classList.toggle("is-lit", lit);
      if (match) shown += 1;
    });
    chips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.thread === thread)));
    if (coreLabel) coreLabel.textContent = thread === "all" ? coreDefault : thread;
    if (status) {
      const text =
        thread === "all"
          ? "All six seats, 2019 to now"
          : `${words[shown] || shown} of ${words[total] || total} seats · ${notes[thread] || thread}`;
      // only touch the live region when the words change, so load stays silent
      if (status.textContent !== text) status.textContent = text;
    }
  };

  chips.forEach((chip) => chip.addEventListener("click", () => applyThread(chip.dataset.thread)));

  // ←/→ (Home/End) move focus between chips; the group carries data-arrow-keys
  // so the global chapter navigation in main.js leaves these keys alone.
  const group = toolbar.querySelector("[data-arrow-keys]") || toolbar;
  group.addEventListener("keydown", (e) => {
    const i = chips.indexOf(document.activeElement);
    if (i === -1) return;
    let target = null;
    if (e.key === "ArrowRight") target = (i + 1) % chips.length;
    else if (e.key === "ArrowLeft") target = (i - 1 + chips.length) % chips.length;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = chips.length - 1;
    if (target === null) return;
    e.preventDefault();
    chips[target].focus();
  });

  // "Trace it on the map" (section 2) asks for a thread through this event
  map.addEventListener("impact:thread", (e) => {
    const thread = e.detail;
    if (!chips.some((chip) => chip.dataset.thread === thread)) return;
    applyThread(thread);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    toolbar.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    const pressed = chips.find((chip) => chip.dataset.thread === thread);
    if (pressed) pressed.focus({ preventScroll: true });
  });

  toolbar.hidden = false;
  applyThread("all");
})();

// 2 · How she leads — accordions, hero links and "trace it on the map"
(() => {
  const section = document.querySelector("[data-habits]");
  if (!section) return;

  const cards = Array.from(section.querySelectorAll(".lead-habit"));
  const toggleOf = (card) => card.querySelector(".lead-habit-toggle");
  if (!cards.length || cards.some((card) => !toggleOf(card))) return;

  // one card open at a time: opening a card closes the others
  const setOpen = (card, open) => {
    cards.forEach((c) => {
      const on = c === card ? open : !open && c.classList.contains("is-open");
      c.classList.toggle("is-open", on);
      toggleOf(c).setAttribute("aria-expanded", String(on));
    });
  };

  setOpen(cards.find((card) => card.hasAttribute("data-open")) || cards[0], true);
  cards.forEach((card) => {
    toggleOf(card).addEventListener("click", () => setOpen(card, !card.classList.contains("is-open")));
    // a closed card opens from anywhere on it (the button stays the keyboard route)
    card.addEventListener("click", (e) => {
      if (card.classList.contains("is-open") || e.target.closest("a, button")) return;
      setOpen(card, true);
    });
  });
  section.classList.add("is-ready");

  // hero links (translate · organize · sustain) and #lead-* URLs open their card
  const openFromHash = () => {
    const card = cards.find((c) => `#${c.id}` === window.location.hash);
    if (card) setOpen(card, true);
  };
  document.querySelectorAll("[data-habit-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const card = cards.find((c) => c.dataset.habit === link.dataset.habitLink);
      if (card) setOpen(card, true);
    });
  });
  window.addEventListener("hashchange", openFromHash);
  openFromHash();

  // "Trace it on the map" — hand the thread to the map (section 1). The buttons
  // ship hidden so they never show up without the script that runs them.
  const map = document.querySelector("[data-impact-map]");
  section.querySelectorAll("[data-trace]").forEach((button) => {
    if (!map) return;
    button.hidden = false;
    button.addEventListener("click", () => {
      map.dispatchEvent(new CustomEvent("impact:thread", { detail: button.dataset.trace }));
    });
  });
})();
