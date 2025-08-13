namespace ExpenseManager.DTOs
{
    public class AccountResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty; // Savings, Credit Card, UPI, Cash
        public decimal Balance { get; set; }
    }
}
