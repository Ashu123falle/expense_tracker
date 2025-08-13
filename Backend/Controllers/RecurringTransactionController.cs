using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ExpenseManager.DTOs;
using ExpenseManager.Service;

namespace ExpenseManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecurringTransactionsController : ControllerBase
    {
        private readonly IRecurringTransactionService _recurringTransactionService;

        public RecurringTransactionsController(IRecurringTransactionService recurringTransactionService)
        {
            _recurringTransactionService = recurringTransactionService;
        }

        // GET: api/RecurringTransactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecurringTransactionResponseDto>>> GetRecurringTransactions()
        {
            var transactions = await _recurringTransactionService.GetAllAsync();
            return Ok(transactions);
        }

        // GET: api/RecurringTransactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RecurringTransactionResponseDto>> GetRecurringTransaction(int id)
        {
            var transaction = await _recurringTransactionService.GetByIdAsync(id);
            if (transaction == null) return NotFound();
            return Ok(transaction);
        }

        // POST: api/RecurringTransactions
        [HttpPost]
        public async Task<ActionResult<RecurringTransactionResponseDto>> PostRecurringTransaction(RecurringTransactionRequestDto request)
        {
            var created = await _recurringTransactionService.CreateAsync(request);
            return CreatedAtAction(nameof(GetRecurringTransaction), new { id = created.Id }, created);
        }

        // PUT: api/RecurringTransactions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecurringTransaction(int id, RecurringTransactionRequestDto request)
        {
            var updated = await _recurringTransactionService.UpdateAsync(id, request);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: api/RecurringTransactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecurringTransaction(int id)
        {
            var deleted = await _recurringTransactionService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
