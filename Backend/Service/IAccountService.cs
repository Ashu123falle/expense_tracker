using ExpenseManager.DTOs;

namespace ExpenseManager.Service
{

    public interface IAccountService
    {
        Task<AccountResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<AccountResponseDto>> GetAllAsync();
        Task<AccountResponseDto> CreateAsync(AccountRequestDto request);
        Task<AccountResponseDto> UpdateAsync(int id, AccountRequestDto request);
        Task<bool> DeleteAsync(int id);
    }

}
