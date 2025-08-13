import React, { useState, useEffect, useContext } from "react";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

export const ExpenseForm = ({ expense, categories, onSave, onCancel }) => {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  useEffect(() => {
    if (expense) {
      setForm({
        categoryId: expense.categoryId,
        amount: expense.amount,
        date: expense.date ? expense.date.split("T")[0] : new Date().toISOString().slice(0, 10),
        notes: expense.notes,
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!user) return alert("User not logged in");
    const payload = {
      accountId: Number(user.id),
      userId: Number(user.id),
      categoryId: Number(form.categoryId),
      amount: parseFloat(form.amount),
      date: new Date(form.date).toISOString(),
      notes: form.notes || "",
    };
    onSave(payload);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {expense ? "Edit Expense" : "Add Expense"}
      </Typography>

      <TextField
        select
        fullWidth
        label="Category"
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name} ({cat.isExpense ? "Expense" : "Income"})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        type="number"
        label="Amount"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        fullWidth
        type="date"
        label="Date"
        name="date"
        value={form.date}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Notes"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {expense ? "Update" : "Add"}
        </Button>
      </Box>
    </Box>
  );
};
