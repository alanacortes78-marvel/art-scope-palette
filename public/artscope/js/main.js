/**
 * Art Scope — main.js
 * Bootstrap del sitio: fetch de datos JSON, orquestación de módulos,
 * scroll reveal, parallax ligero y menú móvil.
 */

import { initGallery } from "./gallery.js";
import { initPortfolio } from "./portfolio.js";
import { initSearch } from "./search.js";
import { initTheme } from "./theme.js";

/** Utilidad global para toasts */
export function toast(message) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = message;
  t.classList.add("is-show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("is-show"), 2200);
}

/** Carga JSON local con manejo de error amistoso.
 *  Devuelve { ok, data, error, path } sin lanzar, para no romper la navegación. */
async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText || ""}`.trim());
    const data = await res.json();
    return { ok: true, data, path };
  } catch (err) {
    console.error(`[Art Scope] No se pudo cargar ${path}:`, err);
    return { ok: false, data: [], error: err?.message || String(err), path };
  }
}

/** Banner de error no bloqueante en la parte superior de <main>. */
function showErrorBanner(failures) {
  if (!failures.length) return;
  const main = document.getElementById("main");
  if (!main) return;
  const prev = document.getElementById("as-error-banner");
  if (prev) prev.remove();

  const banner = document.createElement("div");
  banner.id = "as-error-banner";
  banner.setAttribute("role", "alert");
  banner.style.cssText = [
    "margin:1rem auto", "max-width:1100px", "padding:.9rem 1rem",
    "border-radius:12px", "background:rgba(255,90,90,.12)",
    "border:1px solid rgba(255,90,90,.35)", "color:#ffb4b4",
    "font-size:.9rem", "display:flex", "gap:.75rem",
    "align-items:flex-start", "justify-content:space-between",
  ].join(";");
  const items = failures
    .map((f) => `<li><code>${f.path}</code> — ${f.error}</li>`)
    .join("");
  banner.innerHTML = `
    <div>
      <strong>⚠️ No pudimos cargar algunos datos.</strong>
      <div style="opacity:.85;margin-top:.25rem">
        La navegación sigue funcionando; solo faltan algunas secciones.
      </div>
      <ul style="margin:.5rem 0 0 1rem;padding:0">${items}</ul>
    </div>
    <button type="button" aria-label="Cerrar aviso"
      style="background:transparent;border:0;color:inherit;font-size:1.2rem;cursor:pointer;line-height:1">✕</button>`;
  banner.querySelector("button").addEventListener("click", () => banner.remove());
  main.prepend(banner);
}

/** Sustituye imágenes rotas por el placeholder (obras o avatares). */
function initAssetErrorHandling() {
  document.addEventListener(
    "error",
    (ev) => {
      const el = ev.target;
      if (!(el instanceof HTMLImageElement)) return;
      if (el.dataset.fallbackApplied === "1") return;
      el.dataset.fallbackApplied = "1";
      const isAvatar =
        el.classList.contains("avatar") ||
        /avatar|artist/i.test(el.src) ||
        /avatar|artist/i.test(el.alt);
      el.src = isAvatar
        ? "assets/images/placeholder-avatar.svg"
        : "assets/images/placeholder-obra.svg";
      console.warn("[Art Scope] Imagen no disponible, usando placeholder:", ev.target?.src);
    },
    true
  );
}

/** Muestra un estado vacío dentro de un contenedor si su dato falló. */
function renderEmptyState(elId, message) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = `<p style="color:var(--text-mute);text-align:center;padding:2rem;grid-column:1/-1">
    ${message}
  </p>`;
}

/** Anima la aparición al hacer scroll */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

/** Parallax ligero para la ilustración del hero */
function initParallax() {
  const art = document.querySelector(".hero__art");
  if (!art) return;
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY * 0.15, 60);
        art.style.setProperty("--p", `${y}px`);
        ticking = false;
      });
    },
    { passive: true }
  );
}

/** Menú móvil */
function initMobileNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  if (!nav || !toggle) return;
  toggle.addEventListener("click", () => {
    const open = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!open));
    toggle.setAttribute("aria-expanded", String(!open));
  });
  nav.querySelectorAll(".nav__menu a").forEach((a) =>
    a.addEventListener("click", () => nav.setAttribute("data-open", "false"))
  );
}

/** Marca enlace activo por sección al hacer scroll */
function initScrollSpy() {
  const links = document.querySelectorAll(".nav__menu a[href^='#']");
  const map = new Map();
  links.forEach((l) => {
    const id = l.getAttribute("href").slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, l);
  });
  if (!map.size) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          map.get(e.target)?.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  map.forEach((_, sec) => io.observe(sec));
}

/** Año dinámico del footer */
function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  initMobileNav();
  initReveal();
  initParallax();
  initScrollSpy();
  initYear();
  initAssetErrorHandling();

  const results = await Promise.all([
    loadJSON("data/artworks.json"),
    loadJSON("data/categories.json"),
    loadJSON("data/artists.json"),
    loadJSON("data/challenges.json"),
  ]);
  const [rArtworks, rCategories, rArtists, rChallenges] = results;
  const artworks = rArtworks.data;
  const categories = rCategories.data;
  const artists = rArtists.data;
  const challenges = rChallenges.data;

  const failures = results.filter((r) => !r.ok);
  if (failures.length) showErrorBanner(failures);

  // Guardar en un store simple compartido
  window.ArtScope = { artworks, categories, artists, challenges };

  if (rArtworks.ok && rCategories.ok) {
    initGallery({ artworks, categories });
  } else {
    renderEmptyState(
      "gallery-grid",
      "No pudimos cargar la galería. Intenta recargar la página."
    );
  }

  if (rArtists.ok) {
    initPortfolio({ artists });
    renderPortfolioAvatars(artists);
  } else {
    renderEmptyState("artists-grid", "No pudimos cargar a los artistas.");
  }

  if (rCategories.ok) {
    renderCategories(categories);
  } else {
    renderEmptyState("categories-grid", "No pudimos cargar las categorías.");
  }

  if (rChallenges.ok) {
    renderChallenges(challenges);
  } else {
    renderEmptyState("challenges-grid", "No pudimos cargar los retos.");
  }

  updateHeroStats({ artworks, artists, categories });
  initSearch({ artworks, artists, categories });
});

function renderCategories(categories) {
  const grid = document.getElementById("categories-grid");
  if (!grid) return;
  grid.innerHTML = categories
    .map(
      (c, i) => `
      <a href="#galeria"
         class="cat reveal"
         data-delay="${(i % 5) + 1}"
         style="--cat-color:${c.color}"
         data-cat="${c.id}"
         aria-label="Filtrar galería por ${c.name}">
        <div class="cat__icon" aria-hidden="true">${c.icon}</div>
        <div>
          <div class="cat__name">${c.name}</div>
          <div class="cat__count">${c.count} obras</div>
        </div>
      </a>`
    )
    .join("");

  grid.querySelectorAll(".cat").forEach((el) => {
    el.addEventListener("click", (ev) => {
      const id = el.dataset.cat;
      document
        .querySelectorAll(".filters .chip")
        .forEach((c) => c.classList.toggle("is-active", c.dataset.filter === id));
      document.dispatchEvent(new CustomEvent("filter:change", { detail: { filter: id } }));
    });
  });

  initReveal();
}

function renderChallenges(challenges) {
  const grid = document.getElementById("challenges-grid");
  if (!grid) return;
  grid.innerHTML = challenges
    .map(
      (c, i) => `
      <article class="challenge reveal" data-delay="${(i % 4) + 1}" style="--ch-color:${c.color}">
        <span class="challenge__icon" aria-hidden="true">${c.icon}</span>
        <div class="challenge__month">${c.month}</div>
        <h3>${c.title}</h3>
        <p>${c.description}</p>
      </article>`
    )
    .join("");
  initReveal();
}

function renderPortfolioAvatars(artists) {
  const list = document.getElementById("pf-avatars");
  if (!list) return;
  list.innerHTML = artists
    .slice(0, 4)
    .map((a) => `<a href="artista.html?id=${a.id}" aria-label="Entrar al universo de ${a.name}"><img src="${a.avatar}" alt="Retrato de ${a.name}" loading="lazy"></a>`)
    .join("");
}

function updateHeroStats({ artworks, artists, categories }) {
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(v);
  };
  set("stat-works", `${artworks.length * 47}+`);
  set("stat-artists", `${artists.length * 32}+`);
  set("stat-cats", categories.length);
}
