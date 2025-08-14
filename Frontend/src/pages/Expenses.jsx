import React, { useState } from "react";
import {
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Box,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useExpenses } from "../contexts/ExpenseContext";
import { ExpenseForm } from "../components/ExpenseForm";
import axiosInstance from "../api/axiosInstance";

export function Expenses() {
  const { expenses, income, setExpenses, setIncome, categories, loading } = useExpenses();
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // For edit
 console.log(income);
 
  const handleEdit = (item) => {
    setCurrentItem(item);
    setOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const endpoint = item.isExpense ? `/expenses/${item.id}` : `/incomes/${item.id}`;
      await axiosInstance.delete(endpoint);

      if (item.isExpense) setExpenses((prev) => prev.filter((e) => e.id !== item.id));
      else setIncome((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error("Delete failed", err.response?.data || err);
      alert("Failed to delete. Try again.");
    }
  };
const handleSave = async (updatedFields) => {
  try {
    const endpoint = updatedFields.isExpense
      ? `/expenses/${updatedFields.id}`
      : `/incomes/${updatedFields.id}`;

    // Merge with old item to keep unedited fields
    const oldItem = updatedFields.isExpense
      ? expenses.find((e) => e.id === updatedFields.id)
      : income.find((i) => i.id === updatedFields.id);

    const payload = {
      ...oldItem,          // keep all old values
      ...updatedFields,    // overwrite only what was edited
      date: updatedFields.date instanceof Date ? updatedFields.date.toISOString() : oldItem.date,
    };

    const res = await axiosInstance.put(endpoint, payload);

    // Update context
    if (updatedFields.isExpense) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === updatedFields.id ? { ...res.data, category: updatedFields.category || e.category } : e))
      );
    } else {
      setIncome((prev) =>
        prev.map((i) => (i.id === updatedFields.id ? { ...res.data, category: updatedFields.category || i.category } : i))
      );
    }

    setOpen(false);
    setCurrentItem(null);
  } catch (err) {
    console.error("Update failed", err.response?.data || err);
    alert("Failed to update. Try again.");
  }
};


if (loading) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  const renderTable = (items, type) => (
    
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Amount</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            
            <TableRow key={item.id}>
              <TableCell>{type === "expense" ? item.notes : item.source}</TableCell>
              <TableCell>₹{item.amount}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleEdit(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(item)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Expenses
      </Typography>
      {expenses.length > 0 ? renderTable(expenses, "expense") : <Typography>No expenses found.</Typography>}

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Income
        </Typography>
        {income.length > 0 ? renderTable(income, "income") : <Typography>No income found.</Typography>}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogContent>
          {currentItem && (
            <ExpenseForm
              categories={categories}
             expense={currentItem}
              onSave={handleSave}
              onCancel={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
