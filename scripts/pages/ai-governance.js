// ───────── AI & Governance — rotation legend + research lenses ─────────

// 1 · The rotation board. Hovering or focusing a team in the legend (or its
// slice of the donut) highlights that slice and names the team in the centre;
// clicking a team pins it (aria-pressed) until it is clicked again. The legend
// lives inside a flip card, so its keys keep Enter/Space to themselves and
// leave the tab order while the card shows its back.
(() => {
  const card = document.querySelector("[data-rotation]");
  if (!card) return;

  const keys = Array.from(card.querySelectorAll("[data-team-key]"));
  const slices = Array.from(card.querySelectorAll("[data-team-slice]"));
  let pinned = null;

  const show = (team) => {
    if (team) card.dataset.active = team;
    else delete card.dataset.active;
  };
  const rest = () => show(pinned);

  keys.forEach((key) => {
    const team = key.dataset.teamKey;
    key.addEventListener("pointerenter", () => show(team));
    key.addEventListener("pointerleave", rest);
    key.addEventListener("focus", () => show(team));
    key.addEventListener("blur", rest);
    key.addEventListener("click", () => {
      pinned = pinned === team ? null : team;
      keys.forEach((k) => k.setAttribute("aria-pressed", String(k.dataset.teamKey === pinned)));
      show(pinned || team);
    });
    // stop the card (main.js) from flipping when a legend key is activated
    key.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") e.stopPropagation();
    });
  });

  slices.forEach((slice) => {
    const team = slice.dataset.teamSlice;
    slice.addEventListener("pointerenter", () => show(team));
    slice.addEventListener("pointerleave", rest);
  });

  // keep the hidden face out of the tab order
  const syncFace = () => {
    const flipped = card.classList.contains("is-flipped");
    keys.forEach((key) => (key.tabIndex = flipped ? -1 : 0));
    if (flipped) rest();
  };
  new MutationObserver(syncFace).observe(card, { attributes: true, attributeFilter: ["class"] });
})();

// 2 · The research lenses — WAI-ARIA tabs. Click a lens, or use ←/→
// (Home/End) while one is focused. Without JavaScript every question simply
// stays visible under its own label.
(() => {
  const board = document.querySelector("[data-lenses]");
  if (!board) return;

  const list = board.querySelector('[role="tablist"]');
  const tabs = Array.from(board.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  if (!list || !tabs.length || panels.some((panel) => !panel)) return;

  const counter = board.querySelector("[data-lens-count]");
  const lensBoard = list.closest(".lens-board");
  const total = tabs.length;
  const pad = (n) => String(n).padStart(2, "0");

  let current = -1;
  const select = (index, { focus = false } = {}) => {
    const next = (index + total) % total;
    if (next !== current) {
      current = next;
      tabs.forEach((tab, i) => {
        const on = i === next;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (counter) counter.textContent = `${pad(next + 1)} / ${pad(total)}`;
    }
    if (focus) tabs[next].focus();
  };

  tabs.forEach((tab, i) => tab.addEventListener("click", () => select(i)));

  list.addEventListener("keydown", (e) => {
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
  select(initial === -1 ? 0 : initial);
  if (lensBoard) lensBoard.classList.add("is-ready");
})();
