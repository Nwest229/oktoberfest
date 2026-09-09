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
  SUPABASE_URL: "https://qhuraralayauwkzndfeg.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_UtTH-wlX0yEATbJBFqo46w_u2seFUC1",  // the "anon public" key from Supabase → Project Settings → API

  /* ---- Crew password gate ---------------------------------------------
     Visitors must type this passphrase to see the site (deters casual
     visitors + keeps it off search engines). It is NOT strong security.
     Below is the SHA-256 hash of the passphrase — the phrase itself is
     never stored here.
        Current passphrase:  wiesn2026   ← share this with the crew
     To change it, run in a terminal:
        printf '%s' "YOUR NEW PHRASE" | shasum -a 256
     then paste the resulting hash below. */
  SITE_PASSWORD_SHA256: "56d70a6e163adbea3bb529b986166173078b721b23946c392322c03ba4b410e4"
};
