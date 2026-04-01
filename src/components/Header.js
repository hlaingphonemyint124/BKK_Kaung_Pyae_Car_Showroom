import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header(){

const [menu,setMenu] = useState(false);
const [darkMode,setDarkMode] = useState(false);
const [langOpen,setLangOpen] = useState(false);
const [language,setLanguage] = useState("EN");

const menuRef = useRef(null);
const langRef = useRef(null);

/* LOAD THEME */

useEffect(()=>{
const savedTheme = localStorage.getItem("theme");
if(savedTheme === "dark"){
setDarkMode(true);
document.body.classList.add("dark");
}
},[]);

/* DARK MODE */

useEffect(()=>{
if(darkMode){
document.body.classList.add("dark");
localStorage.setItem("theme","dark");
}else{
document.body.classList.remove("dark");
localStorage.setItem("theme","light");
}
},[darkMode]);

/* CLOSE OUTSIDE CLICK */

useEffect(()=>{

function handleClickOutside(e){

if(menuRef.current && !menuRef.current.contains(e.target)){
setMenu(false);
}

if(langRef.current && !langRef.current.contains(e.target)){
setLangOpen(false);
}

}

document.addEventListener("mousedown",handleClickOutside);
return ()=> document.removeEventListener("mousedown",handleClickOutside);

},[]);


/* LANGUAGE DATA */

const languages = [
{code:"EN",flag:"https://flagcdn.com/w20/gb.png"},
{code:"MM",flag:"https://flagcdn.com/w20/mm.png"},
{code:"TH",flag:"https://flagcdn.com/w20/th.png"}
];

const currentLang = languages.find(l=>l.code===language);

return(

<header className="site-header">

<div className="site-header__inner">



{/* LOGO */}

<Link to="/" className="site-logo">
<div>BKK Kaung Pyae</div>
<span>Auto</span>
</Link>


{/* RIGHT NAV */}

<div className="site-nav">

{/* LANGUAGE */}

<div className="lang-wrapper" ref={langRef}>

<button
className="lang-btn"
onClick={()=>setLangOpen(!langOpen)}
>
<span>{currentLang.code}</span>
<img src={currentLang.flag} alt="flag"/>
</button>

{langOpen && (

<div className="lang-dropdown">

{languages.map((lang)=>(
<div
key={lang.code}
className="lang-item"
onClick={()=>{
setLanguage(lang.code);
setLangOpen(false);
}}
>
<span>{lang.code}</span>
<img src={lang.flag} alt="flag"/>
</div>
))}

</div>

)}

</div>


{/* DARK MODE */}

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


{/* SIDE MENU */}

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