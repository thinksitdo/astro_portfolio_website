/**
 * Minimal inline Markdown for single-line frontmatter values such as a publication's reference:
 * *italic*, **bold** and [text](https://link). Everything else is escaped, so the result is safe
 * to insert as HTML.
 */
export function inlineMarkdown(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return escaped
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
