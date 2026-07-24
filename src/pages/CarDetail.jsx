import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Fuel,
  Settings2,
  Palette,
  Gauge,
  Disc3,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getCarById } from "../api/cars.api";
import {
  getCarsForSale,
  getCarsForRent,
  getPublicCarDocuments,
  getPublicRentalTerms,
} from "../api/showroom.api";
import { getApprovedFeedbacks } from "../api/feedbacks.api";
import "./CarDetail.css";
import { useLanguage } from "../context/LanguageContext";
import Spinner from "../components/Spinner";

function CarDetailParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const COLS = [
      "rgba(220,30,30,",
      "rgba(200,20,20,",
      "rgba(240,60,60,",
      "rgba(180,10,10,",
      "rgba(255,80,50,",
    ];

    const pts = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * canvas.height,
      r0: Math.random() * 4 + 1,
      col: COLS[Math.floor(Math.random() * COLS.length)],
      a: Math.random() * 0.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.12,
      fl: Math.random() * 0.015 + 0.004,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.a += Math.sin(Date.now() * p.fl) * 0.006;
        p.a = Math.max(0.3, Math.min(0.9, p.a));

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const pct = Math.max(0, Math.min(1, p.y / canvas.height));
        const r = Math.max(0.3, p.r0 * pct);
        const a = p.a * (0.3 + pct * 0.7);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.col}${a.toFixed(2)})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="cd-particles" />;
}

const FUEL_CLASS = (f) => {
  const key = (f || "").toLowerCase();
  if (key === "petrol")          return "fuel--petrol";
  if (key === "diesel")          return "fuel--diesel";
  if (key === "hybrid")          return "fuel--hybrid";
  if (key === "electric" || key === "ev") return "fuel--electric";
  if (key === "plug-in hybrid")  return "fuel--plugin";
  return "fuel--default";
};

const getImageSrc = (img) =>
  img?.storage_path ||
  img?.secure_url ||
  img?.url ||
  img?.image_url ||
  "";

const normalizeArray = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data?.[key])) return data.data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export default function CarDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [allCars, setAllCars] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [rentalTerms, setRentalTerms] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  useEffect(() => {
    setActiveImg(0);
    setLoading(true);
    setError(null);
    setAllCars([]);
    setDocuments([]);
    setRentalTerms([]);
    setFeedbacks([]);

    Promise.all([
      getCarById(id),
      getPublicCarDocuments(id).catch(() => null),
      getPublicRentalTerms().catch(() => null),
      getApprovedFeedbacks({ car_id: id }).catch(() => null),
    ])
      .then(([carRes, docsRes, termsRes, feedbackRes]) => {
        const carData = carRes?.data?.car || carRes?.data?.data || carRes?.data;

        if (!carData?.id) {
          setError("Car not found");
          return;
        }

        setCar(carData);

        const docsFromApi = normalizeArray(docsRes, "documents");
        const docsFromCar = Array.isArray(carData.documents) ? carData.documents : [];

        setDocuments(docsFromApi.length > 0 ? docsFromApi : docsFromCar);

        const terms = normalizeArray(termsRes, "terms");
        setRentalTerms(terms);

        const approvedFeedbacks = normalizeArray(feedbackRes?.data ?? feedbackRes, "feedbacks")
          .filter((item) => item.status === "approved");
        setFeedbacks(approvedFeedbacks);

        const isRentalCar =
          carData.listing_type === "rent" ||
          (carData.listing_type == null &&
            !!carData.rent_price_per_day &&
            !carData.sale_price);
        const listFn = isRentalCar ? getCarsForRent : getCarsForSale;

        listFn()
          .then((res) => {
            const cars = res?.data?.cars || res?.cars || res?.data || [];
            setAllCars(Array.isArray(cars) ? cars : []);
          })
          .catch(() => {});
      })
      .catch(() => setError("Car not found"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handler = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen]);

  if (loading) return <div className="cd-loading"><Spinner size="lg" /></div>;

  if (error || !car) {
    return (
      <div className="cd-loading">
        <p>{error || t("cd_not_found")}</p>
        <button className="btn-ghost" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const images =
    car.images?.length > 0
      ? car.images.map(getImageSrc).filter(Boolean)
      : [
          car.primary_image ||
            car.image ||
            car.img ||
            "/images/placeholder.png",
        ];

  const fuel = car.fuel || car.fuel_type || "";
  const drive = car.drive || car.drive_type || "";
  const isRental = !!car.rent_price_per_day && !car.sale_price;

  const currentIdx = allCars.findIndex((c) => String(c.id) === String(id));
  const prevCar = currentIdx > 0 ? allCars[currentIdx - 1] : null;
  const nextCar =
    currentIdx !== -1 && currentIdx < allCars.length - 1
      ? allCars[currentIdx + 1]
      : null;

  const myPrice = isRental
    ? Number(car.rent_price_per_day || 0)
    : Number(car.sale_price || 0);

  const similarCars = allCars
    .filter((c) => String(c.id) !== String(id))
    .sort((a, b) => {
      const aSameBrand = a.brand === car.brand ? 1 : 0;
      const bSameBrand = b.brand === car.brand ? 1 : 0;

      if (aSameBrand !== bSameBrand) return bSameBrand - aSameBrand;

      const aPrice = isRental
        ? Number(a.rent_price_per_day || 0)
        : Number(a.sale_price || 0);
      const bPrice = isRental
        ? Number(b.rent_price_per_day || 0)
        : Number(b.sale_price || 0);

      return Math.abs(aPrice - myPrice) - Math.abs(bPrice - myPrice);
    })
    .slice(0, 4);

  const specs = [
    {
      key: "fuel",
      Icon: Fuel,
      fuelClass: FUEL_CLASS(fuel),
      label: t("spec_fuel"),
      value: fuel || "—",
    },
    {
      key: "transmission",
      Icon: Settings2,
      label: t("spec_transmission"),
      value: car.transmission || "—",
    },
    {
      key: "color",
      Icon: Palette,
      label: t("spec_color"),
      value: car.color || "—",
    },
    {
      key: "engine",
      Icon: Gauge,
      label: t("spec_engine"),
      value: car.engine || "—",
    },
    {
      key: "drive",
      Icon: Disc3,
      label: t("spec_drive"),
      value: drive || "—",
    },
    {
      key: "seats",
      Icon: Users,
      label: t("spec_seats"),
      value: car.seats ? `${car.seats} Seaters` : "—",
    },
  ];

  const dailyPrice = isRental ? Number(car.rent_price_per_day) || 0 : 0;
  const currency = car.currency_code || "THB";

  const infoRows = isRental
    ? [
        ...(dailyPrice
          ? [
              {
                label: t("cd_7day"),
                value: `${Math.round(
                  dailyPrice * 7 * 0.95
                ).toLocaleString()} ${currency}`,
                highlight: true,
              },
              {
                label: t("cd_30day"),
                value: `${Math.round(
                  dailyPrice * 30 * 0.9
                ).toLocaleString()} ${currency}`,
                highlight: true,
              },
            ]
          : []),
        { label: t("cd_status"), value: car.status || "—" },
      ]
    : [
        {
          label: t("spec_mileage"),
          value: car.mileage_km
            ? `${Number(car.mileage_km).toLocaleString()} km`
            : "—",
        },
        { label: t("cd_model_year"), value: car.year || "—" },
        { label: t("cd_status"), value: car.status || "—" },
      ];

  const displaySimilarPrice = (c) => {
    if (!isRental) {
      return c.sale_price
        ? `${Number(c.sale_price).toLocaleString()} ${
            c.currency_code || "THB"
          }`
        : "—";
    }

    return c.rent_price_per_day
      ? `${Number(c.rent_price_per_day).toLocaleString()} ${
          c.currency_code || "THB"
        }/day`
      : "—";
  };

  const getSimilarImage = (c) =>
    c.primary_image ||
    c.image ||
    c.images?.find((img) => img.is_primary)?.storage_path ||
    c.images?.find((img) => img.is_primary)?.secure_url ||
    c.images?.[0]?.storage_path ||
    c.images?.[0]?.secure_url ||
    c.img ||
    "/images/placeholder.png";

  const openLightbox = (idx) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  const lightboxPrev = () =>
    setLightboxIdx((i) => (i - 1 + images.length) % images.length);

  const lightboxNext = () =>
    setLightboxIdx((i) => (i + 1) % images.length);

  return (
    <div className="cd-wrapper">
      <CarDetailParticles />

      <div className="cd-nav">
        <nav className="cd-breadcrumb" aria-label="breadcrumb">
          <Link to="/" className="cd-breadcrumb-link">
            Home
          </Link>
          <span className="cd-breadcrumb-sep">›</span>
          <Link to="/showroom" className="cd-breadcrumb-link">
            {t("cd_breadcrumb_shop")}
          </Link>
          <span className="cd-breadcrumb-sep">›</span>
          <span className="cd-breadcrumb-current">
            {car.brand} {car.model}
          </span>
        </nav>

        <div className="cd-nav-right">
          {prevCar && (
            <button
              className="cd-nav-btn"
              onClick={() => navigate(`/car/${prevCar.id}`)}
            >
              <ChevronLeft size={14} />
              {t("cd_prev")}
            </button>
          )}

          {nextCar && (
            <button
              className="cd-nav-btn"
              onClick={() => navigate(`/car/${nextCar.id}`)}
            >
              {t("cd_next")}
              <ChevronRight size={14} />
            </button>
          )}

          <button className="cd-back-btn" onClick={() => navigate("/showroom")}>
            {t("cd_back")}
          </button>
        </div>
      </div>

      <div className="cd-showcase">
        <div className="cd-showcase__card">
          <div
            className="cd-showcase__stage"
            onClick={() => openLightbox(activeImg)}
          >
            <img
              src={images[activeImg]}
              alt={`${car.brand} ${car.model}`}
              className="cd-showcase__img"
            />

            <div className="cd-showcase__veil" />

            {(car.status === "sold" || car.status === "rented") && (
              <div className="cd-status-badge">{car.status}</div>
            )}

            {images.length > 1 && (
              <div className="cd-thumbs cd-showcase__thumbs">
                {images.map((src, i) => (
                  <button
                    key={src || i}
                    className={`cd-thumb${
                      i === activeImg ? " cd-thumb--active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImg(i);
                    }}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}

            <div className="cd-zoom-hint">⊕</div>
          </div>

          <div className="cd-showcase__bar">
            <div className="cd-showcase__bar-left">
              <p className="cd-section-label">
                {isRental ? t("cd_rental_tag") : t("cd_sale_tag")}
              </p>
              <h1 className="cd-title">
                {car.year} {car.brand} {car.model}
              </h1>
            </div>

            <div className="cd-price-row">
              <span className="cd-price">
                {Number(
                  car.sale_price || car.rent_price_per_day || 0
                ).toLocaleString()}
              </span>
              <span className="cd-currency">
                {car.currency_code || "THB"}
                {isRental ? " / day" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="cd-specs-row">
        <div className="cd-panel">
          <p className="cd-section-label">{t("cd_specs")}</p>

          <div className="cd-spec-grid">
            {specs.map(({ key, Icon, fuelClass, label, value }) => (
              <div key={key} className="cd-spec-item">
                <div className={`cd-spec-icon${fuelClass ? ` ${fuelClass}` : ""}`}>
                  <Icon size={22} strokeWidth={2} />
                </div>
                <div className="cd-spec-value">{value}</div>
                <div className="cd-spec-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cd-shell">
        <div className="cd-shell__right">
          <div className="cd-panel">
            <p className="cd-section-label">{t("cd_details")}</p>

            {infoRows.map(({ label, value, highlight }) => (
              <div key={label} className="cd-info-row">
                <span className="cd-info-label">{label}</span>
                <span
                  className={`cd-info-value${
                    highlight ? " cd-info-value--highlight" : ""
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {!isRental && documents.length > 0 && (
            <div className="cd-panel">
              <p className="cd-section-label">
                {t("cd_documents") || "Car Document Information"}
              </p>

              {documents.map((doc, index) => (
                <div key={doc.id || index} className="cd-info-row">
                  <span className="cd-info-label">
                    {doc.field_name || doc.key || "Document"}
                  </span>
                  <span className="cd-info-value">
                    {doc.field_value || doc.value || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {isRental && rentalTerms.length > 0 && (
            <div className="cd-panel">
              <p className="cd-section-label">{t("cd_terms")}</p>

              <div className="cd-terms-grid">
                {rentalTerms.map((term, i) => (
                  <div key={term.id || i} className="cd-term-item">
                    <span className="cd-term-icon">✔</span>
                    <span className="cd-term-text">
                      {term.description || term.title || term.text || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="cd-panel cd-panel--contact">
            <p className="cd-contact-text">{t("cd_interested")}</p>

            <button
              className="cd-contact-btn"
              onClick={() =>
                navigate(
                  `/contact?car=${encodeURIComponent(
                    `${car.year ? car.year + " " : ""}${car.brand} ${
                      car.model
                    }`
                  )}`
                )
              }
            >
              {t("cd_contact_btn")}
            </button>
          </div>

          {feedbacks.length > 0 && (
            <div className="cd-panel cd-feedback-panel">
              <p className="cd-section-label">Customer Reviews</p>

              <div className="cd-feedback-list">
                {feedbacks.map((item) => (
                  <div key={item.id} className="cd-feedback-item">
                    <div className="cd-feedback-head">
                      <span className="cd-feedback-name">{item.customer_name || "Anonymous"}</span>
                      <span className="cd-feedback-stars">{"★".repeat(Number(item.rating) || 0)}</span>
                    </div>
                    <p className="cd-feedback-comment">{item.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {similarCars.length > 0 && (
        <div className="cd-similar">
          <div className="cd-similar-inner">
            <h2 className="cd-similar-title">{t("cd_similar")}</h2>

            <div className="cd-similar-row">
              {similarCars.map((sc) => (
                <div
                  key={sc.id}
                  className="cd-similar-card"
                  onClick={() => navigate(`/car/${sc.id}`)}
                >
                  <div className="cd-similar-img">
                    <img
                      src={getSimilarImage(sc)}
                      alt={`${sc.brand} ${sc.model}`}
                    />
                  </div>

                  <div className="cd-similar-body">
                    <p className="cd-similar-brand">{sc.brand}</p>
                    <p className="cd-similar-model">{sc.model}</p>
                    <p className="cd-similar-price">
                      {displaySimilarPrice(sc)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {lightboxOpen && (
        <div className="cd-lightbox" onClick={() => setLightboxOpen(false)}>
          <button
            className="cd-lightbox-close"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={20} />
          </button>

          <div
            className="cd-lightbox-img-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={images[lightboxIdx]} alt={`${car.brand} ${car.model}`} />
          </div>

          {images.length > 1 && (
            <>
              <button
                className="cd-lightbox-arrow cd-lightbox-arrow--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxPrev();
                }}
              >
                <ChevronLeft size={28} />
              </button>

              <button
                className="cd-lightbox-arrow cd-lightbox-arrow--next"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxNext();
                }}
              >
                <ChevronRight size={28} />
              </button>

              <div className="cd-lightbox-counter">
                {lightboxIdx + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
