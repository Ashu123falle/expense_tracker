namespace ExpenseManager.DTOs
{
    public class BudgetRequestDto
    {
        public int UserId { get; set; }
        public int CategoryId { get; set; }

        public decimal LimitAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
