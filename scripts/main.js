// Landing-page reveal-on-load animations.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const targets = document.querySelectorAll(
    ".reveal-drop, .reveal-rise, .reveal-slide-left, .reveal-slide-right, .reveal-fade, .pagelink, .resume-link, [data-reveal]"
  );

  const trigger = () => {
    targets.forEach((el) => {
      const delay = parseInt(el.dataset.delay || "0", 10);
      if (reduceMotion) {
        el.classList.add("is-in");
        return;
      }
      window.setTimeout(() => el.classList.add("is-in"), delay);
    });
  };

  if (document.readyState === "complete") {
    requestAnimationFrame(trigger);
  } else {
    window.addEventListener("load", () => requestAnimationFrame(trigger), { once: true });
  }
})();
