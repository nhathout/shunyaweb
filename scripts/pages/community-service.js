// Community & Service — campus-circle tags that open into a readable text box.
// A tag opens while it is hovered (mouse) or keyboard-focused, and can be
// pinned open with a click or tap. Enter / Space / tap toggle it; Escape
// closes it; tapping anywhere else closes a pinned tag. aria-expanded on each
// tag's button always mirrors what is on screen.
(() => {
  const list = document.querySelector("[data-tags]");
  if (!list) return;

  const tags = Array.from(list.querySelectorAll("[data-tag]")).map((el) => ({
    el,
    button: el.querySelector(".tag-trigger"),
    hovered: false,
    focused: false,
    pinned: false,
    dismissed: false,
  }));
  if (!tags.length) return;

  let lastPointer = "mouse";

  const isOpen = (tag) => !tag.dismissed && (tag.hovered || tag.focused || tag.pinned);

  const render = () => {
    tags.forEach((tag) => {
      const open = isOpen(tag);
      tag.el.classList.toggle("is-open", open);
      // only a pinned panel takes pointer input (see community-service.css)
      tag.el.classList.toggle("is-pinned", open && tag.pinned);
      tag.button.setAttribute("aria-expanded", String(open));
    });
  };

  // only one tag at a time: opening one releases every other pinned tag
  const releaseOthers = (keep) => {
    tags.forEach((tag) => {
      if (tag !== keep) {
        tag.pinned = false;
        tag.dismissed = false;
      }
    });
  };

  tags.forEach((tag) => {
    tag.el.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      tag.hovered = true;
      releaseOthers(tag);
      render();
    });

    tag.el.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      tag.hovered = false;
      tag.dismissed = false;
      render();
    });

    tag.el.addEventListener("pointerdown", (e) => {
      lastPointer = e.pointerType || "mouse";
    });

    // keyboard focus opens the tag; a mouse or touch focus does not
    tag.button.addEventListener("focus", () => {
      tag.focused = tag.button.matches(":focus-visible");
      if (tag.focused) releaseOthers(tag);
      render();
    });

    tag.el.addEventListener("focusout", (e) => {
      if (tag.el.contains(e.relatedTarget)) return;
      tag.focused = false;
      tag.dismissed = false;
      // tabbing to another control releases a pin; a click on the open panel
      // itself (relatedTarget null) is handled by the click toggle below
      if (e.relatedTarget) tag.pinned = false;
      render();
    });

    // the open panel covers the button, so listen on the whole tag
    tag.el.addEventListener("click", (e) => {
      const fromKeyboard = e.detail === 0;
      if (!fromKeyboard && lastPointer === "mouse") {
        // mouse: hovering already shows it, a click keeps it open after leaving
        tag.pinned = !tag.pinned;
        tag.dismissed = false;
      } else if (isOpen(tag)) {
        // keyboard / touch: a true open ↔ closed toggle
        tag.pinned = false;
        tag.dismissed = true;
      } else {
        tag.pinned = true;
        tag.dismissed = false;
      }
      if (isOpen(tag)) releaseOthers(tag);
      render();
    });
  });

  // Escape closes whichever tag is open
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    let closed = false;
    tags.forEach((tag) => {
      if (isOpen(tag)) {
        tag.pinned = false;
        tag.dismissed = true;
        closed = true;
      }
    });
    if (closed) render();
  });

  // tapping or clicking outside the tags releases a pinned tag
  document.addEventListener("pointerdown", (e) => {
    if (list.contains(e.target)) return;
    let changed = false;
    tags.forEach((tag) => {
      if (tag.pinned) {
        tag.pinned = false;
        changed = true;
      }
    });
    if (changed) render();
  });

  list.setAttribute("data-ready", "");
  render();
})();
