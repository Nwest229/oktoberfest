/* =========================================================================
   CONFIG  —  Q&A backend (optional but recommended)
   -------------------------------------------------------------------------
   The anonymous Q&A works in TWO modes:

   1. LOCAL MODE (default, no setup):
      Questions are saved only in your own browser. Great for previewing,
      but your friends will NOT see each other's questions.

   2. SHARED MODE (recommended for the trip):
      Everyone sees the same questions & answers, still anonymously.
      To turn this on, create a free Supabase project and paste the two
      values below. Full step-by-step instructions are in README.md.
   ========================================================================= */

window.OKTOBERFEST_CONFIG = {
  SUPABASE_URL: "",       // e.g. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: ""   // the "anon public" key from Supabase → Project Settings → API
};
