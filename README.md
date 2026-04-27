# Polonia Travel

Guía de viaje interactiva para un viaje a Polonia centrado en la Segunda Guerra Mundial y la historia del siglo XX. Diseñada para usarse desde el móvil durante el viaje, sin necesidad de ordenador.

## Acceso

**[→ Abrir la app](https://raulfb.github.io/travel-polonia/)**

> Para activar GitHub Pages: Settings → Pages → Branch: `gh-pages` → Save

---

## Secciones

### 🗺 Mapa histórico
Lugares de interés relacionados con la IIGM y el nazismo en las cuatro ciudades del viaje. Cada lugar incluye descripción histórica, curiosidades y información práctica (horarios, precios, cómo llegar).

**Ciudades cubiertas:**
- Auschwitz / Oświęcim — campo de concentración y exterminio
- Cracovia — gueto judío, fábrica de Schindler, campo de Płaszów
- Varsovia — gueto, Alzamiento de 1944, museos
- Gdansk — Westerplatte (primer disparo de la guerra), Museo de la IIGM

### 🍽 Restaurantes
Los mejores restaurantes españoles y gallegos en Cracovia, Varsovia y Gdansk. Datos contrastados con TripAdvisor, webs oficiales y blogs gastronómicos. Incluye descripción, qué pedir y información práctica.

**Destacados:**
- **Euskadi** (Cracovia) — cocina vasca, Guía Michelin
- **Bilbao** (Varsovia) — pintxos vascos, certificado Embajada de España
- **Tres Toros** (Varsovia) — pulpo a la gallega en carta
- **Hora de España** (Gdansk) — +3.250 reseñas, el mejor del norte de Polonia

### 💶 Cambio de divisas
Conversor PLN ↔ EUR en tiempo real. Descarga el tipo del día del Banco Central Europeo al abrir la app. Funciona sin conexión usando el último tipo guardado. Botones de cantidades rápidas para consultas rápidas al pagar.

### 🇵🇱 Polaco básico
Mini diccionario con ~100 palabras y frases esenciales organizadas por categorías, con pronunciación fonética en español (sílaba tónica en MAYÚSCULAS).

**Categorías:** Saludos · Orientación · Transporte · Comida · Números · Emergencias

---

## Uso en móvil

La app está diseñada mobile-first:

- El **mapa ocupa toda la pantalla** de fondo
- El **panel desliza desde abajo** con tres posiciones: asomado, medio y completo
- Se arrastra con el dedo o se toca para subir/bajar
- Funciona como **PWA** — se puede guardar en la pantalla de inicio del móvil

---

## Estructura del proyecto

```
index.html       — estructura principal
style.css        — estilos (mobile-first, dark theme)
app.js           — lógica: navegación, mapa, secciones, conversor
data.js          — lugares históricos (coordenadas, descripciones, curiosidades)
restaurants.js   — restaurantes españoles/gallegos (12 locales, 3 ciudades)
dict.js          — diccionario polaco (~100 entradas con pronunciación)
```

---

## Tecnologías

- [Leaflet.js](https://leafletjs.com/) — mapas interactivos
- [CARTO Dark Matter](https://carto.com/basemaps/) — tiles de mapa oscuro
- [Frankfurter API](https://www.frankfurter.app/) — tipos de cambio del BCE (gratis, sin API key)
- Sin frameworks, sin build step — HTML/CSS/JS puro

---

## Ciudades del viaje

| Ciudad | Foco principal |
|---|---|
| Oświęcim (Auschwitz) | Campo de concentración y exterminio Auschwitz I y II-Birkenau |
| Cracovia | Gueto de Podgórze, Fábrica de Schindler, campo de Płaszów, Kazimierz |
| Varsovia | Gueto de Varsovia, Alzamiento de 1944, POLIN, Umschlagplatz |
| Gdansk | Westerplatte, Museo de la IIGM, historia de Danzig |
