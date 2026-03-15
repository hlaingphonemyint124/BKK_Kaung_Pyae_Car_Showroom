import "./Deals.css";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

export default function Deals(){

const bestSeller = [
{ name:"Nissan Juke", price:"145000 THB", image:"/images/BestDeals/bd1.png"},
{ name:"Mazda 6", price:"420000 THB", image:"/images/BestDeals/bd2.png"},
{ name:"BMW e90", price:"165000 THB", image:"/images/BestDeals/bd3.png"},
{ name:"Mazda CX5", price:"560000 THB", image:"/images/BestDeals/bd4.png"},
{ name:"Mitsubishi Lancer EX", price:"125000 THB", image:"/images/BestDeals/bd5.png"}
];

const mostRented = [
{ name:"BMW 5Series F90", price:"5500 THB / day", image:"/images/MostRented/mr1.png"},
{ name:"BMW 7Series 750li", price:"6000 THB / day", image:"/images/MostRented/mr2.png"},
{ name:"HONDA City", price:"1000 THB / day", image:"/images/MostRented/mr3.png"},
{ name:"HONDA Accord G8", price:"1500 THB / day", image:"/images/MostRented/mr4.png"},
{ name:"Mercedes E200", price:"1600 THB / day", image:"/images/MostRented/mr5.png"},
{ name:"Mercedes S300", price:"5000 THB / day", image:"/images/MostRented/mr6.png"}
];

const [tab,setTab] = useState("seller");
const cars = tab === "seller" ? bestSeller : mostRented;

const sliderRef = useRef(null);

/* AUTO SCROLL */

useEffect(()=>{

const slider = sliderRef.current;

let scroll;

const autoScroll = () => {
scroll = setInterval(()=>{
if(slider){
slider.scrollLeft += 1;
if(slider.scrollLeft >= slider.scrollWidth - slider.clientWidth){
slider.scrollLeft = 0;
}
}
},20);
};

autoScroll();

return ()=> clearInterval(scroll);

},[tab]);

return(

<section className="deals">

<motion.h2
className="deals-title"
initial={{opacity:0,y:40}}
whileInView={{opacity:1,y:0}}
transition={{duration:0.6}}
viewport={{once:true}}
>
Best Deals For You
</motion.h2>

<div className="deal-tabs">

<button
className={tab==="seller"?"active":""}
onClick={()=>setTab("seller")}
>
⭐ Best Seller
</button>

<button
className={tab==="rented"?"active":""}
onClick={()=>setTab("rented")}
>
🔥 Most Rented
</button>

</div>

<div className="slider" ref={sliderRef}>

<div className="slide-track">

{cars.concat(cars).map((car,index)=>(

<motion.div
key={index}
className="car-card"
initial={{opacity:0,y:80}}
whileInView={{opacity:1,y:0}}
transition={{duration:0.5,delay:index*0.05}}
viewport={{once:true}}
>

<Tilt
tiltMaxAngleX={8}
tiltMaxAngleY={8}
perspective={900}
glareEnable
glareMaxOpacity={0.25}
scale={1.03}
>

<div className="card-inner">

<div className="spotlight"></div>

<img src={car.image} alt={car.name}/>

<div className="car-info">
<h3>{car.name}</h3>
<p>{car.price}</p>
</div>

<button className="rent-btn">
Shop Now
</button>

</div>

</Tilt>

</motion.div>

))}

</div>

</div>

<motion.button
className="view-shop"
whileHover={{scale:1.06}}
whileTap={{scale:0.95}}
>
View On Shop
</motion.button>

</section>

)
}