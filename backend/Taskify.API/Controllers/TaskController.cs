using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskify.Business.DTOs.Tasks;
using Taskify.Business.Interfaces;

namespace Taskify.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    // ============================================================
    // USER TASK ENDPOINTS
    // ============================================================

    [HttpGet]
    public async Task<IActionResult> GetMyTasks()
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var tasks = await _taskService.GetMyTasksAsync(userId, userRole);
        return Ok(new { success = true, data = tasks });
    }

    [HttpGet("assigned")]
    public async Task<IActionResult> GetAssignedTasks()
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var tasks = await _taskService.GetAssignedTasksAsync(userId, userRole);
        return Ok(new { success = true, data = tasks });
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingTasks()
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var tasks = await _taskService.GetPendingTasksAsync(userId, userRole);
        return Ok(new { success = true, data = tasks });
    }

    [HttpGet("in-progress")]
    public async Task<IActionResult> GetInProgressTasks()
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var tasks = await _taskService.GetInProgressTasksAsync(userId, userRole);
        return Ok(new { success = true, data = tasks });
    }

    [HttpGet("completed")]
    public async Task<IActionResult> GetCompletedTasks()
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var tasks = await _taskService.GetCompletedTasksAsync(userId, userRole);
        return Ok(new { success = true, data = tasks });
    }

    [HttpGet("cancelled")]
    public async Task<IActionResult> GetCancelledTasks()
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var tasks = await _taskService.GetCancelledTasksAsync(userId, userRole);
        return Ok(new { success = true, data = tasks });
    }

    [HttpGet("overdue")]
    public async Task<IActionResult> GetOverdueTasks()
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var tasks = await _taskService.GetOverdueTasksAsync(userId, userRole);
        return Ok(new { success = true, data = tasks });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetTask(int id)
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var task = await _taskService.GetTaskByIdAsync(id, userId, userRole);
        return Ok(new { success = true, data = task });
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var task = await _taskService.CreateTaskAsync(request, userId, userRole);
        return StatusCode(StatusCodes.Status201Created, new
        {
            success = true,
            message = "Task created successfully.",
            data = task
        });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskRequest request)
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var task = await _taskService.UpdateTaskAsync(id, request, userId, userRole);
        return Ok(new { success = true, message = "Task updated successfully.", data = task });
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> ChangeTaskStatus(int id, [FromBody] UpdateTaskStatusRequest request)
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        var task = await _taskService.ChangeStatusAsync(id, request, userId, userRole);
        return Ok(new { success = true, message = "Task status updated successfully.", data = task });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();
        await _taskService.DeleteTaskAsync(id, userId, userRole);
        return Ok(new { success = true, message = "Task deleted successfully." });
    }

    // ============================================================
    // ADMIN TASK MANAGEMENT
    // ============================================================

    [HttpGet("/api/admin/tasks")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminTasks([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (page < 1)
            return BadRequest(new { success = false, message = "Page must be greater than or equal to 1." });

        if (pageSize < 1 || pageSize > 100)
            return BadRequest(new { success = false, message = "Page size must be between 1 and 100." });

        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();
        var result = await _taskService.GetAdminTasksAsync(page, pageSize, adminUserId, adminRole);
        return Ok(new { success = true, data = result });
    }

    [HttpGet("/api/admin/tasks/statistics")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminTaskStatistics()
    {
        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();
        var statistics = await _taskService.GetAdminTaskStatisticsAsync(adminUserId, adminRole);
        return Ok(new { success = true, data = statistics });
    }

    [HttpGet("/api/admin/tasks/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminTask(int id)
    {
        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();
        var task = await _taskService.GetAdminTaskByIdAsync(id, adminUserId, adminRole);
        return Ok(new { success = true, data = task });
    }

    [HttpPost("/api/admin/tasks")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAdminTask([FromBody] CreateTaskRequest request)
    {
        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();
        var task = await _taskService.CreateAdminTaskAsync(request, adminUserId, adminRole);
        return StatusCode(StatusCodes.Status201Created, new
        {
            success = true,
            message = "Task created and assigned successfully.",
            data = task
        });
    }

    [HttpPatch("/api/admin/tasks/{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAdminTaskStatus(int id, [FromBody] UpdateTaskStatusRequest request)
    {
        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();
        var task = await _taskService.ChangeAdminTaskStatusAsync(id, request, adminUserId, adminRole);
        return Ok(new { success = true, message = "Task status updated successfully.", data = task });
    }

    [HttpPatch("/api/admin/tasks/{id:int}/due-date")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAdminTaskDueDate(int id, [FromBody] UpdateTaskDueDateRequest request)
    {
        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();
        var task = await _taskService.ChangeAdminTaskDueDateAsync(id, request, adminUserId, adminRole);
        return Ok(new { success = true, message = "Task due date updated successfully.", data = task });
    }

    [HttpPatch("/api/admin/tasks/{id:int}/priority")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAdminTaskPriority(int id, [FromBody] UpdateTaskPriorityRequest request)
    {
        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();
        var task = await _taskService.ChangeAdminTaskPriorityAsync(id, request, adminUserId, adminRole);
        return Ok(new { success = true, message = "Task priority updated successfully.", data = task });
    }

    [HttpPut("/api/admin/tasks/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAdminTask(int id, [FromBody] UpdateTaskRequest request)
    {
        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();
        var task = await _taskService.UpdateAdminTaskAsync(id, request, adminUserId, adminRole);
        return Ok(new { success = true, message = "Task updated successfully.", data = task });
    }

    [HttpDelete("/api/admin/tasks/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAdminTask(int id)
    {
        var adminUserId = GetCurrentUserId();
        var adminRole = GetCurrentUserRole();
        await _taskService.DeleteAdminTaskAsync(id, adminUserId, adminRole);
        return Ok(new { success = true, message = "Task deleted successfully." });
    }

    // ============================================================
    // GET USERS FOR ASSIGNMENT DROPDOWN
    // ============================================================

    [HttpGet("/api/admin/tasks/users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsersForAssignment([FromQuery] int pageSize = 100)
    {
        if (pageSize < 1 || pageSize > 500)
            return BadRequest(new { success = false, message = "Page size must be between 1 and 500." });

        var users = await _taskService.GetUsersForAssignmentAsync();
        return Ok(new { success = true, data = users });
    }

    // ============================================================
    // AUTHENTICATION HELPERS
    // ============================================================

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !int.TryParse(userIdClaim.Value, out var userId))
            throw new Taskify.Business.Exceptions.AuthenticationException("Invalid authentication session.");
        return userId;
    }

    private string GetCurrentUserRole()
    {
        var roleClaim = User.FindFirst(ClaimTypes.Role);
        if (roleClaim is null || string.IsNullOrWhiteSpace(roleClaim.Value))
            throw new Taskify.Business.Exceptions.AuthenticationException("User role not found in authentication session.");
        return roleClaim.Value;
    }
}