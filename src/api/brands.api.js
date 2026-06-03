import API from './api';

// Known brand metadata — logo path + display name normalisation
const BRAND_META = {
  toyota:     { display: "Toyota",     logo: "/images/Brands/toyota.png"     },
  honda:      { display: "Honda",      logo: "/images/Brands/honda.png"      },
  mazda:      { display: "Mazda",      logo: "/images/Brands/mazda.png"      },
  suzuki:     { display: "Suzuki",     logo: "/images/Brands/suzuki.png"     },
  mg:         { display: "MG",         logo: "/images/Brands/mg.png"         },
  byd:        { display: "BYD",        logo: "/images/Brands/byd.png"        },
  mercedes:   { display: "Mercedes",   logo: "/images/Brands/mercedes.png"   },
  "mercedes-benz": { display: "Mercedes", logo: "/images/Brands/mercedes.png" },
  bmw:        { display: "BMW",        logo: "/images/Brands/bmw.png"        },
  volvo:      { display: "Volvo",      logo: "/images/Brands/volvo.png"      },
  volkswagen: { display: "Volkswagen", logo: "/images/Brands/volkswagen.png" },
  vw:         { display: "Volkswagen", logo: "/images/Brands/volkswagen.png" },
  audi:       { display: "Audi",       logo: "/images/Brands/audi.png"       },
};

// Try /brands endpoint; fall back to extracting brands from /cars
export const getAllBrands = async () => {
  try {
    const res = await API.get('/brands');
    if (res.data) return res;
  } catch (_) {}

  // Fallback: derive brands from the cars listing
  const res = await API.get('/cars', { params: { limit: 200 } });
  const cars = res.data?.cars ?? res.data ?? [];

  const seen = new Set();
  const brands = [];

  for (const car of cars) {
    const raw = (car.brand || "").trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const meta = BRAND_META[key] ?? {
      display: raw,
      logo: `/images/Brands/${key}.png`,
    };

    brands.push({
      name: meta.display,
      slug: key,
      logo: meta.logo,
    });
  }

  return { data: { data: brands } };
};
