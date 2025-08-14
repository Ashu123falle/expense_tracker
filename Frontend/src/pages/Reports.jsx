import React, { useState, useMemo } from "react";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TableContainer,
  Paper,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useExpenses } from "../contexts/ExpenseContext";
import { format } from "date-fns";
export const Reports = () => {
  const { expenses = [], income = [] } = useExpenses();
  const [filter, setFilter] = useState({ start: "", end: "" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Merge and mark type for totals / display
  const allItems = useMemo(() => {
    const expItems = expenses.map((e) => ({ ...e, type: "expense" }));
    const incItems = income.map((i) => ({ ...i, type: "income" }));
    return [...expItems, ...incItems];
  }, [expenses, income]);

  // Filter by date
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const itemDate = new Date(item.date);
      const startDate = filter.start ? new Date(filter.start) : null;
      const endDate = filter.end ? new Date(filter.end) : null;
      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
      return true;
    });
  }, [allItems, filter]);

  // Totals
  const totalExpense = filteredItems
    .filter((i) => i.type === "expense")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalIncome = filteredItems
    .filter((i) => i.type === "income")
    .reduce((sum, i) => sum + i.amount, 0);

  // PDF generation
  const generatePDF = () => {
    if (!filteredItems.length) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    doc.setFontSize(18);
    doc.text("Expense Report", pageWidth / 2, 40, { align: "center" });

    // Summary
    doc.setFontSize(12);
    doc.text(`Total Expenses:  ${totalExpense.toLocaleString()}`, margin, 70);
    doc.text(`Total Income: ${totalIncome.toLocaleString()}`, margin, 90);
    doc.text(
      `Date Range: ${filter.start || "Start"} to ${filter.end || "End"}`,
      margin,
      110
    );

    // Table
    const tableData = filteredItems.map((i) => [
      format(new Date(i.date), "dd MMM yyyy, hh:mm a"),
      i.category || "-",
      i.type === "expense" ? i.notes :i.source,
      i.type === "expense" ? `- ${i.amount.toLocaleString()}` :`+ ${i.amount.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 130,
      head: [["Date", "Category", "Note", "Amount"]],
      body: tableData,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [63, 81, 181], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 40, right: 40 },
      columnStyles: { 3: { halign: "right" } },
    });

    doc.save("expense-report.pdf");
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Expense Reports
      </Typography>

      {/* Date Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            name="start"
            value={filter.start}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="End Date"
            type="date"
            fullWidth
            name="end"
            value={filter.end}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ border: "2px solid red", borderRadius: 2, bgcolor: "#f9babaff" }}>
            <CardContent>
              <Typography>Total Expenses</Typography>
              <Typography variant="h5" sx={{ color: "red" }}>
                ₹ {totalExpense.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ border: "2px solid green", borderRadius: 2, bgcolor: "#8af08dff" }}>
            <CardContent>
              <Typography>Total Income</Typography>
              <Typography variant="h5" sx={{ color: "green" }}>
                ₹ {totalIncome.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Expense Table */}
      <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Note</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((i) => (
              <TableRow
                key={i.id + i.date}
                sx={{
                  "&:nth-of-type(odd)": { bgcolor: "grey.100" },
                  "&:hover": { bgcolor: "grey.200" },
                }}
              >
                <TableCell>{new Date(i.date).toLocaleDateString()}</TableCell>
                <TableCell>{i.category}</TableCell>
                <TableCell>{i.type === "expense" ? i.notes : i.source}</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: i.type === "expense" ? "error.main" : "success.main",
                    fontWeight: 500,
                  }}
                >
                  {i.type === "expense" ? "- ₹" : "+ ₹"} {i.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={generatePDF}
        disabled={!filteredItems.length}
      >
        Download PDF
      </Button>
    </div>
  );
};
