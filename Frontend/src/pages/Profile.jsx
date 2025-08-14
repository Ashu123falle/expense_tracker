import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { AuthContext } from "../contexts/AuthContext";
import axiosInstance from "../api/axiosInstance";

const getInitials = (fullName, type = "short") => {
  if (!fullName) return "";
  const names = fullName.trim().split(" ");
  if (type === "short") {
    const first = names[0]?.[0] || "";
    const last = names[names.length - 1]?.[0] || "";
    return (first + last).toUpperCase();
  } else if (type === "long") {
    return names.map((n) => n[0]).join("").toUpperCase();
  } else if (type === "friendly") {
    const first = names[0]?.substring(0, 3) || "";
    const last = names[names.length - 1]?.[0] || "";
    return (first + last).toUpperCase();
  }
  return "";
};

export const Profile = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", username: "" });
  const [saving, setSaving] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          setProfile(storedUser);
          setForm({
            fullName: storedUser.fullName || "",
            email: storedUser.email || "",
            username: storedUser.username || "",
          });
        } else {
          const res = await axiosInstance.get(`/users/${userId}`);
          setProfile(res.data);
          setForm({
            fullName: res.data.fullName,
            email: res.data.email,
            username: res.data.username,
          });
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.put(`/users/${userId}`, form);

      // Merge updated fields with existing profile to keep accountId and other data
      const updatedProfile = { ...profile, ...res.data };
      setProfile(updatedProfile);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedProfile));

      setEditing(false);
    } catch (err) {
      console.error("Failed to save profile", err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress sx={{ m: 3 }} />;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      {/* Profile Card */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 80, height: 80 }}>
              {getInitials(profile?.fullName, "short")}
            </Avatar>
          </Grid>
          <Grid item xs>
            {editing ? (
              <>
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  fullWidth
                />
              </>
            ) : (
              <>
                <Typography variant="h6">{profile?.fullName}</Typography>
                <Typography color="text.secondary">{profile?.email}</Typography>
              </>
            )}
          </Grid>
          <Grid item>
            {editing ? (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ mt: 2, backgroundColor: "green" }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{
                  mt: 2,
                  color: "green",
                  borderColor: "green",
                  "&:hover": { borderColor: "darkgreen", color: "darkgreen" },
                }}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Account Information */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography>
          <strong>Account ID:</strong> {profile?.accountId || "N/A"}
        </Typography>
        <Typography>
          <strong>Username:</strong> {profile?.username}
        </Typography>
      </Paper>

      {/* Account Summary */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography>
          <strong>Total Accounts:</strong> {profile?.accounts?.length || 0}
        </Typography>
        <Typography>
          <strong>Total Budget:</strong> ₹{" "}
          {profile?.budgets?.reduce((sum, b) => sum + b.amount, 0) || 0}
        </Typography>
        <Typography>
          <strong>Recent Expenses:</strong>{" "}
          {profile?.expenses?.slice(-3).map((e) => e.title).join(", ") || "None"}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "green" }}
          onClick={() => alert("Redirect to add new account/budget")}
        >
          Add Account / Budget
        </Button>
      </Paper>
    </Box>
  );
};
