namespace ExpenseManager.Models
{
    public class Expense
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int CategoryId { get; set; }
        public int UserId { get; set; }

        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Notes { get; set; } = string.Empty;

        public User User { get; set; } = null!;
        public Account Account { get; set; } = null!;
        public Category Category { get; set; } = null!;
    }

}
