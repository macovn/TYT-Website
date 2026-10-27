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

// WO-WEB-01 (vá B3 — stored XSS): một chính sách làm sạch HTML dùng
// chung cho cả hai phía client/server, thay cho hai cấu hình lệch nhau
// trước đây.
// - Tuyệt đối không cho qua thẻ object/embed (vector XSS kinh điển mà
//   bản cũ chủ động ADD_TAGS thêm vào phía client) và form/base/link/meta.
// - iframe chỉ được trỏ tới YouTube hoặc *.supabase.co (Storage của
//   chính Trạm, nơi đặt PDF/tài liệu được nhúng qua khối data-pdf-block);
//   iframe tới tên miền khác bị gỡ src ở cả hai phía.
// - style: phía client DOMPurify tự làm sạch giá trị CSS; phía server
//   giữ danh sách thuộc tính như cũ nhưng chặn url(/expression/javascript:.
const IFRAME_SRC_ALLOWLIST: RegExp[] = [
  /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\//i,
  /^https:\/\/[a-z0-9-]+\.supabase\.co\//i,
];

function isAllowedIframeSrc(src: string | null | undefined): boolean {
  if (!src) return false;
  const value = src.trim();
  return IFRAME_SRC_ALLOWLIST.some((re) => re.test(value));
}

let dompurifyHookRegistered = false;

export function sanitizeHtml(html: string | null | undefined) {
  const content = html || "";
  if (typeof window !== 'undefined') {
    // Client-side: use dompurify
    const DOMPurify = require('dompurify');
    if (!dompurifyHookRegistered) {
      // Gỡ src của iframe không thuộc allowlist trước khi DOMPurify
      // quyết định giữ thuộc tính. Đăng ký một lần duy nhất.
      DOMPurify.addHook('uponSanitizeAttribute', (node: any, data: any) => {
        if (
          node.tagName === 'IFRAME' &&
          data.attrName === 'src' &&
          !isAllowedIframeSrc(data.attrValue)
        ) {
          data.keepAttr = false;
        }
      });
      dompurifyHookRegistered = true;
    }
    return DOMPurify.sanitize(content, {
      ADD_TAGS: ['iframe', 'svg', 'path', 'polyline', 'div', 'span'],
      ADD_ATTR: ['target', 'data-pdf-link', 'style', 'class', 'download', 'data-pdf-block', 'data-src', 'data-filename', 'referrerpolicy', 'title', 'type'],
      FORBID_TAGS: ['object', 'embed', 'form', 'base', 'link', 'meta'],
      FORBID_ATTR: ['srcdoc']
    });
  } else {
    // Server-side: use sanitize-html
    const sanitize = require('sanitize-html');
    // Chặn các giá trị CSS có thể tải tài nguyên ngoài hoặc thực thi mã.
    const safeStyleValue = /^(?!.*(url\s*\(|expression|javascript:)).+$/i;
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
          'color': [safeStyleValue],
          'background': [safeStyleValue],
          'background-color': [safeStyleValue],
          'text-align': [safeStyleValue],
          'font-family': [safeStyleValue],
          'font-size': [safeStyleValue],
          'font-weight': [safeStyleValue],
          'display': [safeStyleValue],
          'width': [safeStyleValue],
          'height': [safeStyleValue],
          'border': [safeStyleValue],
          'border-radius': [safeStyleValue],
          'padding': [safeStyleValue],
          'margin': [safeStyleValue],
          'overflow': [safeStyleValue],
          'box-shadow': [safeStyleValue],
          'align-items': [safeStyleValue],
          'justify-content': [safeStyleValue],
          'gap': [safeStyleValue]
        }
      },
      transformTags: {
        // Gỡ src của iframe không thuộc allowlist (giữ thẻ rỗng vô hại
        // thay vì để trình duyệt tải nội dung từ tên miền lạ).
        iframe: (tagName: string, attribs: Record<string, string>) => {
          if (!isAllowedIframeSrc(attribs.src)) {
            return { tagName: 'iframe', attribs: {} };
          }
          return { tagName, attribs };
        }
      }
    });
  }
}
