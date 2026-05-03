import React from "react";
import { useNavigate } from "react-router-dom";
import "./EasyRental.css";
import { useLanguage } from "../context/LanguageContext";
import ParticleBackground from "../components/ParticleBackground";

const STEPS = [
  { num: "01", key: "er_step1_label", desc: "Explore our curated premium fleet online" },
  { num: "02", key: "er_step2_label", desc: "Quick signup with phone or email"         },
  { num: "03", key: "er_step3_label", desc: "Confirm your booking and hit the road"    },
];

const FLEET = [
  { img: "/images/ShopCar/toyotaCamry.webp",    name: "Toyota Camry",    type: "Sedan", price: "฿1,200" },
  { img: "/images/ShopCar/toyotaFortuner.webp", name: "Toyota Fortuner", type: "SUV",   price: "฿1,800" },
  { img: "/images/ShopCar/hondaCivicFl5.webp",  name: "Honda Civic",     type: "Sedan", price: "฿900"   },
];

export default function EasyRental() {
  const { t }    = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="easyRentalSection">
      <ParticleBackground />
      <div className="sec-blob sec-blob--lg sec-blob--bc" />
      <div className="sec-blob sec-blob--md sec-blob--ml" />
      <div className="sec-blob sec-blob--sm sec-blob--tr" />
      <div className="sec-noise" />

      <div className="er-inner">

        {/* ── LEFT ── */}
        <div className="er-left">
          <p className="sec-eyebrow">{t("er_title")}</p>

          <h2 className="er-heading">
            Rent in<br />
            <span>3 simple steps.</span>
          </h2>

          <p className="er-sub">{t("er_sub")}</p>

          <div className="er-steps">
            {STEPS.map((s, i) => (
              <div key={i} className={`er-step${i < STEPS.length - 1 ? " er-step--has-line" : ""}`}>
                <div className="er-step__circle">
                  <span className="er-step__num">{s.num}</span>
                </div>
                <div className="er-step__body">
                  <div className="er-step__label">{t(s.key)}</div>
                  <div className="er-step__desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary btn--lg er-cta" onClick={() => navigate("/showroom")}>
            {t("er_rent_btn")}
          </button>

          <div className="er-trust">
            <span>✓ Insured</span>
            <span>✓ Verified Fleet</span>
            <span>✓ Ready to Go</span>
          </div>
        </div>

        {/* ── RIGHT — Fleet Panel ── */}
        <div className="er-right">
          <div className="er-panel">

            <div className="er-panel__head">
              <div>
                <div className="er-panel__title">Available Fleet</div>
                <div className="er-panel__sub">Updated in real-time</div>
              </div>
              <span className="er-panel__live"><span className="er-panel__live-dot" />Live</span>
            </div>

            <div className="er-fleet">
              {FLEET.map((car, i) => (
                <div key={i} className="er-fleet-row" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="er-fleet-row__img-wrap">
                    <img src={car.img} alt={car.name} className="er-fleet-row__img" />
                  </div>
                  <div className="er-fleet-row__info">
                    <span className="er-fleet-row__name">{car.name}</span>
                    <span className="er-fleet-row__type">{car.type}</span>
                  </div>
                  <div className="er-fleet-row__price">
                    <span className="er-fleet-row__amount">{car.price}</span>
                    <span className="er-fleet-row__unit">/day</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="er-panel__footer">
              <div className="er-panel__stats">
                <div className="er-panel__stat">
                  <strong>200+</strong><span>Cars</span>
                </div>
                <div className="er-panel__divider" />
                <div className="er-panel__stat">
                  <strong>1K+</strong><span>Customers</span>
                </div>
                <div className="er-panel__divider" />
                <div className="er-panel__stat">
                  <strong>5★</strong><span>Rating</span>
                </div>
              </div>
              <button className="er-panel__cta" onClick={() => navigate("/showroom")}>
                View All →
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
