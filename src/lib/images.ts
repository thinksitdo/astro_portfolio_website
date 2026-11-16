import type { ImageMetadata } from 'astro';
import { isTodo } from './content';

// Every image stored next to the content (src/content/**), so frontmatter can point at them with a
// relative path such as "./images/ngo-hero.jpg", the same way images in the Markdown body do.
// Images are published exactly as supplied (astro.config uses the pass-through image service):
// Scott exports them at the right size and compression, so nothing is resized or re-encoded.
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

export type ResolvedImage =
  | { src: string; width?: number; height?: number }
  | { missing: string };

/**
 * Turn a thumbnail or heroImage value into something an <img> can use.
 *   "TODO" or empty   → null (the page shows a placeholder)
 *   "./images/x.jpg"  → the file next to the Markdown file, published as is
 *   "/media/x.jpg"    → served as is from public/
 * A relative path that doesn't match a file returns { missing } instead of stopping the build,
 * so a typo shows on the page rather than taking the dev server down.
 * `recommendedWidth` only triggers a warning in the terminal when an image is much larger.
 */
export function resolveImage(
  filePath: string | undefined,
  value: string | undefined,
  recommendedWidth: number,
): ResolvedImage | null {
  if (!value || isTodo(value)) return null;
  const v = value.trim();
  if (v.startsWith('/') || /^https?:/.test(v)) return { src: v };

  const dir = '/' + (filePath ?? 'src/content/x').split('/').slice(0, -1).join('/');
  const mod = files[normalise(`${dir}/${v}`)];
  if (!mod) {
    console.warn(`[images] ${filePath}: no file at "${v}". Check the name and that it is in the images folder.`);
    return { missing: v };
  }
  const meta = mod.default;
  if (meta.width > recommendedWidth * 1.25) {
    console.warn(`[images] ${filePath}: "${v}" is ${meta.width}px wide; ${recommendedWidth}px is enough.`);
  }
  return { src: meta.src, width: meta.width, height: meta.height };
}

/** Just the URL, for places that only need a src (popover, slideshow); missing images count as none */
export function resolveImageSrc(filePath: string | undefined, value: string | undefined, recommendedWidth: number) {
  const r = resolveImage(filePath, value, recommendedWidth);
  return r && 'src' in r ? r.src : null;
}

/** Recommended widths, matching the layout at double resolution */
export const THUMB_WIDTH = 1200;
export const HERO_WIDTH = 2480;
export const PORTRAIT_WIDTH = 1200;

function normalise(path: string) {
  const out: string[] = [];
  for (const part of path.split('/')) {
    if (part === '..') out.pop();
    else if (part !== '.' && part !== '') out.push(part);
  }
  return '/' + out.join('/');
}

/** A page's link preview image: its thumbnail, or null when there is none (or the file is missing) */
export function shareImage(filePath: string | undefined, value: string | undefined) {
  const r = resolveImage(filePath, value, THUMB_WIDTH);
  return r && 'src' in r ? r : null;
}
