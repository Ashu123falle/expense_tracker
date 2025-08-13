namespace ExpenseManager.Models
{
    public class TransactionLog
    {
        public int Id { get; set; }
        public int? ExpenseId { get; set; }
        public int? IncomeId { get; set; }
        public DateTime ActionDate { get; set; }
        public string ActionType { get; set; } = null!; // Created, Updated, Deleted
        public string PerformedBy { get; set; } = null!;
    }

}
