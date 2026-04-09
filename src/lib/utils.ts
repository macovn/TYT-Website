import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtml(html: string) {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
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

export function sanitizeHtml(html: string) {
  if (typeof window !== 'undefined') {
    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(html);
  } else {
    // Use eval('require') to prevent webpack from bundling jsdom on the client
    const req = eval('require');
    const { JSDOM } = req('jsdom');
    const createDOMPurify = req('dompurify');
    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    return DOMPurify.sanitize(html);
  }
}
