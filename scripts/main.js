// ───────── chapters: one list drives the contents menu + prev/next strip ─────────
// To add, rename, or reorder a chapter, edit this list (and the cover links
// in index.html). Each page declares itself with <body data-chapter="slug">.
const CHAPTERS = [
  { slug: "my-story", title: "My Story", script: "a beginning" },
  { slug: "ai-governance", title: "AI & Governance", script: "responsible by design" },
  { slug: "strategy-brand", title: "Strategy & Brand", script: "a visual diary" },
  { slug: "leadership-impact", title: "Leadership & Impact", script: "in action" },
  { slug: "community-service", title: "Community & Service", script: "a circle widens" },
  { slug: "law-advocacy", title: "Law & Advocacy", script: "briefs in progress" },
  { slug: "next-chapter", title: "The Next Chapter", script: "what comes next" },
];
const CHAPTER_WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

(() => {
  const current = document.body.dataset.chapter;
  if (!current || document.body.classList.contains("landing")) return;
  const index = CHAPTERS.findIndex((c) => c.slug === current);
  if (index === -1) return;

  const escape = (text) =>
    text.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
  const href = (chapter) => `${chapter.slug}.html`;

  // prev / cover / next strip
  const nav = document.querySelector(".chapter-nav");
  if (nav && !nav.children.length) {
    const prev = CHAPTERS[index - 1];
    const next = CHAPTERS[(index + 1) % CHAPTERS.length];
    const nextLabel = index === CHAPTERS.length - 1 ? "Back to Chapter One" : `Chapter ${CHAPTER_WORDS[index + 1]}`;
    nav.innerHTML = `
      ${prev
        ? `<a href="${href(prev)}" class="chapter-nav-prev" aria-label="Previous chapter: ${escape(prev.title)}">
             <small>← Chapter ${CHAPTER_WORDS[index - 1]}</small><span>${escape(prev.title)}</span></a>`
        : `<span class="chapter-nav-prev chapter-nav-empty" aria-hidden="true"></span>`}
      <a href="../index.html" class="chapter-nav-home" aria-label="Back to cover">cover</a>
      <a href="${href(next)}" class="chapter-nav-next" aria-label="Next: ${escape(next.title)}">
        <small>${nextLabel} →</small><span>${escape(next.title)}</span></a>`;
  }

  // "contents" menu in the masthead
  const masthead = document.querySelector(".page-masthead");
  if (!masthead) return;
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "contents-toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "contents-panel");
  toggle.innerHTML = `<span class="contents-toggle-lines" aria-hidden="true"></span><span>contents</span>`;
  const vol = masthead.querySelector(".page-vol");
  masthead.insertBefore(toggle, vol || null);

  const panel = document.createElement("div");
  panel.className = "contents-panel";
  panel.id = "contents-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="contents-sheet" role="dialog" aria-modal="true" aria-label="Contents">
      <div class="contents-head">
        <span class="micro-label">In this issue</span>
        <button type="button" class="contents-close">close <span aria-hidden="true">×</span></button>
      </div>
      <ol class="contents-list">
        ${CHAPTERS.map((c, i) => `
          <li><a href="${href(c)}"${i === index ? ' aria-current="page"' : ""}>
            <span class="contents-num">${String(i + 1).padStart(2, "0")}</span>
            <span class="contents-title">${escape(c.title)}</span>
            <span class="contents-script">${escape(c.script)}</span>
          </a></li>`).join("")}
      </ol>
      <div class="contents-foot">
        <a href="../index.html">← the cover</a>
        <a href="../assets/resume/resume.pdf" download="Alexandra-Petrovicheva-Resume.pdf">download résumé ↓</a>
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
    window.setTimeout(() => { if (!panel.classList.contains("is-open")) panel.hidden = true; }, 380);
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
  if (document.body.classList.contains("landing")) return;
  const prev = document.querySelector("a.chapter-nav-prev");
  const next = document.querySelector("a.chapter-nav-next");
  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.target && e.target.closest && e.target.closest('[role="tablist"], [data-arrow-keys]')) return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    if (document.documentElement.classList.contains("contents-locked")) return;
    if (e.key === "ArrowLeft" && prev) {
      window.location.href = prev.getAttribute("href");
    } else if (e.key === "ArrowRight" && next) {
      window.location.href = next.getAttribute("href");
    }
  });
})();

// Reveal-on-load animations for the cover and section pages.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const targets = document.querySelectorAll(
    ".reveal-drop, .reveal-rise, .reveal-slide-left, .reveal-slide-right, .reveal-fade, .pagelink, .resume-link, [data-reveal]"
  );

  const playReveal = (el) => {
    const delay = parseInt(el.dataset.delay || "0", 10);
    if (reduceMotion) {
      el.classList.add("is-in");
      return;
    }
    window.setTimeout(() => el.classList.add("is-in"), delay);
  };

  // On the landing cover, fire all reveals on load (the page never scrolls).
  // On sub-pages, reveal each element when it enters the viewport so scroll
  // surfaces feel alive instead of pre-loaded.
  const isLanding = document.body.classList.contains("landing");

  if (isLanding || !("IntersectionObserver" in window) || reduceMotion) {
    let didTrigger = false;
    const runOnce = () => {
      if (didTrigger) return;
      didTrigger = true;
      requestAnimationFrame(() => targets.forEach(playReveal));
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runOnce, { once: true });
    } else {
      runOnce();
    }
    window.addEventListener("load", runOnce, { once: true });
    window.setTimeout(runOnce, 800);
  } else {
    // Sub-pages: scroll-driven reveals. Hero stuff above the fold still
    // animates immediately because it's already intersecting.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          playReveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    // Safety net — if anything is still hidden after 1.6s (e.g. tall containers),
    // reveal it so nothing stays invisible.
    window.setTimeout(() => {
      targets.forEach((el) => {
        if (!el.classList.contains("is-in")) el.classList.add("is-in");
      });
    }, 1600);
  }
})();

// Missing photos fall back to a labelled template slot (see .img-slot in
// base.css) so the page stays polished while final images are collected.
(() => {
  const handleMissing = (img) => {
    img.classList.add("is-missing");
    const shell = img.closest(".img-slot, .insta-tile, .portrait, .node-logo");
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

// Subtle pointer tilt for the interactive page objects.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduceMotion || !canHover) return;

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--ry", `${(x - 0.5) * 5.5}deg`);
      card.style.setProperty("--rx", `${(0.5 - y) * 4.5}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
})();

// Scroll-progress ribbon at the top of every sub-page.
(() => {
  if (document.body.classList.contains("landing")) return;
  const ribbon = document.createElement("div");
  ribbon.className = "scroll-ribbon";
  ribbon.setAttribute("aria-hidden", "true");
  document.body.appendChild(ribbon);

  let pending = false;
  const update = () => {
    pending = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    ribbon.style.setProperty("--scroll-progress", `${pct}%`);
  };

  window.addEventListener(
    "scroll",
    () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();
})();

// Click-to-flip cards (chart-card, mood-card, community-card, writing-card).
(() => {
  const flipCards = document.querySelectorAll(".flip-card");
  if (!flipCards.length) return;

  flipCards.forEach((card) => {
    if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");

    const toggle = () => {
      const next = !card.classList.contains("is-flipped");
      card.classList.toggle("is-flipped", next);
      card.setAttribute("aria-pressed", String(next));
    };

    card.addEventListener("click", (e) => {
      if (e.target.closest("a, button, summary, input, label")) return;
      toggle();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });
})();

