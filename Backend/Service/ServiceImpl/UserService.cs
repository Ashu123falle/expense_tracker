using ExpenseManager.Data;
using ExpenseManager.DTOs;
using ExpenseManager.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace ExpenseManager.Service.ServiceImpl
{
    public class UserService : IUserService
    {
        private readonly ExpenseManagerDbContext _context;

        public UserService(ExpenseManagerDbContext context)
        {
            _context = context;
        }

        public async Task<UserResponseDto> CreateAsync(UserRequestDto request)
        {
            var user = new User
            {
                FullName = request.FullName,
                Username = request.Username,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return MapToResponse(user);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
        {
            var users = await _context.Users.ToListAsync();
            return users.Select(MapToResponse);
        }

        public async Task<UserResponseDto> GetByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null!;
            return MapToResponse(user);
        }

        public async Task<UserResponseDto> UpdateAsync(int id, UserRequestDto request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null!;

            user.FullName = request.FullName;
            user.Username = request.Username;
            user.Email = request.Email;

            if (!string.IsNullOrEmpty(request.Password))
                user.PasswordHash = HashPassword(request.Password);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return MapToResponse(user);
        }

        public async Task<UserResponseDto?> LoginAsync(string username, string password)
        {
            // Find user by username
            var user = await _context.Users
                .Include(u => u.Accounts) // Include accounts to return AccountId
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return null; // User not found

            // Verify password
            var hashedPassword = HashPassword(password);
            if (user.PasswordHash != hashedPassword)
                return null; // Invalid password

            // Return mapped response
            return MapToResponse(user);
        }

        private UserResponseDto MapToResponse(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Username = user.Username,
                Email = user.Email,
                AccountId = user.Accounts.FirstOrDefault()?.Id ?? 0
            };
        }


        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
