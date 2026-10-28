/* Only fixed build-time assets, never user-provided URLs. */
(function(root) {
  "use strict";
  const sizes = "(max-width: 700px) 86vw, (max-width: 1200px) 60vw, 600px";
  function attributes(id, deferred = false) {
    const image = root.AnderStudioImageData?.[id];
    if (!image) return "";
    const prefix = deferred ? "data-studio-" : "";
    const selectedSizes = id.startsWith("teacher-") ? "(max-width: 700px) 240px, 360px" : sizes;
    return `${prefix}src="${image.src}" ${prefix}srcset="${image.srcset}" sizes="${selectedSizes}" width="${image.width}" height="${image.height}"`;
  }
  function activate(container = document) {
    container.querySelectorAll("img[data-studio-src]").forEach(img => {
      if (img.closest("[hidden]")) return;
      if (img.dataset.studioSrcset) img.srcset = img.dataset.studioSrcset;
      img.src = img.dataset.studioSrc;
      delete img.dataset.studioSrc; delete img.dataset.studioSrcset;
    });
  }
  root.AnderStudioImages = Object.freeze({attributes, activate});
})(typeof window === "undefined" ? globalThis : window);
