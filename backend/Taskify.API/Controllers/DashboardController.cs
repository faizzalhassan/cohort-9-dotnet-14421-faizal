using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskify.Business.Interfaces;

namespace Taskify.API.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly ITaskService _taskService;

    public DashboardController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    // ============================================================
    // TOP SECTION
    // ============================================================
    // Returns the main dashboard statistics/KPIs.
    //
    // Used for:
    // - Pending tasks
    // - In Progress tasks
    // - Completed tasks
    // - Cancelled tasks
    // - Overdue tasks
    // ============================================================

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();

        var statistics = await _taskService.GetAdminTaskStatisticsAsync(
            adminUserId,
            adminRole);

        return Ok(new
        {
            success = true,
            data = statistics
        });
    }

    // ============================================================
    // BOTTOM SECTION
    // ============================================================
    // Returns the latest tasks for the dashboard.
    //
    // The dashboard does not need the complete task list, so
    // pagination keeps the response small and fast.
    // ============================================================

    [HttpGet("recent-tasks")]
    public async Task<IActionResult> GetRecentTasks(
        [FromQuery] int pageSize = 5)
    {
        if (pageSize < 1 || pageSize > 20)
        {
            return BadRequest(new
            {
                success = false,
                message = "Page size must be between 1 and 20."
            });
        }

        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();

        var result = await _taskService.GetAdminTasksAsync(
            1,
            pageSize,
            adminUserId,
            adminRole);

        return Ok(new
        {
            success = true,
            data = result
        });
    }

    // ============================================================
    // AUTHENTICATION HELPERS
    // ============================================================

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim is null ||
            !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new Taskify.Business.Exceptions.AuthenticationException(
                "Invalid authentication session.");
        }

        return userId;
    }

    private string GetCurrentUserRole()
    {
        var roleClaim = User.FindFirst(ClaimTypes.Role);

        if (roleClaim is null ||
            string.IsNullOrWhiteSpace(roleClaim.Value))
        {
            throw new Taskify.Business.Exceptions.AuthenticationException(
                "User role not found in authentication session.");
        }

        return roleClaim.Value;
    }
}