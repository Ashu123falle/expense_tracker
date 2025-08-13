import { Card, CardContent, Typography } from "@mui/material";

export const SummaryCard = ({ title, value }) => (
  <Card sx={{ minWidth: 200, m: 1 }}>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h5">₹ {value}</Typography>
    </CardContent>
  </Card>
);
