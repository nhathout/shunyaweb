// ───────── My Story — journey timeline (2019 → 2027) ─────────
// WAI-ARIA tabs: each year on the track is a role="tab" button and owns one
// role="tabpanel". Click a year, use ←/→ (Home/End) while a year is focused,
// or the prev/next buttons to step through. The year marked data-now opens
// first. Without JavaScript every panel simply stays visible.
(() => {
  const journey = document.querySelector("[data-journey]");
  if (!journey) return;

  const track = journey.querySelector('[role="tablist"]');
  const tabs = Array.from(journey.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  if (!track || !tabs.length || panels.some((panel) => !panel)) return;

  const prevButton = journey.querySelector("[data-journey-prev]");
  const nextButton = journey.querySelector("[data-journey-next]");
  const counter = journey.querySelector("[data-journey-count]");
  const total = tabs.length;
  const pad = (n) => String(n).padStart(2, "0");
  journey.style.setProperty("--journey-count", total);

  // stagger index for the entry fade-in (see .journey-entry in my-story.css)
  panels.forEach((panel) => {
    panel.querySelectorAll(".journey-entry").forEach((entry, i) => entry.style.setProperty("--i", i));
  });

  const setStep = (button, tab) => {
    if (!button) return;
    button.disabled = !tab;
    const label = button.querySelector("[data-journey-label]");
    if (label) label.textContent = tab ? tab.dataset.year : "";
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
      journey.style.setProperty("--journey-progress", total > 1 ? next / (total - 1) : 1);
      setStep(prevButton, tabs[next - 1]);
      setStep(nextButton, tabs[next + 1]);
      if (counter) counter.textContent = `${pad(next + 1)} / ${pad(total)}`;
    }
    if (focus) tabs[next].focus();
  };

  tabs.forEach((tab, i) => tab.addEventListener("click", () => select(i)));

  track.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    let target = null;
    if (e.key === "ArrowRight") target = (i + 1) % total;
    else if (e.key === "ArrowLeft") target = (i - 1 + total) % total;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = total - 1;
    if (target === null) return;
    e.preventDefault();
    select(target, { focus: true });
  });

  // Keep focus on a step button while it is still usable; once the end of
  // the track disables it, hand focus to the selected year instead.
  const step = (delta, button) => {
    select(current + delta);
    if (button && button.disabled) tabs[current].focus();
  };
  if (prevButton) prevButton.addEventListener("click", () => step(-1, prevButton));
  if (nextButton) nextButton.addEventListener("click", () => step(1, nextButton));

  // Deep links such as my-story.html#journey-2024 open that year.
  const fromHash = () => panels.findIndex((panel) => `#${panel.id}` === window.location.hash);
  window.addEventListener("hashchange", () => {
    const i = fromHash();
    if (i !== -1) select(i);
  });

  const nowIndex = tabs.findIndex((tab) => tab.hasAttribute("data-now"));
  const hashIndex = fromHash();
  select(hashIndex !== -1 ? hashIndex : nowIndex !== -1 ? nowIndex : 0);
  journey.classList.add("is-ready");
})();
