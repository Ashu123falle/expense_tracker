using ExpenseManager.Data;
using ExpenseManager.DTOs;
using ExpenseManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManager.Service.ServiceImpl
{
    public class BudgetService : IBudgetService
    {
        private readonly ExpenseManagerDbContext _context;

        public BudgetService(ExpenseManagerDbContext context)
        {
            _context = context;
        }

        public async Task<BudgetResponseDto> CreateAsync(BudgetRequestDto request)
        {
            var budget = new Budget
            {
                UserId = request.UserId,
                CategoryId = request.CategoryId,
                LimitAmount = request.LimitAmount,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();

            return MapToResponse(budget);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var budget = await _context.Budgets.FindAsync(id);
            if (budget == null) return false;

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<BudgetResponseDto>> GetAllAsync()
        {
            var budgets = await _context.Budgets.ToListAsync();
            return budgets.Select(b => MapToResponse(b));
        }

        public async Task<BudgetResponseDto> GetByIdAsync(int id)
        {
            var budget = await _context.Budgets.FindAsync(id);
            if (budget == null) return null!;
            return MapToResponse(budget);
        }

        public async Task<BudgetResponseDto> UpdateAsync(int id, BudgetRequestDto request)
        {
            var budget = await _context.Budgets.FindAsync(id);
            if (budget == null) return null!;

            budget.UserId = request.UserId;
            budget.CategoryId = request.CategoryId;
            budget.LimitAmount = request.LimitAmount;
            budget.StartDate = request.StartDate;
            budget.EndDate = request.EndDate;

            _context.Budgets.Update(budget);
            await _context.SaveChangesAsync();

            return MapToResponse(budget);
        }

        private BudgetResponseDto MapToResponse(Budget budget)
        {
            return new BudgetResponseDto
            {
                Id = budget.Id,
                UserId = budget.UserId,
                CategoryId = budget.CategoryId,
                LimitAmount = budget.LimitAmount,
                StartDate = budget.StartDate,
                EndDate = budget.EndDate
            };
        }
    }
}
