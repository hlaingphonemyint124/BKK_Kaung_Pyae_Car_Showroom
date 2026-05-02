import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Fuel, Settings2, Palette, Gauge, Disc3, Users, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getCarById } from "../api/cars.api";
import {
  getCarsForSale,
  getCarsForRent,
  getPublicCarDocuments,
  getPublicRentalTerms,
} from "../api/showroom.api";
import "./CarDetail.css";
import { useLanguage } from "../context/LanguageContext";

const FUEL_COLORS = {
  petrol:           "#f59e0b",
  diesel:           "#78716c",
  hybrid:           "#14b8a6",
  electric:         "#3b82f6",
  "plug-in hybrid": "#8b5cf6",
  Petrol:  "#f59e0b",
  Diesel:  "#78716c",
  Hybrid:  "#14b8a6",
  EV:      "#3b82f6",
};

export default function CarDetail() {
  const { t }    = useLanguage();
  const { id }   = useParams();
  const navigate = useNavigate();

  const [car, setCar]               = useState(null);
  const [allCars, setAllCars]       = useState([]);
  const [documents, setDocuments]   = useState([]);
  const [rentalTerms, setRentalTerms] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [activeImg, setActiveImg]   = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx]   = useState(0);

  useEffect(() => {
    setActiveImg(0);
    setLoading(true);
    setAllCars([]);

    Promise.all([
      getCarById(id),
      getPublicCarDocuments(id).catch(() => null),
      getPublicRentalTerms().catch(() => null),
    ])
      .then(([carRes, docsRes, termsRes]) => {
        const carData = carRes.data?.car || carRes.data;
        setCar(carData);

        const docs =
          docsRes?.documents || docsRes?.data?.documents || docsRes?.data || [];
        setDocuments(docs);

        const terms =
          termsRes?.terms || termsRes?.data?.terms || termsRes?.data ||
          (Array.isArray(termsRes) ? termsRes : []);
        setRentalTerms(terms);

        // Fetch sibling list for prev/next and similar cars
        const isRentalCar = !!carData.rent_price_per_day && !carData.sale_price;
        const listFn = isRentalCar ? getCarsForRent : getCarsForSale;
        listFn().then(res => setAllCars(res.data.cars ?? [])).catch(() => {});
      })
      .catch(() => setError("Car not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // Escape key closes lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => { if (e.key === "Escape") setLightboxOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen]);

  if (loading) return <div className="cd-loading">{t("cd_loading")}</div>;
  if (error || !car) return <div className="cd-loading">{error || t("cd_not_found")}</div>;

  const images =
    car.images?.length > 0
      ? car.images.map(img => img.storage_path)
      : [car.img || "/images/placeholder.png"];

  const fuel    = car.fuel  || car.fuel_type  || "";
  const drive   = car.drive || car.drive_type || "";
  const isRental = !!car.rent_price_per_day && !car.sale_price;

  // Prev / Next navigation
  const currentIdx = allCars.findIndex(c => String(c.id) === String(id));
  const prevCar = currentIdx > 0 ? allCars[currentIdx - 1] : null;
  const nextCar = currentIdx !== -1 && currentIdx < allCars.length - 1 ? allCars[currentIdx + 1] : null;

  // Similar cars — same brand first, then closest price
  const myPrice = isRental ? Number(car.rent_price_per_day || 0) : Number(car.sale_price || 0);
  const similarCars = allCars
    .filter(c => String(c.id) !== String(id))
    .sort((a, b) => {
      const aSameBrand = a.brand === car.brand ? 1 : 0;
      const bSameBrand = b.brand === car.brand ? 1 : 0;
      if (aSameBrand !== bSameBrand) return bSameBrand - aSameBrand;
      const aPrice = isRental ? Number(a.rent_price_per_day || 0) : Number(a.sale_price || 0);
      const bPrice = isRental ? Number(b.rent_price_per_day || 0) : Number(b.sale_price || 0);
      return Math.abs(aPrice - myPrice) - Math.abs(bPrice - myPrice);
    })
    .slice(0, 4);

  const specs = [
    { key: "fuel",         Icon: Fuel,      color: FUEL_COLORS[fuel] ?? "#ef2b2d", label: t("spec_fuel"),         value: fuel  || "—" },
    { key: "transmission", Icon: Settings2, color: "#ef2b2d",                      label: t("spec_transmission"), value: car.transmission || "—" },
    { key: "color",        Icon: Palette,   color: "#ef2b2d",                      label: t("spec_color"),        value: car.color || "—" },
    { key: "engine",       Icon: Gauge,     color: "#ef2b2d",                      label: t("spec_engine"),       value: car.engine || "—" },
    { key: "drive",        Icon: Disc3,     color: "#ef2b2d",                      label: t("spec_drive"),        value: drive || "—" },
    { key: "seats",        Icon: Users,     color: "#ef2b2d",                      label: t("spec_seats"),        value: car.seats ? `${car.seats} Seaters` : "—" },
  ];

  const dailyPrice = isRental ? Number(car.rent_price_per_day) || 0 : 0;
  const currency   = car.currency_code || "THB";

  const infoRows = isRental
    ? [
        ...(dailyPrice ? [
          { label: t("cd_7day"),  value: `${Math.round(dailyPrice * 7  * 0.95).toLocaleString()} ${currency}`, highlight: true },
          { label: t("cd_30day"), value: `${Math.round(dailyPrice * 30 * 0.90).toLocaleString()} ${currency}`, highlight: true },
        ] : []),
        { label: t("cd_status"), value: car.status || "—" },
      ]
    : [
        { label: t("spec_mileage"), value: car.mileage_km ? `${Number(car.mileage_km).toLocaleString()} km` : "—" },
        { label: t("cd_model_year"), value: car.year || "—" },
        { label: t("cd_status"), value: car.status || "—" },
        ...(car.vin ? [{ label: t("cd_vin"), value: car.vin }] : []),
      ];

  const displaySimilarPrice = (c) => {
    if (!isRental) return c.sale_price ? `${Number(c.sale_price).toLocaleString()} ${c.currency_code || "THB"}` : "—";
    return c.rent_price_per_day ? `${Number(c.rent_price_per_day).toLocaleString()} ${c.currency_code || "THB"}/day` : "—";
  };

  const openLightbox = (idx) => { setLightboxIdx(idx); setLightboxOpen(true); };
  const lightboxPrev = () => setLightboxIdx(i => (i - 1 + images.length) % images.length);
  const lightboxNext = () => setLightboxIdx(i => (i + 1) % images.length);

  return (
    <div className="cd-wrapper">

      {/* ── Breadcrumb + Back + Prev/Next ── */}
      <div className="cd-nav">
        <nav className="cd-breadcrumb" aria-label="breadcrumb">
          <Link to="/" className="cd-breadcrumb-link">Home</Link>
          <span className="cd-breadcrumb-sep">›</span>
          <Link to="/showroom" className="cd-breadcrumb-link">{t("cd_breadcrumb_shop")}</Link>
          <span className="cd-breadcrumb-sep">›</span>
          <span className="cd-breadcrumb-current">{car.brand} {car.model}</span>
        </nav>
        <div className="cd-nav-right">
          {prevCar && (
            <button className="cd-nav-btn" onClick={() => navigate(`/car/${prevCar.id}`)}>
              <ChevronLeft size={14} />{t("cd_prev")}
            </button>
          )}
          {nextCar && (
            <button className="cd-nav-btn" onClick={() => navigate(`/car/${nextCar.id}`)}>
              {t("cd_next")}<ChevronRight size={14} />
            </button>
          )}
          <button className="cd-back-btn" onClick={() => navigate("/showroom")}>
            {t("cd_back")}
          </button>
        </div>
      </div>

      <div className="cd-shell">

        {/* ── LEFT COLUMN ── */}
        <div className="cd-left">

          {/* Media gallery */}
          <div className="cd-panel cd-panel--media">
            <div className="cd-main-img cd-main-img--clickable" onClick={() => openLightbox(activeImg)}>
              <img src={images[activeImg]} alt={`${car.brand} ${car.model}`} />
              {(car.status === "sold" || car.status === "rented") && (
                <div className="cd-status-badge">{car.status}</div>
              )}
              <div className="cd-zoom-hint">⊕</div>
            </div>
            {images.length > 1 && (
              <div className="cd-thumbs">
                {images.map((src, i) => (
                  <button
                    key={i}
                    className={`cd-thumb${i === activeImg ? " cd-thumb--active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Name + Price */}
          <div className="cd-panel">
            <p className="cd-section-label">{isRental ? t("cd_rental_tag") : t("cd_sale_tag")}</p>
            <h1 className="cd-title">{car.year} {car.brand} {car.model}</h1>
            <div className="cd-price-row">
              <span className="cd-price">
                {car.sale_price
                  ? Number(car.sale_price).toLocaleString()
                  : Number(car.rent_price_per_day).toLocaleString()}
              </span>
              <span className="cd-currency">
                {car.currency_code || "THB"}{isRental ? " / day" : ""}
              </span>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="cd-right">

          {/* Spec grid */}
          <div className="cd-panel">
            <p className="cd-section-label">{t("cd_specs")}</p>
            <div className="cd-spec-grid">
              {specs.map(({ key, Icon, color, label, value }) => (
                <div key={key} className="cd-spec-item">
                  <div className="cd-spec-icon" style={{ color }}><Icon size={22} strokeWidth={2} /></div>
                  <div className="cd-spec-value">{value}</div>
                  <div className="cd-spec-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Info rows */}
          <div className="cd-panel">
            <p className="cd-section-label">{t("cd_details")}</p>
            {infoRows.map(({ label, value, highlight }) => (
              <div key={label} className="cd-info-row">
                <span className="cd-info-label">{label}</span>
                <span className={`cd-info-value${highlight ? " cd-info-value--highlight" : ""}`}>{value}</span>
              </div>
            ))}
          </div>

          {documents.length > 0 && (
            <div className="cd-panel">
              <p className="cd-section-label">{t("cd_documents")}</p>
              {documents.map((doc, i) => (
                <div key={i} className="cd-info-row">
                  <span className="cd-info-label">{doc.field_name || doc.key}</span>
                  <span className="cd-info-value">{doc.field_value || doc.value || "—"}</span>
                </div>
              ))}
            </div>
          )}

          {rentalTerms.length > 0 && (
            <div className="cd-panel">
              <p className="cd-section-label">{t("cd_terms")}</p>
              <div className="cd-terms-grid">
                {rentalTerms.map((term, i) => (
                  <div key={term.id || i} className="cd-term-item">
                    <span className="cd-term-icon">✔</span>
                    <span className="cd-term-text">{(term.description || term.title).replace("-", ": ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="cd-panel cd-panel--contact">
            <p className="cd-contact-text">{t("cd_interested")}</p>
            <button
              className="cd-contact-btn"
              onClick={() => navigate(`/contact?car=${encodeURIComponent(`${car.year ? car.year + " " : ""}${car.brand} ${car.model}`)}`)}
            >
              {t("cd_contact_btn")}
            </button>
          </div>

        </div>
      </div>

      {/* ── Similar Cars ── */}
      {similarCars.length > 0 && (
        <div className="cd-similar">
          <div className="cd-similar-inner">
            <h2 className="cd-similar-title">{t("cd_similar")}</h2>
            <div className="cd-similar-row">
              {similarCars.map(sc => (
                <div key={sc.id} className="cd-similar-card" onClick={() => navigate(`/car/${sc.id}`)}>
                  <div className="cd-similar-img">
                    <img
                      src={sc.images?.[0]?.storage_path || sc.img || "/images/placeholder.png"}
                      alt={`${sc.brand} ${sc.model}`}
                    />
                  </div>
                  <div className="cd-similar-body">
                    <p className="cd-similar-brand">{sc.brand}</p>
                    <p className="cd-similar-model">{sc.model}</p>
                    <p className="cd-similar-price">{displaySimilarPrice(sc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div className="cd-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="cd-lightbox-close" onClick={() => setLightboxOpen(false)}>
            <X size={20} />
          </button>
          <div className="cd-lightbox-img-wrap" onClick={e => e.stopPropagation()}>
            <img src={images[lightboxIdx]} alt={`${car.brand} ${car.model}`} />
          </div>
          {images.length > 1 && (
            <>
              <button
                className="cd-lightbox-arrow cd-lightbox-arrow--prev"
                onClick={e => { e.stopPropagation(); lightboxPrev(); }}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                className="cd-lightbox-arrow cd-lightbox-arrow--next"
                onClick={e => { e.stopPropagation(); lightboxNext(); }}
              >
                <ChevronRight size={28} />
              </button>
              <div className="cd-lightbox-counter">{lightboxIdx + 1} / {images.length}</div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
