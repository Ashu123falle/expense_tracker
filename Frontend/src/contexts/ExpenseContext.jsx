import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const fetchData = useCallback(async () => {
    if (!user?.id) return; // ✅ Wait until user is loaded

    setLoading(true);
    try {
      // ✅ Fetch all data in parallel
      const [expRes, incRes, catRes,accRes] = await Promise.all([
        axiosInstance.get(`/expenses/by-user/${user.id}`),
        axiosInstance.get(`/incomes/by-user/${user.id}`),
        axiosInstance.get(`/categories/by-user/${user.id}`),
        axiosInstance.get(`/accounts/by-user/${user.id}`),
      ]);

      // ✅ Map categories for easy lookup
      const catMap = {};
      catRes.data.forEach((cat) => {
        catMap[cat.id] = { name: cat.name, isExpense: cat.isExpense };
      });

      // ✅ Merge category data into expenses & income
      const mergedExpenses = expRes.data.map((exp) => ({
        ...exp,
        category: catMap[exp.categoryId]?.name || "Unknown",
        isExpense: catMap[exp.categoryId]?.isExpense ?? true,
      }));

      const mergedIncome = incRes.data.map((inc) => ({
        ...inc,
        category: catMap[inc.categoryId]?.name || "Unknown",
        isExpense: catMap[inc.categoryId]?.isExpense ?? false,
      }));

      setExpenses(mergedExpenses);
      setIncome(mergedIncome);
      setCategories(catRes.data);
      setAccounts(accRes.data)
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
      setExpenses([]);
      setIncome([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // ✅ Fetch when user changes (and only if logged in)
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses,
        income,
        setIncome,
        categories,
        setCategories,
        accounts,
        loading,
        reload: fetchData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// ✅ Hook for easy context usage
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("useExpenses must be used within ExpenseProvider");
  return context;
};
