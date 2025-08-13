using ExpenseManager.Data;
using ExpenseManager.DTOs;
using ExpenseManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManager.Service.ServiceImpl
{
    public class RecurringTransactionService : IRecurringTransactionService
    {
        private readonly ExpenseManagerDbContext _context;

        public RecurringTransactionService(ExpenseManagerDbContext context)
        {
            _context = context;
        }

        public async Task<RecurringTransactionResponseDto> CreateAsync(RecurringTransactionRequestDto request)
        {
            var recurring = new RecurringTransaction
            {
                UserId = request.UserId,
                AccountId = request.AccountId,
                CategoryId = request.CategoryId,
                Amount = request.Amount,
                Frequency = request.Frequency,
                NextRunDate = request.NextRunDate
            };

            _context.RecurringTransactions.Add(recurring);
            await _context.SaveChangesAsync();

            return MapToResponse(recurring);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var recurring = await _context.RecurringTransactions.FindAsync(id);
            if (recurring == null) return false;

            _context.RecurringTransactions.Remove(recurring);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<RecurringTransactionResponseDto>> GetAllAsync()
        {
            var list = await _context.RecurringTransactions.ToListAsync();
            return list.Select(MapToResponse);
        }

        public async Task<RecurringTransactionResponseDto> GetByIdAsync(int id)
        {
            var recurring = await _context.RecurringTransactions.FindAsync(id);
            if (recurring == null) return null!;
            return MapToResponse(recurring);
        }

        public async Task<RecurringTransactionResponseDto> UpdateAsync(int id, RecurringTransactionRequestDto request)
        {
            var recurring = await _context.RecurringTransactions.FindAsync(id);
            if (recurring == null) return null!;

            recurring.UserId = request.UserId;
            recurring.AccountId = request.AccountId;
            recurring.CategoryId = request.CategoryId;
            recurring.Amount = request.Amount;
            recurring.Frequency = request.Frequency;
            recurring.NextRunDate = request.NextRunDate;

            _context.RecurringTransactions.Update(recurring);
            await _context.SaveChangesAsync();

            return MapToResponse(recurring);
        }


        private RecurringTransactionResponseDto MapToResponse(RecurringTransaction r)
        {
            return new RecurringTransactionResponseDto
            {
                Id = r.Id,
                UserId = r.UserId,
                AccountId = r.AccountId,
                CategoryId = r.CategoryId,
                Amount = r.Amount,
                Frequency = r.Frequency,
                NextRunDate = r.NextRunDate
            };
        }
    }
}
