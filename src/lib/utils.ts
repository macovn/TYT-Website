import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
}

export function extractFirstImage(content: string) {
  if (!content) return null;

  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sanitizeHtml(html: string | null | undefined) {
  const content = html || "";
  if (typeof window !== 'undefined') {
    // Client-side: use dompurify
    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(content, {
      ADD_TAGS: ['iframe', 'svg', 'path', 'polyline', 'div', 'span', 'embed', 'object'],
      ADD_ATTR: ['target', 'data-pdf-link', 'style', 'class', 'download', 'data-pdf-block', 'data-src', 'data-filename', 'referrerpolicy', 'title', 'type']
    });
  } else {
    // Server-side: use sanitize-html
    const sanitize = require('sanitize-html');
    return sanitize(content, {
      allowedTags: sanitize.defaults.allowedTags.concat(['img', 'iframe', 'svg', 'path', 'polyline', 'span', 'div', 'p', 'br', 'strong', 'em', 'u', 's', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote']),
      allowedAttributes: {
        ...sanitize.defaults.allowedAttributes,
        img: ['src', 'alt', 'width', 'height', 'loading'],
        iframe: ['src', 'width', 'height', 'style', 'frameborder', 'allowfullscreen', 'allow', 'referrerpolicy', 'title'],
        a: ['href', 'name', 'target', 'class', 'data-pdf-link', 'style', 'download'],
        span: ['class', 'style'],
        div: ['class', 'style', 'data-pdf-block', 'data-src', 'data-filename'],
        svg: ['xmlns', 'width', 'height', 'viewbox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'style'],
        path: ['d'],
        polyline: ['points']
      },
      allowedStyles: {
        '*': {
          // Match all styles
          'color': [/^.*$/],
          'background': [/^.*$/],
          'background-color': [/^.*$/],
          'text-align': [/^.*$/],
          'font-family': [/^.*$/],
          'font-size': [/^.*$/],
          'font-weight': [/^.*$/],
          'display': [/^.*$/],
          'width': [/^.*$/],
          'height': [/^.*$/],
          'border': [/^.*$/],
          'border-radius': [/^.*$/],
          'padding': [/^.*$/],
          'margin': [/^.*$/],
          'overflow': [/^.*$/],
          'box-shadow': [/^.*$/],
          'align-items': [/^.*$/],
          'justify-content': [/^.*$/],
          'gap': [/^.*$/]
        }
      }
    });
  }
}
