import { ready } from "./ready";

const initCardImages = () => {
  document.querySelectorAll<HTMLImageElement>("img[data-fade]").forEach((img) => {
    const frame = img.closest(".card-media");
    if (!frame) return;
    const done = () => frame.classList.add("is-loaded");
    // `complete` is also true for images that already failed; either way stop the skeleton.
    if (img.complete) {
      done();
    } else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });
};

ready(initCardImages);
