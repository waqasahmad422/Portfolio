/* Apply the saved theme before first paint (prevents a light/dark flash).
   Loaded synchronously in <head> on purpose - do not add "defer". */
(function () {
  try {
    var d = document.documentElement;
    var theme = localStorage.getItem("theme");
    var skin = localStorage.getItem("skin");
    if (!theme)
      theme = matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    d.dataset.theme = theme;
    if (skin) d.dataset.skin = skin;
  } catch (e) {}
})();
