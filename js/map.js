/* ===== Interactive Munich map (Leaflet + CARTO Voyager tiles) ===== */
(function () {
  "use strict";

  const COLORS = {
    blue: "#0a6ebd",
    amber: "#d99200",
    red: "#c0392b",
    green: "#2e9e5b",
    purple: "#7d4fbd",
    teal: "#0a9ca5"
  };

  let map = null;
  const esc = (window.OktoUtil && window.OktoUtil.esc) || ((s) => s);

  function pinIcon(color) {
    const c = COLORS[color] || COLORS.blue;
    return L.divIcon({
      className: "okto-pin",
      html:
        '<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.7 23.3 0 15 0z" fill="' +
        c +
        '"/><circle cx="15" cy="15" r="6" fill="#fff"/></svg>',
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -38]
    });
  }

  function gmapsUrl(item) {
    const q = item.address
      ? item.address
      : item.lat + "," + item.lng;
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  }

  function popupHtml(item) {
    const addr = item.address
      ? '<p class="popup-addr">' + esc(item.address) + "</p>"
      : "";
    return (
      '<div class="popup-cat">' + esc(item.cat || "") + "</div>" +
      '<h3 class="popup-title">' + esc(item.name) + "</h3>" +
      '<p class="popup-desc">' + esc(item.desc || "") + "</p>" +
      addr +
      '<a class="popup-gmaps" target="_blank" rel="noopener" href="' +
      gmapsUrl(item) +
      '">📍 Open in Google Maps</a>'
    );
  }

  function addLegendGroup(legend, title, entries) {
    if (!entries.length) return;
    const h = document.createElement("li");
    h.className = "legend-head";
    h.textContent = title;
    legend.appendChild(h);
    entries.forEach((e) => legend.appendChild(e));
  }

  function init() {
    const areas = window.AREAS || [];
    const spots = window.SPOTS || [];
    const routes = window.ROUTES || [];

    map = L.map("leaflet-map", { scrollWheelZoom: true });

    // --- Map style ---------------------------------------------------------
    // These tile providers are free and need NO API key. To restyle the map,
    // just swap which one is active below:
    //   Humanitarian (warm, clean):  https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png   subdomains "ab"
    //   Standard OSM (classic):      https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png      subdomains "abc"
    //   OSM German style (muted):    https://tile.openstreetmap.de/{z}/{x}/{y}.png
    //   Esri street map (detailed):  https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      maxZoom: 20,
      subdomains: "ab",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://www.hotosm.org/">HOT</a>'
    }).addTo(map);

    const legend = document.getElementById("spot-list");
    legend.innerHTML = "";
    const cityBounds = [];

    // ---- Areas (shaded circles) ----
    const areaEntries = areas.map((a) => {
      const col = COLORS[a.color] || COLORS.blue;
      const circle = L.circle([a.lat, a.lng], {
        radius: a.radius || 400,
        color: col,
        weight: 2,
        fillColor: col,
        fillOpacity: 0.14
      })
        .addTo(map)
        .bindPopup(popupHtml(a), { maxWidth: 260 })
        .bindTooltip(a.name, { permanent: true, direction: "center", className: "area-label" });
      cityBounds.push([a.lat, a.lng]);

      const li = document.createElement("li");
      li.innerHTML =
        '<span class="spot-dot" style="background:' + col + ';opacity:.5"></span>' +
        '<span><span class="s-name">' + esc(a.name) + "</span><br>" +
        '<span class="s-cat">' + esc(a.cat || "") + "</span></span>";
      li.addEventListener("click", () => {
        map.setView([a.lat, a.lng], 15, { animate: true });
        circle.openPopup();
      });
      return li;
    });

    // ---- Routes (coloured lines) ----
    const routeEntries = routes.map((r) => {
      const col = COLORS[r.color] || COLORS.blue;
      const line = L.polyline(r.points, {
        color: col,
        weight: 5,
        opacity: 0.85,
        dashArray: r.dashed ? "2 10" : null,
        lineCap: "round"
      })
        .addTo(map)
        .bindPopup(popupHtml({ name: r.name, cat: "Route", desc: r.desc }), {
          maxWidth: 260
        });

      const li = document.createElement("li");
      li.innerHTML =
        '<span class="route-line" style="background:' + col + '"></span>' +
        '<span><span class="s-name">' + esc(r.name) + "</span></span>";
      li.addEventListener("click", () => {
        map.fitBounds(line.getBounds(), { padding: [40, 40] });
        line.openPopup();
      });
      return li;
    });

    // ---- Spots (pins) ----
    const spotEntries = spots.map((s) => {
      const col = COLORS[s.color] || COLORS.blue;
      const m = L.marker([s.lat, s.lng], { icon: pinIcon(s.color) })
        .addTo(map)
        .bindPopup(popupHtml(s), { maxWidth: 260 });
      if (!s.farAway) cityBounds.push([s.lat, s.lng]);

      const li = document.createElement("li");
      li.innerHTML =
        '<span class="spot-dot" style="background:' + col + '"></span>' +
        '<span><span class="s-name">' + esc(s.name) + "</span><br>" +
        '<span class="s-cat">' + esc(s.cat || "") + "</span></span>";
      li.addEventListener("click", () => {
        map.setView([s.lat, s.lng], 16, { animate: true });
        m.openPopup();
      });
      return li;
    });

    addLegendGroup(legend, "Areas", areaEntries);
    addLegendGroup(legend, "Spots", spotEntries);
    addLegendGroup(legend, "Getting there", routeEntries);

    // Fit to the city cluster (airport stays out so the centre is readable)
    if (cityBounds.length > 1) {
      map.fitBounds(cityBounds, { padding: [50, 50] });
    } else if (cityBounds.length === 1) {
      map.setView(cityBounds[0], 14);
    } else {
      map.setView([48.1351, 11.582], 12);
    }
  }

  function refresh() {
    if (!map) {
      init();
    } else {
      setTimeout(() => map.invalidateSize(), 0);
    }
  }

  window.OktoMap = { refresh: refresh };

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("map").classList.contains("is-active")) {
      refresh();
    }
  });
})();
