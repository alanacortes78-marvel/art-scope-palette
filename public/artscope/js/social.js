/**
 * social.js — íconos y etiquetas de redes sociales, compartidos entre
 * la página de artista y la de detalle de obra.
 */
export const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.4 2.2 2 3.7 4.2 4v3c-1.5 0-2.9-.4-4.2-1.2V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1a2.9 2.9 0 1 0 2 2.8V3h3z"/></svg>`,
  behance: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6h5.5a3.3 3.3 0 0 1 0 6.6H4V6zm0 6.6h6a3.4 3.4 0 0 1 0 6.8H4v-6.8zM6 8v2.6h3a1.3 1.3 0 0 0 0-2.6H6zm0 6.6V17h3.6a1.7 1.7 0 0 0 0-3.4H6zM14.5 9h5v1.4h-5V9zM14 14.6a3.6 3.6 0 0 1 3.7-3.6c2 0 3.5 1.5 3.5 3.8v.4h-5.4c.1 1 .8 1.7 1.9 1.7.8 0 1.3-.3 1.6-.9h1.8c-.4 1.5-1.7 2.4-3.4 2.4-2.1 0-3.7-1.4-3.7-3.8zm1.9-.9h3.5c-.1-.9-.7-1.5-1.7-1.5s-1.6.6-1.8 1.5z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H17V3.7c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H8v3.1h2.8v8h2.7z"/></svg>`,
  website: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
};

export const SOCIAL_LABELS = {
  instagram: "Instagram",
  tiktok: "TikTok",
  behance: "Behance",
  facebook: "Facebook",
  website: "Sitio web",
};

export function socialLinksHTML(name, social) {
  return Object.entries(social || {})
    .map(
      ([key, url]) => `
      <a class="icon-btn" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${name} en ${SOCIAL_LABELS[key] || key}">
        ${SOCIAL_ICONS[key] || SOCIAL_ICONS.website}
      </a>`
    )
    .join("");
}
