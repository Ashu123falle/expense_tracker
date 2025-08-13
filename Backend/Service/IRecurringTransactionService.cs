using ExpenseManager.DTOs;

namespace ExpenseManager.Service
{
    public interface IRecurringTransactionService
    {
        Task<RecurringTransactionResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<RecurringTransactionResponseDto>> GetAllAsync();
        Task<RecurringTransactionResponseDto> CreateAsync(RecurringTransactionRequestDto request);
        Task<RecurringTransactionResponseDto> UpdateAsync(int id, RecurringTransactionRequestDto request);
        Task<bool> DeleteAsync(int id);
    }
}
