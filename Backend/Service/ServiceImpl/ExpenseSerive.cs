using ExpenseManager.Data;
using ExpenseManager.DTOs;
using ExpenseManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManager.Service.ServiceImpl
{
    public class ExpenseService : IExpenseService
    {
        private readonly ExpenseManagerDbContext _context;

        public ExpenseService(ExpenseManagerDbContext context)
        {
            _context = context;
        }

        public async Task<ExpenseResponseDto> CreateAsync(ExpenseRequestDto request)
        {
            // Verify parent entities exist
            var account = await _context.Accounts.FindAsync(request.AccountId);
            if (account == null) throw new Exception("Account not found");

            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null) throw new Exception("Category not found");

            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) throw new Exception("User not found");

            // Create expense
            var expense = new Expense
            {
                AccountId = request.AccountId,
                CategoryId = request.CategoryId,
                UserId = request.UserId,
                Amount = request.Amount,
                Date = request.Date,
                Notes = request.Notes
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return MapToResponse(expense);
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return false;

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ExpenseResponseDto>> GetAllAsync()
        {
            var expenses = await _context.Expenses.ToListAsync();
            return expenses.Select(MapToResponse);
        }

        public async Task<ExpenseResponseDto> GetByIdAsync(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return null!;
            return MapToResponse(expense);
        }

        public async Task<ExpenseResponseDto> UpdateAsync(int id, ExpenseRequestDto request)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return null!;

            expense.AccountId = request.AccountId;
            expense.CategoryId = request.CategoryId;
            expense.UserId = request.UserId;
            expense.Amount = request.Amount;
            expense.Date = request.Date;
            expense.Notes = request.Notes;

            _context.Expenses.Update(expense);
            await _context.SaveChangesAsync();

            return MapToResponse(expense);
        }

        private ExpenseResponseDto MapToResponse(Expense expense)
        {
            return new ExpenseResponseDto
            {
                Id = expense.Id,
                AccountId = expense.AccountId,
                CategoryId = expense.CategoryId,
                UserId = expense.UserId,
                Amount = expense.Amount,
                Date = expense.Date,
                Notes = expense.Notes
            };
        }
    }
}
