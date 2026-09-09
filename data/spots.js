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

/* ---- Train routes (coloured double lines) ------------------------------
   Drawn as a double line in the REAL MVG line colours. Hover a station dot
   for its name, or the line for the line tag (e.g. "U6 / U7").
     tag      : short line tag shown on hover
     colors   : [outer, inner] real line colours. One colour = solid line
                with a white centre; two colours = a two-tone double line.
     stations : ordered stops { name, lat, lng } — path + hover labels.
   MVG colours used below (tweak any hex if you prefer):
     S8 #00934b · U4 #00a79d · U5 #be7b01 · U6 #0065ae · U7 #c6362f
   ----------------------------------------------------------------------- */
window.ROUTES = [
  {
    name: "S8 · Airport → city",
    tag: "S8",
    desc: "Fastest way in: hop on the S8 at the airport (~40 min) to Marienplatz, then the U6 north to Münchner Freiheit for the flat. (S1 also works.) Tip: a group day ticket beats single fares.",
    colors: ["#00934b"],
    stations: [
      { name: "Munich Airport", lat: 48.3538, lng: 11.7861 },
      { name: "Ismaning", lat: 48.2249, lng: 11.6720 },
      { name: "Johanneskirchen", lat: 48.1730, lng: 11.6300 },
      { name: "Ostbahnhof", lat: 48.1270, lng: 11.6045 },
      { name: "Rosenheimer Platz", lat: 48.1320, lng: 11.5900 },
      { name: "Marienplatz", lat: 48.1373, lng: 11.5754 },
      { name: "Karlsplatz (Stachus)", lat: 48.1396, lng: 11.5658 },
      { name: "Hauptbahnhof", lat: 48.1401, lng: 11.5600 }
    ]
  },
  {
    name: "U6 / U7 · Münchner Freiheit → Sendlinger Tor",
    tag: "U6 / U7",
    desc: "Our flat's line into town: U6 or U7 from Münchner Freiheit down through Odeonsplatz and Marienplatz to Sendlinger Tor. Change at Odeonsplatz onto the U4/U5 for the Wiesn.",
    colors: ["#0065ae", "#c6362f"],
    stations: [
      { name: "Münchner Freiheit", lat: 48.1616, lng: 11.5860 },
      { name: "Giselastraße", lat: 48.1584, lng: 11.5858 },
      { name: "Universität", lat: 48.1507, lng: 11.5810 },
      { name: "Odeonsplatz", lat: 48.1425, lng: 11.5773 },
      { name: "Marienplatz", lat: 48.1373, lng: 11.5754 },
      { name: "Sendlinger Tor", lat: 48.1335, lng: 11.5668 }
    ]
  },
  {
    name: "U4 / U5 · Odeonsplatz → Schwanthalerhöhe",
    tag: "U4 / U5",
    desc: "The Wiesn line: U4 or U5 from Odeonsplatz westbound. Get off at Theresienwiese — right at the tents. Change here from the U6 at Odeonsplatz.",
    colors: ["#00a79d", "#be7b01"],
    stations: [
      { name: "Odeonsplatz", lat: 48.1425, lng: 11.5773 },
      { name: "Karlsplatz (Stachus)", lat: 48.1396, lng: 11.5658 },
      { name: "Hauptbahnhof", lat: 48.1401, lng: 11.5600 },
      { name: "Theresienwiese", lat: 48.1360, lng: 11.5478 },
      { name: "Schwanthalerhöhe", lat: 48.1344, lng: 11.5405 }
    ]
  }
];
