/**
 * search.js — buscador global (obras, artistas, categorías).
 */
export function initSearch({ artworks, artists, categories }) {
  const input = document.getElementById("search-input");
  if (!input) return;

  const emit = (q) =>
    document.dispatchEvent(new CustomEvent("search:change", { detail: { query: q } }));

  let t;
  input.addEventListener("input", (e) => {
    clearTimeout(t);
    t = setTimeout(() => emit(e.target.value), 120);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth" });
    }
    if (e.key === "Escape") {
      input.value = "";
      emit("");
    }
  });
}
