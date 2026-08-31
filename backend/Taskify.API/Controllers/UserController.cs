using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskify.Business.Interfaces;

namespace Taskify.API.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class UserController : ControllerBase
{
    private readonly IUserManagementService _userManagementService;

    public UserController(
        IUserManagementService userManagementService)
    {
        _userManagementService = userManagementService;
    }

    // ============================================================
    // GET ALL USERS
    // ============================================================

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var currentAdminId = GetCurrentUserId();

        var users =
            await _userManagementService.GetAllUsersAsync(
                currentAdminId);

        return Ok(users);
    }

    // ============================================================
    // ACTIVATE USER
    // ============================================================

    [HttpPatch("{id:int}/activate")]
    public async Task<IActionResult> ActivateUser(int id)
    {
        var currentAdminId = GetCurrentUserId();

        await _userManagementService.ActivateUserAsync(
            id,
            currentAdminId);

        return NoContent();
    }

    // ============================================================
    // DEACTIVATE USER
    // ============================================================

    [HttpPatch("{id:int}/deactivate")]
    public async Task<IActionResult> DeactivateUser(int id)
    {
        var currentAdminId = GetCurrentUserId();

        await _userManagementService.DeactivateUserAsync(
            id,
            currentAdminId);

        return NoContent();
    }

    // ============================================================
    // SOFT DELETE USER
    // ============================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var currentAdminId = GetCurrentUserId();

        await _userManagementService.DeleteUserAsync(
            id,
            currentAdminId);

        return NoContent();
    }

    // ============================================================
    // CURRENT USER ID
    // ============================================================

    private int GetCurrentUserId()
    {
        var userIdClaim =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException(
                "User identity could not be determined.");
        }

        return userId;
    }
}