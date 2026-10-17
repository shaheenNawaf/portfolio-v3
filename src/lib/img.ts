/**
 * Resized/re-encoded image URLs via the Netlify Image CDN.
 *
 * Content images are raw uploads in /public (often multi-MB PNGs, and the CMS
 * keeps adding them), so instead of a build pipeline we let Netlify transform
 * them on request. Only applies to site-relative paths on Netlify builds;
 * local dev/preview and remote URLs get the original path untouched.
 */
const onNetlify = process.env.NETLIFY === "true";

const transformable = (src: string) => onNetlify && src.startsWith("/") && !src.startsWith("//");

export const cdn = (src: string, width: number): string =>
  transformable(src)
    ? `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp&q=75`
    : src;

/** `srcset` for the given widths, or undefined when the CDN isn't in play. */
export const cdnSrcset = (src: string, widths: readonly number[]): string | undefined =>
  transformable(src) ? widths.map((w) => `${cdn(src, w)} ${w}w`).join(", ") : undefined;
