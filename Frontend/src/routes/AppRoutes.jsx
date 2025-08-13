import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import { Dashboard } from "../pages/Dashboard";
import { Expenses } from "../pages/Expenses";
import { Categories } from "../pages/Categories";
import { Reports } from "../pages/Reports";
import { Profile } from "../pages/Profile";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Navbar } from "../components/Navbar";
import { LandingPage } from "../pages/LandingPage";

export const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
  path="/"
  element={user ? <Dashboard /> : <LandingPage />}
/>


        {/* Keep this comment */}
        {/* <Route
          path="/expenses"
          element={user ? <Expenses accountId={user.id} userId={user.id} /> : <Navigate to="/" />}
        /> */}

        <Route
          path="/expenses"
          element={
            user
              ? <Expenses accountId={user.id} userId={user.id} />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/categories"
          element={user ? <Categories /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={user ? <Reports /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
