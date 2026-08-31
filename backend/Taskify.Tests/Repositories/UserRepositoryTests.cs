using Microsoft.EntityFrameworkCore;
using Taskify.Repository.Context;
using Taskify.Repository.Entities;
using Taskify.Repository.Repositories;
using Xunit;

namespace Taskify.Tests.Repositories;

public class UserRepositoryTests
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
        int id = 1,
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
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            UpdatedAt = null,
            LastLoginAt = DateTime.UtcNow.AddDays(-1)
        };
    }

    private static TaskItem CreateTask(
        int id,
        int createdByUserId,
        int? assignedToUserId = null,
        bool isDeleted = false)
    {
        return new TaskItem
        {
            Id = id,
            Title = $"Test Task {id}",
            Description = "Test task description",
            Category = "Development",
            Priority = TaskPriority.Medium,
            Status = Taskify.Repository.Entities.TaskStatus.Pending,
            DueDate = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null,
            IsDeleted = isDeleted,
            CreatedByUserId = createdByUserId,
            AssignedToUserId = assignedToUserId
        };
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    [Fact]
    public async Task GetByIdAsync_ExistingUser_ReturnsUser()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(
            id: 1,
            firstName: "Faizal",
            lastName: "Hassan");

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result = await repository.GetByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("Faizal", result.FirstName);
        Assert.Equal("Hassan", result.LastName);
        Assert.Equal("faizal@gmail.com", result.Email);
    }

    [Fact]
    public async Task GetByIdAsync_UserDoesNotExist_ReturnsNull()
    {
        // Arrange
        await using var context = CreateContext();

        var repository = new UserRepository(context);

        // Act
        var result = await repository.GetByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdAsync_DeletedUser_ReturnsDeletedUser()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(
            id: 1,
            isDeleted: true);

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result = await repository.GetByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.IsDeleted);
    }

    // ============================================================
    // GET BY EMAIL
    // ============================================================

    [Fact]
    public async Task GetByEmailAsync_ExistingEmail_ReturnsUser()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(
            id: 1,
            email: "faizal@gmail.com");

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetByEmailAsync("faizal@gmail.com");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("faizal@gmail.com", result.Email);
    }

    [Fact]
    public async Task GetByEmailAsync_EmailDoesNotExist_ReturnsNull()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(
            id: 1,
            email: "faizal@gmail.com");

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetByEmailAsync("unknown@gmail.com");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetByEmailAsync_DeletedUser_ReturnsUser()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(
            id: 1,
            email: "deleted@gmail.com",
            isDeleted: true);

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetByEmailAsync("deleted@gmail.com");

        // Assert
        Assert.NotNull(result);
        Assert.True(result.IsDeleted);
    }

    // ============================================================
    // EXISTS BY EMAIL
    // ============================================================

    [Fact]
    public async Task ExistsByEmailAsync_ExistingEmail_ReturnsTrue()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(
            email: "faizal@gmail.com");

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.ExistsByEmailAsync("faizal@gmail.com");

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task ExistsByEmailAsync_NonExistingEmail_ReturnsFalse()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(
            email: "faizal@gmail.com");

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.ExistsByEmailAsync("unknown@gmail.com");

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task ExistsByEmailAsync_DeletedUser_ReturnsTrue()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(
            email: "deleted@gmail.com",
            isDeleted: true);

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.ExistsByEmailAsync("deleted@gmail.com");

        // Assert
        Assert.True(result);
    }

    // ============================================================
    // ADD USER
    // ============================================================

    [Fact]
    public async Task AddAsync_ValidUser_AddsAndReturnsUser()
    {
        // Arrange
        await using var context = CreateContext();

        var repository = new UserRepository(context);

        var user = CreateUser(
            id: 1,
            firstName: "Faizal",
            lastName: "Hassan",
            email: "faizal@gmail.com");

        // Act
        var result = await repository.AddAsync(user);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(user, result);
        Assert.Equal(1, result.Id);

        var savedUser =
            await context.Users.FirstOrDefaultAsync(x => x.Id == 1);

        Assert.NotNull(savedUser);
        Assert.Equal("Faizal", savedUser.FirstName);
        Assert.Equal("Hassan", savedUser.LastName);
        Assert.Equal("faizal@gmail.com", savedUser.Email);
    }

    [Fact]
    public async Task AddAsync_UserIsPersistedToDatabase()
    {
        // Arrange
        await using var context = CreateContext();

        var repository = new UserRepository(context);

        var user = CreateUser(
            id: 10,
            email: "newuser@gmail.com");

        // Act
        await repository.AddAsync(user);

        // Assert
        var count = await context.Users.CountAsync();

        Assert.Equal(1, count);
    }

    // ============================================================
    // UPDATE USER
    // ============================================================

    [Fact]
    public async Task UpdateAsync_ExistingUser_UpdatesUser()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(
            id: 1,
            firstName: "Faizal",
            lastName: "Hassan",
            email: "faizal@gmail.com");

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        user.FirstName = "Ali";
        user.LastName = "Khan";
        user.Email = "ali@gmail.com";
        user.IsActive = false;

        // Act
        await repository.UpdateAsync(user);

        // Assert
        var updatedUser =
            await context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == 1);

        Assert.NotNull(updatedUser);
        Assert.Equal("Ali", updatedUser.FirstName);
        Assert.Equal("Khan", updatedUser.LastName);
        Assert.Equal("ali@gmail.com", updatedUser.Email);
        Assert.False(updatedUser.IsActive);
    }

    [Fact]
    public async Task UpdateAsync_UserCanBeSoftDeleted()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(
            id: 1,
            isDeleted: false);

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        user.IsDeleted = true;
        user.IsActive = false;

        // Act
        await repository.UpdateAsync(user);

        // Assert
        var updatedUser =
            await context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == 1);

        Assert.NotNull(updatedUser);
        Assert.True(updatedUser.IsDeleted);
        Assert.False(updatedUser.IsActive);
    }

    // ============================================================
    // GET ALL ACTIVE USERS
    // ============================================================

    [Fact]
    public async Task GetAllActiveUsersAsync_ReturnsOnlyNonDeletedUsers()
    {
        // Arrange
        await using var context = CreateContext();

        var activeUser = CreateUser(
            id: 1,
            firstName: "Ali",
            lastName: "Khan",
            email: "ali@gmail.com",
            isDeleted: false);

        var deletedUser = CreateUser(
            id: 2,
            firstName: "Bilal",
            lastName: "Ahmed",
            email: "bilal@gmail.com",
            isDeleted: true);

        await context.Users.AddRangeAsync(
            activeUser,
            deletedUser);

        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetAllActiveUsersAsync();

        // Assert
        Assert.Single(result);
        Assert.Equal(1, result[0].Id);
        Assert.False(result[0].IsDeleted);
    }

    [Fact]
    public async Task GetAllActiveUsersAsync_OrdersByFirstNameThenLastName()
    {
        // Arrange
        await using var context = CreateContext();

        var user1 = CreateUser(
            id: 1,
            firstName: "Zain",
            lastName: "Ahmed",
            email: "zain@gmail.com");

        var user2 = CreateUser(
            id: 2,
            firstName: "Ali",
            lastName: "Khan",
            email: "ali@gmail.com");

        var user3 = CreateUser(
            id: 3,
            firstName: "Ali",
            lastName: "Ahmed",
            email: "ali.ahmed@gmail.com");

        await context.Users.AddRangeAsync(
            user1,
            user2,
            user3);

        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetAllActiveUsersAsync();

        // Assert
        Assert.Equal(3, result.Count);

        Assert.Equal(3, result[0].Id);
        Assert.Equal("Ali", result[0].FirstName);
        Assert.Equal("Ahmed", result[0].LastName);

        Assert.Equal(2, result[1].Id);
        Assert.Equal("Ali", result[1].FirstName);
        Assert.Equal("Khan", result[1].LastName);

        Assert.Equal(1, result[2].Id);
        Assert.Equal("Zain", result[2].FirstName);
    }

    [Fact]
    public async Task GetAllActiveUsersAsync_EmptyDatabase_ReturnsEmptyList()
    {
        // Arrange
        await using var context = CreateContext();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetAllActiveUsersAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    // ============================================================
    // GET TASK COUNT
    // ============================================================

    [Fact]
    public async Task GetTaskCountAsync_UserCreatedTask_ReturnsCount()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(id: 1);

        await context.Users.AddAsync(user);

        var task1 = CreateTask(
            id: 1,
            createdByUserId: 1);

        var task2 = CreateTask(
            id: 2,
            createdByUserId: 1);

        await context.Tasks.AddRangeAsync(
            task1,
            task2);

        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetTaskCountAsync(1);

        // Assert
        Assert.Equal(2, result);
    }

    [Fact]
    public async Task GetTaskCountAsync_UserAssignedTask_ReturnsCount()
    {
        // Arrange
        await using var context = CreateContext();

        var creator = CreateUser(id: 1);
        var assignedUser = CreateUser(
            id: 2,
            firstName: "Ali",
            lastName: "Khan",
            email: "ali@gmail.com");

        await context.Users.AddRangeAsync(
            creator,
            assignedUser);

        var task = CreateTask(
            id: 1,
            createdByUserId: 1,
            assignedToUserId: 2);

        await context.Tasks.AddAsync(task);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetTaskCountAsync(2);

        // Assert
        Assert.Equal(1, result);
    }

    [Fact]
    public async Task GetTaskCountAsync_UserCreatedAndAssignedSameTask_CountsOnce()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(id: 1);

        await context.Users.AddAsync(user);

        var task = CreateTask(
            id: 1,
            createdByUserId: 1,
            assignedToUserId: 1);

        await context.Tasks.AddAsync(task);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetTaskCountAsync(1);

        // Assert
        Assert.Equal(1, result);
    }

    [Fact]
    public async Task GetTaskCountAsync_DeletedTask_DoesNotCount()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(id: 1);

        await context.Users.AddAsync(user);

        var activeTask = CreateTask(
            id: 1,
            createdByUserId: 1,
            isDeleted: false);

        var deletedTask = CreateTask(
            id: 2,
            createdByUserId: 1,
            isDeleted: true);

        await context.Tasks.AddRangeAsync(
            activeTask,
            deletedTask);

        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetTaskCountAsync(1);

        // Assert
        Assert.Equal(1, result);
    }

    [Fact]
    public async Task GetTaskCountAsync_UserHasNoTasks_ReturnsZero()
    {
        // Arrange
        await using var context = CreateContext();

        var user = CreateUser(id: 1);

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetTaskCountAsync(1);

        // Assert
        Assert.Equal(0, result);
    }

    [Fact]
    public async Task GetTaskCountAsync_DeletedCreatedTaskAndActiveAssignedTask_CountsOnlyActiveTask()
    {
        // Arrange
        await using var context = CreateContext();

        var user1 = CreateUser(id: 1);
        var user2 = CreateUser(
            id: 2,
            firstName: "Ali",
            lastName: "Khan",
            email: "ali@gmail.com");

        await context.Users.AddRangeAsync(
            user1,
            user2);

        var deletedCreatedTask = CreateTask(
            id: 1,
            createdByUserId: 1,
            assignedToUserId: 2,
            isDeleted: true);

        var activeAssignedTask = CreateTask(
            id: 2,
            createdByUserId: 2,
            assignedToUserId: 1,
            isDeleted: false);

        await context.Tasks.AddRangeAsync(
            deletedCreatedTask,
            activeAssignedTask);

        await context.SaveChangesAsync();

        var repository = new UserRepository(context);

        // Act
        var result =
            await repository.GetTaskCountAsync(1);

        // Assert
        Assert.Equal(1, result);
    }
}