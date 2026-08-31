using FluentValidation;
using Taskify.Business.DTOs.Tasks;
using Taskify.Business.Exceptions;
using Taskify.Business.Interfaces;
using Taskify.Repository.Entities;
using Taskify.Repository.Interfaces;

// Alias to resolve the ambiguity between System.Threading.Tasks.TaskStatus
// and Taskify.Repository.Entities.TaskStatus
using EntityTaskStatus = Taskify.Repository.Entities.TaskStatus;
using AppValidationException = Taskify.Business.Exceptions.ValidationException;

namespace Taskify.Business.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IUserRepository _userRepository;
    private readonly IValidator<CreateTaskRequest> _createValidator;
    private readonly IValidator<UpdateTaskRequest> _updateValidator;
    private readonly IValidator<UpdateTaskStatusRequest> _statusValidator;

    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;
    private const string AdminRole = "Admin";

    public TaskService(
        ITaskRepository taskRepository,
        IUserRepository userRepository,
        IValidator<CreateTaskRequest> createValidator,
        IValidator<UpdateTaskRequest> updateValidator,
        IValidator<UpdateTaskStatusRequest> statusValidator)
    {
        _taskRepository = taskRepository;
        _userRepository = userRepository;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _statusValidator = statusValidator;
    }

    // ============================================================
    // GET USERS FOR ASSIGNMENT
    // ============================================================

    public async Task<IReadOnlyList<UserAssignmentDto>> GetUsersForAssignmentAsync()
    {
        var users = await _taskRepository.GetUsersForAssignmentAsync();
        return users.Select(user => new UserAssignmentDto
        {
            Id = user.Id,
            FullName = $"{user.FirstName} {user.LastName}".Trim(),
            Email = user.Email
        }).ToList();
    }

    // ============================================================
    // PUBLIC METHODS - USER AND ADMIN
    // ============================================================

    public async Task<TaskResponse> CreateTaskAsync(
        CreateTaskRequest request,
        int currentUserId,
        string currentUserRole)
    {
        await ValidateCreateRequestAsync(request);

        var isAdmin = IsAdmin(currentUserRole);
        var assignedToUserId = DetermineAssignedUserId(request, currentUserId, isAdmin);

        await ValidateAssignedUserAsync(assignedToUserId);

        var task = CreateTaskEntity(request, currentUserId, assignedToUserId);
        var createdTask = await _taskRepository.AddAsync(task);

        return await GetTaskResponseAsync(createdTask.Id);
    }

    public async Task<IReadOnlyList<TaskResponse>> GetMyTasksAsync(
        int currentUserId,
        string currentUserRole)
    {
        var tasks = await GetVisibleTasksAsync(currentUserId, currentUserRole);
        return tasks.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<TaskResponse>> GetAssignedTasksAsync(
        int currentUserId,
        string currentUserRole)
    {
        var tasks = await _taskRepository.GetAdminAssignedTasksForUserAsync(currentUserId);
        return tasks.Select(MapToResponse).ToList();
    }

    public async Task<IReadOnlyList<TaskResponse>> GetPendingTasksAsync(
        int currentUserId,
        string currentUserRole)
    {
        return await GetTasksByStatusAsync(
            currentUserId,
            currentUserRole,
            EntityTaskStatus.Pending);
    }

    public async Task<IReadOnlyList<TaskResponse>> GetInProgressTasksAsync(
        int currentUserId,
        string currentUserRole)
    {
        return await GetTasksByStatusAsync(
            currentUserId,
            currentUserRole,
            EntityTaskStatus.InProgress);
    }

    public async Task<IReadOnlyList<TaskResponse>> GetCompletedTasksAsync(
        int currentUserId,
        string currentUserRole)
    {
        return await GetTasksByStatusAsync(
            currentUserId,
            currentUserRole,
            EntityTaskStatus.Completed);
    }

    public async Task<IReadOnlyList<TaskResponse>> GetCancelledTasksAsync(
        int currentUserId,
        string currentUserRole)
    {
        return await GetTasksByStatusAsync(
            currentUserId,
            currentUserRole,
            EntityTaskStatus.Cancelled);
    }

    public async Task<IReadOnlyList<TaskResponse>> GetOverdueTasksAsync(
        int currentUserId,
        string currentUserRole)
    {
        var tasks = await GetVisibleTasksAsync(currentUserId, currentUserRole);
        var now = DateTime.UtcNow;

        return tasks
            .Where(t => t.DueDate.HasValue &&
                       t.DueDate.Value < now &&
                       t.Status != EntityTaskStatus.Completed &&
                       t.Status != EntityTaskStatus.Cancelled)
            .Select(MapToResponse)
            .ToList();
    }

    public async Task<TaskResponse> GetTaskByIdAsync(
        int id,
        int currentUserId,
        string currentUserRole)
    {
        var task = await GetTaskOrThrowAsync(id);
        EnsureCanView(task, currentUserId, currentUserRole);
        return MapToResponse(task);
    }

    public async Task<TaskResponse> UpdateTaskAsync(
        int id,
        UpdateTaskRequest request,
        int currentUserId,
        string currentUserRole)
    {
        await ValidateUpdateRequestAsync(request);

        var task = await GetTaskOrThrowAsync(id);
        EnsureCanModify(task, currentUserId, currentUserRole);

        var isAdmin = IsAdmin(currentUserRole);
        UpdateTaskEntity(task, request);

        if (isAdmin)
        {
            if (!request.AssignedToUserId.HasValue)
            {
                throw new AppValidationException(
                    new Dictionary<string, string[]>
                    {
                        ["AssignedToUserId"] = new[] { "Admin-managed tasks must be assigned to a user." }
                    });
            }
            await ValidateAssignedUserAsync(request.AssignedToUserId);
            task.AssignedToUserId = request.AssignedToUserId;
        }

        task.UpdatedAt = DateTime.UtcNow;
        await _taskRepository.UpdateAsync(task);

        return await GetTaskResponseAsync(id);
    }

    public async Task<TaskResponse> ChangeStatusAsync(
        int id,
        UpdateTaskStatusRequest request,
        int currentUserId,
        string currentUserRole)
    {
        await ValidateStatusRequestAsync(request);

        var task = await GetTaskOrThrowAsync(id);
        EnsureCanChangeStatus(task, currentUserId, currentUserRole);

        task.Status = MapToTaskStatus(request.Status);
        task.UpdatedAt = DateTime.UtcNow;

        await _taskRepository.UpdateAsync(task);
        return await GetTaskResponseAsync(id);
    }

    public async Task DeleteTaskAsync(
        int id,
        int currentUserId,
        string currentUserRole)
    {
        var task = await GetTaskOrThrowAsync(id);
        EnsureCanModify(task, currentUserId, currentUserRole);
        await _taskRepository.DeleteAsync(task);
    }

    // ============================================================
    // ADMIN METHODS
    // ============================================================

    public async Task<AdminTaskPagedResponse> GetAdminTasksAsync(
        int pageNumber,
        int pageSize,
        int adminUserId,
        string currentUserRole)
    {
        EnsureAdmin(adminUserId, currentUserRole);

        pageNumber = pageNumber < 1 ? 1 : pageNumber;

        pageSize = pageSize switch
        {
            <= 0 => DefaultPageSize,
            > MaxPageSize => MaxPageSize,
            _ => pageSize
        };

        var result = await _taskRepository.GetPagedAsync(pageNumber, pageSize);

        var totalPages = result.TotalCount == 0
            ? 0
            : (int)Math.Ceiling(result.TotalCount / (double)pageSize);

        return new AdminTaskPagedResponse
        {
            Items = result.Items.Select(MapToResponse).ToList(),
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = result.TotalCount,
            TotalPages = totalPages,
            HasPreviousPage = pageNumber > 1,
            HasNextPage = pageNumber < totalPages
        };
    }

    public async Task<AdminTaskStatisticsResponse> GetAdminTaskStatisticsAsync(
        int adminUserId,
        string currentUserRole)
    {
        EnsureAdmin(adminUserId, currentUserRole);

        var statistics = await _taskRepository.GetStatisticsAsync();

        return new AdminTaskStatisticsResponse
        {
            Pending = statistics.Pending,
            InProgress = statistics.InProgress,
            Completed = statistics.Completed,
            Cancelled = statistics.Cancelled,
            Overdue = statistics.Overdue
        };
    }

    public async Task<TaskResponse> GetAdminTaskByIdAsync(
        int id,
        int adminUserId,
        string currentUserRole)
    {
        EnsureAdmin(adminUserId, currentUserRole);
        return await GetTaskResponseAsync(id);
    }

    public async Task<TaskResponse> CreateAdminTaskAsync(
        CreateTaskRequest request,
        int adminUserId,
        string currentUserRole)
    {
        EnsureAdmin(adminUserId, currentUserRole);

        var validationResult = await _createValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new AppValidationException(validationResult.ToDictionary());

        if (!request.AssignedToUserId.HasValue)
        {
            throw new AppValidationException(
                new Dictionary<string, string[]>
                {
                    ["AssignedToUserId"] = new[] { "AssignedToUserId is required for admin-created tasks." }
                });
        }

        await ValidateAssignedUserAsync(request.AssignedToUserId);

        var task = new TaskItem
        {
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            Category = request.Category.Trim(),
            Priority = (TaskPriority)request.Priority,
            Status = EntityTaskStatus.Pending,
            DueDate = request.DueDate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null,
            IsDeleted = false,
            CreatedByUserId = adminUserId,
            AssignedToUserId = request.AssignedToUserId
        };

        var createdTask = await _taskRepository.AddAsync(task);
        return await GetTaskResponseAsync(createdTask.Id);
    }

    public async Task<TaskResponse> UpdateAdminTaskAsync(
        int id,
        UpdateTaskRequest request,
        int adminUserId,
        string currentUserRole)
    {
        EnsureAdmin(adminUserId, currentUserRole);

        var validationResult = await _updateValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new AppValidationException(validationResult.ToDictionary());

        var task = await GetTaskOrThrowAsync(id);

        if (!request.AssignedToUserId.HasValue)
        {
            throw new AppValidationException(
                new Dictionary<string, string[]>
                {
                    ["AssignedToUserId"] = new[] { "Admin-managed tasks must be assigned to a user." }
                });
        }

        await ValidateAssignedUserAsync(request.AssignedToUserId);

        task.Title = request.Title.Trim();
        task.Description = request.Description?.Trim();
        task.Category = request.Category.Trim();
        task.Priority = (TaskPriority)request.Priority;
        task.DueDate = request.DueDate;
        task.AssignedToUserId = request.AssignedToUserId;
        task.UpdatedAt = DateTime.UtcNow;

        await _taskRepository.UpdateAsync(task);
        return await GetTaskResponseAsync(id);
    }

    public async Task<TaskResponse> ChangeAdminTaskStatusAsync(
        int id,
        UpdateTaskStatusRequest request,
        int adminUserId,
        string currentUserRole)
    {
        EnsureAdmin(adminUserId, currentUserRole);

        var validationResult = await _statusValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new AppValidationException(validationResult.ToDictionary());

        var task = await GetTaskOrThrowAsync(id);

        task.Status = (EntityTaskStatus)request.Status;
        task.UpdatedAt = DateTime.UtcNow;

        await _taskRepository.UpdateAsync(task);
        return await GetTaskResponseAsync(id);
    }

    public async Task<TaskResponse> ChangeAdminTaskDueDateAsync(
        int id,
        UpdateTaskDueDateRequest request,
        int adminUserId,
        string currentUserRole)
    {
        EnsureAdmin(adminUserId, currentUserRole);

        var task = await GetTaskOrThrowAsync(id);

        task.DueDate = request.DueDate;
        task.UpdatedAt = DateTime.UtcNow;

        await _taskRepository.UpdateAsync(task);
        return await GetTaskResponseAsync(id);
    }

    public async Task<TaskResponse> ChangeAdminTaskPriorityAsync(
        int id,
        UpdateTaskPriorityRequest request,
        int adminUserId,
        string currentUserRole)
    {
        EnsureAdmin(adminUserId, currentUserRole);

        if (!Enum.IsDefined(typeof(TaskPriority), request.Priority))
        {
            throw new AppValidationException(
                new Dictionary<string, string[]>
                {
                    ["Priority"] = new[] { "Invalid task priority." }
                });
        }

        var task = await GetTaskOrThrowAsync(id);

        task.Priority = (TaskPriority)request.Priority;
        task.UpdatedAt = DateTime.UtcNow;

        await _taskRepository.UpdateAsync(task);
        return await GetTaskResponseAsync(id);
    }

    public async Task DeleteAdminTaskAsync(
        int id,
        int adminUserId,
        string currentUserRole)
    {
        EnsureAdmin(adminUserId, currentUserRole);

        var task = await GetTaskOrThrowAsync(id);
        await _taskRepository.DeleteAsync(task);
    }

    // ============================================================
    // PRIVATE HELPERS - VALIDATION
    // ============================================================

    private async Task ValidateCreateRequestAsync(CreateTaskRequest request)
    {
        var result = await _createValidator.ValidateAsync(request);
        if (!result.IsValid)
            throw new AppValidationException(result.ToDictionary());
    }

    private async Task ValidateUpdateRequestAsync(UpdateTaskRequest request)
    {
        var result = await _updateValidator.ValidateAsync(request);
        if (!result.IsValid)
            throw new AppValidationException(result.ToDictionary());
    }

    private async Task ValidateStatusRequestAsync(UpdateTaskStatusRequest request)
    {
        var result = await _statusValidator.ValidateAsync(request);
        if (!result.IsValid)
            throw new AppValidationException(result.ToDictionary());
    }

    private async Task ValidateAssignedUserAsync(int? userId)
    {
        if (!userId.HasValue) return;

        var user = await _userRepository.GetByIdAsync(userId.Value);
        if (user == null)
            throw new NotFoundException($"User with ID {userId.Value} was not found.");
    }

    // ============================================================
    // PRIVATE HELPERS - AUTHORIZATION
    // ============================================================

    private static bool IsAdmin(string role) =>
        string.Equals(role, AdminRole, StringComparison.OrdinalIgnoreCase);

    private void EnsureAdmin(int userId, string role)
    {
        if (!IsAdmin(role))
            throw new AuthorizationException("Only admins can perform this action.");
    }

    private static void EnsureCanView(TaskItem task, int currentUserId, string currentUserRole)
    {
        if (IsAdmin(currentUserRole)) return;

        if (task.CreatedByUserId != currentUserId && task.AssignedToUserId != currentUserId)
            throw new AuthorizationException("You do not have permission to view this task.");
    }

    private static void EnsureCanModify(TaskItem task, int currentUserId, string currentUserRole)
    {
        if (IsAdmin(currentUserRole)) return;

        // Users can only modify tasks they created themselves (not admin-assigned ones)
        if (task.CreatedByUserId != currentUserId)
            throw new AuthorizationException("You do not have permission to modify this task.");
    }

    private static void EnsureCanChangeStatus(TaskItem task, int currentUserId, string currentUserRole)
    {
        if (IsAdmin(currentUserRole)) return;

        // Users can change status on tasks assigned to them or created by them
        if (task.CreatedByUserId != currentUserId && task.AssignedToUserId != currentUserId)
            throw new AuthorizationException("You do not have permission to change the status of this task.");
    }

    // ============================================================
    // PRIVATE HELPERS - DATA ACCESS
    // ============================================================

    private async Task<TaskItem> GetTaskOrThrowAsync(int id)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null)
            throw new NotFoundException($"Task with ID {id} was not found.");
        return task;
    }

    private async Task<TaskResponse> GetTaskResponseAsync(int id)
    {
        var task = await GetTaskOrThrowAsync(id);
        return MapToResponse(task);
    }

    private async Task<IReadOnlyList<TaskItem>> GetVisibleTasksAsync(int userId, string role)
    {
        if (IsAdmin(role))
            return await _taskRepository.GetAllAsync();

        // Combine tasks the user created themselves with tasks assigned to them by an admin,
        // then deduplicate by Id in case both sides ever overlap.
        var created  = await _taskRepository.GetByCreatorIdAsync(userId);
        var assigned = await _taskRepository.GetByAssignedUserIdAsync(userId);

        return created
            .Union(assigned, TaskItemIdComparer.Instance)
            .ToList();
    }

    private async Task<IReadOnlyList<TaskResponse>> GetTasksByStatusAsync(
        int currentUserId,
        string currentUserRole,
        EntityTaskStatus status)
    {
        var tasks = await GetVisibleTasksAsync(currentUserId, currentUserRole);
        return tasks
            .Where(t => t.Status == status)
            .Select(MapToResponse)
            .ToList();
    }

    // ============================================================
    // PRIVATE HELPERS - MAPPING & FACTORY
    // ============================================================

    private static int DetermineAssignedUserId(
        CreateTaskRequest request,
        int currentUserId,
        bool isAdmin)
    {
        if (isAdmin)
        {
            if (!request.AssignedToUserId.HasValue)
                throw new AppValidationException(
                    new Dictionary<string, string[]>
                    {
                        ["AssignedToUserId"] = new[] { "AssignedToUserId is required for admin-created tasks." }
                    });

            return request.AssignedToUserId.Value;
        }

        // Regular users self-assign; ignore any AssignedToUserId they send
        return currentUserId;
    }

    private static TaskItem CreateTaskEntity(
        CreateTaskRequest request,
        int createdByUserId,
        int assignedToUserId)
    {
        return new TaskItem
        {
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            Category = request.Category.Trim(),
            Priority = (TaskPriority)request.Priority,
            Status = EntityTaskStatus.Pending,
            DueDate = request.DueDate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null,
            IsDeleted = false,
            CreatedByUserId = createdByUserId,
            AssignedToUserId = assignedToUserId
        };
    }

    private static void UpdateTaskEntity(TaskItem task, UpdateTaskRequest request)
    {
        task.Title = request.Title.Trim();
        task.Description = request.Description?.Trim();
        task.Category = request.Category.Trim();
        task.Priority = (TaskPriority)request.Priority;
        task.DueDate = request.DueDate;
    }

    private static EntityTaskStatus MapToTaskStatus(int status) =>
        (EntityTaskStatus)status;

    // Deduplication helper used by GetVisibleTasksAsync
    private sealed class TaskItemIdComparer : IEqualityComparer<TaskItem>
    {
        public static readonly TaskItemIdComparer Instance = new();
        public bool Equals(TaskItem? x, TaskItem? y) => x?.Id == y?.Id;
        public int GetHashCode(TaskItem obj) => obj.Id.GetHashCode();
    }

   private static TaskResponse MapToResponse(TaskItem task) =>
    new TaskResponse
    {
        Id = task.Id,
        Title = task.Title,
        Description = task.Description,
        Category = task.Category,
        Priority = task.Priority.ToString(),
        Status = task.Status.ToString(),
        DueDate = task.DueDate,
        CreatedAt = task.CreatedAt,
        UpdatedAt = task.UpdatedAt,
        CreatedByUserId = task.CreatedByUserId,
        CreatedByName = $"{task.CreatedByUser.FirstName} {task.CreatedByUser.LastName}".Trim(),
        AssignedToUserId = task.AssignedToUserId,
        AssignedToName = task.AssignedToUser != null
            ? $"{task.AssignedToUser.FirstName} {task.AssignedToUser.LastName}".Trim()
            : null
    };
}