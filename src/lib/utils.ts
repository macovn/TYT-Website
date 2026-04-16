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
    return DOMPurify.sanitize(content);
  } else {
    // Server-side: use sanitize-html
    const sanitize = require('sanitize-html');
    return sanitize(content, {
      allowedTags: sanitize.defaults.allowedTags.concat(['img', 'iframe']),
      allowedAttributes: {
        ...sanitize.defaults.allowedAttributes,
        img: ['src', 'alt', 'width', 'height', 'loading'],
        iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow']
      }
    });
  }
}
