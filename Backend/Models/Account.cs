namespace ExpenseManager.Models
{
    public class Account
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty; // Savings, Credit Card, UPI, Cash
        public decimal Balance { get; set; }

        public User User { get; set; } = null!;
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public ICollection<Income> Incomes { get; set; } = new List<Income>();
    }
}
