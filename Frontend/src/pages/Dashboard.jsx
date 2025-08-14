import React, { useState, useMemo } from "react";
import { useExpenses } from "../hooks/useExpenses";
import { SummaryCard } from "../components/SummaryCard";
import { CategoryChart } from "../components/CategoryChart";
import { ExpenseCard } from "../components/ExpenseCard";
import {
  Grid,
  Typography,
  Fab,
  Dialog,
  DialogContent,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { ExpenseForm } from "../components/ExpenseForm";
import axiosInstance from "../api/axiosInstance";

// Group totals by category
const sumByCategory = (items, categories) => {
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});
  const totals = {};
  items.forEach((i) => {
    if (!totals[i.categoryId]) totals[i.categoryId] = 0;
    totals[i.categoryId] += i.amount;
  });
  return Object.keys(totals).map((catId) => ({
    category: categoryMap[catId] || "Unknown",
    amount: totals[catId],
  }));
};

export const Dashboard = () => {
  const { expenses = [], income = [], categories = [], setExpenses, setIncome } = useExpenses();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Merge with type + category name
  const allItems = useMemo(() => {
    const expItems = expenses.map((e) => ({
      ...e,
      type: "expense",
      category: categories.find((c) => c.id === e.categoryId)?.name || "Unknown",
    }));
    const incItems = income.map((i) => ({
      ...i,
      type: "income",
      category: categories.find((c) => c.id === i.categoryId)?.name || "Unknown",
    }));
    return [...expItems, ...incItems];
  }, [expenses, income, categories]);

  // Filter + search + sort
  const filteredItems = useMemo(() => {
    return allItems
      .filter((e) => (typeFilter === "all" ? true : e.type === typeFilter))
      .filter((e) =>
        search.trim()
          ? (e.notes || e.source || e.category || "")
              .toLowerCase()
              .includes(search.toLowerCase())
          : true
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allItems, typeFilter, search]);

  // Totals
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = income.reduce((sum, e) => sum + e.amount, 0);

  // Chart data
  const categoryData = sumByCategory(filteredItems, categories);

  // Save new transaction
  const handleSave = async (newItem) => {
    if (saving) return;
    setSaving(true);

    try {
      const selectedCategory = categories.find((cat) => cat.id === newItem.categoryId);
      if (!selectedCategory) throw new Error("Category not found");

      const endpoint = selectedCategory.isExpense ? "/expenses" : "/incomes";
      const type = selectedCategory.isExpense ? "expense" : "income";

      const payload = { ...newItem, date: newItem.date.toISOString() };
      const res = await axiosInstance.post(endpoint, payload);

      const savedItem = {
        ...res.data,
        type,
        category: selectedCategory.name,
      };

      if (type === "expense") setExpenses((prev) => [savedItem, ...prev]);
      else setIncome((prev) => [savedItem, ...prev]);

      setOpen(false);
    } catch (err) {
      console.error("Save failed", err.response?.data || err);
      alert("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "relative", paddingBottom: "80px" }}>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard title="Total Income" value={totalIncome} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard title="Total Expense" value={totalExpense} color="error" />
        </Grid>
       
      </Grid>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <ToggleButtonGroup
            value={typeFilter}
            exclusive
            onChange={(e, val) => val && setTypeFilter(val)}
            size="small"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="income">Income</ToggleButton>
            <ToggleButton value="expense">Expense</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      {/* Category Chart */}
      {categoryData.length > 0 ? <CategoryChart data={categoryData} /> : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No transactions to display in chart.
        </Typography>
      )}

      {/* Recent Transactions */}
       <Grid item xs={6} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by notes, source, or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        {typeFilter === "all"
          ? "Recent Transactions"
          : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1) + "s"}
      </Typography>
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => <ExpenseCard key={item.id + item.date} expense={item} />)
      ) : (
        <Typography variant="body2" color="text.secondary">
          No {typeFilter} transactions found.
        </Typography>
      )}

      {/* Floating Add Button */}
      <Tooltip title="Add new transaction" arrow>
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Add Form Dialog */}
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
