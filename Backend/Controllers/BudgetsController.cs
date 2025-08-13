using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ExpenseManager.DTOs;
using ExpenseManager.Service;

namespace ExpenseManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetsController : ControllerBase
    {
        private readonly IBudgetService _budgetService;

        public BudgetsController(IBudgetService budgetService)
        {
            _budgetService = budgetService;
        }

        // GET: api/Budgets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetResponseDto>>> GetBudgets()
        {
            var budgets = await _budgetService.GetAllAsync();
            return Ok(budgets);
        }

        // GET: api/Budgets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BudgetResponseDto>> GetBudget(int id)
        {
            var budget = await _budgetService.GetByIdAsync(id);
            if (budget == null) return NotFound();
            return Ok(budget);
        }

        // POST: api/Budgets
        [HttpPost]
        public async Task<ActionResult<BudgetResponseDto>> PostBudget(BudgetRequestDto request)
        {
            var created = await _budgetService.CreateAsync(request);
            return CreatedAtAction(nameof(GetBudget), new { id = created.Id }, created);
        }

        // PUT: api/Budgets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBudget(int id, BudgetRequestDto request)
        {
            var updated = await _budgetService.UpdateAsync(id, request);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: api/Budgets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            var deleted = await _budgetService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
