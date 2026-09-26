// ───────── The Next Chapter — the roadmap, the intersection, correspondence ─────────
// Turning a cohort card over lives in main.js (every .flip-card). This file adds:
//   1. the roadmap — WAI-ARIA tabs. Each stop on the track is a role="tab" that owns
//      one role="tabpanel". Click a stop, use ←/→ (and ↑/↓ while the track runs
//      vertically on phones) or Home/End on a focused stop, or the prev/next buttons
//      under the panel. The progress line grows to the chosen stop
//      (--roadmap-progress, 0 → 1). Links to #stop-mba, #stop-consulting, #stop-law
//      or #stop-practice — the hero's "MBA · consulting · law" line, or a URL from
//      another page — open that stop;
//   2. the intersection — the centre and the five petals are tabs too: choosing a
//      petal lifts it, dims the other four and shows what she brings to that field;
//   3. correspondence — a small "copy" button beside the email address.
// Without JavaScript every panel stays visible and the step controls stay hidden.

// 1 · The roadmap
(() => {
  const roadmap = document.querySelector("[data-roadmap]");
  if (!roadmap) return;

  const track = roadmap.querySelector('[role="tablist"]');
  const tabs = Array.from(roadmap.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  if (!track || !tabs.length || panels.some((panel) => !panel)) return;

  const panelsBox = panels[0].parentElement;
  const controls = roadmap.querySelector(".roadmap-controls");
  const prevButton = roadmap.querySelector("[data-roadmap-prev]");
  const nextButton = roadmap.querySelector("[data-roadmap-next]");
  const counter = roadmap.querySelector("[data-roadmap-count]");
  const status = roadmap.querySelector("[data-roadmap-status]");
  const total = tabs.length;
  const pad = (n) => String(n).padStart(2, "0");
  const nameOf = (tab) => (tab.querySelector(".stop-name") || tab).textContent.trim();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const vertical = window.matchMedia("(max-width: 720px)"); // matches next-chapter.css
  const behavior = () => (reduceMotion.matches ? "auto" : "smooth");

  const setStep = (button, tab) => {
    if (!button) return;
    button.disabled = !tab;
    const label = button.querySelector("[data-step-label]");
    if (label) label.textContent = tab ? nameOf(tab) : "";
  };

  let current = -1;
  const select = (index, { focus = false } = {}) => {
    const next = Math.max(0, Math.min(total - 1, index));
    if (next !== current) {
      current = next;
      tabs.forEach((tab, i) => {
        const on = i === next;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        tab.classList.toggle("is-active", on);
        tab.classList.toggle("is-past", i < next);
        panels[i].hidden = !on;
      });
      roadmap.style.setProperty("--roadmap-progress", total > 1 ? (next / (total - 1)).toFixed(4) : "1");
      setStep(prevButton, tabs[next - 1]);
      setStep(nextButton, tabs[next + 1]);
      if (counter) counter.textContent = `${pad(next + 1)} / ${pad(total)}`;
    }
    // only the prev / next buttons fill the live region (see step); any other
    // selection clears it, so the next announcement always reads as a change
    if (status) status.textContent = "";
    if (focus) tabs[next].focus();
  };

  tabs.forEach((tab, i) => tab.addEventListener("click", () => select(i)));

  // ←/→ always; ↑/↓ too while the track is vertical. The track is a tablist, so
  // the chapter-to-chapter arrow keys in main.js leave these presses alone.
  track.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    const down = vertical.matches && e.key === "ArrowDown";
    const up = vertical.matches && e.key === "ArrowUp";
    let target = null;
    if (e.key === "ArrowRight" || down) target = (i + 1) % total;
    else if (e.key === "ArrowLeft" || up) target = (i - 1 + total) % total;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = total - 1;
    if (target === null) return;
    e.preventDefault();
    select(target, { focus: true });
  });

  const syncOrientation = () =>
    track.setAttribute("aria-orientation", vertical.matches ? "vertical" : "horizontal");
  syncOrientation();
  if (vertical.addEventListener) vertical.addEventListener("change", syncOrientation);

  // prev / next under the panel. Focus stays on the button while it is usable, and a
  // polite live region names the stop it opened; once the end of the road disables
  // the button, focus moves to the chosen stop instead (which announces itself). If
  // the new panel's top has scrolled out of view, it is brought back.
  const step = (delta, button) => {
    select(current + delta);
    if (button && button.disabled) tabs[current].focus({ preventScroll: true });
    else if (status) status.textContent = `${nameOf(tabs[current])}, stop ${current + 1} of ${total}`;
    const top = panelsBox.getBoundingClientRect().top;
    if (top < 0) window.scrollBy({ top: top - 20, behavior: behavior() });
  };
  if (prevButton) prevButton.addEventListener("click", () => step(-1, prevButton));
  if (nextButton) nextButton.addEventListener("click", () => step(1, nextButton));
  // ←/→ on the step buttons walk the stops too (data-arrow-keys keeps main.js out)
  if (controls) {
    controls.setAttribute("data-arrow-keys", "");
    controls.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const button = e.key === "ArrowLeft" ? prevButton : e.key === "ArrowRight" ? nextButton : null;
      if (!button || button.disabled) return;
      e.preventDefault();
      button.click();
    });
  }

  // Deep links. Every panel's scroll-margin (--stop-anchor) reaches back to the top
  // of the roadmap (to the track on phones), so #stop-law lands on the whole
  // roadmap with that stop chosen, not halfway down a panel.
  const measure = () => {
    const from = vertical.matches ? track : roadmap;
    const offset = panelsBox.getBoundingClientRect().top - from.getBoundingClientRect().top;
    roadmap.style.setProperty("--stop-anchor", `${Math.max(0, Math.round(offset)) + 16}px`);
  };
  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      measure();
    });
  };
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(roadmap);
  window.addEventListener("resize", schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);

  const indexOfHash = (hash) => panels.findIndex((panel) => `#${panel.id}` === hash);
  const open = (index) => {
    select(index);
    measure();
    panels[index].scrollIntoView({ behavior: behavior(), block: "start" });
    tabs[index].focus({ preventScroll: true });
  };

  // in-page links to a stop open it and bring the roadmap into view
  document.querySelectorAll('a[href^="#stop-"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const hash = link.getAttribute("href");
      const index = indexOfHash(hash);
      if (index === -1) return;
      e.preventDefault();
      if (window.location.hash !== hash) history.pushState(null, "", hash);
      open(index);
    });
  });
  window.addEventListener("hashchange", () => {
    const index = indexOfHash(window.location.hash);
    if (index !== -1) open(index);
  });

  const fromHash = indexOfHash(window.location.hash);
  const initial = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
  select(fromHash !== -1 ? fromHash : Math.max(0, initial));
  roadmap.classList.add("is-ready");
  measure();
})();

// 2 · The intersection
(() => {
  const section = document.querySelector("[data-intersection]");
  if (!section) return;

  const flower = section.querySelector('[role="tablist"]');
  const tabs = Array.from(section.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  if (!flower || !tabs.length || panels.some((panel) => !panel)) return;

  const petals = tabs.filter((tab) => tab.dataset.field);
  const total = tabs.length;

  let current = -1;
  const select = (index, { focus = false } = {}) => {
    const next = (index + total) % total;
    if (next !== current) {
      current = next;
      const chosen = tabs[next];
      tabs.forEach((tab, i) => {
        const on = i === next;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      // a chosen petal dims the other four; the centre leaves all five lit
      const field = chosen.dataset.field || "";
      petals.forEach((petal) => petal.classList.toggle("is-dim", Boolean(field) && petal !== chosen));
      if (field) section.dataset.active = field;
      else delete section.dataset.active;
    }
    if (focus) tabs[next].focus();
  };

  // The petals overlap, so the button on top is not always the one under the
  // pointer's petal. A pointer click (or hover) goes to the petal whose centre is
  // nearest — that splits each overlap along the line through its two tips, and a
  // label always belongs to its own petal. Keyboard clicks (detail 0) and the
  // centre disc keep their own button. When the pointer focused the button on top
  // but chose a different petal, focus follows the chosen one, so the arrow keys
  // carry on from the petal that is actually selected.
  const petalAt = (x, y) => {
    const box = flower.getBoundingClientRect();
    let best = null;
    let bestDistance = Infinity;
    petals.forEach((petal) => {
      // offset* ignores the chosen petal's scale, so the geometry stays stable
      const radius = petal.offsetWidth / 2;
      const distance = Math.hypot(
        x - (box.left + petal.offsetLeft + radius),
        y - (box.top + petal.offsetTop + radius)
      );
      if (distance <= radius && distance < bestDistance) {
        best = petal;
        bestDistance = distance;
      }
    });
    return best;
  };

  flower.addEventListener("click", (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    const target = e.detail === 0 || !tab.dataset.field ? tab : petalAt(e.clientX, e.clientY) || tab;
    select(tabs.indexOf(target));
    if (target !== tab && document.activeElement === tab) target.focus({ preventScroll: true });
  });

  const setHover = (petal) => petals.forEach((p) => p.classList.toggle("is-hover", p === petal));
  flower.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    setHover(e.target.closest(".petal") ? petalAt(e.clientX, e.clientY) : null);
  });
  flower.addEventListener("pointerleave", () => setHover(null));

  // the petals sit in a ring, so all four arrows walk it: → / ↓ clockwise,
  // ← / ↑ back; Home is the centre, End the last petal
  flower.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    let target = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") target = i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") target = i - 1;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = total - 1;
    if (target === null) return;
    e.preventDefault();
    select(target, { focus: true });
  });

  const initial = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
  select(Math.max(0, initial));
  section.classList.add("is-ready");
})();

// 3 · Correspondence — copy the email address (only where the clipboard is available)
(() => {
  const button = document.querySelector("[data-copy]");
  if (!button || !navigator.clipboard || !window.isSecureContext) return;

  const status = document.querySelector("[data-copy-status]");
  let timer = 0;
  const say = (text) => {
    if (!status) return;
    status.textContent = text;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      status.textContent = "";
    }, 2600);
  };

  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      say("copied");
    } catch (err) {
      say("select the address to copy it");
    }
  });
})();
