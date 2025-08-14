namespace ExpenseManager.DTOs
{
    public class CategoryResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsExpense { get; set; } // true = Expense, false = Income
        public int UserId { get; set; }

    }
}
