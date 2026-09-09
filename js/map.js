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
  let savedBounds = null;
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
    // Only show the Google Maps button for real places (not routes).
    const hasPlace = item.address || (item.lat != null && item.lng != null);
    const maps = hasPlace
      ? '<a class="popup-gmaps" target="_blank" rel="noopener" href="' +
        gmapsUrl(item) +
        '">📍 Open in Google Maps</a>'
      : "";
    return (
      '<div class="popup-cat">' + esc(item.cat || "") + "</div>" +
      '<h3 class="popup-title">' + esc(item.name) + "</h3>" +
      '<p class="popup-desc">' + esc(item.desc || "") + "</p>" +
      addr +
      maps
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

    // ---- Routes (real-colour double lines + station dots) ----
    const routeEntries = routes.map((r) => {
      const pts = (r.stations || []).map((s) => [s.lat, s.lng]);
      const outer = (r.colors && r.colors[0]) || "#0a6ebd";
      const inner = (r.colors && r.colors[1]) || "#ffffff"; // single colour → white centre
      const routePopup = popupHtml({ name: r.name, cat: r.tag || "Route", desc: r.desc });

      // Double line: thick outer colour + thinner inner colour on top.
      const outerLine = L.polyline(pts, {
        color: outer, weight: 8, opacity: 1, lineCap: "round", lineJoin: "round"
      }).addTo(map);
      const innerLine = L.polyline(pts, {
        color: inner, weight: 3.5, opacity: 1, lineCap: "round", lineJoin: "round"
      }).addTo(map);

      [outerLine, innerLine].forEach((ln) => {
        ln.bindTooltip(r.tag || r.name, { sticky: true, direction: "top", className: "line-tag" });
        ln.bindPopup(routePopup, { maxWidth: 260 });
      });

      // Station dots with name-on-hover.
      (r.stations || []).forEach((s) => {
        L.circleMarker([s.lat, s.lng], {
          radius: 4.5, color: "#ffffff", weight: 2, fillColor: "#3a3a3a", fillOpacity: 1
        })
          .addTo(map)
          .bindTooltip(s.name, { direction: "top", className: "station-tip" });
      });

      const group = L.featureGroup([outerLine, innerLine]);
      const li = document.createElement("li");
      const swatch =
        r.colors && r.colors.length >= 2
          ? "linear-gradient(to bottom, " + outer + " 0 34%, " + inner + " 34% 66%, " + outer + " 66% 100%)"
          : "linear-gradient(to bottom, " + outer + " 0 34%, #fff 34% 66%, " + outer + " 66% 100%)";
      li.innerHTML =
        '<span class="route-line" style="background:' + swatch + '"></span>' +
        '<span><span class="s-name">' + esc(r.name) + "</span></span>";
      li.addEventListener("click", () => {
        map.fitBounds(group.getBounds(), { padding: [40, 40] });
        outerLine.openPopup();
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

    // Remember the city cluster so we can re-fit whenever the map is shown
    // (the airport stays out of it so the centre stays readable).
    savedBounds = cityBounds.length ? L.latLngBounds(cityBounds) : null;
    fitCity();
  }

  // Fit the view to the saved city bounds. Deferred so the container has its
  // real size first (Leaflet mis-measures a just-revealed/hidden container).
  function fitCity() {
    setTimeout(function () {
      map.invalidateSize();
      if (savedBounds) {
        map.fitBounds(savedBounds, { padding: [40, 40] });
      } else {
        map.setView([48.1351, 11.582], 12);
      }
    }, 60);
  }

  function refresh() {
    if (!map) {
      init();
    } else {
      fitCity();
    }
  }

  window.OktoMap = { refresh: refresh };

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("map").classList.contains("is-active")) {
      refresh();
    }
  });
})();
