using ExpenseManager.Models;

namespace ExpenseManager.DTOs
{
    public class ExpenseRequestDto
    {
        public int AccountId { get; set; }
        public int CategoryId { get; set; }
        public int UserId { get; set; }

        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Notes { get; set; } = string.Empty;


    }
}
