import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ExpenseProvider } from "./contexts/ExpenseContext";

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
