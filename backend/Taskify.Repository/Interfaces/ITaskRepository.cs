using Taskify.Repository.Entities;

namespace Taskify.Repository.Interfaces;

public interface ITaskRepository
{
    // ============================================================
    // GET TASK BY ID
    // ============================================================

    Task<TaskItem?> GetByIdAsync(int id);

    // ============================================================
    // GET ALL TASKS
    // ============================================================

    Task<IReadOnlyList<TaskItem>> GetAllAsync();

    // ============================================================
    // GET TASKS BY CREATOR
    // ============================================================

    Task<IReadOnlyList<TaskItem>> GetByCreatorIdAsync(
        int userId);

    // ============================================================
    // GET TASKS BY ASSIGNED USER
    // ============================================================

    Task<IReadOnlyList<TaskItem>> GetByAssignedUserIdAsync(
        int userId);

    // ============================================================
    // GET ADMIN-CREATED TASKS ASSIGNED TO USER
    // ============================================================

    Task<IReadOnlyList<TaskItem>> GetAdminAssignedTasksForUserAsync(
        int userId);

    // ============================================================
    // ADMIN TASK PAGINATION
    //
    // Returns only non-deleted tasks.
    // ============================================================

    Task<(IReadOnlyList<TaskItem> Items, int TotalCount)>
        GetPagedAsync(
            int pageNumber,
            int pageSize);

    // ============================================================
    // ADMIN TASK STATISTICS
    //
    // Returns counts for:
    // Pending
    // In Progress
    // Completed
    // Cancelled
    // Overdue
    // ============================================================

    Task<(int Pending,
          int InProgress,
          int Completed,
          int Cancelled,
          int Overdue)>
        GetStatisticsAsync();

    // ============================================================
    // CREATE TASK
    // ============================================================

    Task<TaskItem> AddAsync(TaskItem task);

    // ============================================================
    // UPDATE TASK
    // ============================================================

    Task UpdateAsync(TaskItem task);

    // ============================================================
    // SOFT DELETE TASK
    // ============================================================

    Task DeleteAsync(TaskItem task);

    // ============================================================
    // GET USERS FOR ASSIGNMENT DROPDOWN
    // ============================================================

    Task<IReadOnlyList<User>> GetUsersForAssignmentAsync();
}