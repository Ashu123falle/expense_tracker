namespace ExpenseManager.Models
{
    public class RecurringTransaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AccountId { get; set; }
        public int CategoryId { get; set; }

        public decimal Amount { get; set; }
        public string Frequency { get; set; } = string.Empty; // Daily, Weekly, Monthly, Yearly
        public DateTime NextRunDate { get; set; }

        public User User { get; set; } = null!;
        public Account Account { get; set; } = null!;
        public Category Category { get; set; } = null!;
    }

}
