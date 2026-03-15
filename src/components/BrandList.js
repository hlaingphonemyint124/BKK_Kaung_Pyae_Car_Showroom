import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import "./BrandList.css";

const brands = [
{ name:"Suzuki", logo:"/images/Brands/suzuki.png"},
{ name:"Toyota", logo:"/images/Brands/toyota.png"},
{ name:"BMW", logo:"/images/Brands/bmw.png"},
{ name:"Honda", logo:"/images/Brands/honda.png"},
{ name:"Mercedes", logo:"/images/Brands/mercedes.png"},
{ name:"Mitsubishi", logo:"/images/Brands/mitsubishi.png"},
{ name:"Audi", logo:"/images/Brands/audi.png"},
{ name:"Nissan", logo:"/images/Brands/nissan.png"},
{ name:"Mazda", logo:"/images/Brands/mazda.png"},
{ name:"Ford", logo:"/images/Brands/ford.png"},
{ name:"Tesla", logo:"/images/Brands/tesla.png"},
{ name:"Hyundai", logo:"/images/Brands/hyundai.png"},
{ name:"Kia", logo:"/images/Brands/kia.png"},
{ name:"Porsche", logo:"/images/Brands/porsche.png"},
{ name:"Ferrari", logo:"/images/Brands/ferrari.png"},
{ name:"Lamborghini", logo:"/images/Brands/lamborghini.png"}
];

export default function BrandList(){

const [index,setIndex] = useState(0);
const wheelLock = useRef(false);

const brandsPerSlide = 8;
const totalSlides = Math.ceil(brands.length / brandsPerSlide);

/* ---------- navigation ---------- */

function next(){
setIndex(prev => prev === totalSlides-1 ? 0 : prev + 1);
}

function prev(){
setIndex(prev => prev === 0 ? totalSlides-1 : prev - 1);
}

/* ---------- drag swipe ---------- */

function handleDragEnd(event,info){

const threshold = 120;

if(info.offset.x < -threshold){
next();
}

if(info.offset.x > threshold){
prev();
}

}

/* ---------- MAC TRACKPAD SWIPE FIX ---------- */

function handleWheel(e){

if(wheelLock.current) return;

if(Math.abs(e.deltaX) < 30) return;

wheelLock.current = true;

if(e.deltaX > 0){
next();
}else{
prev();
}

setTimeout(()=>{
wheelLock.current = false;
},600);

}

return(

<section className="brandsSection">

<div className="brandsHeader">

<h3>Browse by Brand</h3>

<div className="headerActions">

<span className="viewAll">View all →</span>

<button className="navBtn" onClick={prev}>‹</button>
<button className="navBtn" onClick={next}>›</button>

</div>

</div>

<div className="brandsSlider">

<motion.div
className="brandsTrack"
drag="x"
dragElastic={0.12}
onDragEnd={handleDragEnd}
onWheel={handleWheel}
animate={{ x:`-${index*100}%` }}
transition={{ type:"spring", stiffness:140, damping:24 }}
>

{Array.from({length: totalSlides}).map((_,slideIndex)=>{

const start = slideIndex * brandsPerSlide;
const visible = brands.slice(start,start+brandsPerSlide);

return(

<div className="brandsGrid" key={slideIndex}>

{visible.map((brand)=>(

<motion.div
className="brandCard"
key={brand.name}
whileHover={{ scale:1.06 }}
transition={{ duration:0.2 }}
>

<img src={brand.logo} alt={brand.name}/>
<p>{brand.name}</p>

</motion.div>

))}

</div>

)

})}

</motion.div>

</div>

<div className="brandDots">

{Array.from({length:totalSlides}).map((_,i)=>(
<span
key={i}
className={`dot ${index===i ? "active":""}`}
onClick={()=>setIndex(i)}
></span>
))}

</div>

</section>

)
}