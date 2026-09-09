/* =========================================================================
   MAP DATA  —  three lists that draw on the Munich map:
     window.AREAS   → shaded circles for neighbourhoods / zones
     window.SPOTS   → pins for exact places
     window.ROUTES  → coloured lines for the train journeys
   -------------------------------------------------------------------------
   Coordinates: open Google Maps, right-click the exact spot, click the
   lat,lng numbers to copy, and paste them here.
   Pin/area colours: "blue", "amber", "red", "green", "purple", "teal".
   ========================================================================= */

/* ---- Shaded areas (neighbourhoods / zones) ---------------------------- */
window.AREAS = [
  {
    name: "Maxvorstadt",
    cat: "Base camp",
    desc: "🛏️🥴 Home turf. Where we (eventually) sleep it off. Museums by day, snoring by night.",
    lat: 48.1492, lng: 11.5660, radius: 750,
    color: "purple"
  },
  {
    name: "Marienplatz",
    cat: "City centre",
    desc: "Munich's living room. Glockenspiel, tourists, and the beating heart of the old town.",
    lat: 48.1374, lng: 11.5755, radius: 230,
    color: "blue"
  },
  {
    name: "Theresienwiese",
    cat: "The Wiesn",
    desc: "The Promised Land. ~6 million people, 14 giant tents, and one very ambitious liver. This is why we came.",
    lat: 48.1316, lng: 11.5497, radius: 430,
    color: "amber"
  }
];

/* ---- Exact pins ------------------------------------------------------- */
window.SPOTS = [
  {
    name: "Our flat",
    cat: "Home base",
    desc: "🏠 Where we sleep — right by Münchner Freiheit (U3/U6). Exact address still loading… update me once we have it!",
    address: "",              // paste the address here when you have it
    lat: 48.1616, lng: 11.5860,
    color: "purple"
  },
  {
    name: "Saturday afterparty",
    cat: "Afterparty",
    desc: "🎉 When the tents kick us out, the party relocates here. Second wind required.",
    address: "Friedrich-Herschel-Straße 27, 81679 München",
    lat: 48.1492, lng: 11.6135,
    color: "red"
  },
  {
    name: "Wiesn entrance (ours)",
    cat: "Meeting point",
    desc: "🚪 Our gate into the madness. Meet HERE, because you WILL lose each other inside.",
    address: "Matthias-Pschorr-Straße 1, 80339 München",
    lat: 48.1339, lng: 11.5470,
    color: "amber"
  },
  {
    name: "München Hauptbahnhof (HBF)",
    cat: "Transport hub",
    desc: "🚆 Every journey — and every hangover — begins here. Main interchange for S-Bahn and U-Bahn.",
    address: "München Hauptbahnhof",
    lat: 48.1401, lng: 11.5600,
    color: "blue"
  },
  {
    name: "Munich Airport (MUC)",
    cat: "Airport",
    desc: "✈️ Wheels down. The adventure — and the S-Bahn saga — starts here. It's a long way out of town.",
    address: "Flughafen München MUC",
    lat: 48.3538, lng: 11.7861,
    color: "blue",
    farAway: true            // kept out of the initial zoom so the city stays readable
  }
];

/* ---- Train routes (coloured lines) ------------------------------------
   Each route is an approximate path through the key stations — enough to
   see the journey on the map, not the exact track. Click it for details.
   ----------------------------------------------------------------------- */
window.ROUTES = [
  {
    name: "S8 · Airport → city",
    desc: "Fastest way in: hop on the S8 at the airport (~40 min) to Marienplatz, then the U6 north to Münchner Freiheit for the flat. (S1 also works.) Tip: a group day ticket beats single fares.",
    color: "green",
    dashed: false,
    points: [
      [48.3538, 11.7861], // Airport
      [48.2249, 11.6720], // Ismaning
      [48.1730, 11.6300], // Johanneskirchen
      [48.1270, 11.6045], // Ostbahnhof
      [48.1320, 11.5900], // Rosenheimer Platz
      [48.1373, 11.5754], // Marienplatz
      [48.1396, 11.5658], // Karlsplatz (Stachus)
      [48.1401, 11.5600]  // Hauptbahnhof
    ]
  },
  {
    name: "U6 / U7 · Münchner Freiheit → Sendlinger Tor",
    desc: "Our flat's line into town: U6 or U7 from Münchner Freiheit down through Odeonsplatz and Marienplatz to Sendlinger Tor. Change at Odeonsplatz onto the U4/U5 for the Wiesn.",
    color: "blue",
    dashed: false,
    points: [
      [48.1616, 11.5860], // Münchner Freiheit
      [48.1584, 11.5858], // Giselastraße
      [48.1507, 11.5810], // Universität
      [48.1425, 11.5773], // Odeonsplatz
      [48.1373, 11.5754], // Marienplatz
      [48.1335, 11.5668]  // Sendlinger Tor
    ]
  },
  {
    name: "U4 / U5 · Odeonsplatz → Schwanthalerhöhe",
    desc: "The Wiesn line: U4 or U5 from Odeonsplatz westbound. Get off at Theresienwiese — right at the tents. Change here from the U6 at Odeonsplatz.",
    color: "teal",
    dashed: true,
    points: [
      [48.1425, 11.5773], // Odeonsplatz
      [48.1396, 11.5658], // Karlsplatz (Stachus)
      [48.1401, 11.5600], // Hauptbahnhof
      [48.1360, 11.5478], // Theresienwiese
      [48.1344, 11.5405]  // Schwanthalerhöhe
    ]
  }
];
