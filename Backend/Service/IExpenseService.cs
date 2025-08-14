using ExpenseManager.DTOs;

namespace ExpenseManager.Service
{

    public interface IExpenseService
    {
        Task<ExpenseResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<ExpenseResponseDto>> GetAllAsync();
        Task<ExpenseResponseDto> CreateAsync(ExpenseRequestDto request);
        Task<ExpenseResponseDto> UpdateAsync(int id, ExpenseRequestDto request);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ExpenseResponseDto>> GetByUserIdAsync(int userId);

    }

}
