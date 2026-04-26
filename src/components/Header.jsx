import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const menuRef = useRef(null);
  const langRef = useRef(null);

  const isAdmin = user?.role === "admin" || user?.role === "employee";

  /* LOAD THEME */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.toggle("dark", savedTheme === "dark");
    }
  }, [setTheme]);

  /* DARK MODE */
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  /* SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* CLOSE OUTSIDE CLICK */
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* LOCK BODY SCROLL WHEN MENU OPEN */
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  /* CLOSE MENU ON ROUTE CHANGE */
  useEffect(() => { setMenu(false); }, [location.pathname]);

  const handleLogout = async () => {
    setMenu(false);
    await logout();
    navigate("/login");
  };

  const languages = [
    { code: "EN", flag: "https://flagcdn.com/w20/gb.png", label: "English"  },
    { code: "MM", flag: "https://flagcdn.com/w20/mm.png", label: "Myanmar"  },
    { code: "TH", flag: "https://flagcdn.com/w20/th.png", label: "ภาษาไทย" },
  ];

  const currentLang = languages.find((l) => l.code === language);

  const navItems = [
    { to: "/",                                      label: "Home Page"     },
    ...(isAdmin ? [{ to: "/admin",                  label: "Dashboard"    }] : []),
    { to: isAdmin ? "/admin/buy"    : "/showroom",  label: "Shop the Cars" },
    { to: isAdmin ? "/admin/rental" : "/rental",    label: "Car Rental"    },
    { to: "/sold-history",                          label: "Sold History"  },
    { to: "/contact",                               label: "Contact Us"    },
    { to: "/help",                                  label: "Need Help?"    },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
        <div className="site-header__inner">

          {/* LOGO */}
          <Link to="/" className="site-logo">
            <div className="site-logo__main">BKK Kaung Pyae</div>
            <span className="site-logo__sub">Auto</span>
          </Link>

          {/* RIGHT NAV */}
          <div className="site-nav">

            {/* LANGUAGE DROPDOWN */}
            <div className="lang-wrapper" ref={langRef}>
              <button
                className={`lang-btn${langOpen ? " lang-btn--open" : ""}`}
                onClick={() => setLangOpen(!langOpen)}
                aria-expanded={langOpen}
                aria-label="Select language"
              >
                <img src={currentLang.flag} alt={currentLang.code} />
                <span>{currentLang.code}</span>
                <svg
                  className={`lang-chevron${langOpen ? " open" : ""}`}
                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                >
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className={`lang-dropdown${langOpen ? " lang-dropdown--open" : ""}`}>
                <div className="lang-dropdown__bar" />
                <div className="lang-dropdown__title">Language</div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-item${lang.code === language ? " lang-item--active" : ""}`}
                    onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                  >
                    <img src={lang.flag} alt={lang.code} />
                    <div className="lang-item__text">
                      <span className="lang-item__code">{lang.code}</span>
                      <span className="lang-item__label">{lang.label}</span>
                    </div>
                    {lang.code === language && (
                      <div className="lang-item__check">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4l2.5 2.5L7 1.5" stroke="#fff"
                            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* DARK MODE TOGGLE */}
            <button
              className="theme-btn"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle dark mode"
            >
              <span className="theme-btn__icon">
                {theme === "dark" ? "☀️" : "🌙"}
              </span>
            </button>

            {/* MENU BUTTON */}
            <button
              className={`menu-btn${menu ? " menu-btn--open" : ""}`}
              onClick={() => setMenu(!menu)}
              aria-label="Open menu"
              aria-expanded={menu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

          </div>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        className={`menu-overlay${menu ? " menu-overlay--show" : ""}`}
        onClick={() => setMenu(false)}
        aria-hidden="true"
      />

      {/* SIDE MENU */}
      <nav
        ref={menuRef}
        className={`sideMenu${menu ? " show" : ""}`}
        aria-hidden={!menu}
        aria-label="Navigation menu"
      >

        {/* PROFILE / LOGIN ROW */}
        <Link
          to="/login"
          className="sideMenu__profile"
          onClick={() => setMenu(false)}
          aria-label="Log in or sign up"
        >
          <div className="avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="sideMenu__profile-info">
            {user ? (
              <span className="loginMenuItem" style={{ cursor: "default" }}>
                {user.name || user.email || "Admin"}
              </span>
            ) : (
              <span className="loginMenuItem">Log In / Sign Up</span>
            )}
            <span className="sideMenu__profile-sub">Access your account</span>
          </div>

          <svg
            className="sideMenu__profile-arrow"
            width="16" height="16" viewBox="0 0 16 16" fill="none"
          >
            <path d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* SECTION LABEL */}
        <div className="sideMenu__section-label">Menu</div>

        {/* NAV ITEMS */}
        <div className="menuItems-wrapper">
          {navItems.map(({ to, label }, i) => (
            <Link
              key={to}
              to={to}
              className={`menuItem${isActive(to) ? " menuItem--active" : ""}`}
              onClick={() => setMenu(false)}
              style={{ animationDelay: `${i * 0.055}s` }}
            >
              <span className="menuItem__dot" aria-hidden="true" />
              <span className="menuItem__label">{label}</span>
              <svg
                className="menuItem__arrow"
                width="14" height="14" viewBox="0 0 14 14" fill="none"
              >
                <path d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
        </div>

        <div className="sideMenu__spacer" />

        {/* FOOTER */}
        <div className="sideMenu__footer">
          <div className="divider" style={{ margin: "0 0 6px" }} />

          {user ? (
            <button className="logout" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6"
                  stroke="#ff3b3b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Log Out
            </button>
          ) : (
            <Link to="/login" className="logout" onClick={() => setMenu(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 2h3a1 1 0 011 1v10a1 1 0 01-1 1h-3M7 11l3-3-3-3M2 8h10"
                  stroke="#ff3b3b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Log In
            </Link>
          )}

          <p className="sideMenu__copyright">© BKK Kaung Pyae Auto</p>
        </div>

      </nav>
    </>
  );
}
