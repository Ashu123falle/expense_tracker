import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { format } from "date-fns";

export const ExpenseCard = ({ expense }) => {
  const chipColor = expense.isExpense ? "error" : "success";
  const amountColor = expense.isExpense ? "error.main" : "success.main";

  return (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <Typography variant="h6">{expense.title}</Typography>
          <Chip label={expense.category} color={chipColor} size="small" sx={{ fontWeight: "bold" }} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, flexWrap: "wrap" }}>
          <Typography variant="body1" sx={{ color: amountColor, fontWeight: "bold" }}>
            {expense.isExpense ? "- ₹ " : "+ ₹ "}
            {expense.amount.toLocaleString()}
          </Typography>
          <Typography variant="caption">
            {format(new Date(expense.date), "dd MMM yyyy")}
          </Typography>
        </Box>

        {expense.notes && (
          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}>
            {expense.notes}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
