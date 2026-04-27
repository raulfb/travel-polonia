let map, markers = {}, activeFilter = "all", activeCard = null;

function init() {
  map = L.map("map", { zoomControl: true }).setView([52.0, 19.5], 6);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
  }).addTo(map);

  PLACES.forEach(addMarker);
  renderList(PLACES);
  setupFilters();
}

function addMarker(place) {
  const color = CITY_COLORS[place.city];

  const icon = L.divIcon({
    className: "",
    html: `<div class="custom-marker" style="background:${color}"><span>${place.icon}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const marker = L.marker([place.lat, place.lng], { icon })
    .addTo(map)
    .bindPopup(buildPopupHTML(place));

  marker.on("popupopen", () => highlightCard(place.id));
  marker.on("click", () => highlightCard(place.id));

  markers[place.id] = marker;
}

function buildPopupHTML(place) {
  return `
    <div class="popup-city">${place.cityLabel}</div>
    <div class="popup-name">${place.name}</div>
    <div class="popup-type">${place.type}</div>
    <button class="popup-btn" onclick="showDetail('${place.id}')">Ver detalle →</button>
  `;
}

function renderList(places) {
  const list = document.getElementById("place-list");
  list.innerHTML = "";

  const grouped = {};
  CITY_ORDER.forEach(c => grouped[c] = []);
  places.forEach(p => { if (grouped[p.city]) grouped[p.city].push(p); });

  CITY_ORDER.forEach(city => {
    const group = grouped[city];
    if (!group || group.length === 0) return;

    const title = document.createElement("div");
    title.className = "city-group-title";
    title.textContent = group[0].cityLabel.split(" — ")[0].split(" / ")[0];
    title.style.color = CITY_COLORS[city];
    list.appendChild(title);

    group.forEach(place => {
      const card = document.createElement("div");
      card.className = "place-card";
      card.id = `card-${place.id}`;
      card.innerHTML = `
        <div class="place-icon">${place.icon}</div>
        <div class="place-info">
          <h3>${place.name}</h3>
          <div class="place-city">${place.cityLabel}</div>
          <div class="place-type">${place.type}</div>
        </div>
      `;
      card.addEventListener("click", () => {
        flyToMarker(place);
        showDetail(place.id);
      });
      list.appendChild(card);
    });
  });
}

function highlightCard(id) {
  document.querySelectorAll(".place-card").forEach(c => c.classList.remove("active"));
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.add("active");
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function flyToMarker(place) {
  map.flyTo([place.lat, place.lng], 15, { duration: 1.2 });
  setTimeout(() => markers[place.id] && markers[place.id].openPopup(), 1300);
}

function showDetail(id) {
  const place = PLACES.find(p => p.id === id);
  if (!place) return;

  if (activeCard !== id) {
    flyToMarker(place);
    highlightCard(id);
    activeCard = id;
  }

  const list = document.getElementById("place-list");
  const detail = document.getElementById("place-detail");
  const content = document.getElementById("detail-content");

  list.classList.add("hidden");
  detail.classList.remove("hidden");

  const practical = place.practical || {};
  const practicalKeys = {
    entrada: "Entrada",
    horario: "Horario",
    precio: "Precio",
    tiempo: "Tiempo recom.",
    transporte: "Transporte",
    tip: "Consejo",
    aviso: "Aviso",
  };

  const practicalHTML = Object.entries(practicalKeys)
    .filter(([k]) => practical[k])
    .map(([k, label]) => `
      <div class="practical-item">
        <span class="p-label">${label}</span>
        <span class="p-value">${practical[k]}</span>
      </div>
    `).join("");

  const curiositiesHTML = (place.curiosities || [])
    .map(c => `<li>${c}</li>`)
    .join("");

  const warningHTML = practical.aviso
    ? `<div class="warning-box"><strong>⚠ Importante:</strong> ${practical.aviso}</div>`
    : "";

  content.innerHTML = `
    <div class="detail-header">
      <div class="detail-city" style="color:${CITY_COLORS[place.city]}">${place.cityLabel}</div>
      <h2>${place.icon} ${place.name}</h2>
      <div class="detail-type">${place.type}</div>
    </div>

    <div class="detail-section">
      <h4>Descripcion</h4>
      <p>${place.description}</p>
    </div>

    <div class="detail-section">
      <h4>Curiosidades e historia</h4>
      <ul class="curiosity-list">${curiositiesHTML}</ul>
    </div>

    <div class="detail-section">
      <h4>Informacion practica</h4>
      <div class="practical-grid">${practicalHTML}</div>
      ${warningHTML}
    </div>
  `;
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const city = btn.dataset.city;
      activeFilter = city;

      const filtered = city === "all" ? PLACES : PLACES.filter(p => p.city === city);
      renderList(filtered);

      if (city === "all") {
        map.flyTo([52.0, 19.5], 6, { duration: 1 });
      } else {
        const center = CITY_CENTERS[city];
        if (center) map.flyTo(center, 13, { duration: 1 });
      }

      // Hide detail if shown
      document.getElementById("place-list").classList.remove("hidden");
      document.getElementById("place-detail").classList.add("hidden");
      activeCard = null;
    });
  });

  document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById("place-list").classList.remove("hidden");
    document.getElementById("place-detail").classList.add("hidden");
    activeCard = null;
  });
}

document.addEventListener("DOMContentLoaded", init);
