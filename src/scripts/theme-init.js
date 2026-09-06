(() => {
  var root = document.documentElement;
  root.classList.add("js");

  var theme = "system";
  try {
    theme = localStorage.getItem("theme") || "system";
    localStorage.removeItem("track");
    localStorage.removeItem("rail");
  } catch (e) {}

  var dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
})();
