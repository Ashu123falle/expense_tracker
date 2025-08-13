using ExpenseManager.DTOs;

namespace ExpenseManager.Service
{
    public interface IUserService
    {
        Task<UserResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<UserResponseDto>> GetAllAsync();
        Task<UserResponseDto> CreateAsync(UserRequestDto request);
        Task<UserResponseDto> UpdateAsync(int id, UserRequestDto request);
        Task<bool> DeleteAsync(int id);
        Task<UserResponseDto?> LoginAsync(string username, string password);
    }
}
