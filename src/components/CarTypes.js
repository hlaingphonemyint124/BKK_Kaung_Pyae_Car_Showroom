import React, { useState, useRef } from "react";
import { BsCarFront } from "react-icons/bs";
import { FaCarSide, FaTruckPickup, FaShuttleVan, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiCarDoor } from "react-icons/gi";
import { MdElectricCar } from "react-icons/md";
import "./CarTypes.css";

export default function CarTypes() {
  const types = [
    { name: "Pickup", icon: <FaTruckPickup /> },
    { name: "SUV", icon: <FaCarSide /> },
    { name: "Van", icon: <FaShuttleVan /> },
    { name: "Sedan", icon: <GiCarDoor /> },
    { name: "Hatchback", icon: <BsCarFront /> },
    { name: "Electric", icon: <MdElectricCar /> },
  ];

  const perSlide = 4;
  const slides = [];
  for (let i = 0; i < types.length; i += perSlide) {
    slides.push(types.slice(i, i + perSlide));
  }

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null); // ← track selected card

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
  const mouseDown = useRef(false);
  const onMouseDown = (e) => { mouseStartX.current = e.clientX; mouseDown.current = true; };
  const onMouseUp = (e) => {
    if (!mouseDown.current) return;
    mouseDown.current = false;
    const dx = mouseStartX.current - e.clientX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
  };
  const onMouseLeave = () => { mouseDown.current = false; };

  // Trackpad wheel
  const wheelTimeout = useRef(null);
  const wheelAccum = useRef(0);
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
    <section className="carTypes">
      <div className="typesHeader">
        <h3>Browse by Car Type</h3>
        <span className="viewAll">View all →</span>
      </div>

      <div className="sliderContainer">
        <button className="arrowBtn" onClick={prev} disabled={current === 0} aria-label="Previous">
          <FaChevronLeft />
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
            {slides.map((group, index) => (
              <div className="slide" key={index}>
                {group.map((type, i) => {
                  const globalIndex = index * perSlide + i;
                  const isSelected = selected === globalIndex;
                  return (
                    <div
                      className={`typeCard ${isSelected ? "typeCard--selected" : ""}`}
                      key={i}
                      onClick={() => setSelected(isSelected ? null : globalIndex)}
                    >
                      <div className={`typeIcon ${isSelected ? "typeIcon--selected" : ""}`}>
                        {type.icon}
                      </div>
                      <p className="typeLabel">{type.name}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <button className="arrowBtn" onClick={next} disabled={current === slides.length - 1} aria-label="Next">
          <FaChevronRight />
        </button>
      </div>

      <div className="dots">
        {slides.map((_, i) => (
          <span key={i} className={current === i ? "dot active" : "dot"} onClick={() => setCurrent(i)} />
        ))}
      </div>

      <p className="typesNote">+100 cars are ready to be yours</p>
      <button className="shopBtn">View on Shop →</button>
    </section>
  );
}