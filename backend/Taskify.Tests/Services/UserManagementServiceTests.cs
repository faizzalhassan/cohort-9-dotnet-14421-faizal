using Moq;
using Taskify.Business.Exceptions;
using Taskify.Business.Services;
using Taskify.Repository.Entities;
using Taskify.Repository.Interfaces;
using Xunit;

namespace Taskify.Tests.Services;

public class UserManagementServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly UserManagementService _userManagementService;

    public UserManagementServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();

        _userManagementService =
            new UserManagementService(
                _userRepositoryMock.Object);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private static User CreateUser(
        int id = 1,
        string firstName = "Faizal",
        string lastName = "Hassan",
        string email = "faizal@gmail.com",
        UserRole role = UserRole.User,
        bool isActive = true,
        bool isDeleted = false,
        DateTime? createdAt = null,
        DateTime? updatedAt = null,
        DateTime? lastLoginAt = null)
    {
        return new User
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Role = role,
            IsActive = isActive,
            IsDeleted = isDeleted,
            CreatedAt = createdAt ?? DateTime.UtcNow.AddDays(-10),
            UpdatedAt = updatedAt,
            LastLoginAt = lastLoginAt
        };
    }

    // ============================================================
    // GET ALL USERS
    // ============================================================

    [Fact]
    public async Task GetAllUsersAsync_ReturnsAllActiveUsersWithTaskCounts()
    {
        // Arrange
        var createdAt1 = DateTime.UtcNow.AddDays(-10);
        var lastLoginAt1 = DateTime.UtcNow.AddDays(-1);

        var createdAt2 = DateTime.UtcNow.AddDays(-20);

        var users = new List<User>
        {
            CreateUser(
                id: 1,
                firstName: "Faizal",
                lastName: "Hassan",
                email: "faizal@gmail.com",
                role: UserRole.User,
                isActive: true,
                isDeleted: false,
                createdAt: createdAt1,
                lastLoginAt: lastLoginAt1),

            CreateUser(
                id: 2,
                firstName: "Ali",
                lastName: "Khan",
                email: "ali@gmail.com",
                role: UserRole.Admin,
                isActive: true,
                isDeleted: false,
                createdAt: createdAt2,
                lastLoginAt: null)
        };

        _userRepositoryMock
            .Setup(x => x.GetAllActiveUsersAsync())
            .ReturnsAsync(users);

        _userRepositoryMock
            .Setup(x => x.GetTaskCountAsync(1))
            .ReturnsAsync(5);

        _userRepositoryMock
            .Setup(x => x.GetTaskCountAsync(2))
            .ReturnsAsync(10);

        // Act
        var result =
            await _userManagementService.GetAllUsersAsync(99);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);

        var firstUser = result[0];

        Assert.Equal(1, firstUser.Id);
        Assert.Equal("Faizal", firstUser.FirstName);
        Assert.Equal("Hassan", firstUser.LastName);
        Assert.Equal("faizal@gmail.com", firstUser.Email);
        Assert.Equal("User", firstUser.Role);
        Assert.True(firstUser.IsActive);
        Assert.Equal(5, firstUser.TaskCount);
        Assert.Equal(createdAt1, firstUser.CreatedAt);
        Assert.Equal(lastLoginAt1, firstUser.LastLoginAt);

        var secondUser = result[1];

        Assert.Equal(2, secondUser.Id);
        Assert.Equal("Ali", secondUser.FirstName);
        Assert.Equal("Khan", secondUser.LastName);
        Assert.Equal("ali@gmail.com", secondUser.Email);
        Assert.Equal("Admin", secondUser.Role);
        Assert.True(secondUser.IsActive);
        Assert.Equal(10, secondUser.TaskCount);
        Assert.Equal(createdAt2, secondUser.CreatedAt);
        Assert.Null(secondUser.LastLoginAt);

        _userRepositoryMock.Verify(
            x => x.GetAllActiveUsersAsync(),
            Times.Once);

        _userRepositoryMock.Verify(
            x => x.GetTaskCountAsync(1),
            Times.Once);

        _userRepositoryMock.Verify(
            x => x.GetTaskCountAsync(2),
            Times.Once);
    }

    [Fact]
    public async Task GetAllUsersAsync_NoUsers_ReturnsEmptyList()
    {
        // Arrange
        _userRepositoryMock
            .Setup(x => x.GetAllActiveUsersAsync())
            .ReturnsAsync(new List<User>());

        // Act
        var result =
            await _userManagementService.GetAllUsersAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);

        _userRepositoryMock.Verify(
            x => x.GetAllActiveUsersAsync(),
            Times.Once);

        _userRepositoryMock.Verify(
            x => x.GetTaskCountAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task GetAllUsersAsync_MapsRoleCorrectly()
    {
        // Arrange
        var admin = CreateUser(
            id: 1,
            role: UserRole.Admin);

        var user = CreateUser(
            id: 2,
            role: UserRole.User);

        _userRepositoryMock
            .Setup(x => x.GetAllActiveUsersAsync())
            .ReturnsAsync(
                new List<User>
                {
                    admin,
                    user
                });

        _userRepositoryMock
            .Setup(x => x.GetTaskCountAsync(1))
            .ReturnsAsync(3);

        _userRepositoryMock
            .Setup(x => x.GetTaskCountAsync(2))
            .ReturnsAsync(7);

        // Act
        var result =
            await _userManagementService.GetAllUsersAsync(99);

        // Assert
        Assert.Equal("Admin", result[0].Role);
        Assert.Equal("User", result[1].Role);
    }

    [Fact]
    public async Task GetAllUsersAsync_MapsInactiveUserReturnedByRepository()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isActive: false);

        _userRepositoryMock
            .Setup(x => x.GetAllActiveUsersAsync())
            .ReturnsAsync(
                new List<User>
                {
                    user
                });

        _userRepositoryMock
            .Setup(x => x.GetTaskCountAsync(1))
            .ReturnsAsync(2);

        // Act
        var result =
            await _userManagementService.GetAllUsersAsync(99);

        // Assert
        Assert.Single(result);
        Assert.False(result[0].IsActive);
        Assert.Equal(2, result[0].TaskCount);
    }

    // ============================================================
    // ACTIVATE USER
    // ============================================================

    [Fact]
    public async Task ActivateUserAsync_ValidUser_ActivatesUser()
    {
        // Arrange
        var user = CreateUser(
            id: 2,
            isActive: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(user);

        // Act
        await _userManagementService.ActivateUserAsync(
            2,
            1);

        // Assert
        Assert.True(user.IsActive);
        Assert.NotNull(user.UpdatedAt);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(2),
            Times.Once);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task ActivateUserAsync_AlreadyActiveUser_RemainsActive()
    {
        // Arrange
        var user = CreateUser(
            id: 2,
            isActive: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(user);

        // Act
        await _userManagementService.ActivateUserAsync(
            2,
            1);

        // Assert
        Assert.True(user.IsActive);
        Assert.NotNull(user.UpdatedAt);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task ActivateUserAsync_UserDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _userManagementService.ActivateUserAsync(
                999,
                1));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task ActivateUserAsync_DeletedUser_ThrowsNotFoundException()
    {
        // Arrange
        var deletedUser = CreateUser(
            id: 2,
            isActive: false,
            isDeleted: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(deletedUser);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _userManagementService.ActivateUserAsync(
                2,
                1));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task ActivateUserAsync_CurrentAdmin_ThrowsConflictException()
    {
        // Arrange
        var admin = CreateUser(
            id: 1,
            role: UserRole.Admin,
            isActive: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(admin);

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<ConflictException>(
                () => _userManagementService.ActivateUserAsync(
                    1,
                    1));

        Assert.Equal(
            "You cannot change the status of your own account.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    // ============================================================
    // DEACTIVATE USER
    // ============================================================

    [Fact]
    public async Task DeactivateUserAsync_ValidUser_DeactivatesUser()
    {
        // Arrange
        var user = CreateUser(
            id: 2,
            isActive: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(user);

        // Act
        await _userManagementService.DeactivateUserAsync(
            2,
            1);

        // Assert
        Assert.False(user.IsActive);
        Assert.NotNull(user.UpdatedAt);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(2),
            Times.Once);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task DeactivateUserAsync_AlreadyInactiveUser_RemainsInactive()
    {
        // Arrange
        var user = CreateUser(
            id: 2,
            isActive: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(user);

        // Act
        await _userManagementService.DeactivateUserAsync(
            2,
            1);

        // Assert
        Assert.False(user.IsActive);
        Assert.NotNull(user.UpdatedAt);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task DeactivateUserAsync_UserDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _userManagementService.DeactivateUserAsync(
                999,
                1));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task DeactivateUserAsync_DeletedUser_ThrowsNotFoundException()
    {
        // Arrange
        var deletedUser = CreateUser(
            id: 2,
            isActive: true,
            isDeleted: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(deletedUser);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _userManagementService.DeactivateUserAsync(
                2,
                1));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task DeactivateUserAsync_CurrentAdmin_ThrowsConflictException()
    {
        // Arrange
        var admin = CreateUser(
            id: 1,
            role: UserRole.Admin,
            isActive: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(admin);

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<ConflictException>(
                () => _userManagementService.DeactivateUserAsync(
                    1,
                    1));

        Assert.Equal(
            "You cannot deactivate your own account.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    // ============================================================
    // DELETE USER
    // ============================================================

    [Fact]
    public async Task DeleteUserAsync_ValidUser_SoftDeletesUser()
    {
        // Arrange
        var user = CreateUser(
            id: 2,
            isActive: true,
            isDeleted: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(user);

        // Act
        await _userManagementService.DeleteUserAsync(
            2,
            1);

        // Assert
        Assert.True(user.IsDeleted);
        Assert.False(user.IsActive);
        Assert.NotNull(user.UpdatedAt);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(2),
            Times.Once);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task DeleteUserAsync_InactiveUser_SoftDeletesUser()
    {
        // Arrange
        var user = CreateUser(
            id: 2,
            isActive: false,
            isDeleted: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(user);

        // Act
        await _userManagementService.DeleteUserAsync(
            2,
            1);

        // Assert
        Assert.True(user.IsDeleted);
        Assert.False(user.IsActive);
        Assert.NotNull(user.UpdatedAt);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task DeleteUserAsync_UserDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _userManagementService.DeleteUserAsync(
                999,
                1));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteUserAsync_AlreadyDeletedUser_ThrowsNotFoundException()
    {
        // Arrange
        var deletedUser = CreateUser(
            id: 2,
            isActive: false,
            isDeleted: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(deletedUser);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _userManagementService.DeleteUserAsync(
                2,
                1));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteUserAsync_CurrentAdmin_ThrowsConflictException()
    {
        // Arrange
        var admin = CreateUser(
            id: 1,
            role: UserRole.Admin);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(admin);

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<ConflictException>(
                () => _userManagementService.DeleteUserAsync(
                    1,
                    1));

        Assert.Equal(
            "You cannot delete your own account.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    // ============================================================
    // REPOSITORY INTERACTION
    // ============================================================

    [Fact]
    public async Task ActivateUserAsync_UpdatesOnlyTargetUser()
    {
        // Arrange
        var user = CreateUser(
            id: 2,
            isActive: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(user);

        // Act
        await _userManagementService.ActivateUserAsync(
            2,
            1);

        // Assert
        _userRepositoryMock.Verify(
            x => x.UpdateAsync(
                It.Is<User>(u =>
                    u.Id == 2 &&
                    u.IsActive &&
                    !u.IsDeleted)),
            Times.Once);
    }

    [Fact]
    public async Task DeactivateUserAsync_UpdatesOnlyTargetUser()
    {
        // Arrange
        var user = CreateUser(
            id: 2,
            isActive: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(user);

        // Act
        await _userManagementService.DeactivateUserAsync(
            2,
            1);

        // Assert
        _userRepositoryMock.Verify(
            x => x.UpdateAsync(
                It.Is<User>(u =>
                    u.Id == 2 &&
                    !u.IsActive &&
                    !u.IsDeleted)),
            Times.Once);
    }

    [Fact]
    public async Task DeleteUserAsync_SetsBothDeletedAndInactive()
    {
        // Arrange
        var user = CreateUser(
            id: 2,
            isActive: true,
            isDeleted: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(2))
            .ReturnsAsync(user);

        // Act
        await _userManagementService.DeleteUserAsync(
            2,
            1);

        // Assert
        _userRepositoryMock.Verify(
            x => x.UpdateAsync(
                It.Is<User>(u =>
                    u.Id == 2 &&
                    u.IsDeleted &&
                    !u.IsActive)),
            Times.Once);
    }
}