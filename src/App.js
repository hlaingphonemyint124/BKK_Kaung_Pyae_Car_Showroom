import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Deals from "./components/Deals";
import BrandList from "./components/BrandList";
import CarTypes from "./components/CarTypes";
import EasyRental from "./components/EasyRental";
import Testimonials from "./components/Testimonials";
import WhyChooseUs from "./components/WhyChooseUs";
import AboutUs from "./components/AboutUs";
import Team from "./components/Team";
import Footer from "./components/Footer";

import Showroom from "./components/Showroom";
import CarDetail from "./components/CarDetail";
import LoginPage from "./features/auth/pages/LoginPage";
import SignupPage from "./features/auth/pages/SignupPage";

/* ========================= */

function Home() {
  return (
    <>
      <Hero />
      <Deals />
      <BrandList />
      <CarTypes />
      <EasyRental />
      <Testimonials />
      <WhyChooseUs />
      <AboutUs />
      <Team />
    </>
  );
}

function AppLayout() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/showroom" element={<Showroom />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

/* ========================= */

function App() {

  // 🔥 FORCE DARK MODE (WORKING)
  useEffect(() => {
    document.body.className = "dark";
  }, []);

  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;