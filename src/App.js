import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import ContactPage from "./features/user/pages/ContactPage";
import ProfilePage from "./features/user/pages/ProfilePage";

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

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/showroom" element={<Showroom />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;