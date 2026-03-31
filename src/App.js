import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

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

import AdminBuyPage from "./features/admin/pages/AdminBuyPage";
import AdminRentalPage from "./features/admin/pages/AdminRentalPage";
import AdminBuyDetailPage from "./features/admin/pages/AdminBuyDetailPage";
import AdminRentalDetailPage from "./features/admin/pages/AdminRentalDetailPage";

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
        <Route path="/admin/buy" element={<AdminBuyPage />} />
        <Route path="/admin/rental" element={<AdminRentalPage />} />
        <Route path="/admin/buy/:id" element={<AdminBuyDetailPage />} />
        <Route path="/admin/rental/:id" element={<AdminRentalDetailPage />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;