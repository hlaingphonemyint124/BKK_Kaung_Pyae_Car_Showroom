import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header(){

const [menu,setMenu] = useState(false);
const [darkMode,setDarkMode] = useState(false);

const menuRef = useRef(null);


/* ===============================
LOAD SAVED THEME
=============================== */

useEffect(()=>{

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
setDarkMode(true);
document.body.classList.add("dark");
}

},[]);


/* ===============================
TOGGLE DARK MODE
=============================== */

useEffect(()=>{

if(darkMode){

document.body.classList.add("dark");
localStorage.setItem("theme","dark");

}else{

document.body.classList.remove("dark");
localStorage.setItem("theme","light");

}

},[darkMode]);


/* ===============================
CLOSE MENU OUTSIDE CLICK
=============================== */

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


{/* RIGHT NAV */}

<div className="site-nav">

{/* LANGUAGE */}

<button className="lang-btn">
EN
<img src="https://flagcdn.com/w20/gb.png" alt="" />
</button>


{/* DARK MODE BUTTON */}

<button
className="theme-btn"
onClick={()=>setDarkMode(!darkMode)}
>
{darkMode ? "☀️" : "🌙"}
</button>


{/* MENU BUTTON */}

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


{/* ===============================
SIDE MENU
=============================== */}

<div
ref={menuRef}
className={`sideMenu ${menu ? "show" : ""}`}
>

<div className="profile">

<div className="avatar">👤</div>

<Link to="/login" className="menuItem loginMenuItem">
  Log In / Sign Up 
</Link>

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