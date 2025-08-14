using ExpenseManager.Data;
using ExpenseManager.DTOs;
using ExpenseManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManager.Service.ServiceImpl
{
    public class IncomeService : IIncomeService
    {
        private readonly ExpenseManagerDbContext _context;

        public IncomeService(ExpenseManagerDbContext context)
        {
            _context = context;
        }

        public async Task<IncomeResponseDto> CreateAsync(IncomeRequestDto request)
        {
            var income = new Income
            {
                AccountId = request.AccountId,
                CategoryId = request.CategoryId,
                UserId = request.UserId,
                Amount = request.Amount,
                Date = request.Date,
                Source = request.Source
            };

            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();

            return MapToResponse(income);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var income = await _context.Incomes.FindAsync(id);
            if (income == null) return false;

            _context.Incomes.Remove(income);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<IncomeResponseDto>> GetAllAsync()
        {
            var incomes = await _context.Incomes.ToListAsync();
            return incomes.Select(MapToResponse);
        }

        public async Task<IncomeResponseDto> GetByIdAsync(int id)
        {
            var income = await _context.Incomes.FindAsync(id);
            if (income == null) return null!;
            return MapToResponse(income);
        }

        public async Task<IncomeResponseDto> UpdateAsync(int id, IncomeRequestDto request)
        {
            var income = await _context.Incomes.FindAsync(id);
            if (income == null) return null!;

            income.AccountId = request.AccountId;
            income.CategoryId = request.CategoryId;
            income.UserId = request.UserId;
            income.Amount = request.Amount;
            income.Date = request.Date;
            income.Source = request.Source;

            _context.Incomes.Update(income);
            await _context.SaveChangesAsync();

            return MapToResponse(income);
        }

        public async Task<IEnumerable<IncomeResponseDto>> GetByUserIdAsync(int userId)
        {
            var incomes = await _context.Incomes
                .Where(i => i.UserId == userId)
                .Select(i => new IncomeResponseDto
                {
                    Id = i.Id,
                    AccountId = i.AccountId,
                    CategoryId = i.CategoryId,
                    UserId = i.UserId,
                    Amount = i.Amount,
                    Date = i.Date,
                    Source = i.Source
                })
                .ToListAsync();

            return incomes;
        }

        private IncomeResponseDto MapToResponse(Income income)
        {
            return new IncomeResponseDto
            {
                Id = income.Id,
                AccountId = income.AccountId,
                CategoryId = income.CategoryId,
                UserId = income.UserId,
                Amount = income.Amount,
                Date = income.Date,
                Source = income.Source
            };
        }
    }
}
