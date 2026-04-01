import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import { useAuth } from "./state/auth.jsx";
import AppLayout from "./pages/AppLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import PropertiesPage from "./pages/PropertiesPage.jsx";
import FavouritesPage from "./pages/FavouritesPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/home" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/app/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="favourites" element={<FavouritesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/app/home" replace />} />
    </Routes>
  );
}
