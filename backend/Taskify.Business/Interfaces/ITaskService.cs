using Taskify.Business.DTOs.Tasks;

namespace Taskify.Business.Interfaces;

public interface ITaskService
{
    // ============================================================
    // USER-SIDE TASK APIs
    // ============================================================

    Task<IReadOnlyList<TaskResponse>> GetMyTasksAsync(
        int currentUserId,
        string currentUserRole);

    Task<IReadOnlyList<TaskResponse>> GetAssignedTasksAsync(
        int currentUserId,
        string currentUserRole);

    Task<IReadOnlyList<TaskResponse>> GetPendingTasksAsync(
        int currentUserId,
        string currentUserRole);

    Task<IReadOnlyList<TaskResponse>> GetInProgressTasksAsync(
        int currentUserId,
        string currentUserRole);

    Task<IReadOnlyList<TaskResponse>> GetCompletedTasksAsync(
        int currentUserId,
        string currentUserRole);

    Task<IReadOnlyList<TaskResponse>> GetCancelledTasksAsync(
        int currentUserId,
        string currentUserRole);

    Task<IReadOnlyList<TaskResponse>> GetOverdueTasksAsync(
        int currentUserId,
        string currentUserRole);

    Task<TaskResponse> GetTaskByIdAsync(
        int id,
        int currentUserId,
        string currentUserRole);

    Task<TaskResponse> CreateTaskAsync(
        CreateTaskRequest request,
        int currentUserId,
        string currentUserRole);

    Task<TaskResponse> UpdateTaskAsync(
        int id,
        UpdateTaskRequest request,
        int currentUserId,
        string currentUserRole);

    Task<TaskResponse> ChangeStatusAsync(
        int id,
        UpdateTaskStatusRequest request,
        int currentUserId,
        string currentUserRole);

    Task DeleteTaskAsync(
        int id,
        int currentUserId,
        string currentUserRole);

    // ============================================================
    // ADMIN TASK MANAGEMENT
    // ============================================================

    Task<AdminTaskPagedResponse> GetAdminTasksAsync(
        int pageNumber,
        int pageSize,
        int adminUserId,
        string currentUserRole);

    Task<AdminTaskStatisticsResponse> GetAdminTaskStatisticsAsync(
        int adminUserId,
        string currentUserRole);

    Task<TaskResponse> GetAdminTaskByIdAsync(
        int id,
        int adminUserId,
        string currentUserRole);

    Task<TaskResponse> CreateAdminTaskAsync(
        CreateTaskRequest request,
        int adminUserId,
        string currentUserRole);

    Task<TaskResponse> UpdateAdminTaskAsync(
        int id,
        UpdateTaskRequest request,
        int adminUserId,
        string currentUserRole);

    Task<TaskResponse> ChangeAdminTaskStatusAsync(
        int id,
        UpdateTaskStatusRequest request,
        int adminUserId,
        string currentUserRole);

    Task<TaskResponse> ChangeAdminTaskDueDateAsync(
        int id,
        UpdateTaskDueDateRequest request,
        int adminUserId,
        string currentUserRole);

    Task<TaskResponse> ChangeAdminTaskPriorityAsync(
        int id,
        UpdateTaskPriorityRequest request,
        int adminUserId,
        string currentUserRole);

    Task DeleteAdminTaskAsync(
        int id,
        int adminUserId,
        string currentUserRole);

    // ============================================================
    // GET USERS FOR ASSIGNMENT DROPDOWN
    // ============================================================

    Task<IReadOnlyList<UserAssignmentDto>> GetUsersForAssignmentAsync();
}