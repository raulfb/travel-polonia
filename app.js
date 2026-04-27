let map, markers = {}, activeFilter = "all", activeCard = null;

// ─── BOTTOM SHEET STATE ────────────────────────────────────────────────────
const STATES = ["state-peek", "state-list", "state-full"];
let sheetState = "state-peek";

function setSheetState(state, animate = true) {
  const panel = document.getElementById("panel");
  if (!animate) panel.classList.add("dragging");
  STATES.forEach(s => panel.classList.remove(s));
  panel.classList.add(state);
  sheetState = state;
  if (!animate) requestAnimationFrame(() => panel.classList.remove("dragging"));
}

function openSheet(toState) {
  if (sheetState !== toState) setSheetState(toState);
}

// ─── DRAG / SWIPE HANDLING ─────────────────────────────────────────────────
function setupDrag() {
  const panel     = document.getElementById("panel");
  const panelTop  = document.getElementById("panel-top");
  const body      = document.getElementById("panel-body");

  let startY = 0, startTranslate = 0, currentY = 0;
  let dragging = false;

  function getSnapPx() {
    const h = panel.offsetHeight;
    return {
      "state-peek": h - 116,
      "state-list": h * 0.42,
      "state-full": 0,
    };
  }

  function getCurrentTranslatePx() {
    const style = window.getComputedStyle(panel);
    const mat = new DOMMatrix(style.transform);
    return mat.m42;
  }

  function onStart(clientY) {
    startY = clientY;
    startTranslate = getCurrentTranslatePx();
    dragging = true;
    panel.classList.add("dragging");
  }

  function onMove(clientY) {
    if (!dragging) return;
    const delta = clientY - startY;
    let newY = startTranslate + delta;
    const h = panel.offsetHeight;
    newY = Math.max(0, Math.min(h - 116, newY));
    panel.style.transform = `translateY(${newY}px)`;
    currentY = newY;
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    panel.classList.remove("dragging");
    panel.style.transform = "";

    const snaps = getSnapPx();
    const diffs = Object.entries(snaps).map(([state, px]) => ({
      state, diff: Math.abs(currentY - px),
    }));
    diffs.sort((a, b) => a.diff - b.diff);
    setSheetState(diffs[0].state);
  }

  // Touch
  panelTop.addEventListener("touchstart", e => {
    if (sheetState === "state-full" || sheetState === "state-list") {
      // allow normal scroll only if body is at top
      if (body.scrollTop > 0) return;
    }
    onStart(e.touches[0].clientY);
  }, { passive: true });

  panelTop.addEventListener("touchstart", e => {
    onStart(e.touches[0].clientY);
  }, { passive: true });

  document.addEventListener("touchmove", e => {
    if (!dragging) return;
    onMove(e.touches[0].clientY);
  }, { passive: true });

  document.addEventListener("touchend", onEnd, { passive: true });

  // Tap the top area to cycle states (mobile)
  panelTop.addEventListener("click", () => {
    if (window.innerWidth >= 768) return;
    if (sheetState === "state-peek") setSheetState("state-list");
    else if (sheetState === "state-list") setSheetState("state-full");
    // state-full: tapping does nothing (user scrolls or drags down)
  });
}

// ─── MAP SETUP ─────────────────────────────────────────────────────────────
function initMap() {
  map = L.map("map", {
    zoomControl: false,
  }).setView([52.0, 19.5], 6);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
  }).addTo(map);

  // Zoom control top-right
  L.control.zoom({ position: "topright" }).addTo(map);
}

function addMarker(place) {
  const color = CITY_COLORS[place.city];

  const icon = L.divIcon({
    className: "",
    html: `<div class="custom-marker" style="background:${color}"><span>${place.icon}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const marker = L.marker([place.lat, place.lng], { icon })
    .addTo(map)
    .bindPopup(buildPopupHTML(place), { maxWidth: 240 });

  marker.on("click", () => {
    highlightCard(place.id);
    openSheet("state-list");
  });

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

// ─── LIST RENDERING ────────────────────────────────────────────────────────
function renderList(places) {
  const list = document.getElementById("place-list");
  list.innerHTML = "";

  document.getElementById("place-count").textContent =
    `${places.length} lugar${places.length !== 1 ? "es" : ""}`;

  const grouped = {};
  CITY_ORDER.forEach(c => (grouped[c] = []));
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
        <div class="place-chevron">›</div>
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
  const zoom = window.innerWidth < 768 ? 14 : 15;
  map.flyTo([place.lat, place.lng], zoom, { duration: 1.1 });
  setTimeout(() => markers[place.id] && markers[place.id].openPopup(), 1200);
}

// ─── DETAIL VIEW ───────────────────────────────────────────────────────────
function showDetail(id) {
  const place = PLACES.find(p => p.id === id);
  if (!place) return;

  if (activeCard !== id) {
    flyToMarker(place);
    highlightCard(id);
    activeCard = id;
  }

  openSheet("state-full");

  const list   = document.getElementById("place-list");
  const detail = document.getElementById("place-detail");
  const content = document.getElementById("detail-content");

  list.classList.add("hidden");
  detail.classList.remove("hidden");

  document.getElementById("panel-body").scrollTop = 0;

  const practical = place.practical || {};
  const practicalKeys = {
    entrada:    "Entrada",
    horario:    "Horario",
    precio:     "Precio",
    tiempo:     "Tiempo",
    transporte: "Transporte",
    tip:        "Consejo",
    aviso:      "Aviso",
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

// ─── FILTERS ───────────────────────────────────────────────────────────────
function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation(); // don't trigger panel-top tap
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

      // Back to list
      document.getElementById("place-list").classList.remove("hidden");
      document.getElementById("place-detail").classList.add("hidden");
      activeCard = null;

      // Open list state on mobile
      if (window.innerWidth < 768) openSheet("state-list");
    });
  });

  document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById("place-list").classList.remove("hidden");
    document.getElementById("place-detail").classList.add("hidden");
    activeCard = null;
    document.getElementById("panel-body").scrollTop = 0;
    if (window.innerWidth < 768) setSheetState("state-list");
  });
}

// ─── INIT ──────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  PLACES.forEach(addMarker);
  renderList(PLACES);
  setupFilters();
  setupDrag();
  setSheetState("state-peek");
});
