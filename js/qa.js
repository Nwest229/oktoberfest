/* ===== Anonymous Q&A  =====================================================
   Two interchangeable stores:
     • SupabaseStore  — shared across everyone (needs config.js filled in)
     • LocalStore     — this browser only (default preview mode)
   Both expose the same async API: listQuestions(), addQuestion(), addAnswer().
   ========================================================================= */
(function () {
  "use strict";

  const esc = (window.OktoUtil && window.OktoUtil.esc) || ((s) => s);
  const cfg = window.OKTOBERFEST_CONFIG || {};
  const hasSupabase =
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_ANON_KEY &&
    window.supabase &&
    typeof window.supabase.createClient === "function";

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ---------- Local store (localStorage) ----------
  const LocalStore = {
    shared: false,
    _key: "okto_qa_v1",
    _read() {
      try {
        return JSON.parse(localStorage.getItem(this._key) || "[]");
      } catch (e) {
        return [];
      }
    },
    _write(list) {
      localStorage.setItem(this._key, JSON.stringify(list));
    },
    async listQuestions() {
      return this._read().sort((a, b) => b.created_at - a.created_at);
    },
    async addQuestion(text) {
      const list = this._read();
      list.push({ id: uid(), text: text, created_at: Date.now(), answers: [] });
      this._write(list);
    },
    async addAnswer(qid, text) {
      const list = this._read();
      const q = list.find((x) => x.id === qid);
      if (q) {
        q.answers = q.answers || [];
        q.answers.push({ id: uid(), text: text, created_at: Date.now() });
        this._write(list);
      }
    }
  };

  // ---------- Supabase store (shared) ----------
  function makeSupabaseStore() {
    const client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    return {
      shared: true,
      async listQuestions() {
        const { data: qs, error: e1 } = await client
          .from("questions")
          .select("*")
          .order("created_at", { ascending: false });
        if (e1) throw e1;
        const { data: ans, error: e2 } = await client
          .from("answers")
          .select("*")
          .order("created_at", { ascending: true });
        if (e2) throw e2;
        const byQ = {};
        (ans || []).forEach((a) => {
          (byQ[a.question_id] = byQ[a.question_id] || []).push({
            id: a.id,
            text: a.text,
            created_at: new Date(a.created_at).getTime()
          });
        });
        return (qs || []).map((q) => ({
          id: q.id,
          text: q.text,
          created_at: new Date(q.created_at).getTime(),
          answers: byQ[q.id] || []
        }));
      },
      async addQuestion(text) {
        const { error } = await client.from("questions").insert({ text: text });
        if (error) throw error;
      },
      async addAnswer(qid, text) {
        const { error } = await client
          .from("answers")
          .insert({ question_id: qid, text: text });
        if (error) throw error;
      }
    };
  }

  const store = hasSupabase ? makeSupabaseStore() : LocalStore;

  // ---------- Time formatting ----------
  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    const d = Math.floor(h / 24);
    return d + "d ago";
  }

  // ---------- DOM ----------
  const listEl = document.getElementById("qa-list");
  const formEl = document.getElementById("qa-form");
  const inputEl = document.getElementById("qa-input");
  const bannerEl = document.getElementById("qa-mode-banner");

  function showBanner() {
    if (store.shared) return; // shared mode: no banner needed
    bannerEl.hidden = false;
    bannerEl.innerHTML =
      "🔒 <strong>Preview mode.</strong> Questions are saved only on this device. " +
      "To let the whole crew share the same anonymous board, add your Supabase keys in " +
      "<code>config.js</code> — see <code>README.md</code>.";
  }

  function render(questions) {
    if (!questions.length) {
      listEl.innerHTML =
        '<div class="qa-empty">No questions yet — be the first to ask. 🍻</div>';
      return;
    }
    listEl.innerHTML = questions
      .map((q) => {
        const answers = (q.answers || [])
          .map(
            (a) =>
              '<div class="qa-answer">' +
              esc(a.text) +
              '<span class="a-time">answered ' +
              timeAgo(a.created_at) +
              "</span></div>"
          )
          .join("");
        return (
          '<article class="qa-card" data-qid="' + esc(q.id) + '">' +
          '<div class="qa-q"><span class="q-mark">Q</span>' +
          '<span class="q-text">' + esc(q.text) + "</span></div>" +
          '<div class="qa-meta">asked ' + timeAgo(q.created_at) +
          " · " + (q.answers ? q.answers.length : 0) + " answer" +
          ((q.answers && q.answers.length === 1) ? "" : "s") + "</div>" +
          (answers ? '<div class="qa-answers">' + answers + "</div>" : "") +
          '<form class="answer-form" data-qid="' + esc(q.id) + '">' +
          '<input type="text" maxlength="400" placeholder="Write an answer…" />' +
          '<button type="submit" class="btn btn-ghost btn-small">Answer</button>' +
          "</form>" +
          "</article>"
        );
      })
      .join("");
  }

  let refreshing = false;
  async function refresh() {
    if (refreshing) return;
    refreshing = true;
    try {
      render(await store.listQuestions());
    } catch (e) {
      listEl.innerHTML =
        '<div class="qa-empty">Couldn\'t load questions (' +
        esc(e.message || e) +
        "). Check your Supabase setup in <code>config.js</code>.</div>";
    } finally {
      refreshing = false;
    }
  }

  // Ask a question
  formEl.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    try {
      await store.addQuestion(text);
      await refresh();
    } catch (e) {
      alert("Could not post your question: " + (e.message || e));
    }
  });

  // Answer a question (event delegation)
  listEl.addEventListener("submit", async function (ev) {
    if (!ev.target.classList.contains("answer-form")) return;
    ev.preventDefault();
    const input = ev.target.querySelector("input");
    const text = input.value.trim();
    const qid = ev.target.dataset.qid;
    if (!text) return;
    input.value = "";
    try {
      await store.addAnswer(qid, text);
      await refresh();
    } catch (e) {
      alert("Could not post your answer: " + (e.message || e));
    }
  });

  // Refresh when the Q&A tab is opened, and periodically in shared mode
  const qaTabBtn = document.querySelector('.tab[data-tab="qa"]');
  if (qaTabBtn) qaTabBtn.addEventListener("click", refresh);
  if (store.shared) setInterval(refresh, 12000);

  document.addEventListener("DOMContentLoaded", function () {
    showBanner();
    refresh();
  });
})();
