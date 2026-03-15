import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Showroom.css";

export default function Showroom(){

const navigate = useNavigate();

const [mode,setMode] = useState("buy");
const [filterOpen,setFilterOpen] = useState(false);
const [modeOpen,setModeOpen] = useState(false);

const filterRef = useRef();
const modeRef = useRef();

useEffect(()=>{
function handleClick(e){
if(filterRef.current && !filterRef.current.contains(e.target)){
setFilterOpen(false);
}
if(modeRef.current && !modeRef.current.contains(e.target)){
setModeOpen(false);
}
}
document.addEventListener("mousedown",handleClick);
return ()=> document.removeEventListener("mousedown",handleClick);
},[]);

const categories = [
"All",
"Sedan",
"Hatchback",
"SUV",
"Pickup Truck",
"Van / Minivan",
"Electric"
];

const buyCars = [
{
id:1,
name:"BYD Atto 3",
img:"/images/ShopCar/bydAtto3.png",
fuel:"EV",
gear:"Auto",
price:"999,999 THB"
},
{
id:2,
name:"Toyota Fortuner",
img:"/images/ShopCar/toyotaFortuner.webp",
fuel:"Diesel",
gear:"Manual",
price:"999,999 THB"
},
{
id:3,
name:"Isuzu D-Max",
img:"/images/ShopCar/isuzuDmax.webp",
fuel:"Diesel",
gear:"Manual",
price:"999,999 THB"
},
{
id:4,
name:"Toyota Yaris",
img:"/images/ShopCar/toyotaYaris.webp",
fuel:"Petrol",
gear:"Auto",
price:"999,999 THB"
}
];

const rentCars = [
{
id:5,
name:"BYD Atto 3",
img:"/images/ShopCar/bydAtto3.png",
fuel:"EV",
gear:"Auto",
price:"728 THB/day"
},
{
id:6,
name:"Honda Civic Type R",
img:"/images/ShopCar/hondaCivicFl5.webp",
fuel:"Petrol",
gear:"Manual",
price:"1,100 THB/day"
},
{
id:7,
name:"Isuzu D-Max",
img:"/images/ShopCar/isuzuDmax.webp",
fuel:"Diesel",
gear:"Manual",
price:"890 THB/day"
},
{
id:8,
name:"Toyota Yaris",
img:"/images/ShopCar/toyotaYaris.webp",
fuel:"Petrol",
gear:"Auto",
price:"900 THB/day"
}
];

const cars = mode === "buy" ? buyCars : rentCars;

return(

<div className="showroom">

<h2 className="title">Fast, Simple and Easy.</h2>

<p className="subtitle">
Shop Online. Pickup Today. It’s Fast, Simple and Easy.
</p>

<div className="filterBar">

<div className="filterItem" ref={filterRef}>
<div
className="filterBtn"
onClick={()=>setFilterOpen(!filterOpen)}
>
Filter ▾
</div>

{filterOpen && (
<div className="dropdown">
{categories.map((cat,i)=>(
<div key={i} className="dropdownItem">
{cat}
</div>
))}
</div>
)}
</div>

<div className="filterItem" ref={modeRef}>

<div
className="filterBtn"
onClick={()=>setModeOpen(!modeOpen)}
>
{mode==="buy"?"Buy":"Rental"} ▾
</div>

{modeOpen && (
<div className="dropdown">

<div
className="dropdownItem"
onClick={()=>{
setMode("buy");
setModeOpen(false);
}}
>
Buy
</div>

<div
className="dropdownItem"
onClick={()=>{
setMode("rent");
setModeOpen(false);
}}
>
Rental
</div>

</div>
)}

</div>

<div className="filterItem">
Search 🔍
</div>

</div>

<div className="carsGrid">

{cars.map((car)=>(
<div
className="carCard"
key={car.id}
onClick={()=>navigate(`/car/${car.id}`,{state:{car}})}
style={{cursor:"pointer"}}
>

<div className={`tag ${mode==="buy"?"sale":"rent"}`}>
{mode==="buy"?"Sale":"Rent"}
</div>

<img src={car.img} alt="car"/>

<div className="cardBody">

<h3>{car.name}</h3>

<p className="desc">
Petrol, 2WD, 2c,4seaters....
</p>

<div className="specs">

<div className="fuel">
⛽ {car.fuel}
</div>

<div className="gear">
⚙ {car.gear}
</div>

</div>

<div className="bottomRow">

<div className="price">
{car.price}
</div>

<div className="detail">
view detail →
</div>

</div>

</div>

</div>
))}

</div>

</div>

)
}