"use strict";

(function () {
  const config = {
    version: "1.3.1",
    telegramUrl: "https://t.me/chikikto",
    sourceUrl: "https://github.com/chikirao/video_glitcher"
  };

  window.GLITCHY_SITE = config;

  function syncSiteMeta() {
    document.querySelectorAll("[data-site-version]").forEach(function (node) {
      node.textContent = "v" + config.version;
    });

    document.querySelectorAll("[data-site-link]").forEach(function (node) {
      const linkType = node.getAttribute("data-site-link");
      if (linkType === "telegram") {
        node.setAttribute("href", config.telegramUrl);
      }
      if (linkType === "source") {
        node.setAttribute("href", config.sourceUrl);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncSiteMeta, { once: true });
  } else {
    syncSiteMeta();
  }
})();
