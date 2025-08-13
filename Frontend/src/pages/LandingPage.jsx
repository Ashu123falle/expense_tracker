import React from "react";
import { Box, Typography, Button, Grid, Paper, Fab } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BarChartIcon from "@mui/icons-material/BarChart";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", position: "relative" }}>
      {/* Floating Login/Register Button */}
      <Fab
        variant="extended"
        color="primary"
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
        onClick={() => navigate("/login")}
      >
        <LoginIcon sx={{ mr: 1 }} />
        Login / Register
      </Fab>

      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
          Expense Manager
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Track your expenses, manage budgets, and save smarter.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ bgcolor: "white", color: "primary.main", fontWeight: "bold" }}
          onClick={() => navigate("/register")}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 10 } }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 6 }}
        >
          Features
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                "&:hover": { boxShadow: 6, transform: "scale(1.03)", transition: "0.3s" },
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Track Expenses
              </Typography>
              <Typography color="text.secondary">
                Log your daily expenses and keep an eye on your spending habits.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                "&:hover": { boxShadow: 6, transform: "scale(1.03)", transition: "0.3s" },
              }}
            >
              <AccountBalanceWalletIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Manage Budgets
              </Typography>
              <Typography color="text.secondary">
                Create budgets for different categories and track them in real-time.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                "&:hover": { boxShadow: 6, transform: "scale(1.03)", transition: "0.3s" },
              }}
            >
              <BarChartIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Analytics
              </Typography>
              <Typography color="text.secondary">
                Visualize your spending with charts and reports for better insights.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, textAlign: "center", bgcolor: "white" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Start managing your finances today
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ bgcolor: "primary.main", color: "white", fontWeight: "bold" }}
          onClick={() => navigate("/register")}
        >
          Sign Up Now
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: "primary.dark", color: "white", textAlign: "center" }}>
        <Typography>© 2025 Expense Manager. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};
