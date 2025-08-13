using Microsoft.EntityFrameworkCore;
using ExpenseManager.Models;

namespace ExpenseManager.Data
{
    public class ExpenseManagerDbContext : DbContext
    {
        public ExpenseManagerDbContext(DbContextOptions<ExpenseManagerDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<RecurringTransaction> RecurringTransactions { get; set; }
        public DbSet<TransactionLog> TransactionLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ----------------------
            // User Relations
            // ----------------------
            modelBuilder.Entity<User>()
                .HasMany(u => u.Accounts)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Expenses)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict); // avoids multiple cascade paths

            // ----------------------
            // Account Relations
            // ----------------------
            modelBuilder.Entity<Account>()
                .HasMany(a => a.Expenses)
                .WithOne(e => e.Account)
                .HasForeignKey(e => e.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Account>()
                .HasMany(a => a.Incomes)
                .WithOne(i => i.Account)
                .HasForeignKey(i => i.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Account>()
                .Property(a => a.Balance)
                .HasPrecision(18, 2);

            // ----------------------
            // Category Relations
            // ----------------------
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Expenses)
                .WithOne(e => e.Category)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.Incomes)
                .WithOne(i => i.Category)
                .HasForeignKey(i => i.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // ----------------------
            // Expense & Income Precision
            // ----------------------
            modelBuilder.Entity<Expense>()
                .Property(e => e.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Income>()
                .Property(i => i.Amount)
                .HasPrecision(18, 2);

            // ----------------------
            // Income -> User Relation (no collection on User)
            // ----------------------
            modelBuilder.Entity<Income>()
                .HasOne(i => i.User)
                .WithMany() // no navigation collection
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ----------------------
            // Budget
            // ----------------------
            modelBuilder.Entity<Budget>()
                .HasOne(b => b.User)
                .WithMany(u => u.Budgets)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Budget>()
                .HasOne(b => b.Category)
                .WithMany()
                .HasForeignKey(b => b.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Budget>()
                .Property(b => b.LimitAmount)
                .HasPrecision(18, 2);

            // ----------------------
            // Recurring Transaction
            // ----------------------
            modelBuilder.Entity<RecurringTransaction>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RecurringTransaction>()
                .HasOne(r => r.Account)
                .WithMany()
                .HasForeignKey(r => r.AccountId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RecurringTransaction>()
                .HasOne(r => r.Category)
                .WithMany()
                .HasForeignKey(r => r.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RecurringTransaction>()
                .Property(r => r.Amount)
                .HasPrecision(18, 2);

            // ----------------------
            // TransactionLog
            // ----------------------
            modelBuilder.Entity<TransactionLog>()
                .HasKey(t => t.Id);

            // ----------------------
            // Table Names
            // ----------------------
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Account>().ToTable("Accounts");
            modelBuilder.Entity<Category>().ToTable("Categories");
            modelBuilder.Entity<Expense>().ToTable("Expenses");
            modelBuilder.Entity<Income>().ToTable("Incomes");
            modelBuilder.Entity<Budget>().ToTable("Budgets");
            modelBuilder.Entity<RecurringTransaction>().ToTable("RecurringTransactions");
            modelBuilder.Entity<TransactionLog>().ToTable("TransactionLogs");
        }
    }
}
