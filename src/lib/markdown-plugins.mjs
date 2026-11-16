// Markdown plugins for Astro's Sätteri processor (hast phase).
//
// 1. figures: a paragraph holding only one image becomes a full-width <figure>; a paragraph holding
//    exactly two images (consecutive lines, no blank line) becomes a two-column row of figures.
//    The image title becomes the <figcaption>; the alt text stays as alt text. Each image is a button
//    that opens the lightbox. Figures are numbered automatically, in order, on each page: the caption
//    shows "Figure 3 · <title>", and any "Figure 3:" typed at the start of the title is replaced.
//    A video is its poster image wrapped in a link to the file, [![alt](poster.jpg "Caption")](/media/clip.mp4):
//    the poster shows with a play icon, and the lightbox plays the video. A YouTube link works the same
//    way, [![alt](poster.jpg "Caption")](https://www.youtube.com/watch?v=ID), and plays in the lightbox.
// 2. sections: the article is split at each h2 into numbered sections (number and heading on the left,
//    text on the right), as in the case study design. Figures sit between sections at full width.

const isWhitespace = (node) => node.type === 'text' && !node.value.trim();
const isImg = (node) => node.type === 'element' && node.tagName === 'img';
const el = (tagName, className, children = [], properties = {}) => ({
  type: 'element',
  tagName,
  properties: className ? { ...properties, className: className.split(' ') } : properties,
  children,
});
const text = (value) => ({ type: 'text', value });

const VIDEO = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;
const kids = (node) => (node.children ?? []).filter((c) => !isWhitespace(c));

/** The video ID in a YouTube address (watch?v=, youtu.be/, shorts/, embed/), or null */
export function youtubeId(href) {
  let url;
  try { url = new URL(href); } catch { return null; }
  const host = url.hostname.replace(/^(www|m)\./, '');
  let id = null;
  if (host === 'youtu.be') id = url.pathname.slice(1);
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null;
  }
  return id && /^[\w-]{6,}$/.test(id) ? id : null;
}

/** A video: a link to a video file or a YouTube video holding just its poster image, [![alt](poster.jpg "Caption")](/media/clip.mp4) */
const isVideoLink = (node) => {
  if (node.type !== 'element' || node.tagName !== 'a') return false;
  const href = String(node.properties?.href ?? '');
  return (VIDEO.test(href) || !!youtubeId(href)) && kids(node).length === 1 && isImg(kids(node)[0]);
};

/** The images and videos in a paragraph that holds one or two of them and nothing else, or null */
function imagesOnly(node) {
  if (node.type !== 'element' || node.tagName !== 'p') return null;
  const content = (node.children ?? []).filter((c) => !isWhitespace(c) && !(c.type === 'element' && c.tagName === 'br'));
  return content.length >= 1 && content.length <= 2 && content.every((c) => isImg(c) || isVideoLink(c)) ? content : null;
}

// A number typed by hand at the start of a caption ("Figure 3:", "Fig. 3 -", "Figure 3 ·"), replaced by the automatic one
const typedNumber = /^\s*fig(?:ure|\.)?\s*\d+\s*[:·.\-–—]?\s*/i;

// A square play button drawn over a video's poster image
const playIcon = () =>
  el('span', 'cs-play', [{
    type: 'element', tagName: 'svg',
    properties: { width: 24, height: 24, viewBox: '0 0 24 24', ariaHidden: 'true', focusable: 'false' },
    children: [{ type: 'element', tagName: 'path', properties: { d: 'M6 3L21 12L6 21Z', fill: 'currentColor' }, children: [] }],
  }], { ariaHidden: 'true' });

// Each image sits in a button that opens it larger in the lightbox (components/Lightbox.astro).
// For a video the button holds the poster image and a play icon, and the lightbox plays the video.
function figure(item, n) {
  const href = isVideoLink(item) ? String(item.properties.href) : null;
  const yt = href ? youtubeId(href) : null;
  const video = href;
  const img = video ? kids(item)[0] : item;
  const { title, ...props } = img.properties ?? {};
  const poster = { ...img, properties: props };
  const zoom = video
    ? el('button', 'cs-zoom cs-zoom--video', [el('span', 'visually-hidden', [text('Play video: ')]), poster, playIcon()], yt ? { type: 'button', dataYoutube: yt } : { type: 'button', dataVideo: video })
    : el('button', 'cs-zoom', [el('span', 'visually-hidden', [text('View larger image: ')]), poster], { type: 'button' });
  const caption = typeof title === 'string' ? title.replace(typedNumber, '').trim() : '';
  const label = el('span', 'cs-cap-n', [text(`Figure ${n}`)]);
  const figcaption = el('figcaption', 'cs-cap', caption ? [label, text(` · ${caption}`)] : [label]);
  return el('figure', 'cs-fig', [zoom, figcaption]);
}

// Runs in `before`, ahead of the tree walk, so Astro's image step (which runs during the walk) still
// sees the images inside the new figures and publishes them. Nodes swapped in during the walk are skipped.
export const figuresPlugin = {
  name: 'case-figures',
  before(root, ctx) {
    let n = 0; // runs once per Markdown file, so numbering starts at 1 on every page
    const children = root.children.map((node) => {
      const content = imagesOnly(node);
      if (!content) return node;
      const figures = content.map((item) => figure(item, ++n));
      return el('div', content.length === 1 ? 'cs-figs cs-figs--one' : 'cs-figs cs-figs--two', figures);
    });
    ctx.setField(root, 'children', children);
  },
};

const isFigures = (node) =>
  node.type === 'element' && [].concat(node.properties?.className ?? []).join(' ').split(' ').includes('cs-figs');

export const sectionsPlugin = {
  name: 'case-sections',
  before(root, ctx) {
    const out = [];
    let current = null;
    let n = 0;

    const open = (heading) => {
      const head = el('div', 'cs-sec-h');
      if (heading) {
        n += 1;
        head.children.push(el('span', 'cs-n', [text(String(n).padStart(2, '0'))]), heading);
      }
      current = { head, body: el('div', 'cs-sec-b') };
    };
    const close = () => {
      if (current && (current.body.children.some((c) => !isWhitespace(c)) || current.head.children.length)) {
        out.push(el('div', 'cs-sec', [current.head, current.body]));
      }
      current = null;
    };

    for (const child of root.children) {
      if (child.type === 'element' && child.tagName === 'h2') {
        close();
        open(child);
      } else if (isFigures(child) || imagesOnly(child)) {
        close();
        out.push(child);
      } else if (isWhitespace(child)) {
        if (current) current.body.children.push(child);
      } else {
        if (!current) open(null);
        current.body.children.push(child);
      }
    }
    close();
    ctx.setField(root, 'children', out);
  },
};

// 3. image references (mdast phase): turns reference-style images, ![alt][image-1] with
//    [image-1]: ./images/x.jpg "Caption" further down (what Google Docs exports), into ordinary
//    images. Astro only publishes ordinary ![alt](./images/x.jpg) images, so without this the
//    referenced files are never copied into the site.
export const imageReferencesPlugin = {
  name: 'image-references',
  before(root, ctx) {
    const defs = new Map();
    const collect = (node) => {
      if (node.type === 'definition') defs.set(String(node.identifier).toLowerCase(), node);
      (node.children ?? []).forEach(collect);
    };
    collect(root);
    if (!defs.size) return;

    let changed = false;
    const rewrite = (node) => {
      if (node.type === 'imageReference') {
        const def = defs.get(String(node.identifier).toLowerCase());
        if (!def) return node;
        changed = true;
        return { type: 'image', url: def.url, title: def.title ?? null, alt: node.alt ?? '' };
      }
      if (!node.children) return node;
      const children = node.children.map(rewrite);
      return children.some((c, i) => c !== node.children[i]) ? { ...node, children } : node;
    };
    const children = root.children.map(rewrite);
    if (changed) ctx.setField(root, 'children', children);
  },
};
