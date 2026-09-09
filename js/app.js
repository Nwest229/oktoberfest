/* ===== Tab navigation + Schedule + Contacts rendering ===== */
(function () {
  "use strict";

  // ---------- Tabs ----------
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  function activate(tabName) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === tabName;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach((p) => p.classList.toggle("is-active", p.id === tabName));
    // Leaflet needs a nudge once its container becomes visible
    if (tabName === "map" && window.OktoMap && window.OktoMap.refresh) {
      window.OktoMap.refresh();
    }
    if (history.replaceState) history.replaceState(null, "", "#" + tabName);
  }

  tabs.forEach((t) => t.addEventListener("click", () => activate(t.dataset.tab)));

  // Open the tab named in the URL hash, if valid
  const fromHash = (location.hash || "").replace("#", "");
  if (fromHash && document.getElementById(fromHash)) activate(fromHash);

  // ---------- Helpers ----------
  function initials(name) {
    return name
      .replace(/\(.*?\)/g, "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase() || "?";
  }
  function avatarColor(name) {
    const palette = ["#0a6ebd", "#d99200", "#2e7d43", "#c0392b", "#7d4fbd", "#0b8a8a"];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return palette[h % palette.length];
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  // ---------- Schedule ----------
  function renderSchedule() {
    const root = document.getElementById("schedule-list");
    const days = window.SCHEDULE || [];
    if (!days.length) {
      root.innerHTML =
        '<div class="empty-note">No schedule yet — add your days in <code>data/schedule.js</code>.</div>';
      return;
    }
    root.innerHTML = days
      .map((day) => {
        const items = (day.items || [])
          .map((it) => {
            const tag = it.tag
              ? `<span class="tl-tag ${esc(it.tag)}">${esc(it.tag)}</span>`
              : "";
            const detail = it.detail ? `<span>${esc(it.detail)}</span>` : "";
            return `<li>
              <span class="tl-time">${esc(it.time)}</span>
              <span class="tl-body"><strong>${esc(it.title)}</strong>${detail}${tag}</span>
            </li>`;
          })
          .join("");
        const note = day.note ? `<div class="day-note">${esc(day.note)}</div>` : "";
        return `<article class="day-card">
          <div class="day-header">
            <h3>${esc(day.title)}</h3>
            <span class="day-date">${esc(day.date || "")}</span>
          </div>
          ${note}
          <ul class="timeline">${items}</ul>
        </article>`;
      })
      .join("");
  }

  // ---------- Contacts ----------
  // Build a downloadable vCard so tapping "Add to contacts" opens the
  // phone's contacts app pre-filled.
  function downloadVCard(name, phone) {
    let v = "BEGIN:VCARD\r\nVERSION:3.0\r\nFN:" + name + "\r\n";
    if (phone) v += "TEL;TYPE=CELL:" + phone.replace(/\s+/g, "") + "\r\n";
    v += "END:VCARD\r\n";
    const blob = new Blob([v], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name.replace(/[^\w]+/g, "_") + ".vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function renderContacts() {
    const root = document.getElementById("contacts-grid");
    const people = (window.CONTACTS || []).slice();
    if (!people.length) {
      root.innerHTML =
        '<div class="empty-note">No contacts yet — add people in <code>data/contacts.js</code>.</div>';
      return;
    }
    // Emergency contacts float to the top, order otherwise preserved.
    people.sort((a, b) => (b.emergency ? 1 : 0) - (a.emergency ? 1 : 0));

    root.innerHTML = people
      .map((p) => {
        const tel = (p.phone || "").replace(/\s+/g, "");
        const actions = tel
          ? `<a class="c-btn call" href="tel:${esc(tel)}">📞 Call</a>
             <a class="c-btn" href="sms:${esc(tel)}">💬 Text</a>`
          : `<span class="c-btn c-btn-muted">No number yet</span>`;
        const role = p.role ? `<div class="c-role">${esc(p.role)}</div>` : "";
        const phoneLine = p.phone ? `<div class="c-phone">${esc(p.phone)}</div>` : "";
        const avColor = p.emergency ? "#c0392b" : avatarColor(p.name);
        return `<div class="contact-card${p.emergency ? " is-emergency" : ""}">
          <div class="contact-top">
            <div class="avatar" style="background:${avColor}">${esc(initials(p.name))}</div>
            <div class="contact-info">
              <div class="c-name">${esc(p.name)}</div>
              ${role}
              ${phoneLine}
            </div>
          </div>
          <div class="contact-actions">${actions}</div>
          <button class="c-btn add-btn" data-name="${esc(p.name)}" data-phone="${esc(p.phone || "")}">＋ Add to contacts</button>
        </div>`;
      })
      .join("");

    // One delegated handler for every "Add to contacts" button.
    root.onclick = function (ev) {
      const btn = ev.target.closest(".add-btn");
      if (!btn) return;
      downloadVCard(btn.dataset.name, btn.dataset.phone);
    };
  }

  // Expose small helpers other modules reuse
  window.OktoUtil = { esc: esc };

  document.addEventListener("DOMContentLoaded", function () {
    renderSchedule();
    renderContacts();
  });
})();
