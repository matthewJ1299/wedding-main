/**
 * Strip TextEdit / macOS RTF wrapper from pasted email HTML and normalize escapes.
 * Does not parse full RTF; assumes a single HTML document is embedded.
 */

/**
 * @param {string} raw
 * @returns {string}
 */
export function stripRtfToEmailHtml(raw) {
  const s = String(raw ?? '');
  const lower = s.toLowerCase();
  const start =
    lower.indexOf('<!doctype') >= 0
      ? lower.indexOf('<!doctype')
      : lower.indexOf('<html');
  if (start < 0) {
    throw new Error('stripRtfToEmailHtml: no <!DOCTYPE or <html> found');
  }
  let end = lower.lastIndexOf('</html>');
  if (end < 0) {
    throw new Error('stripRtfToEmailHtml: no </html> found');
  }
  end += '</html>'.length;
  let html = s.slice(start, end);

  // RTF often appends `}` after `</html>`
  if (html.endsWith('</html>}')) {
    html = html.slice(0, -1);
  }

  html = decodeRtfEscapes(html);
  html = stripRtfUnicodeEmojiArtifacts(html);
  // RTF line continuation: backslash + CR/LF inside pasted HTML
  html = html.replace(/\\\r?\n/g, '');
  html = html.replace(/\r\n/g, '\n');
  html = html.replace(/\r/g, '\n');
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<link[^>]*rel=["']preload["'][^>]*>/gi, '');
  html = html.replace(/\sses:no-track=""?\s*/gi, ' ');
  return html.trim();
}

/**
 * @param {string} html
 * @returns {string}
 */
function stripRtfUnicodeEmojiArtifacts(html) {
  return html
    .replace(/\\uc0(?:\\u-?\d+\s*)+/gi, '')
    .replace(/\\u-?\d+\?/g, '');
}

/**
 * RTF `\'hh` is a byte in the ANSI code page (often Windows-1252 for \ansicpg1252).
 * @param {string} html
 * @returns {string}
 */
function decodeRtfEscapes(html) {
  let out = html;
  // Temporarily protect real backslashes we want to keep (rare in this HTML path)
  out = out.replace(/\\\\/g, '\u0000BACKSLASH\u0000');

  // \'92 etc. -> CP1252-ish character
  out = out.replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => {
    const b = parseInt(hex, 16);
    return cp1252ByteToUnicode(b);
  });

  out = out.replace(/\\\{/g, '{').replace(/\\\}/g, '}');
  out = out.replace(/\u0000BACKSLASH\u0000/g, '\\');
  return out;
}

/**
 * @param {number} b 0–255
 * @returns {string}
 */
function cp1252ByteToUnicode(b) {
  if (b >= 0x20 && b <= 0x7e) {
    return String.fromCharCode(b);
  }
  const map = {
    0x80: '\u20ac',
    0x82: '\u201a',
    0x83: '\u0192',
    0x84: '\u201e',
    0x85: '\u2026',
    0x86: '\u2020',
    0x87: '\u2021',
    0x88: '\u02c6',
    0x89: '\u2030',
    0x8a: '\u0160',
    0x8b: '\u2039',
    0x8c: '\u0152',
    0x8e: '\u017d',
    0x91: '\u2018',
    0x92: '\u2019',
    0x93: '\u201c',
    0x94: '\u201d',
    0x95: '\u2022',
    0x96: '\u2013',
    0x97: '\u2014',
    0x98: '\u02dc',
    0x99: '\u2122',
    0x9a: '\u0161',
    0x9b: '\u203a',
    0x9c: '\u0153',
    0x9e: '\u017e',
    0x9f: '\u0178',
  };
  if (map[b] !== undefined) return map[b];
  if (b < 0x20) return '';
  return String.fromCharCode(b);
}
