import { useState, useEffect, useContext } from "react";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export const ExpenseForm = ({ expense, categories, onSave, onCancel }) => {
  const { user } = useContext(AuthContext);
  const { accounts } = useContext(ExpenseContext);

  // Keep track of form values
  const [form, setForm] = useState({
    categoryId: "",
    accountId: "",
    amount: "",
    date: dayjs(),
    notes: "",
    source: "",
    type: "expense",
  });

  // Track only edited fields
  const [editedFields, setEditedFields] = useState({});

  useEffect(() => {
    if (expense) {
      setForm({
        categoryId: expense.categoryId,
        accountId: expense.accountId || "",
        amount: expense.amount,
        date: expense.date ? dayjs(expense.date) : dayjs(),
        notes: expense.notes || "",
        source: expense.source || "",
        type: expense.type || "expense",
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setEditedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate) => {
    setForm((prev) => ({ ...prev, date: newDate }));
    setEditedFields((prev) => ({ ...prev, date: newDate }));
  };

  const handleSubmit = () => {
    if (!user) return alert("User not logged in");

    // Merge old expense with edited fields (or create new)
    const payload = expense
      ? { ...expense, ...editedFields }
      : {
          userId: Number(user.id),
          accountId: Number(form.accountId),
          categoryId: Number(form.categoryId),
          amount: parseFloat(form.amount),
          date: form.date,
          type: form.type,
          ...(form.type === "income" ? { source: form.source } : { notes: form.notes }),
        };

    onSave(payload);
  };

  const selectedCategory = categories.find((cat) => cat.id === Number(form.categoryId));
  const isIncome = selectedCategory ? !selectedCategory.isExpense : form.type === "income";

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {expense ? "Edit Transaction" : "Add Transaction"}
      </Typography>

      {/* Category */}
      <TextField
        select
        fullWidth
        label="Category"
        name="categoryId"
        value={form.categoryId}
        onChange={(e) => {
          const value = Number(e.target.value);
          setForm((prev) => ({ ...prev, categoryId: value }));
          setEditedFields((prev) => ({ ...prev, categoryId: value }));
          const cat = categories.find((c) => c.id === value);
          if (cat) setForm((prev) => ({ ...prev, type: cat.isExpense ? "expense" : "income" }));
        }}
        sx={{ mb: 2 }}
        required
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name} ({cat.isExpense ? "Expense" : "Income"})
          </MenuItem>
        ))}
      </TextField>

      {/* Account */}
      <TextField
        select
        fullWidth
        label="Payment Method"
        name="accountId"
        value={form.accountId}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      >
        {accounts.map((acc) => (
          <MenuItem key={acc.id} value={acc.id}>
            {acc.accountName} ({acc.accountType})
          </MenuItem>
        ))}
      </TextField>

      {/* Amount */}
      <TextField
        fullWidth
        type="number"
        label="Amount"
        name="amount"
        value={form.amount}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "" || parseFloat(val) >= 0) handleChange(e);
        }}
        sx={{ mb: 2 }}
        required
      />

      {/* Date & Time */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Date & Time"
          value={form.date}
          onChange={handleDateChange}
          slotProps={{ textField: { fullWidth: true, sx: { mb: 2 }, required: true } }}
        />
      </LocalizationProvider>

      {/* Notes / Source */}
      {isIncome ? (
        <TextField
          fullWidth
          label="Source"
          name="source"
          value={form.source}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
      ) : (
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
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {expense ? "Update" : "Add"}
        </Button>
      </Box>
    </Box>
  );
};
