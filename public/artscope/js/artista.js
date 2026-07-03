/**
 * artista.js — "universo" del artista: su perfil y el portafolio completo
 * de sus obras en la exposición (destino del QR de un artista).
 */
import { initTheme } from "./theme.js";
import { socialLinksHTML } from "./social.js";
import { cardHTML, bindCardEvents } from "./gallery.js";

async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (err) {
    console.error("No se pudo cargar", path, err);
    return [];
  }
}

function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

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

function countryFlag(country) {
  const map = { México: "🇲🇽", España: "🇪🇸", Argentina: "🇦🇷", Colombia: "🇨🇴" };
  return map[country] || "🌎";
}

function renderNotFound() {
  const root = document.getElementById("artista-root");
  root.innerHTML = `
    <div class="container obra-notfound">
      <h1>Artista no encontrado</h1>
      <p>El código QR o el enlace que seguiste no corresponde a ningún artista de la exposición.</p>
      <a href="index.html" class="btn btn--primary">Ir a la galería principal</a>
    </div>`;
}

function renderProfile(artist) {
  document.title = `${artist.name} — Art Scope`;

  const profile = document.getElementById("artista-profile");
  profile.hidden = false;

  document.getElementById("artista-avatar").src = artist.avatar;
  document.getElementById("artista-avatar").alt = `Retrato de ${artist.name}`;
  document.getElementById("artista-name").textContent = artist.name;
  const metaEl = document.getElementById("artista-meta");
  if (artist.country) {
    metaEl.textContent = `${countryFlag(artist.country)} ${artist.country}${artist.age ? " · " + artist.age + " años" : ""}`;
    metaEl.hidden = false;
  } else {
    metaEl.hidden = true;
  }
  document.getElementById("artista-bio").textContent = artist.bio || "";

  document.getElementById("artista-specs").innerHTML = (artist.specialties || [])
    .map((s) => `<span class="spec">${s}</span>`)
    .join("");

  document.getElementById("artista-social").innerHTML = socialLinksHTML(artist.name, artist.social);
}

function renderPortfolio(artist, artworks) {
  const grid = document.getElementById("artista-gallery");
  const title = document.getElementById("artista-galeria-title");
  title.textContent = `Obras de ${artist.name}`;

  if (!artworks.length) {
    grid.innerHTML = `<p style="color:var(--text-mute);text-align:center;padding:2rem">
      Este artista todavía no tiene obras publicadas en la exposición.</p>`;
    return;
  }

  grid.innerHTML = artworks.map(cardHTML).join("");
  bindCardEvents(grid);
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  initYear();

  const id = new URLSearchParams(location.search).get("id");

  const [artists, artworks] = await Promise.all([
    loadJSON("data/artists.json"),
    loadJSON("data/artworks.json"),
  ]);

  const artist = artists.find((a) => a.id === id);
  if (!artist) {
    renderNotFound();
    return;
  }

  renderProfile(artist);
  renderPortfolio(artist, artworks.filter((a) => a.authorId === artist.id));

  initReveal();
});
