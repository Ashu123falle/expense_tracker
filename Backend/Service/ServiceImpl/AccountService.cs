using ExpenseManager.Data;
using ExpenseManager.DTOs;
using ExpenseManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManager.Service.ServiceImpl
{
    public class AccountService : IAccountService
    {
        private readonly ExpenseManagerDbContext _context;

        public AccountService(ExpenseManagerDbContext context)
        {
            _context = context;
        }

        public async Task<AccountResponseDto> CreateAsync(AccountRequestDto request)
        {
            var account = new Account
            {
                UserId = request.UserId,
                AccountName = request.AccountName,
                AccountType = request.AccountType,
                Balance = request.Balance
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return MapToResponse(account);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null) return false;

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<AccountResponseDto>> GetAllAsync()
        {
            var accounts = await _context.Accounts.ToListAsync();
            return accounts.Select(a => MapToResponse(a));
        }

        public async Task<AccountResponseDto> GetByIdAsync(int id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null) return null!;
            return MapToResponse(account);
        }

        public async Task<AccountResponseDto> UpdateAsync(int id, AccountRequestDto request)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null) return null!;

            account.AccountName = request.AccountName;
            account.AccountType = request.AccountType;
            account.Balance = request.Balance;

            _context.Accounts.Update(account);
            await _context.SaveChangesAsync();

            return MapToResponse(account);
        }


        private AccountResponseDto MapToResponse(Account account)
        {
            return new AccountResponseDto
            {
                Id = account.Id,
                UserId = account.UserId,
                AccountName = account.AccountName,
                AccountType = account.AccountType,
                Balance = account.Balance
            };
        }
        public async Task<IEnumerable<AccountResponseDto>> GetByUserIdAsync(int userId)
        {
            var accounts = await _context.Accounts
                .Where(a => a.UserId == userId)
                .Select(a => new AccountResponseDto
                {
                    Id = a.Id,
                    AccountName = a.AccountName,
                    AccountType = a.AccountType,
                    Balance = a.Balance,
                    UserId = a.UserId
                })
                .ToListAsync();

            return accounts;
        }

    }
}
