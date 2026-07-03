/**
 * obra.js — página de detalle de una obra (destino del QR individual de cada cuadro).
 * Muestra la ficha técnica, qué inspiró al artista y sus redes sociales.
 */
import { initTheme } from "./theme.js";
import { socialLinksHTML } from "./social.js";

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

function renderNotFound() {
  const root = document.getElementById("obra-root");
  root.innerHTML = `
    <div class="container obra-notfound">
      <h1>Obra no encontrada</h1>
      <p>El código QR o el enlace que seguiste no corresponde a ninguna obra de la exposición.</p>
      <a href="index.html" class="btn btn--primary">Ir a la galería principal</a>
    </div>`;
}

function renderArtwork(art) {
  document.title = `${art.title} — Art Scope`;

  const img = document.getElementById("obra-img");
  img.src = art.image;
  img.alt = `${art.title} por ${art.author}`;

  document.getElementById("obra-cat").textContent = art.category;
  document.getElementById("obra-title").textContent = art.title;
  document.getElementById("obra-author").textContent = art.author;

  const date = new Date(art.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  document.getElementById("obra-date").textContent = date;

  document.getElementById("obra-favs").innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="vertical-align:-2px">
      <path d="M12 21s-7.5-4.6-9.5-9.1C1 8.7 3.1 5 6.6 5c2 0 3.5 1 5.4 3.2C13.9 6 15.4 5 17.4 5c3.5 0 5.6 3.7 4.1 6.9C19.5 16.4 12 21 12 21z"/>
    </svg> ${art.favorites}`;

  document.getElementById("obra-desc").textContent = art.description;
  document.getElementById("obra-inspiration").textContent = art.inspiration || "El artista aún no compartió esta historia.";

  document.getElementById("obra-tools").innerHTML = (art.tools || [])
    .map((t) => `<li>${t}</li>`)
    .join("");

  document.getElementById("obra-tags").innerHTML = (art.tags || [])
    .map((t) => `<span class="spec">#${t}</span>`)
    .join("");
}

function renderArtist(artist) {
  const wrap = document.getElementById("obra-artist");
  wrap.hidden = false;

  document.getElementById("obra-artist-avatar").src = artist.avatar;
  document.getElementById("obra-artist-avatar").alt = `Retrato de ${artist.name}`;
  document.getElementById("obra-artist-name").textContent = artist.name;
  document.getElementById("obra-artist-bio").textContent = artist.bio;

  document.getElementById("obra-artist-social").innerHTML = socialLinksHTML(artist.name, artist.social);

  const link = document.getElementById("obra-artist-link");
  if (link) link.href = `artista.html?id=${artist.id}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  initYear();

  const id = new URLSearchParams(location.search).get("id");

  const [artworks, artists] = await Promise.all([
    loadJSON("data/artworks.json"),
    loadJSON("data/artists.json"),
  ]);

  const artwork = artworks.find((a) => a.id === id);
  if (!artwork) {
    renderNotFound();
    return;
  }

  renderArtwork(artwork);

  const artist = artists.find((a) => a.id === artwork.authorId);
  if (artist) renderArtist(artist);

  initReveal();
});
