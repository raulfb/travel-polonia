// ─── STATE ────────────────────────────────────────────────────────────────
let map, markers = {}, activeFilter = "all", activeCard = null;
let sheetState = "state-peek";
let activeSection = "map";
let activeDictCat = "all";

const STATES = ["state-peek", "state-list", "state-full"];

// ─── SECTION SWITCHING ────────────────────────────────────────────────────
function switchSection(section) {
  activeSection = section;

  // Nav buttons
  document.querySelectorAll(".nav-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.section === section));
  document.querySelectorAll(".desktop-tab").forEach(b =>
    b.classList.toggle("active", b.dataset.section === section));

  // Panel tops
  document.getElementById("top-map").classList.toggle("hidden", section !== "map");
  document.getElementById("top-dict").classList.toggle("hidden", section !== "dict");

  // Panel body sections
  document.getElementById("section-map").classList.toggle("hidden", section !== "map");
  document.getElementById("section-dict").classList.toggle("hidden", section !== "dict");

  if (section === "dict") {
    if (window.innerWidth < 768) setSheetState("state-full");
    document.getElementById("panel-top").style.cursor = "default";
  } else {
    document.getElementById("panel-top").style.cursor = "";
    if (window.innerWidth < 768) setSheetState("state-peek");
  }
}

// ─── BOTTOM SHEET ─────────────────────────────────────────────────────────
function setSheetState(state, animate = true) {
  const panel = document.getElementById("panel");
  if (!animate) panel.classList.add("dragging");
  STATES.forEach(s => panel.classList.remove(s));
  panel.classList.add(state);
  sheetState = state;
  if (!animate) requestAnimationFrame(() => panel.classList.remove("dragging"));
}

function setupDrag() {
  const panel    = document.getElementById("panel");
  const panelTop = document.getElementById("panel-top");

  let startY = 0, currentY = 0, dragging = false;

  function getCurrentTranslatePx() {
    const mat = new DOMMatrix(window.getComputedStyle(panel).transform);
    return mat.m42;
  }

  function snapPositions() {
    const h = panel.offsetHeight;
    return {
      "state-peek": h - 116,
      "state-list": h * 0.42,
      "state-full": 0,
    };
  }

  function onStart(y) {
    if (activeSection === "dict") return;
    startY = y;
    currentY = getCurrentTranslatePx();
    dragging = true;
    panel.classList.add("dragging");
  }

  function onMove(y) {
    if (!dragging) return;
    const body = document.getElementById("panel-body");
    if (sheetState === "state-full" && body.scrollTop > 0) {
      dragging = false;
      panel.classList.remove("dragging");
      return;
    }
    const delta = y - startY;
    const h = panel.offsetHeight;
    const newY = Math.max(0, Math.min(h - 116, currentY + delta));
    panel.style.transform = `translateY(${newY}px)`;
    currentY = newY;
    startY = y;
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    panel.classList.remove("dragging");
    panel.style.transform = "";

    const snaps = snapPositions();
    const nearest = Object.entries(snaps)
      .map(([s, px]) => ({ s, diff: Math.abs(currentY - px) }))
      .sort((a, b) => a.diff - b.diff)[0].s;
    setSheetState(nearest);
  }

  panelTop.addEventListener("touchstart", e => onStart(e.touches[0].clientY), { passive: true });
  document.addEventListener("touchmove",  e => { if (dragging) onMove(e.touches[0].clientY); }, { passive: true });
  document.addEventListener("touchend",   onEnd, { passive: true });

  // Tap panel-top to advance state
  panelTop.addEventListener("click", () => {
    if (activeSection === "dict" || window.innerWidth >= 768) return;
    if (sheetState === "state-peek") setSheetState("state-list");
    else if (sheetState === "state-list") setSheetState("state-full");
  });
}

// ─── MAP ──────────────────────────────────────────────────────────────────
function initMap() {
  map = L.map("map", { zoomControl: false }).setView([52.0, 19.5], 6);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
  }).addTo(map);

  L.control.zoom({ position: "topright" }).addTo(map);
}

function addMarker(place) {
  const color = CITY_COLORS[place.city];
  const icon = L.divIcon({
    className: "",
    html: `<div class="custom-marker" style="background:${color}"><span>${place.icon}</span></div>`,
    iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
  });

  const marker = L.marker([place.lat, place.lng], { icon })
    .addTo(map)
    .bindPopup(buildPopupHTML(place), { maxWidth: 240 });

  marker.on("click", () => {
    highlightCard(place.id);
    if (window.innerWidth < 768) setSheetState("state-list");
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

// ─── PLACE LIST ───────────────────────────────────────────────────────────
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
    if (!group || !group.length) return;

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
      card.addEventListener("click", () => { flyToMarker(place); showDetail(place.id); });
      list.appendChild(card);
    });
  });
}

function highlightCard(id) {
  document.querySelectorAll(".place-card").forEach(c => c.classList.remove("active"));
  const card = document.getElementById(`card-${id}`);
  if (card) { card.classList.add("active"); card.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
}

function flyToMarker(place) {
  const zoom = window.innerWidth < 768 ? 14 : 15;
  map.flyTo([place.lat, place.lng], zoom, { duration: 1.1 });
  setTimeout(() => markers[place.id]?.openPopup(), 1200);
}

function showDetail(id) {
  const place = PLACES.find(p => p.id === id);
  if (!place) return;

  if (activeCard !== id) { flyToMarker(place); highlightCard(id); activeCard = id; }

  if (activeSection !== "map") switchSection("map");
  if (window.innerWidth < 768) setSheetState("state-full");

  document.getElementById("place-list").classList.add("hidden");
  document.getElementById("place-detail").classList.remove("hidden");
  document.getElementById("panel-body").scrollTop = 0;

  const practical = place.practical || {};
  const practicalKeys = {
    entrada: "Entrada", horario: "Horario", precio: "Precio",
    tiempo: "Tiempo", transporte: "Transporte", tip: "Consejo", aviso: "Aviso",
  };

  const practicalHTML = Object.entries(practicalKeys)
    .filter(([k]) => practical[k])
    .map(([k, label]) => `
      <div class="practical-item">
        <span class="p-label">${label}</span>
        <span class="p-value">${practical[k]}</span>
      </div>
    `).join("");

  const curiositiesHTML = (place.curiosities || []).map(c => `<li>${c}</li>`).join("");

  const warningHTML = practical.aviso
    ? `<div class="warning-box"><strong>⚠ Importante:</strong> ${practical.aviso}</div>` : "";

  document.getElementById("detail-content").innerHTML = `
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

// ─── MAP FILTERS ──────────────────────────────────────────────────────────
function setupMapFilters() {
  document.querySelectorAll("#city-filters .filter-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      document.querySelectorAll("#city-filters .filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.city;

      const filtered = activeFilter === "all" ? PLACES : PLACES.filter(p => p.city === activeFilter);
      renderList(filtered);

      if (activeFilter === "all") map.flyTo([52.0, 19.5], 6, { duration: 1 });
      else { const c = CITY_CENTERS[activeFilter]; if (c) map.flyTo(c, 13, { duration: 1 }); }

      document.getElementById("place-list").classList.remove("hidden");
      document.getElementById("place-detail").classList.add("hidden");
      activeCard = null;

      if (window.innerWidth < 768) setSheetState("state-list");
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

// ─── DICTIONARY ───────────────────────────────────────────────────────────
function buildDictFilters() {
  const row = document.getElementById("dict-filters");
  DICT_CATS.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat.id === "all" ? " dict-active" : "");
    btn.dataset.cat = cat.id;
    btn.textContent = cat.label;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      document.querySelectorAll("#dict-filters .filter-btn").forEach(b => b.classList.remove("dict-active"));
      btn.classList.add("dict-active");
      activeDictCat = cat.id;
      renderDict();
    });
    row.appendChild(btn);
  });
}

function renderDict(query = "") {
  const list = document.getElementById("dict-list");
  list.innerHTML = "";
  const q = query.toLowerCase().trim();

  let entries = DICT;
  if (activeDictCat !== "all") entries = entries.filter(e => e.cat === activeDictCat);
  if (q) entries = entries.filter(e =>
    e.es.toLowerCase().includes(q) ||
    e.pl.toLowerCase().includes(q) ||
    e.pron.toLowerCase().includes(q));

  if (!entries.length) {
    list.innerHTML = `<div class="dict-empty">Sin resultados para "${query}"</div>`;
    return;
  }

  // Group by category only when showing all cats and no search
  const showGroups = activeDictCat === "all" && !q;
  let lastCat = null;

  entries.forEach(entry => {
    if (showGroups && entry.cat !== lastCat) {
      lastCat = entry.cat;
      const catInfo = DICT_CATS.find(c => c.id === entry.cat);
      if (catInfo) {
        const title = document.createElement("div");
        title.className = "dict-cat-title";
        title.textContent = catInfo.label;
        list.appendChild(title);
      }
    }

    const card = document.createElement("div");
    card.className = "dict-card";
    card.innerHTML = `
      <div class="dict-emoji">${entry.emoji}</div>
      <div class="dict-info">
        <div class="dict-es">${entry.es}</div>
        <div class="dict-pl">${entry.pl}</div>
        <span class="dict-pron">🔊 ${entry.pron}</span>
      </div>
    `;
    list.appendChild(card);
  });
}

function setupDictSearch() {
  const input = document.getElementById("dict-search");
  let timer;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => renderDict(input.value), 180);
  });
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => switchSection(btn.dataset.section));
  });
}

// ─── DESKTOP TABS ─────────────────────────────────────────────────────────
function injectDesktopTabs() {
  if (window.innerWidth < 768) return;
  const panelTop = document.getElementById("panel-top");
  const tabBar = document.createElement("div");
  tabBar.id = "desktop-tabs";
  tabBar.innerHTML = `
    <button class="desktop-tab active" data-section="map">🗺 Mapa</button>
    <button class="desktop-tab" data-section="dict">🇵🇱 Polaco</button>
  `;
  panelTop.insertBefore(tabBar, panelTop.firstChild.nextSibling); // after drag-handle
  tabBar.querySelectorAll(".desktop-tab").forEach(btn => {
    btn.addEventListener("click", () => switchSection(btn.dataset.section));
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  PLACES.forEach(addMarker);
  renderList(PLACES);
  setupMapFilters();
  setupDrag();
  buildDictFilters();
  renderDict();
  setupDictSearch();
  setupNav();
  injectDesktopTabs();
  setSheetState("state-peek");
});
