import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header(){

const [menu,setMenu] = useState(false);

const menuRef = useRef(null);

useEffect(()=>{

function handleClickOutside(e){

if(menuRef.current && !menuRef.current.contains(e.target)){
setMenu(false);
}

}

document.addEventListener("mousedown",handleClickOutside);
document.addEventListener("touchstart",handleClickOutside);

return ()=>{
document.removeEventListener("mousedown",handleClickOutside);
document.removeEventListener("touchstart",handleClickOutside);
};

},[]);


return(

<header className="site-header">

<div className="site-header__inner">

{/* LOGO */}

<div className="site-logo">
<div>BKK Kaung Pyae</div>
<span>Auto</span>
</div>


{/* RIGHT */}

<div className="site-nav">

<button className="lang-btn">
EN
<img src="https://flagcdn.com/w20/gb.png" alt="" />
</button>

<button
className="menu-btn"
onClick={()=>setMenu(!menu)}
>
<span></span>
<span></span>
<span></span>
</button>

</div>

</div>


{/* SIDE MENU */}

<div
ref={menuRef}
className={`sideMenu ${menu ? "show" : ""}`}
>

<div className="profile">

<div className="avatar">👤</div>

<div className="profileName">
Kyaw Kyaw
</div>

<div className="arrow">→</div>

</div>

<div className="divider"></div>

<Link to="/" className="menuItem">Home Page <span>→</span></Link>

<Link to="/showroom" className="menuItem">Shop the cars <span>→</span></Link>

<Link to="/showroom" className="menuItem">Car Rental <span>→</span></Link>

<Link to="/contact" className="menuItem">Contact Us <span>→</span></Link>

<Link to="/help" className="menuItem">Need Help? <span>→</span></Link>

<div className="logout">Log Out</div>

</div>

</header>

)

}