using ExpenseManager.DTOs;

namespace ExpenseManager.Service
{

    public interface IIncomeService
    {
        Task<IncomeResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<IncomeResponseDto>> GetAllAsync();
        Task<IncomeResponseDto> CreateAsync(IncomeRequestDto request);
        Task<IncomeResponseDto> UpdateAsync(int id, IncomeRequestDto request);
        Task<bool> DeleteAsync(int id);
    }

}
