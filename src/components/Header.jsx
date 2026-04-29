import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const [params] = useSearchParams();

  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const menuRef = useRef(null);
  const langRef = useRef(null);

  const isAdmin = user?.role === "admin" || user?.role === "employee";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.toggle("dark", savedTheme === "dark");
    }
  }, [setTheme]);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }

      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  useEffect(() => {
    setMenu(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setMenu(false);

    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }

    window.location.href = "/";
  };

  const languages = [
    { code: "EN", flag: "https://flagcdn.com/w20/gb.png", label: "English" },
    { code: "MM", flag: "https://flagcdn.com/w20/mm.png", label: "Myanmar" },
    { code: "TH", flag: "https://flagcdn.com/w20/th.png", label: "ภาษาไทย" },
  ];

  const currentLang = languages.find((l) => l.code === language);

  const navItems = [
    { to: "/", label: "Home Page" },

    ...(isAdmin ? [{ to: "/admin", label: "Dashboard" }] : []),

    {
      to: isAdmin ? "/admin/buy" : "/showroom?mode=buy",
      label: "Shop the Cars",
    },

    {
      to: isAdmin ? "/admin/rental" : "/showroom?mode=rent",
      label: "Car Rental",
    },

    { to: "/sold-history", label: "Sold History" },
    { to: "/contact", label: "Contact Us" },
    { to: "/help", label: "Need Help?" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";

    const [pathname, search] = path.split("?");

    if (!location.pathname.startsWith(pathname)) return false;

    if (search) {
      const linkParams = new URLSearchParams(search);

      return [...linkParams.entries()].every(
        ([key, value]) => params.get(key) === value
      );
    }

    return true;
  };

  return (
    <>
      <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
        <div className="site-header__inner">
          <Link to="/" className="site-logo">
            <div className="site-logo__main">BKK Kaung Pyae</div>
            <span className="site-logo__sub">Auto</span>
          </Link>

          <div className="site-nav">
            <div className="lang-wrapper" ref={langRef}>
              <button
                className={`lang-btn${langOpen ? " lang-btn--open" : ""}`}
                onClick={() => setLangOpen(!langOpen)}
                aria-expanded={langOpen}
                aria-label="Select language"
              >
                <img src={currentLang.flag} alt={currentLang.code} />
                <span>{currentLang.code}</span>
              </button>

              <div className={`lang-dropdown${langOpen ? " lang-dropdown--open" : ""}`}>
                <div className="lang-dropdown__bar" />
                <div className="lang-dropdown__title">Language</div>

                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-item${
                      lang.code === language ? " lang-item--active" : ""
                    }`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                  >
                    <img src={lang.flag} alt={lang.code} />

                    <div className="lang-item__text">
                      <span className="lang-item__code">{lang.code}</span>
                      <span className="lang-item__label">{lang.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              className="theme-btn"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle dark mode"
            >
              <span className="theme-btn__icon">
                {theme === "dark" ? "☀️" : "🌙"}
              </span>
            </button>

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

      <div
        className={`menu-overlay${menu ? " menu-overlay--show" : ""}`}
        onClick={() => setMenu(false)}
        aria-hidden="true"
      />

      <nav
        ref={menuRef}
        className={`sideMenu${menu ? " show" : ""}`}
        aria-hidden={!menu}
        aria-label="Navigation menu"
      >
        {user ? (
          <Link
            to="/profile"
            className="sideMenu__profile"
            onClick={() => setMenu(false)}
          >
            <div className="avatar">👤</div>

            <div className="sideMenu__profile-info">
              <span className="loginMenuItem">
                {user.name || user.email || "Admin"}
              </span>
              <span className="sideMenu__profile-sub">View your profile</span>
            </div>
          </Link>
        ) : (
          <div className="sideMenu__auth-row">
            <Link
              to="/login"
              className="sideMenu__auth-btn sideMenu__auth-btn--login"
              onClick={() => setMenu(false)}
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className="sideMenu__auth-btn sideMenu__auth-btn--signup"
              onClick={() => setMenu(false)}
            >
              Sign Up
            </Link>
          </div>
        )}

        <div className="sideMenu__section-label">Menu</div>

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
            </Link>
          ))}
        </div>

        <div className="sideMenu__spacer" />

        <div className="sideMenu__footer">
          <div className="divider" style={{ margin: "0 0 6px" }} />

          {user ? (
            <button className="logout" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <Link to="/login" className="logout" onClick={() => setMenu(false)}>
              Log In
            </Link>
          )}

          <p className="sideMenu__copyright">© BKK Kaung Pyae Auto</p>
        </div>
      </nav>
    </>
  );
}