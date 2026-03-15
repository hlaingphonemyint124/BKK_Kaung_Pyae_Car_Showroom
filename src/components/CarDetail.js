import React from "react";
import { useLocation } from "react-router-dom";
import "./CarDetail.css";

export default function CarDetail(){

const location = useLocation();
const car = location.state?.car;

if(!car){
return <div style={{padding:"40px"}}>Car not found</div>;
}

return(

<div className="carDetail">

{/* IMAGE */}

<div className="carHero">
<img src={car.img} alt={car.name}/>
</div>

{/* CONTENT */}

<div className="carContent">

<h1 className="carTitle">
2024 {car.name}
</h1>

<div className="carPrice">
{car.price}
</div>


{/* SPEC GRID */}

<div className="specGrid">

<div className="specItem">
<div className="specIcon fuel">⛽</div>
<p>Patrol</p>
</div>

<div className="divider"></div>

<div className="specItem">
<div className="specIcon gear">⚙</div>
<p>{car.gear}</p>
</div>

<div className="divider"></div>

<div className="specItem">
<div className="specIcon color">🎨</div>
<p>White</p>
</div>

<div className="specItem">
<div className="specIcon engine">🔋</div>
<p>1.2c</p>
</div>

<div className="divider"></div>

<div className="specItem">
<div className="specIcon drive">🛞</div>
<p>2 WD</p>
</div>

<div className="divider"></div>

<div className="specItem">
<div className="specIcon seat">👥</div>
<p>5 Seaters</p>
</div>

</div>


{/* INFO ROWS */}

<div className="infoRow">
<span>Mileage</span>
<span className="highlight">120,000 km</span>
</div>

<div className="infoRow">
<span>Model</span>
<span className="highlight">2024</span>
</div>

<div className="infoRow">
<span>Documents</span>
<span className="highlight">Ready to transfer</span>
</div>


{/* DOCUMENT TABLE */}

<div className="docHeader">
Car Document Infomation
</div>

<div className="docTable">

{[1,2,3,4,5,6].map((row)=>(
<div key={row} className="docRow">
<div></div>
<div></div>
</div>
))}

</div>


{/* CONTACT SELLER */}

<div className="contactSection">

<p>• Do you interested in this car ?</p>

<button className="contactBtn">
Contact Seller →
</button>

</div>

</div>

</div>

)
}