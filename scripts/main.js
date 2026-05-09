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

// Keep the cover polished while Sasha is still collecting final images.
(() => {
  const handleMissing = (img) => {
    img.classList.add("is-missing");
    const shell = img.closest(".insta-tile, .portrait, .node-logo");
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

// Count-up metrics once they enter the viewport.
(() => {
  const counters = document.querySelectorAll(".metric-value[data-count]");
  if (!counters.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const format = (value) => Math.round(value).toLocaleString("en-US");

  const animate = (el) => {
    if (el.dataset.counted === "true") return;
    el.dataset.counted = "true";

    const target = Number(el.dataset.count || "0");
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";

    if (reduceMotion) {
      el.textContent = `${prefix}${format(target)}${suffix}`;
      return;
    }

    const duration = target > 100000 ? 1500 : 1050;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${prefix}${format(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
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

// Keyboard arrows (←/→) jump between adjacent chapter pages when present.
(() => {
  if (document.body.classList.contains("landing")) return;
  const prev = document.querySelector(".chapter-nav-prev");
  const next = document.querySelector(".chapter-nav-next");
  document.addEventListener("keydown", (e) => {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowLeft" && prev) {
      window.location.href = prev.getAttribute("href");
    } else if (e.key === "ArrowRight" && next) {
      window.location.href = next.getAttribute("href");
    }
  });
})();
