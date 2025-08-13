import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Box, TextField, Button, Typography } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
export const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/"); 
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.username || !form.password) {
    setError("Please enter both username and password");
    return;
  }

  try {
    const res = await axiosInstance.post("users/login", form);

    // axios throws automatically on status >= 400, so no need for res.ok
    const data = res.data; 
    login(data); // store in context
    localStorage.setItem("user", JSON.stringify(data));
    navigate("/"); // redirect to dashboard
  } catch (err) {
    console.error(err);

    // better error handling
    if (err.response) {
      // server responded with status code outside 2xx
      setError(err.response.data?.message || "Invalid username or password");
    } else if (err.request) {
      // request made but no response
      setError("No response from server. Try again later.");
    } else {
      // other errors
      setError(err.message || "Login failed");
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
        Login
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <Button fullWidth variant="contained" type="submit">
          Login
        </Button>
      </form>
    </Box>
  );
};
