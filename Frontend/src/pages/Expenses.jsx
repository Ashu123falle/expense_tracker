import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { addExpense, updateExpense, deleteExpense } from "../api/expenseApi";
import { ExpenseForm } from "../components/ExpenseForm";

export const Expenses = () => {
  const { expenses, setExpenses, categories } = useContext(ExpenseContext);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleOpenDialog = (expense = null) => {
    setEditingExpense(expense);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingExpense(null);
    setOpenDialog(false);
  };

  const handleSave = async (payload) => {
    try {
      if (editingExpense) {
        const updated = await updateExpense({ ...payload, id: editingExpense.id });
        setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      } else {
        const newExp = await addExpense(payload);
        setExpenses((prev) => [...prev, newExp]);
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving expense:", err.response?.data || err);
      alert("Failed to save expense. Check console.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Failed to delete expense. Check console.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Expenses
      </Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>
        Add Expense
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell>{categories.find((c) => c.id === exp.categoryId)?.name || "N/A"}</TableCell>
                <TableCell>{exp.amount}</TableCell>
                <TableCell>{new Date(exp.date).toLocaleDateString()}</TableCell>
                <TableCell>{exp.notes}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpenDialog(exp)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(exp.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingExpense ? "Edit Expense" : "Add Expense"}</DialogTitle>
        <DialogContent>
          <ExpenseForm
            expense={editingExpense}
            categories={categories}
            onSave={handleSave}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
