/**
 * gallery.js — render de galería tipo masonry, filtros y favoritos.
 */
import { toast } from "./main.js";

const state = { filter: "all", favs: loadFavs(), query: "" };

function loadFavs() {
  try {
    return new Set(JSON.parse(localStorage.getItem("as_favs") || "[]"));
  } catch { return new Set(); }
}
function saveFavs() {
  localStorage.setItem("as_favs", JSON.stringify([...state.favs]));
}

export function initGallery({ artworks, categories }) {
  renderFilters(categories);
  render(artworks);

  document.addEventListener("filter:change", (e) => {
    state.filter = e.detail.filter;
    render(artworks);
  });
  document.addEventListener("search:change", (e) => {
    state.query = (e.detail.query || "").toLowerCase().trim();
    render(artworks);
  });
}

function renderFilters(categories) {
  const wrap = document.getElementById("gallery-filters");
  if (!wrap) return;
  const chips = [
    { id: "all", name: "Todo", icon: "✨" },
    ...categories.slice(0, 8),
  ];
  wrap.innerHTML = chips
    .map(
      (c) => `
      <button type="button" class="chip ${c.id === state.filter ? "is-active" : ""}"
              data-filter="${c.id}">
        <span aria-hidden="true">${c.icon || ""}</span> ${c.name}
      </button>`
    )
    .join("");
  wrap.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.filter = btn.dataset.filter;
      document.dispatchEvent(new CustomEvent("filter:change", { detail: { filter: state.filter } }));
    });
  });
}

function render(artworks) {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  let list = artworks;
  if (state.filter && state.filter !== "all") {
    list = list.filter((a) => a.categoryId === state.filter);
  }
  if (state.query) {
    list = list.filter((a) =>
      [a.title, a.author, a.category, ...(a.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(state.query)
    );
  }

  if (!list.length) {
    grid.innerHTML = `<p style="color:var(--text-mute);text-align:center;padding:2rem">
      No encontramos obras con ese criterio. Prueba con otra categoría o búsqueda.</p>`;
    return;
  }

  grid.innerHTML = list.map(cardHTML).join("");
  bindCardEvents(grid);
}

function cardHTML(art) {
  const fav = state.favs.has(art.id);
  const favCount = art.favorites + (fav ? 1 : 0);
  const date = new Date(art.date).toLocaleDateString("es-ES", {
    year: "numeric", month: "short",
  });
  return `
    <article class="card" data-id="${art.id}">
      <div class="card__media">
        <img src="${art.image}" alt="${art.title} por ${art.author}" loading="lazy" width="800" />
        <div class="card__overlay">
          <div>
            <div class="card__cat">${art.category}</div>
          </div>
          <div class="card__actions">
            <button type="button" class="icon-btn ${fav ? "is-fav" : ""}"
              data-action="fav"
              aria-label="${fav ? "Quitar de favoritos" : "Agregar a favoritos"}"
              aria-pressed="${fav}">
              ${heartSVG()}
            </button>
            <button type="button" class="icon-btn"
              data-action="share"
              aria-label="Compartir obra">
              ${shareSVG()}
            </button>
          </div>
        </div>
      </div>
      <div class="card__body">
        <h3 class="card__title">${art.title}</h3>
        <div class="card__meta">
          <span>${art.author} · ${date}</span>
          <span class="card__favs" aria-label="${favCount} favoritos">
            ${heartSmallSVG()} ${favCount}
          </span>
        </div>
      </div>
    </article>`;
}

function bindCardEvents(grid) {
  grid.querySelectorAll(".card").forEach((card) => {
    const id = card.dataset.id;
    card.querySelector('[data-action="fav"]')?.addEventListener("click", (e) => {
      e.preventDefault();
      const btn = e.currentTarget;
      if (state.favs.has(id)) {
        state.favs.delete(id);
        btn.classList.remove("is-fav");
        btn.setAttribute("aria-pressed", "false");
        toast("Quitado de favoritos");
      } else {
        state.favs.add(id);
        btn.classList.add("is-fav", "just-fav");
        btn.setAttribute("aria-pressed", "true");
        setTimeout(() => btn.classList.remove("just-fav"), 400);
        toast("¡Añadido a favoritos!");
      }
      saveFavs();
    });

    card.querySelector('[data-action="share"]')?.addEventListener("click", async (e) => {
      e.preventDefault();
      const url = `${location.origin}${location.pathname}#obra-${id}`;
      const data = { title: "Art Scope", text: "Mira esta obra en Art Scope", url };
      if (navigator.share) {
        try { await navigator.share(data); } catch { /* cancelado */ }
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast("Enlace copiado al portapapeles");
      }
    });
  });
}

/* Iconos SVG inline */
function heartSVG() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.5-9.1C1 8.7 3.1 5 6.6 5c2 0 3.5 1 5.4 3.2C13.9 6 15.4 5 17.4 5c3.5 0 5.6 3.7 4.1 6.9C19.5 16.4 12 21 12 21z"/>
  </svg>`;
}
function heartSmallSVG() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="vertical-align:-2px">
    <path d="M12 21s-7.5-4.6-9.5-9.1C1 8.7 3.1 5 6.6 5c2 0 3.5 1 5.4 3.2C13.9 6 15.4 5 17.4 5c3.5 0 5.6 3.7 4.1 6.9C19.5 16.4 12 21 12 21z"/>
  </svg>`;
}
function shareSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/>
  </svg>`;
}
