// Stand-in photographs from Unsplash (free licence). Replace with the
// company's own photography before launch; in production these become
// Filament-managed media.
export const photos = {
  familyHome: {
    id: 'photo-1730130596425-197566414dc4',
    alt: 'A family sitting together on the floor of their decorated home, smiling at a young child',
  },
  family: {
    id: 'photo-1780329946888-0db2441b249c',
    alt: 'A family of five, three generations, standing together outside their home',
  },
  house: {
    id: 'photo-1689649539122-a2ef8d486b03',
    alt: 'A single-storey home with a tiled roof and potted plants along the front',
  },
  apartments: {
    id: 'photo-1549499090-c9203d2b20ad',
    alt: 'A white residential apartment building against a clear sky',
  },
  laptopWoman: {
    id: 'photo-1743865318581-2e0e59e7292e',
    alt: 'A woman smiling as she works on a laptop at a bright table',
  },
  laptopReview: {
    id: 'photo-1683107695974-98a9fddb249a',
    alt: 'A woman at home reviewing figures on her laptop',
  },
  vendor: {
    id: 'photo-1761753088381-9fcaa087edae',
    alt: 'A street-side book seller with his stall under a large tree',
  },
  car: {
    id: 'photo-1649954459557-f77663765a48',
    alt: 'A man standing beside his car on a city street',
  },
  adviser: {
    id: 'photo-1771244688590-1e481dba1b5a',
    alt: 'An adviser at his desk with a laptop, ready for a client meeting',
  },
  phoneCall: {
    id: 'photo-1573633509389-0e3075dea01b',
    alt: 'A man smiling during a phone call, holding a cup of tea',
  },
  couple: {
    id: 'photo-1776741147201-cbaa6155646c',
    alt: 'A couple sitting together at home, talking over their plans',
  },
}

export function photoUrl(id, w, h, q = 72) {
  // crop=faces keeps people's heads in frame when the ratio changes
  const params = new URLSearchParams({ auto: 'format', fit: 'crop', crop: 'faces,center', w: String(w), q: String(q) })
  if (h) params.set('h', String(h))
  return `https://images.unsplash.com/${id}?${params}`
}
