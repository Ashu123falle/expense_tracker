namespace ExpenseManager.DTOs
{
    public class AccountRequestDto
    {
        public int UserId { get; set; }

        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        public decimal Balance { get; set; }
    }
}
