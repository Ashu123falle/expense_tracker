namespace ExpenseManager.Models
{
    public class Category
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public bool IsExpense { get; set; } // true = Expense, false = Income

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public ICollection<Income> Incomes { get; set; } = new List<Income>();
    }
}
