import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [expRes, catRes] = await Promise.all([
        axiosInstance.get(`/expenses?userId=${user.id}&accountId=${user.accountId}`),
        axiosInstance.get("/categories"),
      ]);

      const catMap = {};
      catRes.data.forEach(cat => {
        catMap[cat.id] = { name: cat.name, isExpense: cat.isExpense };
      });

      const mergedExpenses = expRes.data.map(exp => ({
        ...exp,
        category: catMap[exp.categoryId]?.name || "Unknown",
        isExpense: catMap[exp.categoryId]?.isExpense ?? true,
      }));

      setExpenses(mergedExpenses);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Error fetching expenses or categories:", err.response?.data || err);
      setExpenses([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses,
        categories,
        setCategories,
        loading,
        reload: fetchData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("useExpenses must be used within ExpenseProvider");
  return context;
};
