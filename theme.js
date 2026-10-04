// Apply the theme before styles and page content load.
(function () {
  let storedTheme;
  try { storedTheme = localStorage.getItem("portfolio-theme"); } catch (_) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = ["light", "dark"].includes(storedTheme)
    ? storedTheme
    : (prefersDark ? "dark" : "light");
})();
