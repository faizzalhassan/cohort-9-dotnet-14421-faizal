using FluentValidation;
using FluentValidation.Results;
using Moq;
using Taskify.Business.DTOs.Tasks;
using Taskify.Business.Exceptions;
using Taskify.Business.Services;
using Taskify.Repository.Entities;
using Taskify.Repository.Interfaces;
using Xunit;

using EntityTaskStatus = Taskify.Repository.Entities.TaskStatus;

namespace Taskify.Tests.Services;

public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _taskRepositoryMock;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IValidator<CreateTaskRequest>> _createValidatorMock;
    private readonly Mock<IValidator<UpdateTaskRequest>> _updateValidatorMock;
    private readonly Mock<IValidator<UpdateTaskStatusRequest>> _statusValidatorMock;

    private readonly TaskService _taskService;

    public TaskServiceTests()
    {
        _taskRepositoryMock = new Mock<ITaskRepository>();
        _userRepositoryMock = new Mock<IUserRepository>();

        _createValidatorMock =
            new Mock<IValidator<CreateTaskRequest>>();

        _updateValidatorMock =
            new Mock<IValidator<UpdateTaskRequest>>();

        _statusValidatorMock =
            new Mock<IValidator<UpdateTaskStatusRequest>>();

        _taskService = new TaskService(
            _taskRepositoryMock.Object,
            _userRepositoryMock.Object,
            _createValidatorMock.Object,
            _updateValidatorMock.Object,
            _statusValidatorMock.Object);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private static ValidationResult ValidValidationResult()
    {
        return new ValidationResult();
    }

    private static ValidationResult InvalidValidationResult(
        string propertyName,
        string errorMessage)
    {
        return new ValidationResult(
            new[]
            {
                new ValidationFailure(propertyName, errorMessage)
            });
    }

    private static User CreateUser(
        int id = 1,
        string firstName = "Faizal",
        string lastName = "Hassan",
        string email = "faizal@gmail.com",
        UserRole role = UserRole.User)
    {
        return new User
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Role = role,
            IsActive = true
        };
    }

    private static TaskItem CreateTask(
        int id = 1,
        int createdByUserId = 1,
        int? assignedToUserId = 1,
        EntityTaskStatus status = EntityTaskStatus.Pending,
        DateTime? dueDate = null,
        bool isDeleted = false)
    {
        var creator = CreateUser(
            createdByUserId,
            "Faizal",
            "Hassan",
            "faizal@gmail.com");

        User? assignedUser = assignedToUserId.HasValue
            ? CreateUser(
                assignedToUserId.Value,
                "Assigned",
                "User",
                "assigned@gmail.com")
            : null;

        return new TaskItem
        {
            Id = id,
            Title = "Test Task",
            Description = "Test Description",
            Category = "Development",
            Priority = Enum.GetValues<TaskPriority>().First(),
            Status = status,
            DueDate = dueDate,
            CreatedAt = DateTime.UtcNow.AddDays(-1),
            UpdatedAt = null,
            IsDeleted = isDeleted,
            CreatedByUserId = createdByUserId,
            CreatedByUser = creator,
            AssignedToUserId = assignedToUserId,
            AssignedToUser = assignedUser
        };
    }

    private static CreateTaskRequest CreateValidCreateRequest(
        int? assignedToUserId = null)
    {
        return new CreateTaskRequest
        {
            Title = "  New Task  ",
            Description = "  Task Description  ",
            Category = "  Development  ",
            Priority = (int)Enum.GetValues<TaskPriority>().First(),
            DueDate = DateTime.UtcNow.AddDays(7),
            AssignedToUserId = assignedToUserId
        };
    }

    private static UpdateTaskRequest CreateValidUpdateRequest(
        int? assignedToUserId = null)
    {
        return new UpdateTaskRequest
        {
            Title = "  Updated Task  ",
            Description = "  Updated Description  ",
            Category = "  Testing  ",
            Priority = (int)Enum.GetValues<TaskPriority>().First(),
            DueDate = DateTime.UtcNow.AddDays(10),
            AssignedToUserId = assignedToUserId
        };
    }

    private static UpdateTaskStatusRequest CreateValidStatusRequest()
    {
        return new UpdateTaskStatusRequest
        {
            Status = (int)EntityTaskStatus.Completed
        };
    }

    // ============================================================
    // GET USERS FOR ASSIGNMENT
    // ============================================================

    [Fact]
    public async Task GetUsersForAssignmentAsync_ReturnsMappedUsers()
    {
        // Arrange
        var users = new List<User>
        {
            CreateUser(
                1,
                "Faizal",
                "Hassan",
                "faizal@gmail.com"),

            CreateUser(
                2,
                "Ali",
                "Khan",
                "ali@gmail.com")
        };

        _taskRepositoryMock
            .Setup(x => x.GetUsersForAssignmentAsync())
            .ReturnsAsync(users);

        // Act
        var result =
            await _taskService.GetUsersForAssignmentAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);

        Assert.Equal(1, result[0].Id);
        Assert.Equal("Faizal Hassan", result[0].FullName);
        Assert.Equal("faizal@gmail.com", result[0].Email);

        Assert.Equal(2, result[1].Id);
        Assert.Equal("Ali Khan", result[1].FullName);
        Assert.Equal("ali@gmail.com", result[1].Email);

        _taskRepositoryMock.Verify(
            x => x.GetUsersForAssignmentAsync(),
            Times.Once);
    }

    // ============================================================
    // CREATE TASK
    // ============================================================

    [Fact]
    public async Task CreateTaskAsync_ValidUserRequest_CreatesTask()
    {
        // Arrange
        var request = CreateValidCreateRequest();

        var createdTask = CreateTask(
            id: 10,
            createdByUserId: 1,
            assignedToUserId: 1);

        _createValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(CreateUser());

        _taskRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<TaskItem>()))
            .ReturnsAsync(createdTask);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(10))
            .ReturnsAsync(createdTask);

        // Act
        var result =
            await _taskService.CreateTaskAsync(
                request,
                1,
                "User");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(10, result.Id);
        Assert.Equal("Test Task", result.Title);
        Assert.Equal("Development", result.Category);
        Assert.Equal(1, result.CreatedByUserId);
        Assert.Equal(1, result.AssignedToUserId);
        Assert.Equal("Faizal Hassan", result.CreatedByName);

        _taskRepositoryMock.Verify(
            x => x.AddAsync(It.Is<TaskItem>(task =>
                task.CreatedByUserId == 1 &&
                task.AssignedToUserId == 1 &&
                task.Status == EntityTaskStatus.Pending &&
                !task.IsDeleted)),
            Times.Once);
    }

    [Fact]
    public async Task CreateTaskAsync_ValidAdminRequest_CreatesAssignedTask()
    {
        // Arrange
        var request = CreateValidCreateRequest(2);

        var createdTask = CreateTask(
            id: 20,
            createdByUserId: 1,
            assignedToUserId: 2);

        _createValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(CreateUser(
                2,
                "Ali",
                "Khan",
                "ali@gmail.com"));

        _taskRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<TaskItem>()))
            .ReturnsAsync(createdTask);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(20))
            .ReturnsAsync(createdTask);

        // Act
        var result =
            await _taskService.CreateTaskAsync(
                request,
                1,
                "Admin");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(20, result.Id);
        Assert.Equal(2, result.AssignedToUserId);

        _taskRepositoryMock.Verify(
            x => x.AddAsync(It.Is<TaskItem>(task =>
                task.CreatedByUserId == 1 &&
                task.AssignedToUserId == 2 &&
                task.Status == EntityTaskStatus.Pending)),
            Times.Once);
    }

    [Fact]
    public async Task CreateTaskAsync_UserProvidedAssignment_IgnoresProvidedAssignment()
    {
        // Arrange
        var request = CreateValidCreateRequest(99);

        var createdTask = CreateTask(
            id: 21,
            createdByUserId: 1,
            assignedToUserId: 1);

        _createValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(CreateUser());

        _taskRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<TaskItem>()))
            .ReturnsAsync(createdTask);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(21))
            .ReturnsAsync(createdTask);

        // Act
        await _taskService.CreateTaskAsync(
            request,
            1,
            "User");

        // Assert
        _taskRepositoryMock.Verify(
            x => x.AddAsync(It.Is<TaskItem>(task =>
                task.CreatedByUserId == 1 &&
                task.AssignedToUserId == 1)),
            Times.Once);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(99),
            Times.Never);
    }

    [Fact]
    public async Task CreateTaskAsync_InvalidRequest_ThrowsValidationException()
    {
        // Arrange
        var request = CreateValidCreateRequest();

        _createValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(
                InvalidValidationResult(
                    "Title",
                    "Title is required."));

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _taskService.CreateTaskAsync(
                request,
                1,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    [Fact]
    public async Task CreateTaskAsync_AdminWithoutAssignment_ThrowsValidationException()
    {
        // Arrange
        var request = CreateValidCreateRequest();

        _createValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _taskService.CreateTaskAsync(
                request,
                1,
                "Admin"));

        _taskRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    [Fact]
    public async Task CreateTaskAsync_NonExistingAssignedUser_ThrowsNotFoundException()
    {
        // Arrange
        var request = CreateValidCreateRequest(999);

        _createValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _taskService.CreateTaskAsync(
                request,
                1,
                "Admin"));

        _taskRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    // ============================================================
    // GET MY TASKS
    // ============================================================

    [Fact]
    public async Task GetMyTasksAsync_Admin_ReturnsAllTasks()
    {
        // Arrange
        var tasks = new List<TaskItem>
        {
            CreateTask(1, 1, 1),
            CreateTask(2, 2, 2)
        };

        _taskRepositoryMock
            .Setup(x => x.GetAllAsync())
            .ReturnsAsync(tasks);

        // Act
        var result =
            await _taskService.GetMyTasksAsync(99, "Admin");

        // Assert
        Assert.Equal(2, result.Count);

        _taskRepositoryMock.Verify(
            x => x.GetAllAsync(),
            Times.Once);

        _taskRepositoryMock.Verify(
            x => x.GetByCreatorIdAsync(It.IsAny<int>()),
            Times.Never);

        _taskRepositoryMock.Verify(
            x => x.GetByAssignedUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task GetMyTasksAsync_User_ReturnsCreatedAndAssignedTasks()
    {
        // Arrange
        var createdTasks = new List<TaskItem>
        {
            CreateTask(1, 1, 1),
            CreateTask(2, 1, 2)
        };

        var assignedTasks = new List<TaskItem>
        {
            CreateTask(3, 2, 1)
        };

        _taskRepositoryMock
            .Setup(x => x.GetByCreatorIdAsync(1))
            .ReturnsAsync(createdTasks);

        _taskRepositoryMock
            .Setup(x => x.GetByAssignedUserIdAsync(1))
            .ReturnsAsync(assignedTasks);

        // Act
        var result =
            await _taskService.GetMyTasksAsync(1, "User");

        // Assert
        Assert.Equal(3, result.Count);
        Assert.Contains(result, x => x.Id == 1);
        Assert.Contains(result, x => x.Id == 2);
        Assert.Contains(result, x => x.Id == 3);
    }

    [Fact]
    public async Task GetMyTasksAsync_User_DeduplicatesTasks()
    {
        // Arrange
        var duplicateTask =
            CreateTask(1, 1, 1);

        _taskRepositoryMock
            .Setup(x => x.GetByCreatorIdAsync(1))
            .ReturnsAsync(new List<TaskItem>
            {
                duplicateTask
            });

        _taskRepositoryMock
            .Setup(x => x.GetByAssignedUserIdAsync(1))
            .ReturnsAsync(new List<TaskItem>
            {
                duplicateTask
            });

        // Act
        var result =
            await _taskService.GetMyTasksAsync(1, "User");

        // Assert
        Assert.Single(result);
        Assert.Equal(1, result[0].Id);
    }

    // ============================================================
    // ASSIGNED TASKS
    // ============================================================

    [Fact]
    public async Task GetAssignedTasksAsync_ReturnsAssignedTasks()
    {
        // Arrange
        var tasks = new List<TaskItem>
        {
            CreateTask(1, 2, 1),
            CreateTask(2, 3, 1)
        };

        _taskRepositoryMock
            .Setup(x => x.GetAdminAssignedTasksForUserAsync(1))
            .ReturnsAsync(tasks);

        // Act
        var result =
            await _taskService.GetAssignedTasksAsync(1, "User");

        // Assert
        Assert.Equal(2, result.Count);

        Assert.All(
            result,
            task => Assert.Equal(1, task.AssignedToUserId));
    }

    // ============================================================
    // STATUS FILTERING
    // ============================================================

    [Fact]
    public async Task GetPendingTasksAsync_ReturnsOnlyPendingTasks()
    {
        // Arrange
        var tasks = new List<TaskItem>
        {
            CreateTask(
                1,
                1,
                1,
                EntityTaskStatus.Pending),

            CreateTask(
                2,
                1,
                1,
                EntityTaskStatus.Completed),

            CreateTask(
                3,
                1,
                1,
                EntityTaskStatus.InProgress)
        };

        _taskRepositoryMock
            .Setup(x => x.GetByCreatorIdAsync(1))
            .ReturnsAsync(tasks);

        _taskRepositoryMock
            .Setup(x => x.GetByAssignedUserIdAsync(1))
            .ReturnsAsync(new List<TaskItem>());

        // Act
        var result =
            await _taskService.GetPendingTasksAsync(1, "User");

        // Assert
        Assert.Single(result);
        Assert.Equal("Pending", result[0].Status);
    }

    [Fact]
    public async Task GetInProgressTasksAsync_ReturnsOnlyInProgressTasks()
    {
        // Arrange
        var tasks = new List<TaskItem>
        {
            CreateTask(
                1,
                1,
                1,
                EntityTaskStatus.Pending),

            CreateTask(
                2,
                1,
                1,
                EntityTaskStatus.InProgress),

            CreateTask(
                3,
                1,
                1,
                EntityTaskStatus.Completed)
        };

        _taskRepositoryMock
            .Setup(x => x.GetByCreatorIdAsync(1))
            .ReturnsAsync(tasks);

        _taskRepositoryMock
            .Setup(x => x.GetByAssignedUserIdAsync(1))
            .ReturnsAsync(new List<TaskItem>());

        // Act
        var result =
            await _taskService.GetInProgressTasksAsync(1, "User");

        // Assert
        Assert.Single(result);
        Assert.Equal("InProgress", result[0].Status);
    }

    [Fact]
    public async Task GetCompletedTasksAsync_ReturnsOnlyCompletedTasks()
    {
        // Arrange
        var tasks = new List<TaskItem>
        {
            CreateTask(
                1,
                1,
                1,
                EntityTaskStatus.Completed),

            CreateTask(
                2,
                1,
                1,
                EntityTaskStatus.Pending)
        };

        _taskRepositoryMock
            .Setup(x => x.GetByCreatorIdAsync(1))
            .ReturnsAsync(tasks);

        _taskRepositoryMock
            .Setup(x => x.GetByAssignedUserIdAsync(1))
            .ReturnsAsync(new List<TaskItem>());

        // Act
        var result =
            await _taskService.GetCompletedTasksAsync(1, "User");

        // Assert
        Assert.Single(result);
        Assert.Equal("Completed", result[0].Status);
    }

    [Fact]
    public async Task GetCancelledTasksAsync_ReturnsOnlyCancelledTasks()
    {
        // Arrange
        var tasks = new List<TaskItem>
        {
            CreateTask(
                1,
                1,
                1,
                EntityTaskStatus.Cancelled),

            CreateTask(
                2,
                1,
                1,
                EntityTaskStatus.Pending)
        };

        _taskRepositoryMock
            .Setup(x => x.GetByCreatorIdAsync(1))
            .ReturnsAsync(tasks);

        _taskRepositoryMock
            .Setup(x => x.GetByAssignedUserIdAsync(1))
            .ReturnsAsync(new List<TaskItem>());

        // Act
        var result =
            await _taskService.GetCancelledTasksAsync(1, "User");

        // Assert
        Assert.Single(result);
        Assert.Equal("Cancelled", result[0].Status);
    }

    // ============================================================
    // OVERDUE TASKS
    // ============================================================

    [Fact]
    public async Task GetOverdueTasksAsync_ReturnsOnlyOverdueTasks()
    {
        // Arrange
        var overdueTask = CreateTask(
            1,
            1,
            1,
            EntityTaskStatus.Pending,
            DateTime.UtcNow.AddDays(-1));

        var futureTask = CreateTask(
            2,
            1,
            1,
            EntityTaskStatus.Pending,
            DateTime.UtcNow.AddDays(1));

        var completedOverdueTask = CreateTask(
            3,
            1,
            1,
            EntityTaskStatus.Completed,
            DateTime.UtcNow.AddDays(-2));

        _taskRepositoryMock
            .Setup(x => x.GetByCreatorIdAsync(1))
            .ReturnsAsync(
                new List<TaskItem>
                {
                    overdueTask,
                    futureTask,
                    completedOverdueTask
                });

        _taskRepositoryMock
            .Setup(x => x.GetByAssignedUserIdAsync(1))
            .ReturnsAsync(new List<TaskItem>());

        // Act
        var result =
            await _taskService.GetOverdueTasksAsync(1, "User");

        // Assert
        Assert.Single(result);
        Assert.Equal(1, result[0].Id);
        Assert.Equal("Pending", result[0].Status);
    }

    [Fact]
    public async Task GetOverdueTasksAsync_CancelledOverdueTask_IsNotReturned()
    {
        // Arrange
        var task = CreateTask(
            1,
            1,
            1,
            EntityTaskStatus.Cancelled,
            DateTime.UtcNow.AddDays(-1));

        _taskRepositoryMock
            .Setup(x => x.GetByCreatorIdAsync(1))
            .ReturnsAsync(new List<TaskItem> { task });

        _taskRepositoryMock
            .Setup(x => x.GetByAssignedUserIdAsync(1))
            .ReturnsAsync(new List<TaskItem>());

        // Act
        var result =
            await _taskService.GetOverdueTasksAsync(1, "User");

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetOverdueTasksAsync_TaskWithoutDueDate_IsNotReturned()
    {
        // Arrange
        var task = CreateTask(
            1,
            1,
            1,
            EntityTaskStatus.Pending,
            null);

        _taskRepositoryMock
            .Setup(x => x.GetByCreatorIdAsync(1))
            .ReturnsAsync(new List<TaskItem> { task });

        _taskRepositoryMock
            .Setup(x => x.GetByAssignedUserIdAsync(1))
            .ReturnsAsync(new List<TaskItem>());

        // Act
        var result =
            await _taskService.GetOverdueTasksAsync(1, "User");

        // Assert
        Assert.Empty(result);
    }

    // ============================================================
    // GET TASK BY ID
    // ============================================================

    [Fact]
    public async Task GetTaskByIdAsync_Owner_ReturnsTask()
    {
        // Arrange
        var task = CreateTask(
            1,
            1,
            1);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act
        var result =
            await _taskService.GetTaskByIdAsync(
                1,
                1,
                "User");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("Test Task", result.Title);
        Assert.Equal("Faizal Hassan", result.CreatedByName);
        Assert.Equal("Assigned User", result.AssignedToName);
    }

    [Fact]
    public async Task GetTaskByIdAsync_Admin_CanViewAnyTask()
    {
        // Arrange
        var task = CreateTask(
            1,
            99,
            2);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act
        var result =
            await _taskService.GetTaskByIdAsync(
                1,
                1,
                "Admin");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
    }

    [Fact]
    public async Task GetTaskByIdAsync_UnauthorizedUser_ThrowsAuthorizationException()
    {
        // Arrange
        var task = CreateTask(
            1,
            10,
            20);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.GetTaskByIdAsync(
                1,
                99,
                "User"));
    }

    [Fact]
    public async Task GetTaskByIdAsync_TaskDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((TaskItem?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _taskService.GetTaskByIdAsync(
                999,
                1,
                "User"));
    }

    // ============================================================
    // UPDATE TASK
    // ============================================================

    [Fact]
    public async Task UpdateTaskAsync_Owner_UpdatesTask()
    {
        // Arrange
        var request = CreateValidUpdateRequest();

        var task = CreateTask(
            1,
            1,
            1);

        _updateValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        _taskRepositoryMock
            .Setup(x => x.UpdateAsync(It.IsAny<TaskItem>()))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _taskService.UpdateTaskAsync(
                1,
                request,
                1,
                "User");

        // Assert
        Assert.NotNull(result);

        _taskRepositoryMock.Verify(
            x => x.UpdateAsync(It.Is<TaskItem>(t =>
                t.Id == 1 &&
                t.Title == "Updated Task" &&
                t.Category == "Testing")),
            Times.Once);
    }

    [Fact]
    public async Task UpdateTaskAsync_NonOwner_ThrowsAuthorizationException()
    {
        // Arrange
        var request = CreateValidUpdateRequest();

        var task = CreateTask(
            1,
            10,
            20);

        _updateValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.UpdateTaskAsync(
                1,
                request,
                99,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateTaskAsync_InvalidRequest_ThrowsValidationException()
    {
        // Arrange
        var request = CreateValidUpdateRequest();

        _updateValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(
                InvalidValidationResult(
                    "Title",
                    "Title is required."));

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _taskService.UpdateTaskAsync(
                1,
                request,
                1,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateTaskAsync_TaskDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        var request = CreateValidUpdateRequest();

        _updateValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((TaskItem?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _taskService.UpdateTaskAsync(
                999,
                request,
                1,
                "User"));
    }

    // ============================================================
    // CHANGE STATUS
    // ============================================================

    [Fact]
    public async Task ChangeStatusAsync_Owner_ChangesStatus()
    {
        // Arrange
        var request = CreateValidStatusRequest();

        var task = CreateTask(
            1,
            1,
            1,
            EntityTaskStatus.Pending);

        _statusValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act
        var result =
            await _taskService.ChangeStatusAsync(
                1,
                request,
                1,
                "User");

        // Assert
        Assert.Equal(
            EntityTaskStatus.Completed.ToString(),
            result.Status);

        _taskRepositoryMock.Verify(
            x => x.UpdateAsync(It.Is<TaskItem>(t =>
                t.Status == EntityTaskStatus.Completed)),
            Times.Once);
    }

    [Fact]
    public async Task ChangeStatusAsync_AssignedUser_CanChangeStatus()
    {
        // Arrange
        var request = CreateValidStatusRequest();

        var task = CreateTask(
            1,
            10,
            1,
            EntityTaskStatus.Pending);

        _statusValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act
        var result =
            await _taskService.ChangeStatusAsync(
                1,
                request,
                1,
                "User");

        // Assert
        Assert.Equal("Completed", result.Status);

        _taskRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<TaskItem>()),
            Times.Once);
    }

    [Fact]
    public async Task ChangeStatusAsync_UnauthorizedUser_ThrowsAuthorizationException()
    {
        // Arrange
        var request = CreateValidStatusRequest();

        var task = CreateTask(
            1,
            10,
            20);

        _statusValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.ChangeStatusAsync(
                1,
                request,
                99,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangeStatusAsync_InvalidRequest_ThrowsValidationException()
    {
        // Arrange
        var request = new UpdateTaskStatusRequest
        {
            Status = 999
        };

        _statusValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(
                InvalidValidationResult(
                    "Status",
                    "Invalid status."));

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _taskService.ChangeStatusAsync(
                1,
                request,
                1,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // DELETE TASK
    // ============================================================

    [Fact]
    public async Task DeleteTaskAsync_Owner_DeletesTask()
    {
        // Arrange
        var task = CreateTask(
            1,
            1,
            1);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act
        await _taskService.DeleteTaskAsync(
            1,
            1,
            "User");

        // Assert
        _taskRepositoryMock.Verify(
            x => x.DeleteAsync(task),
            Times.Once);
    }

    [Fact]
    public async Task DeleteTaskAsync_NonOwner_ThrowsAuthorizationException()
    {
        // Arrange
        var task = CreateTask(
            1,
            10,
            20);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.DeleteTaskAsync(
                1,
                99,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.DeleteAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteTaskAsync_TaskDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((TaskItem?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _taskService.DeleteTaskAsync(
                999,
                1,
                "User"));
    }

    // ============================================================
    // ADMIN PAGINATION
    // ============================================================

    [Fact]
    public async Task GetAdminTasksAsync_Admin_ReturnsPagedTasks()
    {
        // Arrange
        var tasks = new List<TaskItem>
        {
            CreateTask(1),
            CreateTask(2)
        };

        _taskRepositoryMock
            .Setup(x => x.GetPagedAsync(1, 10))
            .ReturnsAsync(
                ((IReadOnlyList<TaskItem>)tasks, 25));

        // Act
        var result =
            await _taskService.GetAdminTasksAsync(
                1,
                10,
                99,
                "Admin");

        // Assert
        Assert.Equal(1, result.PageNumber);
        Assert.Equal(10, result.PageSize);
        Assert.Equal(25, result.TotalCount);
        Assert.Equal(3, result.TotalPages);
        Assert.False(result.HasPreviousPage);
        Assert.True(result.HasNextPage);
        Assert.Equal(2, result.Items.Count);
    }

    [Fact]
    public async Task GetAdminTasksAsync_PageNumberLessThanOne_UsesPageOne()
    {
        // Arrange
        _taskRepositoryMock
            .Setup(x => x.GetPagedAsync(1, 20))
            .ReturnsAsync(
                ((IReadOnlyList<TaskItem>)
                    new List<TaskItem>(),
                    0));

        // Act
        var result =
            await _taskService.GetAdminTasksAsync(
                0,
                0,
                1,
                "Admin");

        // Assert
        Assert.Equal(1, result.PageNumber);
        Assert.Equal(20, result.PageSize);
        Assert.Equal(0, result.TotalPages);
        Assert.False(result.HasPreviousPage);
        Assert.False(result.HasNextPage);
    }

    [Fact]
    public async Task GetAdminTasksAsync_PageSizeGreaterThanMaximum_CapsAt100()
    {
        // Arrange
        _taskRepositoryMock
            .Setup(x => x.GetPagedAsync(1, 100))
            .ReturnsAsync(
                ((IReadOnlyList<TaskItem>)
                    new List<TaskItem>(),
                    150));

        // Act
        var result =
            await _taskService.GetAdminTasksAsync(
                1,
                500,
                1,
                "Admin");

        // Assert
        Assert.Equal(100, result.PageSize);
        Assert.Equal(2, result.TotalPages);
    }

    [Fact]
    public async Task GetAdminTasksAsync_NonAdmin_ThrowsAuthorizationException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.GetAdminTasksAsync(
                1,
                20,
                1,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.GetPagedAsync(
                It.IsAny<int>(),
                It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // ADMIN STATISTICS
    // ============================================================

    [Fact]
    public async Task GetAdminTaskStatisticsAsync_Admin_ReturnsStatistics()
    {
        // Arrange
        _taskRepositoryMock
            .Setup(x => x.GetStatisticsAsync())
            .ReturnsAsync(
                (
                    Pending: 5,
                    InProgress: 4,
                    Completed: 10,
                    Cancelled: 2,
                    Overdue: 3
                ));

        // Act
        var result =
            await _taskService.GetAdminTaskStatisticsAsync(
                1,
                "Admin");

        // Assert
        Assert.Equal(5, result.Pending);
        Assert.Equal(4, result.InProgress);
        Assert.Equal(10, result.Completed);
        Assert.Equal(2, result.Cancelled);
        Assert.Equal(3, result.Overdue);
    }

    [Fact]
    public async Task GetAdminTaskStatisticsAsync_NonAdmin_ThrowsAuthorizationException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.GetAdminTaskStatisticsAsync(
                1,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.GetStatisticsAsync(),
            Times.Never);
    }

    // ============================================================
    // ADMIN GET BY ID
    // ============================================================

    [Fact]
    public async Task GetAdminTaskByIdAsync_Admin_ReturnsTask()
    {
        // Arrange
        var task = CreateTask(
            1,
            2,
            3);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act
        var result =
            await _taskService.GetAdminTaskByIdAsync(
                1,
                99,
                "Admin");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
    }

    [Fact]
    public async Task GetAdminTaskByIdAsync_NonAdmin_ThrowsAuthorizationException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.GetAdminTaskByIdAsync(
                1,
                1,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // ADMIN CREATE
    // ============================================================

    [Fact]
    public async Task CreateAdminTaskAsync_Admin_CreatesAssignedTask()
    {
        // Arrange
        var request = CreateValidCreateRequest(2);

        var task = CreateTask(
            50,
            1,
            2);

        _createValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(CreateUser(
                2,
                "Ali",
                "Khan",
                "ali@gmail.com"));

        _taskRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<TaskItem>()))
            .ReturnsAsync(task);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(50))
            .ReturnsAsync(task);

        // Act
        var result =
            await _taskService.CreateAdminTaskAsync(
                request,
                1,
                "Admin");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(50, result.Id);
        Assert.Equal(2, result.AssignedToUserId);

        _taskRepositoryMock.Verify(
            x => x.AddAsync(It.Is<TaskItem>(t =>
                t.CreatedByUserId == 1 &&
                t.AssignedToUserId == 2 &&
                t.Status == EntityTaskStatus.Pending &&
                !t.IsDeleted)),
            Times.Once);
    }

    [Fact]
    public async Task CreateAdminTaskAsync_NonAdmin_ThrowsAuthorizationException()
    {
        // Arrange
        var request = CreateValidCreateRequest(2);

        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.CreateAdminTaskAsync(
                request,
                1,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    [Fact]
    public async Task CreateAdminTaskAsync_InvalidRequest_ThrowsValidationException()
    {
        // Arrange
        var request = CreateValidCreateRequest(2);

        _createValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(
                InvalidValidationResult(
                    "Title",
                    "Title is required."));

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _taskService.CreateAdminTaskAsync(
                request,
                1,
                "Admin"));

        _taskRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    [Fact]
    public async Task CreateAdminTaskAsync_WithoutAssignment_ThrowsValidationException()
    {
        // Arrange
        var request = CreateValidCreateRequest();

        _createValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _taskService.CreateAdminTaskAsync(
                request,
                1,
                "Admin"));

        _taskRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    // ============================================================
    // ADMIN UPDATE
    // ============================================================

    [Fact]
    public async Task UpdateAdminTaskAsync_Admin_UpdatesTask()
    {
        // Arrange
        var request = CreateValidUpdateRequest(2);

        var task = CreateTask(
            1,
            1,
            2);

        _updateValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // IMPORTANT:
        // UpdateAdminTaskAsync validates the assigned user.
        // The request assigns the task to user ID 2,
        // therefore the mock must return an existing user.
        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(
                CreateUser(
                    2,
                    "Ali",
                    "Khan",
                    "ali@gmail.com"));

        _taskRepositoryMock
            .Setup(x => x.UpdateAsync(It.IsAny<TaskItem>()))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _taskService.UpdateAdminTaskAsync(
                1,
                request,
                1,
                "Admin");

        // Assert
        Assert.NotNull(result);

        _taskRepositoryMock.Verify(
            x => x.UpdateAsync(It.Is<TaskItem>(t =>
                t.Id == 1 &&
                t.Title == "Updated Task" &&
                t.Description == "Updated Description" &&
                t.Category == "Testing" &&
                t.AssignedToUserId == 2)),
            Times.Once);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(2),
            Times.Once);
    }

    [Fact]
    public async Task UpdateAdminTaskAsync_WithoutAssignment_ThrowsValidationException()
    {
        // Arrange
        var request = CreateValidUpdateRequest();

        _updateValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(
                CreateTask(
                    1,
                    1,
                    2));

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _taskService.UpdateAdminTaskAsync(
                1,
                request,
                1,
                "Admin"));

        _taskRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<TaskItem>()),
            Times.Never);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateAdminTaskAsync_NonExistingTask_ThrowsNotFoundException()
    {
        // Arrange
        var request = CreateValidUpdateRequest(2);

        _updateValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((TaskItem?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _taskService.UpdateAdminTaskAsync(
                999,
                request,
                1,
                "Admin"));

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // ADMIN CHANGE STATUS
    // ============================================================

    [Fact]
    public async Task ChangeAdminTaskStatusAsync_Admin_ChangesStatus()
    {
        // Arrange
        var request = CreateValidStatusRequest();

        var task = CreateTask(
            1,
            1,
            2,
            EntityTaskStatus.Pending);

        _statusValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ValidValidationResult());

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act
        var result =
            await _taskService.ChangeAdminTaskStatusAsync(
                1,
                request,
                1,
                "Admin");

        // Assert
        Assert.Equal("Completed", result.Status);

        _taskRepositoryMock.Verify(
            x => x.UpdateAsync(It.Is<TaskItem>(t =>
                t.Status == EntityTaskStatus.Completed)),
            Times.Once);
    }

    [Fact]
    public async Task ChangeAdminTaskStatusAsync_NonAdmin_ThrowsAuthorizationException()
    {
        // Arrange
        var request = CreateValidStatusRequest();

        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.ChangeAdminTaskStatusAsync(
                1,
                request,
                1,
                "User"));

        _statusValidatorMock.Verify(
            x => x.ValidateAsync(
                It.IsAny<UpdateTaskStatusRequest>(),
                It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangeAdminTaskStatusAsync_InvalidRequest_ThrowsValidationException()
    {
        // Arrange
        var request = new UpdateTaskStatusRequest
        {
            Status = 999
        };

        _statusValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(
                InvalidValidationResult(
                    "Status",
                    "Invalid status."));

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _taskService.ChangeAdminTaskStatusAsync(
                1,
                request,
                1,
                "Admin"));

        _taskRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // ADMIN CHANGE DUE DATE
    // ============================================================

    [Fact]
    public async Task ChangeAdminTaskDueDateAsync_Admin_ChangesDueDate()
    {
        // Arrange
        var task = CreateTask(
            1,
            1,
            2);

        var newDueDate =
            DateTime.UtcNow.AddDays(15);

        var request = new UpdateTaskDueDateRequest
        {
            DueDate = newDueDate
        };

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act
        var result =
            await _taskService.ChangeAdminTaskDueDateAsync(
                1,
                request,
                1,
                "Admin");

        // Assert
        Assert.Equal(newDueDate, result.DueDate);

        _taskRepositoryMock.Verify(
            x => x.UpdateAsync(It.Is<TaskItem>(t =>
                t.DueDate == newDueDate)),
            Times.Once);
    }

    [Fact]
    public async Task ChangeAdminTaskDueDateAsync_NonAdmin_ThrowsAuthorizationException()
    {
        // Arrange
        var request = new UpdateTaskDueDateRequest
        {
            DueDate = DateTime.UtcNow.AddDays(5)
        };

        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.ChangeAdminTaskDueDateAsync(
                1,
                request,
                1,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangeAdminTaskDueDateAsync_TaskDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        var request = new UpdateTaskDueDateRequest
        {
            DueDate = DateTime.UtcNow.AddDays(5)
        };

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((TaskItem?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _taskService.ChangeAdminTaskDueDateAsync(
                999,
                request,
                1,
                "Admin"));
    }

    // ============================================================
    // ADMIN CHANGE PRIORITY
    // ============================================================

    [Fact]
    public async Task ChangeAdminTaskPriorityAsync_Admin_ChangesPriority()
    {
        // Arrange
        var priorities =
            Enum.GetValues<TaskPriority>();

        var newPriority =
            priorities.Last();

        var request = new UpdateTaskPriorityRequest
        {
            Priority = (int)newPriority
        };

        var task = CreateTask(
            1,
            1,
            2);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act
        var result =
            await _taskService.ChangeAdminTaskPriorityAsync(
                1,
                request,
                1,
                "Admin");

        // Assert
        Assert.Equal(
            newPriority.ToString(),
            result.Priority);

        _taskRepositoryMock.Verify(
            x => x.UpdateAsync(It.Is<TaskItem>(t =>
                t.Priority == newPriority)),
            Times.Once);
    }

    [Fact]
    public async Task ChangeAdminTaskPriorityAsync_InvalidPriority_ThrowsValidationException()
    {
        // Arrange
        var request = new UpdateTaskPriorityRequest
        {
            Priority = -999
        };

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _taskService.ChangeAdminTaskPriorityAsync(
                1,
                request,
                1,
                "Admin"));

        _taskRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangeAdminTaskPriorityAsync_NonAdmin_ThrowsAuthorizationException()
    {
        // Arrange
        var request = new UpdateTaskPriorityRequest
        {
            Priority =
                (int)Enum.GetValues<TaskPriority>().First()
        };

        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.ChangeAdminTaskPriorityAsync(
                1,
                request,
                1,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // ADMIN DELETE
    // ============================================================

    [Fact]
    public async Task DeleteAdminTaskAsync_Admin_DeletesTask()
    {
        // Arrange
        var task = CreateTask(
            1,
            1,
            2);

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(task);

        // Act
        await _taskService.DeleteAdminTaskAsync(
            1,
            1,
            "Admin");

        // Assert
        _taskRepositoryMock.Verify(
            x => x.DeleteAsync(task),
            Times.Once);
    }

    [Fact]
    public async Task DeleteAdminTaskAsync_NonAdmin_ThrowsAuthorizationException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<AuthorizationException>(
            () => _taskService.DeleteAdminTaskAsync(
                1,
                1,
                "User"));

        _taskRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);

        _taskRepositoryMock.Verify(
            x => x.DeleteAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteAdminTaskAsync_TaskDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((TaskItem?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _taskService.DeleteAdminTaskAsync(
                999,
                1,
                "Admin"));

        _taskRepositoryMock.Verify(
            x => x.DeleteAsync(It.IsAny<TaskItem>()),
            Times.Never);
    }

    // ============================================================
    // RESPONSE MAPPING
    // ============================================================

    [Fact]
    public async Task GetTaskByIdAsync_MapsTaskToResponseCorrectly()
    {
        // Arrange
        var createdAt =
            DateTime.UtcNow.AddDays(-5);

        var updatedAt =
            DateTime.UtcNow.AddDays(-1);

        var dueDate =
            DateTime.UtcNow.AddDays(5);

        var creator = CreateUser(
            1,
            "Faizal",
            "Hassan",
            "faizal@gmail.com");

        var assignedUser = CreateUser(
            2,
            "Ali",
            "Khan",
            "ali@gmail.com");

        var task = new TaskItem
        {
            Id = 100,
            Title = "Mapped Task",
            Description = "Mapped Description",
            Category = "Testing",
            Priority = Enum.GetValues<TaskPriority>().First(),
            Status = EntityTaskStatus.InProgress,
            DueDate = dueDate,
            CreatedAt = createdAt,
            UpdatedAt = updatedAt,
            IsDeleted = false,
            CreatedByUserId = 1,
            CreatedByUser = creator,
            AssignedToUserId = 2,
            AssignedToUser = assignedUser
        };

        _taskRepositoryMock
            .Setup(x => x.GetByIdAsync(100))
            .ReturnsAsync(task);

        // Act
        var result =
            await _taskService.GetTaskByIdAsync(
                100,
                1,
                "User");

        // Assert
        Assert.Equal(100, result.Id);
        Assert.Equal("Mapped Task", result.Title);
        Assert.Equal("Mapped Description", result.Description);
        Assert.Equal("Testing", result.Category);
        Assert.Equal(
            task.Priority.ToString(),
            result.Priority);
        Assert.Equal("InProgress", result.Status);
        Assert.Equal(dueDate, result.DueDate);
        Assert.Equal(createdAt, result.CreatedAt);
        Assert.Equal(updatedAt, result.UpdatedAt);
        Assert.Equal(1, result.CreatedByUserId);
        Assert.Equal("Faizal Hassan", result.CreatedByName);
        Assert.Equal(2, result.AssignedToUserId);
        Assert.Equal("Ali Khan", result.AssignedToName);
    }

    // ============================================================
    // ADMIN ROLE CASE-INSENSITIVITY
    // ============================================================

    [Fact]
    public async Task GetAdminTaskStatisticsAsync_AdminRoleIsCaseInsensitive()
    {
        // Arrange
        _taskRepositoryMock
            .Setup(x => x.GetStatisticsAsync())
            .ReturnsAsync(
                (
                    Pending: 1,
                    InProgress: 2,
                    Completed: 3,
                    Cancelled: 4,
                    Overdue: 5
                ));

        // Act
        var result =
            await _taskService.GetAdminTaskStatisticsAsync(
                1,
                "admin");

        // Assert
        Assert.Equal(1, result.Pending);
        Assert.Equal(2, result.InProgress);
        Assert.Equal(3, result.Completed);
        Assert.Equal(4, result.Cancelled);
        Assert.Equal(5, result.Overdue);
    }
}