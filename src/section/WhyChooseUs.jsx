import React, { useEffect, useRef } from "react";
import "./WhyChooseUs.css";
import { useLanguage } from "../context/LanguageContext";

const ITEM_IMAGES = [
  { img: "/images/WhyChooseUs/WCU1.webp", side: "left",  keys: ["wcu_tag1","wcu_h4_1","wcu_p1"] },
  { img: "/images/WhyChooseUs/WCU3.jpg",  side: "right", keys: ["wcu_tag2","wcu_h4_2","wcu_p2"] },
  { img: "/images/WhyChooseUs/WCU2.jpg",  side: "left",  keys: ["wcu_tag3","wcu_h4_3","wcu_p3"] },
];

export default function WhyChooseUs() {
  const { t }    = useLanguage();
  const itemsRef = useRef([]);

  useEffect(() => {
    const show = (el) => el && el.classList.add("visible");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    itemsRef.current.forEach((el) => {
      if (!el) return;
      const { top } = el.getBoundingClientRect();
      top < window.innerHeight ? show(el) : observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="whySection">
      <div className="sec-blob sec-blob--lg sec-blob--tc" />
      <div className="sec-blob sec-blob--md sec-blob--bl" />
      <div className="sec-blob sec-blob--sm sec-blob--mr" />
      <div className="sec-noise" />

      <div className="whyContainer">

        <h2 className="whyTitle">{t("wcu_title")}</h2>
        <p className="whySubline">{t("wcu_sub")}</p>

        <div className="whyGrid">
          {ITEM_IMAGES.map(({ img, side, keys }, i) => (
            <div
              key={i}
              className="whyItem"
              ref={(el) => (itemsRef.current[i] = el)}
            >
              <img src={img} alt={t(keys[1])} />

              <div className={`whyOverlay ${side}`}>
                <span className="whyTag">{t(keys[0])}</span>
                <h4>{t(keys[1])}</h4>
                <p>{t(keys[2])}</p>
              </div>

              <div className={`whyEdgeBar ${side === "left" ? "edgeLeft" : "edgeRight"}`} />
            </div>
          ))}
        </div>

        <div className="whyAction">
          <p className="whyFeatures">{t("wcu_features")}</p>
        </div>

      </div>
    </section>
  );
}