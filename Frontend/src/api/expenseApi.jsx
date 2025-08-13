import axiosInstance from "./axiosInstance";

// Fetch all expenses and categories
export const getExpenses = async () => {
  try {
    const [expRes, catRes] = await Promise.all([
      axiosInstance.get("/expenses"),
      axiosInstance.get("/categories"),
    ]);
    return { expenses: expRes.data, categories: catRes.data };
  } catch (err) {
    console.error("Error fetching expenses:", err);
    return { expenses: [], categories: [] };
  }
};

// Add new expense
export const addExpense = async (expense) => {
  try {
    const res = await axiosInstance.post("/expenses", expense);
    return res.data;
  } catch (err) {
    console.error("Error adding expense:", err);
    throw err;
  }
};

// Update existing expense
export const updateExpense = async (expense) => {
  try {
    const res = await axiosInstance.put(`/expenses/${expense.id}`, expense);
    return res.data;
  } catch (err) {
    console.error("Error updating expense:", err);
    throw err;
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    await axiosInstance.delete(`/expenses/${id}`);
    return true;
  } catch (err) {
    console.error("Error deleting expense:", err);
    throw err;
  }
};
