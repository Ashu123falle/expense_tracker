namespace ExpenseManager.DTOs
{
    public class IncomeRequestDto
    {

        public int AccountId { get; set; }
        public int CategoryId { get; set; }
        public int UserId { get; set; }

        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Source { get; set; } = string.Empty;
    }
}
