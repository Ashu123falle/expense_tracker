using ExpenseManager.DTOs;

namespace ExpenseManager.Service
{

    public interface IBudgetService
    {
        Task<BudgetResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<BudgetResponseDto>> GetAllAsync();
        Task<BudgetResponseDto> CreateAsync(BudgetRequestDto request);
        Task<BudgetResponseDto> UpdateAsync(int id, BudgetRequestDto request);
        Task<bool> DeleteAsync(int id);
    }

}
