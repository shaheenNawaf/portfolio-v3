import { ready } from "./ready";

const initCardImages = () => {
  document.querySelectorAll<HTMLImageElement>("img[data-fade]").forEach((img) => {
    const frame = img.closest(".card-media");
    if (!frame) return;
    const done = () => frame.classList.add("is-loaded");
    if (img.complete && img.naturalWidth > 0) {
      done();
    } else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });
};

ready(initCardImages);
