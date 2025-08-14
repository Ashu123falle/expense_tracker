using ExpenseManager.Data;
using ExpenseManager.DTOs;
using ExpenseManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManager.Service.ServiceImpl
{
    public class CategoryService : ICategoryService
    {
        private readonly ExpenseManagerDbContext _context;

        public CategoryService(ExpenseManagerDbContext context)
        {
            _context = context;
        }

        public async Task<CategoryResponseDto> CreateAsync(CategoryRequestDto request)
        {
            var category = new Category
            {
                Name = request.Name,
                IsExpense = request.IsExpense,
                UserId = request.UserId
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return MapToResponse(category);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync()
        {
            var categories = await _context.Categories.ToListAsync();
            return categories.Select(c => MapToResponse(c));
        }

        public async Task<CategoryResponseDto> GetByIdAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return null!;
            return MapToResponse(category);
        }

        public async Task<CategoryResponseDto> UpdateAsync(int id, CategoryRequestDto request)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return null!;

            category.Name = request.Name;
            category.IsExpense = request.IsExpense;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            return MapToResponse(category);
        }

        public async Task<IEnumerable<CategoryResponseDto>> GetCategoriesByUserIdAsync(int userId)
        {
            var categories = await _context.Categories
         .Where(c => c.UserId == userId)
         .Include(c => c.Expenses)
         .Include(c => c.Incomes)
         .ToListAsync();

            return categories.Select(MapToResponse).ToList();
        }
        private CategoryResponseDto MapToResponse(Category category)
        {
            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                IsExpense = category.IsExpense,
                UserId = category.UserId
            };
        }
    }
}
