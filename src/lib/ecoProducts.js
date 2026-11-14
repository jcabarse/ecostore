// ------------------------------------------------------------
// Eco Store — DEMO products (3 items). Edit freely.
// Descriptions are made-up demo copy. Prices are placeholders.
//
// Photos are free stock photos from Pexels (https://www.pexels.com).
// To use your own photo instead, put it in /public (e.g. /public/rug.jpg)
// and set image: '/rug.jpg'
// ------------------------------------------------------------
export const ECO_PRODUCTS = [
  {
    id: 1,
    name: 'Recycled Charcoal Briquettes',
    category: 'Charcoal',
    description:
      'Clean-burning briquettes pressed from recycled coconut shell and wood offcuts. Long-lasting heat, less smoke, and zero virgin timber.',
    price: 20,
    image: 'https://images.pexels.com/photos/9263/summer-garden-dinner-eating.jpg?auto=compress&cs=tinysrgb&w=800',
    emoji: '🔥',
    badge: 'Made from recycled materials',
  },
  {
    id: 2,
    name: 'Handmade Eco Clay Pots',
    category: 'Pots',
    description:
      'Sturdy plant pots shaped by hand from natural clay and reclaimed fired-clay scrap. Breathable, plastic-free, and perfect for herbs and indoor greens.',
    price: 50,
    image: 'https://images.pexels.com/photos/9707245/pexels-photo-9707245.jpeg?auto=compress&cs=tinysrgb&w=800',
    emoji: '🪴',
    badge: 'Plastic-free',
  },
  {
    id: 3,
    name: 'Woven Recycled-Fiber Rug',
    category: 'Rugs',
    description:
      'A soft, durable floor rug hand-woven from upcycled fabric strips and natural fibers. Adds warmth to any room while keeping textile waste out of landfills.',
    price: 35,
    image: 'https://images.pexels.com/photos/8186478/pexels-photo-8186478.jpeg?auto=compress&cs=tinysrgb&w=800',
    emoji: '🧶',
    badge: 'Upcycled fibers',
  },
].map((p) => ({
  ...p,
  // Aliases so existing cart / checkout code that expects other field names still works
  title: p.name,
  image_url: p.image,
  img: p.image,
}));

export const formatPeso = (n) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);
