// ------------------------------------------------------------
// Eco Store — one place for the shop's details.
// Edit the values here and the landing page, map and footer
// all update automatically.
// ------------------------------------------------------------
export const STORE = {
  name: 'Eco Store',
  barangay: 'Brgy. Alegria',
  city: 'Ormoc City',
  province: 'Leyte',
  region: 'Eastern Visayas (Region VIII)',
  country: 'Philippines',
  postalCode: '6541',

  // Approximate center of Barangay Alegria, Ormoc City (source: PhilAtlas).
  // TIP: to pin the exact shop, open Google Maps, right-click the spot,
  // click the coordinates to copy them, and paste them below.
  lat: 11.0052,
  lng: 124.6040,

  // Optional — leave as '' to hide. Anything you fill in appears on the page.
  phone: '',
  email: '',
  hours: '',          // e.g. 'Mon–Sat, 8:00 AM – 6:00 PM'
  facebook: '',       // full link, e.g. 'https://facebook.com/yourpage'
};

export const fullAddress = `${STORE.barangay}, ${STORE.city}, ${STORE.province} ${STORE.postalCode}, ${STORE.country}`;

export const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${STORE.lat},${STORE.lng}`;
export const googleDirectionsLink = `https://www.google.com/maps/dir/?api=1&destination=${STORE.lat},${STORE.lng}`;