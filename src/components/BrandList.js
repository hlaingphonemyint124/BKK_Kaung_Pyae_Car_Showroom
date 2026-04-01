import React, { useRef, useState } from "react";
import "./BrandList.css";

const brands = [
  { name: "Suzuki", logo: "/images/Brands/suzuki.png" },
  { name: "Toyota", logo: "/images/Brands/toyota.png" },
  { name: "BMW", logo: "/images/Brands/bmw.png" },
  { name: "Honda", logo: "/images/Brands/honda.png" },
  { name: "Mercedes", logo: "/images/Brands/mercedes.png" },
  { name: "Ford", logo: "/images/Brands/ford.png" },
  { name: "Nissan", logo: "/images/Brands/nissan.png" },
  { name: "Audi", logo: "/images/Brands/audi.png" },
  { name: "Ferrari", logo: "/images/Brands/ferrari.png" },
  { name: "Hyundai", logo: "/images/Brands/hyundai.png" },
  { name: "Kia", logo: "/images/Brands/kia.png" },
  { name: "Lamborghini", logo: "/images/Brands/lamborghini.png" },
  { name: "Mazda", logo: "/images/Brands/mazda.png" },
  { name: "Tesla", logo: "/images/Brands/tesla.png" },
  { name: "Porsche", logo: "/images/Brands/porsche.png" },
  { name: "Mitsubishi", logo: "/images/Brands/mitsubishi.png" },
];

export default function BrandList() {
  const sliderRef = useRef(null);
  const [active, setActive] = useState(0);

  const itemsPerPage = 4;
  const pages = Math.ceil(brands.length / itemsPerPage);

  const handleScroll = () => {
    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActive(index);
  };

  const goToSlide = (index) => {
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
  };

  return (
    <section className="brandsSection">

      {/* HEADER */}
      <div className="brandsHeader">
        <h2>Brands</h2>

        <button className="viewAll">
          View all →
        </button>
      </div>

      {/* SLIDER */}
      <div
        className="brandsSlider"
        ref={sliderRef}
        onScroll={handleScroll}
      >
        {Array.from({ length: pages }).map((_, pageIndex) => (
          <div className="brandsPage" key={pageIndex}>
            {brands
              .slice(
                pageIndex * itemsPerPage,
                pageIndex * itemsPerPage + itemsPerPage
              )
              .map((brand, i) => (
                <div className="brandCard" key={i}>
                  <img src={brand.logo} alt={brand.name} />
                  <span>{brand.name}</span>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="dots">
        {Array.from({ length: pages }).map((_, i) => (
          <span
            key={i}
            className={i === active ? "dot active" : "dot"}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>

    </section>
  );
}