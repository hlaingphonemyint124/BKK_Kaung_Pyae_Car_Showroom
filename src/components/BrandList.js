import React, { useState, useRef } from "react";
import "./BrandList.css";

const brands = [
  { name: "Suzuki",      logo: "/images/Brands/suzuki.png" },
  { name: "Toyota",      logo: "/images/Brands/toyota.png" },
  { name: "BMW",         logo: "/images/Brands/bmw.png" },
  { name: "Honda",       logo: "/images/Brands/honda.png" },
  { name: "Mercedes",    logo: "/images/Brands/mercedes.png" },
  { name: "Ford",        logo: "/images/Brands/ford.png" },
  { name: "Nissan",      logo: "/images/Brands/nissan.png" },
  { name: "Audi",        logo: "/images/Brands/audi.png" },
  { name: "Ferrari",     logo: "/images/Brands/ferrari.png" },
  { name: "Hyundai",     logo: "/images/Brands/hyundai.png" },
  { name: "Kia",         logo: "/images/Brands/kia.png" },
  { name: "Lamborghini", logo: "/images/Brands/lamborghini.png" },
  { name: "Mazda",       logo: "/images/Brands/mazda.png" },
  { name: "Tesla",       logo: "/images/Brands/tesla.png" },
  { name: "Porsche",     logo: "/images/Brands/porsche.png" },
  { name: "Mitsubishi",  logo: "/images/Brands/mitsubishi.png" },
];

const PER_SLIDE = 4;

export default function BrandList() {
  const slides = [];
  for (let i = 0; i < brands.length; i += PER_SLIDE) {
    slides.push(brands.slice(i, i + PER_SLIDE));
  }

  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const next = () => setCurrent((c) => Math.min(c + 1, slides.length - 1));

  // Touch
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) dx > 0 ? next() : prev();
  };

  // Mouse drag
  const mouseStartX = useRef(0);
  const mouseDown   = useRef(false);
  const onMouseDown = (e) => { mouseStartX.current = e.clientX; mouseDown.current = true; };
  const onMouseUp   = (e) => {
    if (!mouseDown.current) return;
    mouseDown.current = false;
    const dx = mouseStartX.current - e.clientX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
  };
  const onMouseLeave = () => { mouseDown.current = false; };

  // Trackpad wheel
  const wheelTimeout = useRef(null);
  const wheelAccum   = useRef(0);
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    e.preventDefault();
    wheelAccum.current += e.deltaX;
    clearTimeout(wheelTimeout.current);
    wheelTimeout.current = setTimeout(() => {
      if (wheelAccum.current > 40) next();
      else if (wheelAccum.current < -40) prev();
      wheelAccum.current = 0;
    }, 50);
  };

  return (
    <section className="brandsSection">

      {/* HEADER */}
      <div className="brandsHeader">
        <h2>Brands</h2>
        <span className="viewAll">View all →</span>
      </div>

      {/* SLIDER + ARROWS */}
      <div className="sliderContainer">

        <button
          className="arrowBtn"
          onClick={prev}
          disabled={current === 0}
          aria-label="Previous"
        >
          ‹
        </button>

        <div
          className="sliderWrapper"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onWheel={onWheel}
          style={{ touchAction: "pan-y" }}
        >
          <div
            className="slides"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((group, pageIndex) => (
              <div className="slide" key={pageIndex}>
                {group.map((brand, i) => {
                  const globalIndex = pageIndex * PER_SLIDE + i;
                  const isSelected  = selected === globalIndex;
                  return (
                    <div
                      key={i}
                      className={`brandCard ${isSelected ? "brandCard--selected" : ""}`}
                      onClick={() => setSelected(isSelected ? null : globalIndex)}
                    >
                      <div className={`brandLogo ${isSelected ? "brandLogo--selected" : ""}`}>
                        <img src={brand.logo} alt={brand.name} />
                      </div>
                      <p className="brandLabel">{brand.name}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <button
          className="arrowBtn"
          onClick={next}
          disabled={current === slides.length - 1}
          aria-label="Next"
        >
          ›
        </button>

      </div>

      {/* DOTS */}
      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={current === i ? "dot active" : "dot"}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

    </section>
  );
}