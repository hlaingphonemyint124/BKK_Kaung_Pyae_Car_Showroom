import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { createContext, useContext, useState } from "react";

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
import VerifyEmailPage from "./features/auth/pages/VerifyEmailPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import ContactPage from "./features/user/pages/ContactPage";
import ProfilePage from "./features/user/pages/ProfilePage";

import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";
import AdminBuyPage from "./features/admin/pages/AdminBuyPage";
import AdminRentalPage from "./features/admin/pages/AdminRentalPage";
import AdminBuyDetailPage from "./features/admin/pages/AdminBuyDetailPage";
import AdminRentalDetailPage from "./features/admin/pages/AdminRentalDetailPage";
import ProtectedRoute from "./features/admin/components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

/* ========================= */

export const ThemeContext = createContext();

const ADMIN_ROLES = ["admin", "employee"];

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

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";
  const isAdminRoute = location.pathname.startsWith("/admin");

  const hideHeader = isAuthRoute;
  const hideFooter = isAuthRoute || isAdminRoute;

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/showroom" element={<Showroom />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/buy"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminBuyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rental"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminRentalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/buy/new"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminBuyDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/buy/:id"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminBuyDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rental/new"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminRentalDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rental/:id"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminRentalDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

/* ========================= */

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}

export default App;
