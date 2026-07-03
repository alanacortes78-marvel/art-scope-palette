/**
 * portfolio.js — render de tarjetas de artistas.
 */
export function initPortfolio({ artists }) {
  const grid = document.getElementById("artists-grid");
  if (!grid) return;
  grid.innerHTML = artists
    .map(
      (a, i) => `
      <article class="artist reveal" data-delay="${(i % 4) + 1}">
        <div class="artist__cover">
          <img src="${a.cover}" alt="Portada de ${a.name}" loading="lazy" />
        </div>
        <div class="artist__body">
          <img class="artist__avatar" src="${a.avatar}" alt="Retrato de ${a.name}" loading="lazy" />
          <h3 class="artist__name">${a.name}</h3>
          <div class="artist__country">${countryFlag(a.country)} ${a.country}${a.age ? " · " + a.age + " años" : ""}</div>
          <p style="margin:.6rem 0 0;font-size:.9rem;color:var(--text-dim)">${truncate(a.bio, 110)}</p>
          <div class="artist__specs" aria-label="Especialidades">
            ${a.specialties.map((s) => `<span class="spec">${s}</span>`).join("")}
          </div>
          <div class="artist__badges" aria-label="Insignias">${a.badges.join(" · ")}</div>
        </div>
      </article>`
    )
    .join("");
}

function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + "…" : s; }

function countryFlag(country) {
  const map = { México: "🇲🇽", España: "🇪🇸", Argentina: "🇦🇷", Colombia: "🇨🇴" };
  return map[country] || "🌎";
}
