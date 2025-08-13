import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { Box, TextField, Button, Typography } from "@mui/material";

export const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.username || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload = {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
      };

      // Call backend API
      const res = await axiosInstance.post("/users", payload);

      // Assuming backend returns UserResponseDto
      const createdUser = res.data;

      login(createdUser); // store in context + localStorage
      navigate("/");      // redirect to dashboard
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Registration failed.");
      } else {
        setError("Registration failed. Try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        width: 400,
        mx: "auto",
        mt: 10,
        p: 4,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Register
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button fullWidth variant="contained" type="submit">
          Register
        </Button>
      </form>
    </Box>
  );
};
