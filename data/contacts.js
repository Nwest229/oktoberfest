/* =========================================================================
   CONTACTS  —  edit this file to manage the crew.
   -------------------------------------------------------------------------
   Each person:
     name  : full name (first initials become the avatar)
     role  : short label (e.g. "Emergency", "Munich local"); "" for none
     phone : full number in international format, e.g. "+49 175 6021444"
             (used for Call / Text / Add-to-contacts — spaces are fine)
     emergency: true puts the card at the top with a red highlight
   Leave phone as "" if you don't have it yet.
   ========================================================================= */

window.CONTACTS = [
  { name: "Police",    role: "Emergency (Germany)",         phone: "110", emergency: true },
  { name: "Ambulance", role: "Emergency / Fire (Germany)",  phone: "112", emergency: true },

  { name: "Nicodème",  role: "", phone: "+49 175 6021444" },
  { name: "Gabriel",   role: "", phone: "+34 692 23 04 10" },
  { name: "Kirill",    role: "", phone: "+33 7 86 95 43 13" },
  { name: "Yann",      role: "", phone: "+32 478 92 35 10" },
  { name: "Carlota",   role: "", phone: "+34 630 78 45 87" },
  { name: "Paloma",    role: "", phone: "+34 650 83 39 65" },
  { name: "Almudena",  role: "", phone: "+34 690 90 73 66" },
  { name: "Teresa",    role: "", phone: "+39 391 796 6872" },
  { name: "Angélique", role: "", phone: "+41 79 326 01 95" }
];
