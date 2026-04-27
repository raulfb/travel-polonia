// ─── STATE ────────────────────────────────────────────────────────────────
let map;
let placeMarkers = {}, restMarkers = {};
let activeFilter = "all", activeRestFilter = "all", activeDictCat = "all";
let activeCard = null, activeRestCard = null;
let sheetState = "state-peek";
let activeSection = "map";

// Currency state
let eurPln = 4.25;
let convDir = "pln2eur";

const PLN_QUICK = [10, 20, 50, 100, 200, 500];
const EUR_QUICK = [5, 10, 20, 50, 100, 200];

const STATES = ["state-peek", "state-list", "state-full"];

// ─── SECTION SWITCHING ────────────────────────────────────────────────────
function switchSection(section) {
  activeSection = section;

  document.querySelectorAll(".nav-btn, .desktop-tab").forEach(b =>
    b.classList.toggle("active", b.dataset.section === section));

  ["map","rest","curr","dict"].forEach(s => {
    document.getElementById(`top-${s}`)?.classList.toggle("hidden", s !== section);
    document.getElementById(`section-${s}`)?.classList.toggle("hidden", s !== section);
  });

  // Map markers visibility
  Object.values(placeMarkers).forEach(m =>
    section === "map"  ? m.addTo(map) : map.removeLayer(m));
  Object.values(restMarkers).forEach(m =>
    section === "rest" ? m.addTo(map) : map.removeLayer(m));

  const noMap = section === "dict" || section === "rest" || section === "curr";
  document.getElementById("panel-top").style.cursor = noMap ? "default" : "";

  if (window.innerWidth < 768) {
    setSheetState(noMap ? "state-full" : "state-peek");
  }

  if (section === "map")  map.flyTo([52.0, 19.5], 6, { duration: 1 });
  if (section === "rest") map.flyTo([52.0, 19.5], 6, { duration: 1 });
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
    return new DOMMatrix(window.getComputedStyle(panel).transform).m42;
  }

  function snapPositions() {
    const h = panel.offsetHeight;
    return { "state-peek": h - 116, "state-list": h * 0.42, "state-full": 0 };
  }

  function onStart(y) {
    if (activeSection === "dict" || activeSection === "rest") return;
    startY = y;
    currentY = getCurrentTranslatePx();
    dragging = true;
    panel.classList.add("dragging");
  }

  function onMove(y) {
    if (!dragging) return;
    const body = document.getElementById("panel-body");
    if (sheetState === "state-full" && body.scrollTop > 0) {
      dragging = false; panel.classList.remove("dragging"); return;
    }
    const delta = y - startY;
    const h = panel.offsetHeight;
    const newY = Math.max(0, Math.min(h - 116, currentY + delta));
    panel.style.transform = `translateY(${newY}px)`;
    currentY = newY; startY = y;
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false; panel.classList.remove("dragging");
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

  panelTop.addEventListener("click", () => {
    if (activeSection !== "map" || window.innerWidth >= 768) return;
    if (sheetState === "state-peek") setSheetState("state-list");
    else if (sheetState === "state-list") setSheetState("state-full");
  });
}

// ─── MAP INIT ─────────────────────────────────────────────────────────────
function initMap() {
  map = L.map("map", { zoomControl: false }).setView([52.0, 19.5], 6);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>', maxZoom: 19,
  }).addTo(map);
  L.control.zoom({ position: "topright" }).addTo(map);
}

// ─── PLACE MARKERS ────────────────────────────────────────────────────────
function addPlaceMarker(place) {
  const icon = L.divIcon({
    className: "",
    html: `<div class="custom-marker" style="background:${CITY_COLORS[place.city]}"><span>${place.icon}</span></div>`,
    iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
  });
  const marker = L.marker([place.lat, place.lng], { icon })
    .addTo(map)
    .bindPopup(buildPlacePopup(place), { maxWidth: 240 });
  marker.on("click", () => {
    highlightCard(place.id);
    if (window.innerWidth < 768) setSheetState("state-list");
  });
  placeMarkers[place.id] = marker;
}

function buildPlacePopup(place) {
  return `
    <div class="popup-city">${place.cityLabel}</div>
    <div class="popup-name">${place.name}</div>
    <div class="popup-type">${place.type}</div>
    <button class="popup-btn" onclick="showPlaceDetail('${place.id}')">Ver detalle →</button>
  `;
}

// ─── RESTAURANT MARKERS ───────────────────────────────────────────────────
function addRestMarker(rest) {
  const icon = L.divIcon({
    className: "",
    html: `<div class="custom-marker" style="background:#e67e22"><span>${rest.icon}</span></div>`,
    iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
  });
  const marker = L.marker([rest.lat, rest.lng], { icon })
    .bindPopup(buildRestPopup(rest), { maxWidth: 240 });
  // hidden initially (map section active by default)
  marker.on("click", () => {
    highlightRestCard(rest.id);
    if (window.innerWidth < 768) setSheetState("state-list");
  });
  restMarkers[rest.id] = marker;
}

function buildRestPopup(rest) {
  return `
    <div class="popup-city">${rest.cityLabel}</div>
    <div class="popup-name">${rest.icon} ${rest.name}</div>
    <div class="popup-type">${rest.type}</div>
    <div style="margin-top:4px">
      <span style="font-size:0.72rem;padding:2px 8px;border-radius:10px;background:rgba(230,126,34,0.2);color:#e67e22;font-family:Arial">${rest.price}</span>
    </div>
    <button class="popup-btn" style="background:#e67e22" onclick="showRestDetail('${rest.id}')">Ver detalle →</button>
  `;
}

// ─── PLACE LIST ───────────────────────────────────────────────────────────
function renderPlaceList(places) {
  const list = document.getElementById("place-list");
  list.innerHTML = "";
  document.getElementById("place-count").textContent =
    `${places.length} lugar${places.length !== 1 ? "es" : ""}`;

  const grouped = {};
  CITY_ORDER.forEach(c => (grouped[c] = []));
  places.forEach(p => { if (grouped[p.city]) grouped[p.city].push(p); });

  CITY_ORDER.forEach(city => {
    const group = grouped[city];
    if (!group?.length) return;
    const title = document.createElement("div");
    title.className = "city-group-title";
    title.textContent = group[0].cityLabel.split(" — ")[0].split(" / ")[0];
    title.style.color = CITY_COLORS[city];
    list.appendChild(title);
    group.forEach(place => {
      const card = document.createElement("div");
      card.className = "place-card"; card.id = `card-${place.id}`;
      card.innerHTML = `
        <div class="place-icon">${place.icon}</div>
        <div class="place-info">
          <h3>${place.name}</h3>
          <div class="place-city">${place.cityLabel}</div>
          <div class="place-type">${place.type}</div>
        </div>
        <div class="place-chevron">›</div>
      `;
      card.addEventListener("click", () => { flyTo(place.lat, place.lng, 14); showPlaceDetail(place.id); });
      list.appendChild(card);
    });
  });
}

function highlightCard(id) {
  document.querySelectorAll(".place-card").forEach(c => c.classList.remove("active"));
  const card = document.getElementById(`card-${id}`);
  if (card) { card.classList.add("active"); card.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
}

function showPlaceDetail(id) {
  const place = PLACES.find(p => p.id === id);
  if (!place) return;
  if (activeCard !== id) { flyTo(place.lat, place.lng, 14); highlightCard(id); activeCard = id; }
  if (activeSection !== "map") switchSection("map");
  if (window.innerWidth < 768) setSheetState("state-full");

  document.getElementById("place-list").classList.add("hidden");
  document.getElementById("place-detail").classList.remove("hidden");
  document.getElementById("panel-body").scrollTop = 0;

  const p = place.practical || {};
  const keys = { entrada:"Entrada", horario:"Horario", precio:"Precio", tiempo:"Tiempo", transporte:"Transporte", tip:"Consejo", aviso:"Aviso" };
  const practHTML = Object.entries(keys).filter(([k]) => p[k])
    .map(([k, label]) => `<div class="practical-item"><span class="p-label">${label}</span><span class="p-value">${p[k]}</span></div>`).join("");
  const curHTML = (place.curiosities || []).map(c => `<li>${c}</li>`).join("");
  const warnHTML = p.aviso ? `<div class="warning-box"><strong>⚠ Importante:</strong> ${p.aviso}</div>` : "";

  document.getElementById("detail-content").innerHTML = `
    <div class="detail-header">
      <div class="detail-city" style="color:${CITY_COLORS[place.city]}">${place.cityLabel}</div>
      <h2>${place.icon} ${place.name}</h2>
      <div class="detail-type">${place.type}</div>
    </div>
    <div class="detail-section"><h4>Descripcion</h4><p>${place.description}</p></div>
    <div class="detail-section"><h4>Curiosidades e historia</h4><ul class="curiosity-list">${curHTML}</ul></div>
    <div class="detail-section"><h4>Informacion practica</h4><div class="practical-grid">${practHTML}</div>${warnHTML}</div>
    ${directionsBtn(place.lat, place.lng, place.name)}
  `;
}

// ─── RESTAURANT LIST ──────────────────────────────────────────────────────
function renderRestList(rests) {
  const list = document.getElementById("rest-list");
  list.innerHTML = "";
  document.getElementById("rest-count").textContent =
    `${rests.length} restaurante${rests.length !== 1 ? "s" : ""}`;

  const order = ["cracovia", "varsovia", "gdansk"];
  const grouped = {}; order.forEach(c => (grouped[c] = []));
  rests.forEach(r => { if (grouped[r.city]) grouped[r.city].push(r); });

  order.forEach(city => {
    const group = grouped[city];
    if (!group?.length) return;
    const title = document.createElement("div");
    title.className = "rest-group-title";
    title.textContent = group[0].cityLabel.split(" · ")[0];
    list.appendChild(title);
    group.forEach(rest => {
      const card = document.createElement("div");
      card.className = "rest-card"; card.id = `rest-card-${rest.id}`;
      card.innerHTML = `
        <div class="rest-icon">${rest.icon}</div>
        <div class="rest-info">
          <h3>${rest.name}</h3>
          <div class="rest-meta">
            <span class="rest-district">${rest.cityLabel.split(" · ")[1] || ""}</span>
            <span class="rest-type-tag">${rest.type.split(" · ")[0]}</span>
          </div>
        </div>
        <div class="rest-price">${rest.price}</div>
      `;
      card.addEventListener("click", () => { flyTo(rest.lat, rest.lng, 15); showRestDetail(rest.id); });
      list.appendChild(card);
    });
  });
}

function highlightRestCard(id) {
  document.querySelectorAll(".rest-card").forEach(c => c.classList.remove("active"));
  const card = document.getElementById(`rest-card-${id}`);
  if (card) { card.classList.add("active"); card.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
}

function showRestDetail(id) {
  const rest = RESTAURANTS.find(r => r.id === id);
  if (!rest) return;
  if (activeRestCard !== id) { flyTo(rest.lat, rest.lng, 15); highlightRestCard(id); activeRestCard = id; }
  if (activeSection !== "rest") switchSection("rest");
  if (window.innerWidth < 768) setSheetState("state-full");

  document.getElementById("rest-list").classList.add("hidden");
  document.getElementById("rest-detail").classList.remove("hidden");
  document.getElementById("panel-body").scrollTop = 0;

  const p = rest.practical || {};
  const keys = { direccion:"Dirección", horario:"Horario", precio:"Precio", reserva:"Reserva", tip:"Consejo", web:"Web" };
  const practHTML = Object.entries(keys).filter(([k]) => p[k])
    .map(([k, label]) => `<div class="practical-item"><span class="p-label">${label}</span><span class="p-value">${p[k]}</span></div>`).join("");
  const orderHTML = (rest.order || []).map(o => `<li>${o}</li>`).join("");

  document.getElementById("rest-detail-content").innerHTML = `
    <div class="rest-detail-header">
      <div class="rest-detail-city">${rest.cityLabel}</div>
      <h2>${rest.icon} ${rest.name}</h2>
      <div class="rest-detail-meta">
        <span class="rest-detail-type">${rest.type}</span>
        <span class="rest-detail-price">${rest.price}</span>
      </div>
    </div>
    <div class="detail-section"><h4>Sobre el restaurante</h4><p>${rest.description}</p></div>
    <div class="detail-section"><h4>Que pedir</h4><ul class="order-list">${orderHTML}</ul></div>
    <div class="detail-section"><h4>Informacion practica</h4><div class="practical-grid">${practHTML}</div></div>
    ${restExternalLinks(rest)}
    <div class="rest-warning">⚠ Verifica horarios y disponibilidad antes de ir — los restaurantes pueden cambiar.</div>
  `;
}

// ─── EXTERNAL LINKS ───────────────────────────────────────────────────────
function restExternalLinks(rest) {
  const { lat, lng, name, links = {} } = rest;
  const btns = [];

  btns.push(directionsBtn(lat, lng, name));

  if (links.ta) {
    btns.push(`<a class="ext-link-btn ext-ta" href="${links.ta}" target="_blank" rel="noopener">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
      </svg>
      TripAdvisor
    </a>`);
  }

  if (links.web) {
    const domain = new URL(links.web).hostname.replace("www.", "");
    btns.push(`<a class="ext-link-btn ext-web" href="${links.web}" target="_blank" rel="noopener">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      ${domain}
    </a>`);
  }

  return `<div class="ext-links-row">${btns.join("")}</div>`;
}

// ─── DIRECTIONS BUTTON ────────────────────────────────────────────────────
function directionsBtn(lat, lng, name) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_name=${encodeURIComponent(name)}`;
  return `<a class="directions-btn" href="${url}" target="_blank" rel="noopener">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
    Cómo llegar
  </a>`;
}

// ─── SHARED FLY TO ────────────────────────────────────────────────────────
function flyTo(lat, lng, zoom) {
  const z = window.innerWidth < 768 ? Math.min(zoom, 14) : zoom;
  map.flyTo([lat, lng], z, { duration: 1.1 });
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
      renderPlaceList(filtered);
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

// ─── RESTAURANT FILTERS ───────────────────────────────────────────────────
function buildRestFilters() {
  const row = document.getElementById("rest-city-filters");
  REST_CITY_FILTERS.forEach(f => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (f.id === "all" ? " active" : "");
    btn.dataset.city = f.id;
    btn.textContent = f.label;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      row.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeRestFilter = f.id;
      const filtered = activeRestFilter === "all" ? RESTAURANTS : RESTAURANTS.filter(r => r.city === activeRestFilter);
      renderRestList(filtered);

      // Sync map markers visibility
      RESTAURANTS.forEach(r => {
        const m = restMarkers[r.id];
        if (!m) return;
        if (activeRestFilter === "all" || r.city === activeRestFilter) m.addTo(map);
        else map.removeLayer(m);
      });

      if (activeRestFilter !== "all") {
        const c = CITY_CENTERS[activeRestFilter];
        if (c) map.flyTo(c, 13, { duration: 1 });
      } else {
        map.flyTo([52.0, 19.5], 6, { duration: 1 });
      }
      document.getElementById("rest-list").classList.remove("hidden");
      document.getElementById("rest-detail").classList.add("hidden");
      activeRestCard = null;
      if (window.innerWidth < 768) setSheetState("state-list");
    });
    row.appendChild(btn);
  });

  document.getElementById("rest-back-btn").addEventListener("click", () => {
    document.getElementById("rest-list").classList.remove("hidden");
    document.getElementById("rest-detail").classList.add("hidden");
    activeRestCard = null;
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
      row.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("dict-active"));
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
    e.es.toLowerCase().includes(q) || e.pl.toLowerCase().includes(q) || e.pron.toLowerCase().includes(q));

  if (!entries.length) {
    list.innerHTML = `<div class="dict-empty">Sin resultados para "${query}"</div>`; return;
  }

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

// ─── CURRENCY CONVERTER ───────────────────────────────────────────────────
function initCurrency() {
  // Load cached rate from localStorage
  const cached = localStorage.getItem("plneur_rate");
  const cachedTime = localStorage.getItem("plneur_time");
  if (cached) {
    eurPln = parseFloat(cached);
    document.getElementById("curr-rate-val").textContent = eurPln.toFixed(4);
    if (cachedTime) {
      const mins = Math.round((Date.now() - parseInt(cachedTime)) / 60000);
      const label = mins < 60
        ? `Hace ${mins} min${mins !== 1 ? "s" : ""}`
        : `Hace ${Math.round(mins / 60)}h`;
      document.getElementById("curr-rate-time").textContent = label;
    }
  }

  buildQuickBtns();
  setupDirectionBtns();
  document.getElementById("curr-input").addEventListener("input", convert);
  document.getElementById("curr-refresh-btn").addEventListener("click", () => fetchRate(true));

  // Silently try to fetch fresh rate on load
  fetchRate(false);
}

function fetchRate(showFeedback) {
  const btn = document.getElementById("curr-refresh-btn");
  if (showFeedback) { btn.textContent = "↻ Actualizando…"; btn.classList.add("loading"); }

  fetch("https://api.frankfurter.app/latest?from=EUR&to=PLN")
    .then(r => r.json())
    .then(data => {
      if (data.rates?.PLN) {
        eurPln = data.rates.PLN;
        localStorage.setItem("plneur_rate", eurPln);
        localStorage.setItem("plneur_time", Date.now());
        document.getElementById("curr-rate-val").textContent = eurPln.toFixed(4);
        document.getElementById("curr-rate-time").textContent = "Actualizado ahora";
        convert();
      }
    })
    .catch(() => {
      if (showFeedback) document.getElementById("curr-rate-time").textContent = "Sin conexión — tipo almacenado";
    })
    .finally(() => {
      btn.textContent = "↻ Actualizar";
      btn.classList.remove("loading");
    });
}

function convert() {
  const raw = parseFloat(document.getElementById("curr-input").value);
  if (isNaN(raw) || raw === 0) {
    document.getElementById("curr-result").textContent = convDir === "pln2eur" ? "€ —" : "— zł";
    return;
  }
  if (convDir === "pln2eur") {
    const eur = raw / eurPln;
    document.getElementById("curr-result").textContent =
      `€ ${eur.toFixed(2).replace(".", ",")}`;
  } else {
    const pln = raw * eurPln;
    document.getElementById("curr-result").textContent =
      `${pln.toFixed(2).replace(".", ",")} zł`;
  }
}

function buildQuickBtns() {
  const row = document.getElementById("curr-quick-btns");
  row.innerHTML = "";
  const amounts = convDir === "pln2eur" ? PLN_QUICK : EUR_QUICK;
  const sym = convDir === "pln2eur" ? "zł" : "€";
  amounts.forEach(amt => {
    const btn = document.createElement("button");
    btn.className = "quick-btn";
    btn.textContent = `${amt} ${sym}`;
    btn.addEventListener("click", () => {
      document.getElementById("curr-input").value = amt;
      convert();
    });
    row.appendChild(btn);
  });
}

function setupDirectionBtns() {
  document.querySelectorAll(".dir-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".dir-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      convDir = btn.dataset.dir;

      const isP2E = convDir === "pln2eur";
      document.getElementById("curr-input-symbol").textContent = isP2E ? "zł" : "€";
      document.getElementById("curr-from-label").textContent = isP2E ? "Pagas en Polonia" : "Pagas en euros";
      document.getElementById("curr-input").value = "";
      document.getElementById("curr-result").textContent = isP2E ? "€ —" : "— zł";
      buildQuickBtns();
    });
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
    <button class="desktop-tab" data-section="rest">🍽 Restaurantes</button>
    <button class="desktop-tab" data-section="curr">💶 Cambio</button>
    <button class="desktop-tab" data-section="dict">🇵🇱 Polaco</button>
  `;
  panelTop.insertBefore(tabBar, panelTop.children[1]);
  tabBar.querySelectorAll(".desktop-tab").forEach(btn => {
    btn.addEventListener("click", () => switchSection(btn.dataset.section));
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  PLACES.forEach(addPlaceMarker);
  RESTAURANTS.forEach(addRestMarker);
  renderPlaceList(PLACES);
  renderRestList(RESTAURANTS);
  setupMapFilters();
  buildRestFilters();
  buildDictFilters();
  renderDict();
  setupDictSearch();
  setupNav();
  setupDrag();
  injectDesktopTabs();
  initCurrency();
  setSheetState("state-peek");
});
