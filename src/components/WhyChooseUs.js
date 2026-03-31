import React from "react";
import "./WhyChooseUs.css";

export default function WhyChooseUs() {
  return (
    <section className="whySection">

      <h2 className="whyTitle">Why Choose Us?</h2>

      <div className="whyGrid">

        <div className="whyItem">
          <img src="/images/WhyChooseUs/WCU1.jpg" alt="" />
          <div className="whyOverlay left">
            <h4>Trusted & well-maintained cars</h4>
            <p>Every vehicle is carefully inspected, clean, and ready to drive.</p>
          </div>
        </div>

        <div className="whyItem">
          <img src="/images/WhyChooseUs/WCU3.jpg" alt="" />
          <div className="whyOverlay right">
            <h4>Transparent Pricing</h4>
            <p>Clear price with no hidden fees — what you see is what you pay.</p>
          </div>
        </div>

        <div className="whyItem">
          <img src="/images/WhyChooseUs/WCU2.jpg" alt="" />
          <div className="whyOverlay left">
            <h4>Fast & Easy Booking</h4>
            <p>Rent in minutes with flexible rental options and quick support.</p>
          </div>
        </div>

      </div>

      <div className="whyAction">
        <button className="rentBtn">Buy / rent a car →</button>
        <p className="whyFeatures">
          • Trust • Fair Price • Simple & fast booking
        </p>
      </div>

    </section>
  );
}