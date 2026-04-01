import React from "react";
import { FaCarSide, FaTruckPickup, FaShuttleVan } from "react-icons/fa";
import { GiCarDoor } from "react-icons/gi";
import { MdElectricCar } from "react-icons/md";
import { BsCarFront } from "react-icons/bs";
import "./CarTypes.css";

export default function CarTypes() {

const types = [
  {name:"Hatchback", icon:<BsCarFront/>},
  {name:"SUV", icon:<FaCarSide/>},
  {name:"Pickup Truck", icon:<FaTruckPickup/>},
  {name:"Sedan", icon:<GiCarDoor/>},
  {name:"Van / Minivan", icon:<FaShuttleVan/>},
  {name:"Electric", icon:<MdElectricCar/>},
];

return (

<section className="carTypes">

<div className="typesHeader">

<h3>Browse by Car Type</h3>

<span className="viewAll">
View all →
</span>

</div>

<div className="typesWrapper">

  <div className="typesGrid">
    {types.map((type,index)=>(
      
    <div 
    className="typeCard" 
    key={type.name}
    >

      <div className="typeIcon">
      {type.icon}
      </div>

      <p>{type.name}</p>

    </div>

    ))}
  </div>

  {/* dots */}
  <div className="sliderDots">
    {Array.from({ length: Math.ceil(types.length / 4) }).map((_, i) => (
      <span key={i}></span>
    ))}
  </div>

</div>

<p className="typesNote">
+100 cars are ready to be yours
</p>

<button className="shopBtn">
View on Shop →
</button>

</section>

);
}