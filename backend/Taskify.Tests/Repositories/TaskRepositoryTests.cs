using Microsoft.EntityFrameworkCore;
using Taskify.Repository.Context;
using Taskify.Repository.Entities;
using Taskify.Repository.Repositories;
using Xunit;

namespace Taskify.Tests.Repositories;

public class TaskRepositoryTests
{
    // ============================================================
    // HELPERS
    // ============================================================

    private static TaskifyDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<TaskifyDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new TaskifyDbContext(options);
    }

    private static User CreateUser(
        int id,
        string firstName = "Faizal",
        string lastName = "Hassan",
        string email = "faizal@gmail.com",
        UserRole role = UserRole.User,
        bool isActive = true,
        bool isDeleted = false)
    {
        return new User
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PasswordHash = "hashed-password",
            Role = role,
            IsActive = isActive,
            IsDeleted = isDeleted,
            CreatedAt = DateTime.UtcNow.AddDays(-30)
        };
    }

    private static TaskItem CreateTask(
        int id,
        string title,
        int createdByUserId,
        int? assignedToUserId = null,
        Taskify.Repository.Entities.TaskStatus status = Taskify.Repository.Entities.TaskStatus.Pending,
        bool isDeleted = false,
        DateTime? createdAt = null,
        DateTime? dueDate = null)
    {
        return new TaskItem
        {
            Id = id,
            Title = title,
            Description = $"Description for {title}",
            Category = "Development",
            Priority = TaskPriority.Medium,
            Status = status,
            DueDate = dueDate,
            CreatedAt = createdAt ?? DateTime.UtcNow,
            UpdatedAt = null,
            IsDeleted = isDeleted,
            CreatedByUserId = createdByUserId,
            AssignedToUserId = assignedToUserId
        };
    }

    private static async Task SeedUsersAsync(
        TaskifyDbContext context)
    {
        var admin = CreateUser(
            id: 1,
            firstName: "Admin",
            lastName: "User",
            email: "admin@gmail.com",
            role: UserRole.Admin);

        var user1 = CreateUser(
            id: 2,
            firstName: "Faizal",
            lastName: "Hassan",
            email: "faizal@gmail.com");

        var user2 = CreateUser(
            id: 3,
            firstName: "Ali",
            lastName: "Khan",
            email: "ali@gmail.com");

        var inactiveUser = CreateUser(
            id: 4,
            firstName: "Inactive",
            lastName: "User",
            email: "inactive@gmail.com",
            isActive: false);

        context.Users.AddRange(
            admin,
            user1,
            user2,
            inactiveUser);

        await context.SaveChangesAsync();
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    [Fact]
    public async Task GetByIdAsync_ExistingTask_ReturnsTask()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var task = CreateTask(
            id: 1,
            title: "Test Task",
            createdByUserId: 1,
            assignedToUserId: 2);

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("Test Task", result.Title);
        Assert.Equal(1, result.CreatedByUserId);
        Assert.Equal(2, result.AssignedToUserId);

        Assert.NotNull(result.CreatedByUser);
        Assert.NotNull(result.AssignedToUser);

        Assert.Equal(
            "Admin",
            result.CreatedByUser!.FirstName);

        Assert.Equal(
            "Faizal",
            result.AssignedToUser!.FirstName);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingTask_ReturnsNull()
    {
        // Arrange
        await using var context = CreateContext();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdAsync_DeletedTask_ReturnsNull()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.Add(
            CreateTask(
                id: 1,
                title: "Deleted Task",
                createdByUserId: 1,
                isDeleted: true));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetByIdAsync(1);

        // Assert
        Assert.Null(result);
    }

    // ============================================================
    // GET ALL
    // ============================================================

    [Fact]
    public async Task GetAllAsync_ReturnsOnlyNonDeletedTasks()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.AddRange(
            CreateTask(
                id: 1,
                title: "Active Task",
                createdByUserId: 1,
                isDeleted: false),

            CreateTask(
                id: 2,
                title: "Deleted Task",
                createdByUserId: 1,
                isDeleted: true));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetAllAsync();

        // Assert
        Assert.Single(result);
        Assert.Equal("Active Task", result[0].Title);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsTasksOrderedByCreatedAtDescending()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var olderTask = CreateTask(
            id: 1,
            title: "Older Task",
            createdByUserId: 1,
            createdAt: DateTime.UtcNow.AddDays(-2));

        var newerTask = CreateTask(
            id: 2,
            title: "Newer Task",
            createdByUserId: 1,
            createdAt: DateTime.UtcNow.AddDays(-1));

        context.Tasks.AddRange(
            olderTask,
            newerTask);

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal(
            "Newer Task",
            result[0].Title);

        Assert.Equal(
            "Older Task",
            result[1].Title);
    }

    // ============================================================
    // GET BY CREATOR
    // ============================================================

    [Fact]
    public async Task GetByCreatorIdAsync_ReturnsTasksCreatedByUser()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.AddRange(
            CreateTask(
                id: 1,
                title: "User 1 Task",
                createdByUserId: 2),

            CreateTask(
                id: 2,
                title: "Admin Task",
                createdByUserId: 1),

            CreateTask(
                id: 3,
                title: "Another User 1 Task",
                createdByUserId: 2));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetByCreatorIdAsync(2);

        // Assert
        Assert.Equal(2, result.Count);

        Assert.All(
            result,
            task => Assert.Equal(
                2,
                task.CreatedByUserId));
    }

    [Fact]
    public async Task GetByCreatorIdAsync_ExcludesDeletedTasks()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.AddRange(
            CreateTask(
                id: 1,
                title: "Active Task",
                createdByUserId: 2),

            CreateTask(
                id: 2,
                title: "Deleted Task",
                createdByUserId: 2,
                isDeleted: true));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetByCreatorIdAsync(2);

        // Assert
        Assert.Single(result);
        Assert.Equal(
            "Active Task",
            result[0].Title);
    }

    // ============================================================
    // ADMIN ASSIGNED TASKS
    // ============================================================

    [Fact]
    public async Task GetAdminAssignedTasksForUserAsync_ReturnsAdminCreatedTasksAssignedToUser()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.AddRange(
            CreateTask(
                id: 1,
                title: "Admin Assigned Task",
                createdByUserId: 1,
                assignedToUserId: 2),

            CreateTask(
                id: 2,
                title: "User Created Task",
                createdByUserId: 2,
                assignedToUserId: 2),

            CreateTask(
                id: 3,
                title: "Admin Task Assigned Elsewhere",
                createdByUserId: 1,
                assignedToUserId: 3));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetAdminAssignedTasksForUserAsync(2);

        // Assert
        Assert.Single(result);

        Assert.Equal(
            "Admin Assigned Task",
            result[0].Title);

        Assert.Equal(
            UserRole.Admin,
            result[0].CreatedByUser!.Role);
    }

    [Fact]
    public async Task GetAdminAssignedTasksForUserAsync_ExcludesDeletedTasks()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.AddRange(
            CreateTask(
                id: 1,
                title: "Active Admin Task",
                createdByUserId: 1,
                assignedToUserId: 2),

            CreateTask(
                id: 2,
                title: "Deleted Admin Task",
                createdByUserId: 1,
                assignedToUserId: 2,
                isDeleted: true));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetAdminAssignedTasksForUserAsync(2);

        // Assert
        Assert.Single(result);
        Assert.Equal(
            "Active Admin Task",
            result[0].Title);
    }

    // ============================================================
    // GET BY ASSIGNED USER
    // ============================================================

    [Fact]
    public async Task GetByAssignedUserIdAsync_ReturnsAssignedTasks()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.AddRange(
            CreateTask(
                id: 1,
                title: "Assigned Task 1",
                createdByUserId: 1,
                assignedToUserId: 2),

            CreateTask(
                id: 2,
                title: "Assigned Task 2",
                createdByUserId: 2,
                assignedToUserId: 2),

            CreateTask(
                id: 3,
                title: "Other User Task",
                createdByUserId: 1,
                assignedToUserId: 3));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetByAssignedUserIdAsync(2);

        // Assert
        Assert.Equal(2, result.Count);

        Assert.All(
            result,
            task => Assert.Equal(
                2,
                task.AssignedToUserId));
    }

    [Fact]
    public async Task GetByAssignedUserIdAsync_ExcludesDeletedTasks()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.AddRange(
            CreateTask(
                id: 1,
                title: "Active Assigned Task",
                createdByUserId: 1,
                assignedToUserId: 2),

            CreateTask(
                id: 2,
                title: "Deleted Assigned Task",
                createdByUserId: 1,
                assignedToUserId: 2,
                isDeleted: true));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetByAssignedUserIdAsync(2);

        // Assert
        Assert.Single(result);
        Assert.Equal(
            "Active Assigned Task",
            result[0].Title);
    }

    // ============================================================
    // PAGINATION
    // ============================================================

    [Fact]
    public async Task GetPagedAsync_ReturnsCorrectPageAndTotalCount()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        for (var i = 1; i <= 5; i++)
        {
            context.Tasks.Add(
                CreateTask(
                    id: i,
                    title: $"Task {i}",
                    createdByUserId: 1,
                    createdAt: DateTime.UtcNow.AddMinutes(i)));
        }

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetPagedAsync(
                pageNumber: 2,
                pageSize: 2);

        // Assert
        Assert.Equal(5, result.TotalCount);
        Assert.Equal(2, result.Items.Count);

        Assert.Equal(
            "Task 3",
            result.Items[0].Title);

        Assert.Equal(
            "Task 2",
            result.Items[1].Title);
    }

    [Fact]
    public async Task GetPagedAsync_ExcludesDeletedTasksFromTotalAndItems()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.AddRange(
            CreateTask(
                id: 1,
                title: "Task 1",
                createdByUserId: 1,
                createdAt: DateTime.UtcNow.AddMinutes(1)),

            CreateTask(
                id: 2,
                title: "Deleted Task",
                createdByUserId: 1,
                isDeleted: true,
                createdAt: DateTime.UtcNow.AddMinutes(2)),

            CreateTask(
                id: 3,
                title: "Task 3",
                createdByUserId: 1,
                createdAt: DateTime.UtcNow.AddMinutes(3)));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetPagedAsync(
                pageNumber: 1,
                pageSize: 10);

        // Assert
        Assert.Equal(2, result.TotalCount);
        Assert.Equal(2, result.Items.Count);

        Assert.DoesNotContain(
            result.Items,
            task => task.IsDeleted);
    }

    // ============================================================
    // STATISTICS
    // ============================================================

    [Fact]
    public async Task GetStatisticsAsync_ReturnsCorrectTaskCounts()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.AddRange(
            CreateTask(
                id: 1,
                title: "Pending Task",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.Pending),

            CreateTask(
                id: 2,
                title: "In Progress Task",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.InProgress),

            CreateTask(
                id: 3,
                title: "Completed Task",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.Completed),

            CreateTask(
                id: 4,
                title: "Cancelled Task",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.Cancelled));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetStatisticsAsync();

        // Assert
        Assert.Equal(1, result.Pending);
        Assert.Equal(1, result.InProgress);
        Assert.Equal(1, result.Completed);
        Assert.Equal(1, result.Cancelled);
        Assert.Equal(0, result.Overdue);
    }

    [Fact]
    public async Task GetStatisticsAsync_CountsOverduePendingTask()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.Add(
            CreateTask(
                id: 1,
                title: "Overdue Pending Task",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.Pending,
                dueDate: DateTime.UtcNow.AddDays(-1)));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetStatisticsAsync();

        // Assert
        Assert.Equal(1, result.Pending);
        Assert.Equal(1, result.Overdue);
    }

    [Fact]
    public async Task GetStatisticsAsync_CountsOverdueInProgressTask()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.Add(
            CreateTask(
                id: 1,
                title: "Overdue In Progress Task",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.InProgress,
                dueDate: DateTime.UtcNow.AddDays(-1)));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetStatisticsAsync();

        // Assert
        Assert.Equal(1, result.InProgress);
        Assert.Equal(1, result.Overdue);
    }

    [Fact]
    public async Task GetStatisticsAsync_DoesNotCountCompletedTaskAsOverdue()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.Add(
            CreateTask(
                id: 1,
                title: "Completed Overdue Task",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.Completed,
                dueDate: DateTime.UtcNow.AddDays(-1)));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetStatisticsAsync();

        // Assert
        Assert.Equal(1, result.Completed);
        Assert.Equal(0, result.Overdue);
    }

    [Fact]
    public async Task GetStatisticsAsync_DoesNotCountCancelledTaskAsOverdue()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.Add(
            CreateTask(
                id: 1,
                title: "Cancelled Overdue Task",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.Cancelled,
                dueDate: DateTime.UtcNow.AddDays(-1)));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetStatisticsAsync();

        // Assert
        Assert.Equal(1, result.Cancelled);
        Assert.Equal(0, result.Overdue);
    }

    [Fact]
    public async Task GetStatisticsAsync_DoesNotCountFutureDueTaskAsOverdue()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.Add(
            CreateTask(
                id: 1,
                title: "Future Task",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.Pending,
                dueDate: DateTime.UtcNow.AddDays(1)));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetStatisticsAsync();

        // Assert
        Assert.Equal(1, result.Pending);
        Assert.Equal(0, result.Overdue);
    }

    [Fact]
    public async Task GetStatisticsAsync_ExcludesDeletedTasks()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        context.Tasks.AddRange(
            CreateTask(
                id: 1,
                title: "Active Pending",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.Pending),

            CreateTask(
                id: 2,
                title: "Deleted Pending",
                createdByUserId: 1,
                status: Taskify.Repository.Entities.TaskStatus.Pending,
                isDeleted: true));

        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetStatisticsAsync();

        // Assert
        Assert.Equal(1, result.Pending);
    }

    // ============================================================
    // USERS FOR ASSIGNMENT
    // ============================================================

    [Fact]
    public async Task GetUsersForAssignmentAsync_ReturnsOnlyActiveUsers()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetUsersForAssignmentAsync();

        // Assert
        Assert.Equal(3, result.Count);

        Assert.DoesNotContain(
            result,
            user => user.Id == 4);
    }

    [Fact]
    public async Task GetUsersForAssignmentAsync_ReturnsUsersOrderedByName()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetUsersForAssignmentAsync();

        // Assert
        Assert.Equal(
            "Admin",
            result[0].FirstName);

        Assert.Equal(
            "Ali",
            result[1].FirstName);

        Assert.Equal(
            "Faizal",
            result[2].FirstName);
    }

    [Fact]
    public async Task GetUsersForAssignmentAsync_ReturnsOnlyRequiredUserFields()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetUsersForAssignmentAsync();

        // Assert
        var user = result[0];

        Assert.NotEqual(0, user.Id);
        Assert.False(string.IsNullOrWhiteSpace(user.FirstName));
        Assert.False(string.IsNullOrWhiteSpace(user.LastName));
        Assert.False(string.IsNullOrWhiteSpace(user.Email));

        Assert.Equal(
            string.Empty,
            user.PasswordHash);
    }

    // ============================================================
    // ADD
    // ============================================================

    [Fact]
    public async Task AddAsync_AddsTaskToDatabase()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var repository = new TaskRepository(context);

        var task = CreateTask(
            id: 1,
            title: "New Task",
            createdByUserId: 1);

        // Act
        var result =
            await repository.AddAsync(task);

        // Assert
        Assert.Same(task, result);

        var savedTask =
            await context.Tasks
                .FirstOrDefaultAsync(x => x.Id == 1);

        Assert.NotNull(savedTask);
        Assert.Equal(
            "New Task",
            savedTask.Title);
    }

    [Fact]
    public async Task AddAsync_PreservesTaskProperties()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var repository = new TaskRepository(context);

        var task = CreateTask(
            id: 1,
            title: "Important Task",
            createdByUserId: 1,
            assignedToUserId: 2,
            status: Taskify.Repository.Entities.TaskStatus.InProgress);

        // Act
        var result =
            await repository.AddAsync(task);

        // Assert
        Assert.Equal(
            "Important Task",
            result.Title);

        Assert.Equal(
            1,
            result.CreatedByUserId);

        Assert.Equal(
            2,
            result.AssignedToUserId);

        Assert.Equal(
            Taskify.Repository.Entities.TaskStatus.InProgress,
            result.Status);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    [Fact]
    public async Task UpdateAsync_UpdatesExistingTask()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var task = CreateTask(
            id: 1,
            title: "Original Title",
            createdByUserId: 1);

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        task.Title = "Updated Title";
        task.Status = Taskify.Repository.Entities.TaskStatus.Completed;

        // Act
        await repository.UpdateAsync(task);

        // Assert
        var updatedTask =
            await context.Tasks
                .AsNoTracking()
                .FirstAsync(x => x.Id == 1);

        Assert.Equal(
            "Updated Title",
            updatedTask.Title);

        Assert.Equal(
            Taskify.Repository.Entities.TaskStatus.Completed,
            updatedTask.Status);
    }

    // ============================================================
    // SOFT DELETE
    // ============================================================

    [Fact]
    public async Task DeleteAsync_SoftDeletesTask()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var task = CreateTask(
            id: 1,
            title: "Task To Delete",
            createdByUserId: 1);

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        await repository.DeleteAsync(task);

        // Assert
        var deletedTask =
            await context.Tasks
                .AsNoTracking()
                .FirstAsync(x => x.Id == 1);

        Assert.True(deletedTask.IsDeleted);
        Assert.NotNull(deletedTask.UpdatedAt);
    }

    [Fact]
    public async Task DeleteAsync_DoesNotPhysicallyRemoveTask()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var task = CreateTask(
            id: 1,
            title: "Task To Delete",
            createdByUserId: 1);

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        await repository.DeleteAsync(task);

        // Assert
        var taskStillExists =
            await context.Tasks
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(x => x.Id == 1);

        Assert.NotNull(taskStillExists);
        Assert.True(taskStillExists.IsDeleted);
    }

    // ============================================================
    // EMPTY DATABASE
    // ============================================================

    [Fact]
    public async Task GetAllAsync_EmptyDatabase_ReturnsEmptyList()
    {
        // Arrange
        await using var context = CreateContext();

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetAllAsync();

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetByCreatorIdAsync_NoMatchingTasks_ReturnsEmptyList()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetByCreatorIdAsync(999);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetByAssignedUserIdAsync_NoMatchingTasks_ReturnsEmptyList()
    {
        // Arrange
        await using var context = CreateContext();

        await SeedUsersAsync(context);

        var repository = new TaskRepository(context);

        // Act
        var result =
            await repository.GetByAssignedUserIdAsync(999);

        // Assert
        Assert.Empty(result);
    }
}