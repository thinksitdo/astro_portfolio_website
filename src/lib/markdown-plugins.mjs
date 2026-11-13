// Markdown plugins for Astro's Sätteri processor (hast phase).
//
// 1. figures: a paragraph holding only one image becomes a full-width <figure>; a paragraph holding
//    exactly two images (consecutive lines, no blank line) becomes a two-column row of figures.
//    The image title becomes the <figcaption>; the alt text stays as alt text.
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

/** The images in a paragraph that holds one or two images and nothing else, or null */
function imagesOnly(node) {
  if (node.type !== 'element' || node.tagName !== 'p') return null;
  const content = (node.children ?? []).filter((c) => !isWhitespace(c) && !(c.type === 'element' && c.tagName === 'br'));
  return content.length >= 1 && content.length <= 2 && content.every(isImg) ? content : null;
}

function figure(img) {
  const { title, ...props } = img.properties ?? {};
  const children = [{ ...img, properties: props }];
  if (typeof title === 'string' && title.trim()) children.push(el('figcaption', 'cs-cap', [text(title)]));
  return el('figure', 'cs-fig', children);
}

// Runs in `before`, ahead of the tree walk, so Astro's image step (which runs during the walk) still
// sees the images inside the new figures and publishes them. Nodes swapped in during the walk are skipped.
export const figuresPlugin = {
  name: 'case-figures',
  before(root, ctx) {
    const children = root.children.map((node) => {
      const content = imagesOnly(node);
      if (!content) return node;
      return content.length === 1
        ? el('div', 'cs-figs cs-figs--one', [figure(content[0])])
        : el('div', 'cs-figs cs-figs--two', content.map(figure));
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
