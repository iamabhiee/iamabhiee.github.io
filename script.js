(function () {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".theme-toggle");

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    toggle.setAttribute("aria-checked", String(theme === "dark"));
  };
  setTheme(root.dataset.theme || "light");

  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try { localStorage.setItem("portfolio-theme", nextTheme); } catch (_) {}
  });

  // Keep app tiles useful if a third-party icon URL becomes unavailable.
  document.querySelectorAll(".app-icon img").forEach(image => {
    const showFallback = () => {
      const icon = image.parentElement;
      if (!icon) return;
      const name = image.closest(".app-card").querySelector("h3").textContent.trim();
      const initials = name.split(/\s+/).map(word => word[0]).slice(0, 2).join("").toUpperCase();
      icon.classList.remove("app-icon-image");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = initials;
    };
    image.addEventListener("error", showFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) showFallback();
  });

  const sections = Array.from(document.querySelectorAll(".nav-links a")).map(link => ({
    link,
    section: document.querySelector(link.getAttribute("href"))
  })).filter(item => item.section);

  const updateHeader = () => {
    header.dataset.elevated = window.scrollY > 10 ? "true" : "false";
    const threshold = header.getBoundingClientRect().bottom + 48;
    let active = null;
    for (const item of sections) {
      if (item.section.getBoundingClientRect().top <= threshold) active = item.link;
    }
    // The last section may be too short to reach the sticky header.
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= root.scrollHeight - 2) {
      active = sections[sections.length - 1]?.link;
    }
    for (const { link } of sections) {
      if (link === active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };

  let framePending = false;
  const scheduleUpdate = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(() => {
      framePending = false;
      updateHeader();
    });
  };
  updateHeader();
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);
  document.querySelector(".apps-disclosure")?.addEventListener("toggle", scheduleUpdate);
})();
