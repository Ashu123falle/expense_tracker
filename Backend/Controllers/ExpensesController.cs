using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ExpenseManager.DTOs;
using ExpenseManager.Service;

namespace ExpenseManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        // GET: api/Expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetExpenses()
        {
            var expenses = await _expenseService.GetAllAsync();
            return Ok(expenses);
        }

        // GET: api/Expenses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseResponseDto>> GetExpense(int id)
        {
            var expense = await _expenseService.GetByIdAsync(id);
            if (expense == null) return NotFound();
            return Ok(expense);
        }

        // POST: api/Expenses
        [HttpPost]
        public async Task<ActionResult<ExpenseResponseDto>> PostExpense(ExpenseRequestDto request)
        {
            var created = await _expenseService.CreateAsync(request);
            return CreatedAtAction(nameof(GetExpense), new { id = created.Id }, created);
        }

        // PUT: api/Expenses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExpense(int id, ExpenseRequestDto request)
        {
            var updated = await _expenseService.UpdateAsync(id, request);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: api/Expenses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var deleted = await _expenseService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
