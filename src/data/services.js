export const guides = [];

export const transport = [];

export const seedGuides = guides.map(g => ({
  ...g,
  cover_image: g.coverImage,
  reviews_count: g.reviews,
  price_unit: g.priceUnit,
}));

export const seedTransport = transport.map(t => ({
  ...t,
  cover_image: t.coverImage,
  reviews_count: t.reviews,
  owner_name: t.owner,
}));
