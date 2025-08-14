import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Stack,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";
import { ExpenseContext } from "../contexts/ExpenseContext";

// const API_URL = "https://localhost:7096/api/Accounts";
const API_URL = "https://expense-tracker-ybyq.onrender.com/api/Accounts";


export const Accounts = () => {
  const { accounts: contextAccounts, setAccounts: setContextAccounts } = useContext(ExpenseContext);
  const { user, isLoggedIn } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    accountName: "",
    accountType: "",
    balance: 0,
    userId: null,
  });

  const accountTypes = ["Savings", "Credit Card", "UPI", "Cash"];

  // Load accounts when user logs in
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      setForm((prev) => ({ ...prev, userId: user.id }));
      fetchAccounts(user.id);
    }
  }, [isLoggedIn, user]);

  // Fetch accounts from backend and update context
  const fetchAccounts = async (userId) => {
    try {
      const res = await axiosInstance.get(`${API_URL}/by-user/${userId}`);
      setContextAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  // Open dialog for add/edit
  const handleOpen = (account = null) => {
    if (account) {
      setEditing(account);
      setForm({
        accountName: account.accountName,
        accountType: account.accountType,
        balance: account.balance,
        userId: account.userId,
      });
    } else {
      setEditing(null);
      setForm({
        accountName: "",
        accountType: "",
        balance: 0,
        userId: user?.id || null,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save or update account
  const handleSave = async () => {
    try {
      if (editing) {
        await axiosInstance.put(`${API_URL}/${editing.id}`, form);
      } else {
        await axiosInstance.post(API_URL, form);
      }
      fetchAccounts(user.id); // update context
      handleClose();
    } catch (err) {
      console.error("Error saving account:", err);
    }
  };

  // Delete account
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this account?")) return;
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
      fetchAccounts(user.id); // update context
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  if (!isLoggedIn) {
    return <Typography>Please log in to view your accounts.</Typography>;
  }

  return (
    <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          Accounts
        </Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          + Add Account
        </Button>
      </Stack>

      <Table sx={{ mt: 3 }}>
        <TableHead sx={{ backgroundColor: "#f9f9f9" }}>
          <TableRow>
            <TableCell><strong>Account Name</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell align="right"><strong>Balance</strong></TableCell>
            <TableCell align="right"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contextAccounts.length > 0 ? (
            contextAccounts.map((acc) => (
              <TableRow key={acc.id} hover>
                <TableCell>{acc.accountName}</TableCell>
                <TableCell>{acc.accountType}</TableCell>
                <TableCell align="right">₹ {acc.balance.toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(acc)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(acc.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ color: "text.secondary" }}>
                No accounts found. Click "Add Account" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Edit Account" : "Add Account"}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="dense"
              label="Account Name"
              name="accountName"
              fullWidth
              value={form.accountName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              select
              label="Account Type"
              name="accountType"
              fullWidth
              value={form.accountType}
              onChange={handleChange}
            >
              {accountTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Balance"
              name="balance"
              type="number"
              fullWidth
              value={form.balance}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
