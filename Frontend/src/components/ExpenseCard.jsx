import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { format } from "date-fns";

export const ExpenseCard = ({ expense }) => {
  // Determine colors based on type
  const isExpense = expense.type === "expense";
  const chipColor = isExpense ? "error" : "success";
  const amountColor = isExpense ? "error.main" : "success.main";

  return (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        {/* Title & Category */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6">{expense.title || (isExpense ? "Expense" : "Income")}</Typography>
          <Chip
            label={expense.category || "Unknown"}
            color={chipColor}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        {/* Amount & Date */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body1" sx={{ color: amountColor, fontWeight: "bold" }}>
            {isExpense ? "- ₹ " : "+ ₹ "}
            {expense.amount?.toLocaleString()}
          </Typography>
          <Typography variant="caption">
            {format(new Date(expense.date), "dd MMM yyyy, hh:mm a")}
          </Typography>
        </Box>

        {/* Notes or Source */}
        {isExpense && expense.notes && (
          <Typography
            variant="body2"
            sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
          >
           Note: {expense.notes}
          </Typography>
        )}
        {!isExpense && expense.source && (
          <Typography
            variant="body2"
            sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
          >
            Source: {expense.source}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
