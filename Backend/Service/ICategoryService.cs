using ExpenseManager.DTOs;
using ExpenseManager.Models;

namespace ExpenseManager.Service
{
    public interface ICategoryService
    {
        Task<CategoryResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<CategoryResponseDto>> GetAllAsync();
        Task<CategoryResponseDto> CreateAsync(CategoryRequestDto request);
        Task<CategoryResponseDto> UpdateAsync(int id, CategoryRequestDto request);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<CategoryResponseDto>> GetCategoriesByUserIdAsync(int userId);

    }
}
