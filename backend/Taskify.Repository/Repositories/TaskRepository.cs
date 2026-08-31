using Microsoft.EntityFrameworkCore;
using Taskify.Repository.Context;
using Taskify.Repository.Entities;
using Taskify.Repository.Interfaces;

namespace Taskify.Repository.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly TaskifyDbContext _context;

    public TaskRepository(TaskifyDbContext context)
    {
        _context = context;
    }

    // ============================================================
    // GET TASK BY ID
    // ============================================================

    public async Task<TaskItem?> GetByIdAsync(int id)
    {
        return await _context.Tasks
            .Include(task => task.CreatedByUser)
            .Include(task => task.AssignedToUser)
            .FirstOrDefaultAsync(task =>
                task.Id == id &&
                !task.IsDeleted);
    }

    // ============================================================
    // GET ALL TASKS
    // ============================================================

    public async Task<IReadOnlyList<TaskItem>> GetAllAsync()
    {
        return await _context.Tasks
            .Include(task => task.CreatedByUser)
            .Include(task => task.AssignedToUser)
            .Where(task => !task.IsDeleted)
            .OrderByDescending(task => task.CreatedAt)
            .ToListAsync();
    }

    // ============================================================
    // GET TASKS BY CREATOR
    // ============================================================

    public async Task<IReadOnlyList<TaskItem>> GetByCreatorIdAsync(
        int userId)
    {
        return await _context.Tasks
            .Include(task => task.CreatedByUser)
            .Include(task => task.AssignedToUser)
            .Where(task =>
                task.CreatedByUserId == userId &&
                !task.IsDeleted)
            .OrderByDescending(task => task.CreatedAt)
            .ToListAsync();
    }

    // ============================================================
    // GET ADMIN-CREATED TASKS ASSIGNED TO USER
    // ============================================================

    public async Task<IReadOnlyList<TaskItem>>
        GetAdminAssignedTasksForUserAsync(int userId)
    {
        return await _context.Tasks
            .Include(task => task.CreatedByUser)
            .Include(task => task.AssignedToUser)
            .Where(task =>
                task.AssignedToUserId == userId &&
                task.CreatedByUser.Role == UserRole.Admin &&
                !task.IsDeleted)
            .OrderByDescending(task => task.CreatedAt)
            .ToListAsync();
    }

    // ============================================================
    // GET TASKS BY ASSIGNED USER
    // ============================================================

    public async Task<IReadOnlyList<TaskItem>> GetByAssignedUserIdAsync(
        int userId)
    {
        return await _context.Tasks
            .Include(task => task.CreatedByUser)
            .Include(task => task.AssignedToUser)
            .Where(task =>
                task.AssignedToUserId == userId &&
                !task.IsDeleted)
            .OrderByDescending(task => task.CreatedAt)
            .ToListAsync();
    }

    // ============================================================
    // GET PAGINATED TASKS
    //
    // Admin task management only.
    //
    // Page numbering starts from 1.
    // Only non-deleted tasks are returned.
    // ============================================================

    public async Task<(IReadOnlyList<TaskItem> Items, int TotalCount)>
        GetPagedAsync(
            int pageNumber,
            int pageSize)
    {
        var query = _context.Tasks
            .Include(task => task.CreatedByUser)
            .Include(task => task.AssignedToUser)
            .Where(task => !task.IsDeleted)
            .OrderByDescending(task => task.CreatedAt);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    // ============================================================
    // GET TASK STATISTICS
    //
    // Counts:
    // - Pending
    // - In Progress
    // - Completed
    // - Cancelled
    // - Overdue
    //
    // Overdue is calculated dynamically.
    // It is NOT a TaskStatus.
    // Completed and Cancelled tasks are never overdue.
    // ============================================================

    public async Task<(int Pending,
                       int InProgress,
                       int Completed,
                       int Cancelled,
                       int Overdue)>
        GetStatisticsAsync()
    {
        var now = DateTime.UtcNow;

        var query = _context.Tasks
            .Where(task => !task.IsDeleted);

        var pending = await query
            .CountAsync(task =>
                task.Status == Taskify.Repository.Entities.TaskStatus.Pending);

        var inProgress = await query
            .CountAsync(task =>
                task.Status == Taskify.Repository.Entities.TaskStatus.InProgress);

        var completed = await query
            .CountAsync(task =>
                task.Status == Taskify.Repository.Entities.TaskStatus.Completed);

        var cancelled = await query
            .CountAsync(task =>
                task.Status == Taskify.Repository.Entities.TaskStatus.Cancelled);

        var overdue = await query
            .CountAsync(task =>
                task.DueDate.HasValue &&
                task.DueDate.Value < now &&
                task.Status != Taskify.Repository.Entities.TaskStatus.Completed &&
                task.Status != Taskify.Repository.Entities.TaskStatus.Cancelled);

        return (
            pending,
            inProgress,
            completed,
            cancelled,
            overdue
        );
    }

    // ============================================================
    // GET USERS FOR ASSIGNMENT DROPDOWN
    // ============================================================

    public async Task<IReadOnlyList<User>> GetUsersForAssignmentAsync()
    {
        return await _context.Users
            .Where(user => user.IsActive)
            .OrderBy(user => user.FirstName)
            .ThenBy(user => user.LastName)
            .Select(user => new User
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            })
            .ToListAsync();
    }

    // ============================================================
    // CREATE TASK
    // ============================================================

    public async Task<TaskItem> AddAsync(TaskItem task)
    {
        await _context.Tasks.AddAsync(task);

        await _context.SaveChangesAsync();

        return task;
    }

    // ============================================================
    // UPDATE TASK
    // ============================================================

    public async Task UpdateAsync(TaskItem task)
    {
        _context.Tasks.Update(task);

        await _context.SaveChangesAsync();
    }

    // ============================================================
    // SOFT DELETE TASK
    // ============================================================

    public async Task DeleteAsync(TaskItem task)
    {
        task.IsDeleted = true;
        task.UpdatedAt = DateTime.UtcNow;

        _context.Tasks.Update(task);

        await _context.SaveChangesAsync();
    }
}