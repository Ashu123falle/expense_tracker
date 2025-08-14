using ExpenseManager.Data;
using ExpenseManager.DTOs;
using ExpenseManager.Models;
using ExpenseManager.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        // GET: api/Accounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountResponseDto>>> GetAccounts()
        {
            var accounts = await _accountService.GetAllAsync();
            return Ok(accounts);
        }

        // GET: api/Accounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AccountResponseDto>> GetAccount(int id)
        {
            var account = await _accountService.GetByIdAsync(id);
            if (account == null)
                return NotFound();
            return Ok(account);
        }

        // PUT: api/Accounts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccount(int id, AccountRequestDto request)
        {
            var updated = await _accountService.UpdateAsync(id, request);
            if (updated == null)
                return NotFound();
            return Ok(updated);
        }

        // POST: api/Accounts
        [HttpPost]
        public async Task<ActionResult<AccountResponseDto>> PostAccount(AccountRequestDto request)
        {
            var created = await _accountService.CreateAsync(request);
            return CreatedAtAction(nameof(GetAccount), new { id = created.Id }, created);
        }

        // DELETE: api/Accounts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var deleted = await _accountService.DeleteAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
        // GET: api/Accounts/by-user/{userId}
        [HttpGet("by-user/{userId}")]
        public async Task<ActionResult<IEnumerable<AccountResponseDto>>> GetAccountsByUserId(int userId)
        {
            var accounts = await _accountService.GetByUserIdAsync(userId);
            if (accounts == null || !accounts.Any())
                return NotFound();

            return Ok(accounts);
        }

    }


}
