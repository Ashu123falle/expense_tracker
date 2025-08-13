using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ExpenseManager.DTOs;
using ExpenseManager.Service;

namespace ExpenseManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomesController : ControllerBase
    {
        private readonly IIncomeService _incomeService;

        public IncomesController(IIncomeService incomeService)
        {
            _incomeService = incomeService;
        }

        // GET: api/Incomes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IncomeResponseDto>>> GetIncomes()
        {
            var incomes = await _incomeService.GetAllAsync();
            return Ok(incomes);
        }

        // GET: api/Incomes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IncomeResponseDto>> GetIncome(int id)
        {
            var income = await _incomeService.GetByIdAsync(id);
            if (income == null) return NotFound();
            return Ok(income);
        }

        // POST: api/Incomes
        [HttpPost]
        public async Task<ActionResult<IncomeResponseDto>> PostIncome(IncomeRequestDto request)
        {
            var created = await _incomeService.CreateAsync(request);
            return CreatedAtAction(nameof(GetIncome), new { id = created.Id }, created);
        }

        // PUT: api/Incomes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIncome(int id, IncomeRequestDto request)
        {
            var updated = await _incomeService.UpdateAsync(id, request);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: api/Incomes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(int id)
        {
            var deleted = await _incomeService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
