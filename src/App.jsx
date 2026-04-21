import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { createContext, useContext, useState } from "react";

import Header from "./components/Header";
import Hero from "./section/Hero";
import Deals from "./section/Deals";
import BrandList from "./section/BrandList";
import CarTypes from "./section/CarTypes";
import EasyRental from "./section/EasyRental";
import Testimonials from "./section/Testimonials";
import WhyChooseUs from "./section/WhyChooseUs";
import AboutUs from "./section/AboutUs";
import Team from "./section/Team";
import Footer from "./components/Footer";

import Showroom from "./pages/Showroom";
import CarDetail from "./pages/CarDetail";
import LoginPage from "./features/auth/pages/LoginPage";
import SignupPage from "./features/auth/pages/SignupPage";

/* ========================= */

export const ThemeContext = createContext();

function Home() {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Hero />
      <Deals />
      <BrandList />
      <CarTypes />
      <EasyRental />
      <Testimonials />
      <WhyChooseUs />
      <AboutUs theme={theme} />
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
  const [theme, setTheme] = useState("light"); // 👈 change to "dark" to default dark

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;