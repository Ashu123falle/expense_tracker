import React, { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import axiosInstance from "../api/axiosInstance";
import {
  Button,
  TextField,
  List,
  ListItem,
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Chip,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const Categories = () => {
  const { categories = [], setCategories } = useExpenses();
  const [newCategory, setNewCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    if (categories.some((c) => c.name.toLowerCase() === newCategory.toLowerCase())) {
      alert("Category already exists!");
      return;
    }

    try {
      const res = await axiosInstance.post("/categories", {
        name: newCategory,
        isExpense,
      });
      setCategories([...categories, res.data]);
      setNewCategory("");
      setIsExpense(true);
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Categories
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          label="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          fullWidth
        />
        <FormControlLabel
          control={
            <Switch
              checked={isExpense}
              onChange={(e) => setIsExpense(e.target.checked)}
              color="primary"
            />
          }
          label={isExpense ? "Expense" : "Income"}
        />
        <Button variant="contained" onClick={addCategory}>
          Add
        </Button>
      </Box>

      {categories.length === 0 ? (
        <Typography variant="body1">No categories yet.</Typography>
      ) : (
        <List>
  {categories.map((cat) => (
    <Paper
      key={cat.id}
      elevation={2}
      sx={{
        mb: 1,
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: cat.isExpense ? "#ffe5e5" : "#e5ffe5", // light red for Expense, green for Income
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {cat.name}
        </Typography>
        <Chip
          label={cat.isExpense ? "Expense" : "Income"}
          size="small"
          color={cat.isExpense ? "error" : "success"}
        />
      </Box>
      <IconButton edge="end" onClick={() => deleteCategory(cat.id)}>
        <DeleteIcon />
      </IconButton>
    </Paper>
  ))}
</List>
      )}
    </Box>
  );
};
