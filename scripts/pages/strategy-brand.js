// ───────── Strategy & Brand — the mood-board wall ─────────
// Flipping a single card lives in main.js (every .flip-card). This file adds:
//   1. filter chips (All / Strategy / Content & brand / Venture) — one chip is
//      pressed at a time (aria-pressed); cards whose data-tags don't match are
//      dimmed, never removed, so the wall keeps its shape;
//   2. a "read every card" button that turns the whole wall over at once and
//      stays in sync when cards are flipped one by one;
//   3. fit-to-copy heights — each card grows to fit its back text, so nothing is
//      clipped at any width (flip faces are absolutely positioned);
//   4. keyboard-safe links on card backs, for when a TEMPLATE link is enabled.
// Without JavaScript the toolbar stays hidden and the CSS heights apply.
(() => {
  const studio = document.querySelector("[data-studio]");
  if (!studio) return;

  const wall = studio.querySelector(".campaign-wall");
  const cards = wall ? Array.from(wall.querySelectorAll(".mood-card")) : [];
  if (!cards.length) return;

  const toolbar = studio.querySelector("[data-studio-toolbar]");
  const chips = toolbar ? Array.from(toolbar.querySelectorAll("[data-filter]")) : [];
  const status = studio.querySelector("[data-studio-status]");
  const flipAll = studio.querySelector("[data-flip-all]");
  const flipAllLabel = flipAll && flipAll.querySelector("[data-flip-all-label]");
  const total = cards.length;
  const tagsOf = (card) => (card.dataset.tags || "").split(/\s+/).filter(Boolean);

  // stagger index for the "read every card" cascade (see strategy-brand.css)
  cards.forEach((card, i) => card.style.setProperty("--i", i));

  // ── 1 · filter chips ──
  const labelOf = (chip) => chip.firstChild.textContent.trim();
  const matches = (card, filter) => filter === "all" || tagsOf(card).includes(filter);

  chips.forEach((chip) => {
    const count = chip.querySelector("[data-count]");
    if (count) count.textContent = cards.filter((card) => matches(card, chip.dataset.filter)).length;
  });

  const applyFilter = (filter) => {
    let shown = 0;
    cards.forEach((card) => {
      const on = matches(card, filter);
      card.classList.toggle("is-dimmed", !on);
      card.classList.toggle("is-match", on && filter !== "all");
      if (on) shown += 1;
    });
    chips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.filter === filter)));
    if (status) {
      const chip = chips.find((c) => c.dataset.filter === filter);
      const text =
        filter === "all" ? `All ${total} pieces` : `${shown} of ${total} pieces · ${chip ? labelOf(chip) : filter}`;
      // only touch the live region when the words change, so load stays silent
      if (status.textContent !== text) status.textContent = text;
    }
  };

  chips.forEach((chip) => chip.addEventListener("click", () => applyFilter(chip.dataset.filter)));

  // ←/→ (Home/End) move focus between chips; the group carries data-arrow-keys
  // so the global chapter navigation in main.js leaves these keys alone.
  if (toolbar) {
    toolbar.querySelector(".studio-filters").addEventListener("keydown", (e) => {
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
  }

  // ── 2 · read every card ──
  const allFlipped = () => cards.every((card) => card.classList.contains("is-flipped"));
  const syncFlipAll = () => {
    if (!flipAll) return;
    const flipped = allFlipped();
    flipAll.dataset.state = flipped ? "back" : "front";
    if (flipAllLabel) flipAllLabel.textContent = flipped ? "back to the photos" : "read every card";
  };

  let cascadeTimer = 0;
  if (flipAll) {
    flipAll.addEventListener("click", () => {
      const next = !allFlipped();
      window.clearTimeout(cascadeTimer);
      wall.classList.add("is-cascading");
      cards.forEach((card) => {
        card.classList.toggle("is-flipped", next);
        card.setAttribute("aria-pressed", String(next));
      });
      cascadeTimer = window.setTimeout(() => wall.classList.remove("is-cascading"), 700 + total * 70);
      syncFlipAll();
    });
  }

  // Links added to a card's back (see the TEMPLATE comments in the HTML) stay
  // out of the tab order while that face is hidden, and Enter/Space on them
  // follows the link instead of reaching main.js's card handler (which would
  // turn the card over and cancel the link).
  const syncLinks = () => {
    cards.forEach((card) => {
      const flipped = card.classList.contains("is-flipped");
      card.querySelectorAll(".flip-back a[href]").forEach((link) => (link.tabIndex = flipped ? 0 : -1));
    });
  };
  wall.addEventListener(
    "keydown",
    (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target.closest(".flip-back a[href]")) e.stopPropagation();
    },
    true
  );

  // main.js flips single cards and updates aria-pressed; follow along.
  new MutationObserver(() => {
    syncFlipAll();
    syncLinks();
  }).observe(wall, {
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-pressed"],
  });

  // ── 3 · fit-to-copy heights ──
  // --fit = the back copy's height plus the face's padding and border.
  const fit = () => {
    cards.forEach((card) => {
      const back = card.querySelector(".flip-back");
      const body = back && back.querySelector(".mood-back-body");
      if (!body) return;
      const cs = getComputedStyle(back);
      const chrome =
        parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) +
        parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
      card.style.setProperty("--fit", `${Math.ceil(body.offsetHeight + chrome)}px`);
    });
  };

  let lastWidth = 0;
  let pending = false;
  const refit = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      fit();
    });
  };
  if ("ResizeObserver" in window) {
    new ResizeObserver((entries) => {
      const width = Math.round(entries[0].contentRect.width);
      if (width === lastWidth) return;
      lastWidth = width;
      refit();
    }).observe(wall);
  } else {
    window.addEventListener("resize", refit);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
  window.addEventListener("load", refit, { once: true });
  fit();

  // ready: show the controls and set the starting state
  if (toolbar) toolbar.hidden = false;
  applyFilter("all");
  syncFlipAll();
  syncLinks();
  studio.classList.add("is-ready");
})();
