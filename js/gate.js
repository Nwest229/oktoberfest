/* ===== Crew password gate =================================================
   A light passphrase screen over the whole site. NOT strong security — it
   deters casual visitors and keeps the page out of search engines. The
   passphrase is compared as a SHA-256 hash (config.js holds only the hash).
   If SITE_PASSWORD_SHA256 is empty, the site is open to everyone.
   ========================================================================= */
(function () {
  "use strict";

  const cfg = window.OKTOBERFEST_CONFIG || {};
  const target = (cfg.SITE_PASSWORD_SHA256 || "").toLowerCase();
  const KEY = "okto_unlocked";
  const gate = document.getElementById("gate");
  const form = document.getElementById("gate-form");
  const input = document.getElementById("gate-input");
  const errEl = document.getElementById("gate-error");

  // No passphrase configured → nothing to gate.
  if (!target) {
    if (gate) gate.remove();
    document.documentElement.classList.remove("gated");
    return;
  }

  let unlocked = false;
  try {
    unlocked = localStorage.getItem(KEY) === target;
  } catch (e) {}

  function unlock() {
    try { localStorage.setItem(KEY, target); } catch (e) {}
    document.documentElement.classList.remove("gated");
    if (gate) gate.remove();
  }

  if (unlocked) {
    unlock();
    return;
  }

  // Locked: the <head> pre-check already added .gated so the gate is showing.
  async function sha256(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  if (form) {
    form.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      if (errEl) errEl.hidden = true;
      try {
        const h = (await sha256(input.value)).toLowerCase();
        if (h === target) {
          unlock();
        } else if (errEl) {
          errEl.textContent = "Nope — try again.";
          errEl.hidden = false;
          input.select();
        }
      } catch (e) {
        if (errEl) {
          errEl.textContent = "This browser blocked the check (needs https or localhost).";
          errEl.hidden = false;
        }
      }
    });
  }
  if (input) input.focus();
})();
