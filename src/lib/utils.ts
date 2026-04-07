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
