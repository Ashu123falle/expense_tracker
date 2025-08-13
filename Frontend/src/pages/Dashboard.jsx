import React, { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import { SummaryCard } from "../components/SummaryCard";
import { CategoryChart } from "../components/CategoryChart";
import { ExpenseCard } from "../components/ExpenseCard";
import { Grid, Typography, Fab, Dialog, DialogContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ExpenseForm } from "../components/ExpenseForm";
import axiosInstance from "../api/axiosInstance";

// Helper function to sum expenses by category
const sumExpensesByCategory = (expenses, categories) => {
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  const totals = {};
  expenses.forEach((e) => {
    if (!totals[e.categoryId]) totals[e.categoryId] = 0;
    totals[e.categoryId] += e.amount;
  });

  return Object.keys(totals).map((catId) => ({
    category: categoryMap[catId] || "Unknown",
    amount: totals[catId],
  }));
};

export const Dashboard = () => {
  const { expenses = [], categories = [], setExpenses } = useExpenses();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryData = sumExpensesByCategory(expenses, categories);

  // Save new expense to backend
  const handleSave = async (newExpense) => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await axiosInstance.post("/expenses", newExpense);
      // Add returned expense to state
      setExpenses((prev) => [...prev, res.data]);
      setOpen(false);
    } catch (err) {
      console.error("Failed to save expense", err.response?.data || err);
      alert("Failed to save expense. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "relative", paddingBottom: "80px" }}>
      <Grid container spacing={2}>
        <SummaryCard title="Total Expense" value={totalExpense} />
      </Grid>

      <CategoryChart data={categoryData} />

      <Typography variant="h5" sx={{ mt: 4 }}>
        Recent Expenses
      </Typography>
      {expenses.map((e) => (
        <ExpenseCard key={e.id} expense={e} />
      ))}

      {/* Floating Add Expense Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Dialog for Add Expense */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogContent>
          <ExpenseForm
            categories={categories}
            onSave={handleSave}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
