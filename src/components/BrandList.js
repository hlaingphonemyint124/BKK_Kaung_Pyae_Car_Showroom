import React, { useRef, useEffect } from "react";
import "./BrandList.css";
import gsap from "gsap";

const brands = [
  { name: "Toyota", logo: "/images/Brands/toyota.png" },
  { name: "Honda", logo: "/images/Brands/honda.png" },
  { name: "Suzuki", logo: "/images/Brands/suzuki.png" },
  { name: "BMW", logo: "/images/Brands/bmw.png" },
  { name: "Mercedes", logo: "/images/Brands/mercedes.png" },
  { name: "Ford", logo: "/images/Brands/ford.png" },
  { name: "Nissan", logo: "/images/Brands/nissan.png" },
  { name: "Mazda", logo: "/images/Brands/mazda.png" },
];

export default function BrandList() {

  const trackRef = useRef(null);

  const duplicated = [...brands, ...brands];

  useEffect(() => {

    const track = trackRef.current;

    const width = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -width,
      duration: 30,
      ease: "none",
      repeat: -1
    });

    const pause = () => tween.pause();
    const play = () => tween.resume();

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", play);

    return () => {
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", play);
    };

  }, []);

  const handleMouseMove = (e, card) => {

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(card,{
      rotateX,
      rotateY,
      scale:1.06,
      duration:.3,
      ease:"power2.out"
    });

  };

  const resetMagnet = (card) => {

    gsap.to(card,{
      rotateX:0,
      rotateY:0,
      scale:1,
      duration:.5,
      ease:"elastic.out(1,0.4)"
    });

  };

  return (
    <section className="brandsSection">

      <div className="brandsHeader">
        <h2>Browse by Brand</h2>
        <p>Choose from popular car manufacturers</p>
      </div>

      <div className="brandsSlider">

        <div className="brandsTrack" ref={trackRef}>

          {duplicated.map((brand, index) => (

            <div
              className="brandCard"
              key={index}
              onMouseMove={(e)=>handleMouseMove(e,e.currentTarget)}
              onMouseLeave={(e)=>resetMagnet(e.currentTarget)}
            >

              <img src={brand.logo} alt={brand.name}/>
              <span>{brand.name}</span>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}