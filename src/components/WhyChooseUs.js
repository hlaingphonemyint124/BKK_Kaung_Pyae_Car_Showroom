import React, { useEffect, useRef } from "react";
import "./WhyChooseUs.css";

const items = [
  {
    img:  "/images/WhyChooseUs/WCU1.jpg",
    tag:  "Quality",
    h4:   "Trusted & Well-Maintained Cars",
    p:    "Every vehicle is carefully inspected, clean, and ready to drive.",
    side: "left",
  },
  {
    img:  "/images/WhyChooseUs/WCU3.webp",
    tag:  "Pricing",
    h4:   "Transparent Pricing",
    p:    "Clear price with no hidden fees — what you see is what you pay.",
    side: "right",
  },
  {
    img:  "/images/WhyChooseUs/WCU2.webp",
    tag:  "Booking",
    h4:   "Fast & Easy Booking",
    p:    "Rent in minutes with flexible rental options and quick support.",
    side: "left",
  },
];

export default function WhyChooseUs() {
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
      <div className="whyContainer">

        <h2 className="whyTitle">Why Choose Us?</h2>
        <p className="whySubline">What makes us different</p>

        <div className="whyGrid">
          {items.map(({ img, tag, h4, p, side }, i) => (
            <div
              key={i}
              className="whyItem"
              ref={(el) => (itemsRef.current[i] = el)}
            >
              <img src={img} alt={h4} />

              <div className={`whyOverlay ${side}`}>
                <span className="whyTag">{tag}</span>
                <h4>{h4}</h4>
                <p>{p}</p>
              </div>

              <div className={`whyEdgeBar ${side === "left" ? "edgeLeft" : "edgeRight"}`} />
            </div>
          ))}
        </div>

        <div className="whyAction">
          <button className="rentBtn">Buy / Rent a Car →</button>
          <p className="whyFeatures">• Trust &nbsp;•&nbsp; Fair Price &nbsp;•&nbsp; Simple & Fast Booking</p>
        </div>

      </div>
    </section>
  );
}