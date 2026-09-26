// ───────── chapters: one list drives the chapter strip, contents menu and prev/next ─────────
// To add, rename, or reorder a chapter, edit this list (and the cover links
// in index.html). Each page declares itself with <body data-chapter="slug">.
// icon = a symbol id in assets/icons.svg; dek = the chapter's one-line description.
const CHAPTERS = [
  { slug: "my-story", title: "My Story", icon: "i-book-open", dek: "From Los Angeles to Boston, and a dual degree at Northeastern" },
  { slug: "ai-governance", title: "AI & Governance", icon: "i-shield-check", dek: "Governing AI in high-stakes financial operations" },
  { slug: "strategy-brand", title: "Strategy & Brand", icon: "i-target", dek: "Audience research, positioning and go-to-market strategy" },
  { slug: "leadership-impact", title: "Leadership & Impact", icon: "i-users", dek: "Leading media, communications and peer-learning teams" },
  { slug: "community-service", title: "Community & Service", icon: "i-hand-heart", dek: "Service and community work in Los Angeles and Boston" },
  { slug: "law-advocacy", title: "Law & Advocacy", icon: "i-scale", dek: "Legal research, policy writing and a pre-law internship" },
  { slug: "next-chapter", title: "The Next Chapter", icon: "i-compass", dek: "An MBA in AI and technology, and the path beyond it" },
];

// Shared helpers, exposed as one global (SITE) so page scripts can reuse them
// and no other top-level names can collide: SITE.icon("i-shield") returns the
// <svg><use> markup for a sprite icon with the right relative path.
const SITE = (() => {
  const isCover = document.body.classList.contains("landing");
  const sprite = isCover ? "assets/icons.svg" : "../assets/icons.svg";
  return Object.freeze({
    isCover,
    pad2: (n) => String(n).padStart(2, "0"),
    escapeHtml: (text) =>
      text.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]),
    icon: (id) => `<svg class="icon" aria-hidden="true" focusable="false"><use href="${sprite}#${id}"></use></svg>`,
  });
})();

// ───────── chapter pages: chapter strip, prev / next pager, contents menu ─────────
(() => {
  const { isCover, pad2, escapeHtml, icon } = SITE;
  const current = document.body.dataset.chapter;
  if (!current || isCover) return;
  const index = CHAPTERS.findIndex((c) => c.slug === current);
  if (index === -1) return;
  const href = (chapter) => `${chapter.slug}.html`;

  // desktop chapter strip under the masthead: <nav class="wrap chapter-strip">
  const strip = document.querySelector(".chapter-strip");
  if (strip && !strip.children.length) {
    strip.innerHTML = `<ol class="chapter-strip-list">
      ${CHAPTERS.map((c, i) => `
        <li><a class="chapter-strip-link" href="${href(c)}"${i === index ? ' aria-current="page"' : ""}>
          <span class="chapter-strip-num">${pad2(i + 1)}</span>${escapeHtml(c.title)}</a></li>`).join("")}
    </ol>`;
  }

  // prev / cover / next pager: <nav class="wrap pager" aria-label="Chapter navigation">
  const pager = document.querySelector(".pager");
  if (pager && !pager.children.length) {
    const prev = CHAPTERS[index - 1];
    const nextIndex = (index + 1) % CHAPTERS.length;
    const next = CHAPTERS[nextIndex];
    const link = (chapter, i, dir) => `
      <a class="pager-link pager-${dir}" href="${href(chapter)}" rel="${dir}">
        <span class="pager-label label">${dir === "prev" ? icon("i-arrow-left") + "Previous" : "Next"} &middot; Chapter ${pad2(i + 1)}${dir === "next" ? icon("i-arrow-right") : ""}</span>
        <span class="pager-row">
          <span class="medallion medallion-sm" aria-hidden="true">${icon(chapter.icon)}</span>
          <span class="pager-title">${escapeHtml(chapter.title)}</span>
        </span>
        <span class="pager-dek">${escapeHtml(chapter.dek)}</span>
      </a>`;
    pager.innerHTML = `
      ${prev ? link(prev, index - 1, "prev") : `<span class="pager-empty" aria-hidden="true"></span>`}
      <a class="pager-home" href="../index.html">
        <span class="monogram" aria-hidden="true"><span>AP</span></span>
        <span class="label label-ink">Cover</span>
      </a>
      ${link(next, nextIndex, "next")}`;
  }

  // Contents menu: the static <button class="contents-toggle"> in the masthead opens it
  const toggle = document.querySelector(".contents-toggle");
  if (!toggle) return;

  const panel = document.createElement("div");
  panel.className = "contents-panel";
  panel.id = "contents-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="contents-sheet" role="dialog" aria-modal="true" aria-labelledby="contents-heading">
      <div class="contents-head">
        <h2 class="label label-ink" id="contents-heading">Contents</h2>
        <button type="button" class="contents-close" aria-label="Close contents">${icon("i-close")}</button>
      </div>
      <ol class="contents-list">
        <li><a href="../index.html">
          <span class="contents-num">00</span>
          <span class="contents-title">Cover</span>
          ${icon("i-home")}
        </a></li>
        ${CHAPTERS.map((c, i) => `
          <li><a href="${href(c)}"${i === index ? ' aria-current="page"' : ""}>
            <span class="contents-num">${pad2(i + 1)}</span>
            <span class="contents-title">${escapeHtml(c.title)}</span>
            ${icon(c.icon)}
            <span class="contents-dek">${escapeHtml(c.dek)}</span>
          </a></li>`).join("")}
      </ol>
      <div class="contents-foot">
        <a class="btn btn-primary btn-sm" href="../assets/resume/resume.pdf" download="Alexandra-Petrovicheva-Resume.pdf">${icon("i-download")}Download r&eacute;sum&eacute;</a>
        <a class="btn btn-secondary btn-sm" href="mailto:alexpetrovicheva@gmail.com">${icon("i-mail")}Email</a>
        <a class="btn btn-secondary btn-sm" href="https://www.linkedin.com/in/alex-petrovicheva" target="_blank" rel="noopener">${icon("i-linkedin")}LinkedIn</a>
      </div>
    </div>`;
  document.body.appendChild(panel);

  let lastFocus = null;
  const open = () => {
    lastFocus = document.activeElement;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("is-open"));
    toggle.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("contents-locked");
    const currentLink = panel.querySelector('[aria-current="page"]') || panel.querySelector("a");
    currentLink && currentLink.focus({ preventScroll: true });
  };
  const close = () => {
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("contents-locked");
    window.setTimeout(() => { if (!panel.classList.contains("is-open")) panel.hidden = true; }, 220);
    (lastFocus || toggle).focus({ preventScroll: true });
  };
  toggle.addEventListener("click", () => (panel.hidden ? open() : close()));
  panel.querySelector(".contents-close").addEventListener("click", close);
  panel.addEventListener("click", (e) => { if (e.target === panel) close(); });
  document.addEventListener("keydown", (e) => {
    if (panel.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "Tab") {
      // keep focus inside the open sheet
      const focusables = panel.querySelectorAll("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();

// Keyboard arrows (←/→) jump between adjacent chapter pages when present.
(() => {
  if (SITE.isCover) return;
  const prev = document.querySelector("a.pager-prev");
  const next = document.querySelector("a.pager-next");
  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.target && e.target.isContentEditable) return;
    if (e.target && e.target.closest && e.target.closest('[role="tablist"], [data-arrow-keys], .matrix-wrap')) return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    if (document.documentElement.classList.contains("contents-locked")) return;
    if (e.key === "ArrowLeft" && prev) {
      window.location.href = prev.getAttribute("href");
    } else if (e.key === "ArrowRight" && next) {
      window.location.href = next.getAttribute("href");
    }
  });
})();

// Reveals: a subtle fade + 12px rise as each element enters the viewport
// (see base.css section 5). Content is visible without JS; with reduced
// motion everything is shown at once.
(() => {
  const targets = document.querySelectorAll(
    ".reveal, .reveal-drop, .reveal-rise, .reveal-slide-left, .reveal-slide-right, .reveal-fade"
  );
  if (!targets.length) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const show = (el) => el.classList.add("is-in");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach(show);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || "0", 10);
        if (delay) window.setTimeout(() => show(entry.target), delay);
        else show(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
  // Safety net: anything still hidden after 2.5s (very tall blocks, print,
  // odd viewports) is shown so nothing stays invisible.
  window.setTimeout(() => targets.forEach(show), 2500);
})();

// Missing photos fall back to a labelled template slot (see .img-slot in
// base.css) so the page stays polished while final images are collected.
(() => {
  const handleMissing = (img) => {
    img.classList.add("is-missing");
    const shell = img.closest(".img-slot, .org-logo, [data-file]");
    if (shell) shell.classList.add("image-missing");
  };

  document.querySelectorAll("img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      handleMissing(img);
      return;
    }
    img.addEventListener("error", () => handleMissing(img), { once: true });
  });
})();

// Scroll-progress ribbon at the top of every chapter page (transform: scaleX only).
(() => {
  if (SITE.isCover) return;
  const ribbon = document.createElement("div");
  ribbon.className = "scroll-ribbon";
  ribbon.setAttribute("aria-hidden", "true");
  document.body.appendChild(ribbon);

  let pending = false;
  const update = () => {
    pending = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    ribbon.style.transform = `scaleX(${progress.toFixed(4)})`;
  };
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
})();
