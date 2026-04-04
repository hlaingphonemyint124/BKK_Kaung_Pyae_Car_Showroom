import "./Deals.css";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

export default function Deals() {

  const bestSeller = [
    { name: "Nissan Juke",         price: "145,000 THB", image: "/images/BestDeals/bd1.png" },
    { name: "Mazda 6",             price: "420,000 THB", image: "/images/BestDeals/bd2.png" },
    { name: "BMW e90",             price: "165,000 THB", image: "/images/BestDeals/bd3.png" },
    { name: "Mazda CX5",           price: "560,000 THB", image: "/images/BestDeals/bd4.png" },
    { name: "Mitsubishi Lancer EX",price: "125,000 THB", image: "/images/BestDeals/bd5.png" },
  ];

  const mostRented = [
    { name: "BMW 5 Series F90",  price: "5,500 THB / day", image: "/images/MostRented/mr1.png" },
    { name: "BMW 7 Series 750Li",price: "6,000 THB / day", image: "/images/MostRented/mr2.png" },
    { name: "Honda City",        price: "1,000 THB / day", image: "/images/MostRented/mr3.png" },
    { name: "Honda Accord G8",   price: "1,500 THB / day", image: "/images/MostRented/mr4.png" },
    { name: "Mercedes E200",     price: "1,600 THB / day", image: "/images/MostRented/mr5.png" },
    { name: "Mercedes S300",     price: "5,000 THB / day", image: "/images/MostRented/mr6.png" },
  ];

  const [tab, setTab] = useState("seller");
  const cars = tab === "seller" ? bestSeller : mostRented;
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    let scroll;
    const autoScroll = () => {
      scroll = setInterval(() => {
        if (slider) {
          slider.scrollLeft += 1;
          if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
            slider.scrollLeft = 0;
          }
        }
      }, 20);
    };
    autoScroll();
    return () => clearInterval(scroll);
  }, [tab]);

  return (
    <section className="deals">

      {/* Ambient background layers */}
      <div className="deals-ambient deals-ambient--1" />
      <div className="deals-ambient deals-ambient--2" />
      <div className="deals-ambient deals-ambient--3" />
      <div className="deals-noise" />

      {/* Header */}
      <motion.div
        className="deals-header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
      >
        <span className="deals-eyebrow">
          <span className="eyebrow-line" /> Exclusive Collection <span className="eyebrow-line" />
        </span>
        <h2 className="deals-title">Best Deals For You</h2>
        <p className="deals-sub">Premium vehicles. Unmatched prices.</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="deal-tabs"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <button className={tab === "seller" ? "active" : ""} onClick={() => setTab("seller")}>
          <span className="tab-dot" /> Best Seller
        </button>
        <button className={tab === "rented" ? "active" : ""} onClick={() => setTab("rented")}>
          <span className="tab-dot" /> Most Rented
        </button>
      </motion.div>

      {/* Slider */}
      <div className="slider" ref={sliderRef}>
        <div className="slide-track">
          {cars.concat(cars).map((car, index) => (
            <motion.div
              key={index}
              className="car-card"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <Tilt
                tiltMaxAngleX={7}
                tiltMaxAngleY={7}
                perspective={1000}
                glareEnable
                glareMaxOpacity={0.08}
                glareColor="#c8a96e"
                glarePosition="all"
                scale={1.025}
              >
                <div className="card-inner">

                  {/* Gold corner accent */}
                  <div className="card-corner card-corner--tl" />
                  <div className="card-corner card-corner--br" />

                  {/* Spotlight glow */}
                  <div className="spotlight" />

                  {/* Image */}
                  <div className="card-img-wrap">
                    <div className="card-img-glow" />
                    <img src={car.image} alt={car.name} />
                  </div>

                  {/* Divider */}
                  <div className="card-rule" />

                  {/* Info */}
                  <div className="car-info">
                    <h3>{car.name}</h3>
                    <p>{car.price}</p>
                  </div>

                  {/* Button */}
                  <button className="rent-btn">
                    <span className="btn-label">Shop Now</span>
                    <span className="btn-arrow">→</span>
                  </button>

                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        className="deals-cta"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.button
          className="view-shop"
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.96 }}
        >
          View Full Collection
        </motion.button>
      </motion.div>

    </section>
  );
}