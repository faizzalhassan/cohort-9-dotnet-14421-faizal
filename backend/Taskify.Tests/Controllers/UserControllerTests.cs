using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Taskify.API.Controllers;
using Taskify.Business.DTOs.Users;
using Taskify.Business.Interfaces;
using Xunit;

namespace Taskify.Tests.Controllers;

public class UserControllerTests
{
    private readonly Mock<IUserManagementService> _userManagementServiceMock;
    private readonly UserController _controller;

    public UserControllerTests()
    {
        _userManagementServiceMock =
            new Mock<IUserManagementService>();

        _controller = new UserController(
            _userManagementServiceMock.Object);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private void SetAuthenticatedUser(
        int userId,
        string role = "Admin")
    {
        var claims = new List<Claim>
        {
            new(
                ClaimTypes.NameIdentifier,
                userId.ToString()),

            new(
                ClaimTypes.Role,
                role)
        };

        var identity = new ClaimsIdentity(
            claims,
            "TestAuthentication");

        var principal = new ClaimsPrincipal(identity);

        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = principal
                }
            };
    }

    private void SetUserWithoutIdClaim()
    {
        var claims = new List<Claim>
        {
            new(
                ClaimTypes.Role,
                "Admin")
        };

        var identity = new ClaimsIdentity(
            claims,
            "TestAuthentication");

        var principal = new ClaimsPrincipal(identity);

        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = principal
                }
            };
    }

    private void SetUserWithInvalidIdClaim()
    {
        var claims = new List<Claim>
        {
            new(
                ClaimTypes.NameIdentifier,
                "invalid-id"),

            new(
                ClaimTypes.Role,
                "Admin")
        };

        var identity = new ClaimsIdentity(
            claims,
            "TestAuthentication");

        var principal = new ClaimsPrincipal(identity);

        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = principal
                }
            };
    }

    private static AdminUserResponse CreateUser(
        int id = 1,
        string firstName = "Faizal",
        string lastName = "Hassan",
        string email = "faizal@gmail.com",
        string role = "User",
        bool isActive = true,
        int taskCount = 5)
    {
        return new AdminUserResponse
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Role = role,
            IsActive = isActive,
            TaskCount = taskCount,
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            LastLoginAt = DateTime.UtcNow.AddDays(-1)
        };
    }

    // ============================================================
    // GET ALL USERS
    // ============================================================

    [Fact]
    public async Task GetAllUsers_AuthenticatedAdmin_ReturnsOkWithUsers()
    {
        // Arrange
        SetAuthenticatedUser(10);

        var users = new List<AdminUserResponse>
        {
            CreateUser(
                id: 1,
                firstName: "Faizal",
                lastName: "Hassan",
                email: "faizal@gmail.com"),

            CreateUser(
                id: 2,
                firstName: "Ali",
                lastName: "Khan",
                email: "ali@gmail.com")
        };

        _userManagementServiceMock
            .Setup(x => x.GetAllUsersAsync(10))
            .ReturnsAsync(users);

        // Act
        var result = await _controller.GetAllUsers();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.Same(users, okResult.Value);

        _userManagementServiceMock.Verify(
            x => x.GetAllUsersAsync(10),
            Times.Once);
    }

    [Fact]
    public async Task GetAllUsers_NoUsers_ReturnsOkWithEmptyList()
    {
        // Arrange
        SetAuthenticatedUser(10);

        var users =
            new List<AdminUserResponse>();

        _userManagementServiceMock
            .Setup(x => x.GetAllUsersAsync(10))
            .ReturnsAsync(users);

        // Act
        var result = await _controller.GetAllUsers();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.Same(users, okResult.Value);

        _userManagementServiceMock.Verify(
            x => x.GetAllUsersAsync(10),
            Times.Once);
    }

    [Fact]
    public async Task GetAllUsers_MissingUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUserWithoutIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.GetAllUsers());

        Assert.Equal(
            "User identity could not be determined.",
            exception.Message);

        _userManagementServiceMock.Verify(
            x => x.GetAllUsersAsync(
                It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task GetAllUsers_InvalidUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUserWithInvalidIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.GetAllUsers());

        Assert.Equal(
            "User identity could not be determined.",
            exception.Message);

        _userManagementServiceMock.Verify(
            x => x.GetAllUsersAsync(
                It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // ACTIVATE USER
    // ============================================================

    [Fact]
    public async Task ActivateUser_ValidRequest_ReturnsNoContent()
    {
        // Arrange
        SetAuthenticatedUser(10);

        _userManagementServiceMock
            .Setup(x => x.ActivateUserAsync(5, 10))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.ActivateUser(5);

        // Assert
        Assert.IsType<NoContentResult>(result);

        _userManagementServiceMock.Verify(
            x => x.ActivateUserAsync(5, 10),
            Times.Once);
    }

    [Fact]
    public async Task ActivateUser_AdminActivatingAnotherUser_ReturnsNoContent()
    {
        // Arrange
        SetAuthenticatedUser(100);

        _userManagementServiceMock
            .Setup(x => x.ActivateUserAsync(25, 100))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.ActivateUser(25);

        // Assert
        var noContentResult =
            Assert.IsType<NoContentResult>(result);

        Assert.Equal(
            StatusCodes.Status204NoContent,
            noContentResult.StatusCode);

        _userManagementServiceMock.Verify(
            x => x.ActivateUserAsync(25, 100),
            Times.Once);
    }

    [Fact]
    public async Task ActivateUser_MissingUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUserWithoutIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.ActivateUser(5));

        Assert.Equal(
            "User identity could not be determined.",
            exception.Message);

        _userManagementServiceMock.Verify(
            x => x.ActivateUserAsync(
                It.IsAny<int>(),
                It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task ActivateUser_InvalidUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUserWithInvalidIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.ActivateUser(5));

        Assert.Equal(
            "User identity could not be determined.",
            exception.Message);

        _userManagementServiceMock.Verify(
            x => x.ActivateUserAsync(
                It.IsAny<int>(),
                It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // DEACTIVATE USER
    // ============================================================

    [Fact]
    public async Task DeactivateUser_ValidRequest_ReturnsNoContent()
    {
        // Arrange
        SetAuthenticatedUser(10);

        _userManagementServiceMock
            .Setup(x => x.DeactivateUserAsync(5, 10))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.DeactivateUser(5);

        // Assert
        Assert.IsType<NoContentResult>(result);

        _userManagementServiceMock.Verify(
            x => x.DeactivateUserAsync(5, 10),
            Times.Once);
    }

    [Fact]
    public async Task DeactivateUser_AdminDeactivatingAnotherUser_ReturnsNoContent()
    {
        // Arrange
        SetAuthenticatedUser(100);

        _userManagementServiceMock
            .Setup(x => x.DeactivateUserAsync(25, 100))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.DeactivateUser(25);

        // Assert
        var noContentResult =
            Assert.IsType<NoContentResult>(result);

        Assert.Equal(
            StatusCodes.Status204NoContent,
            noContentResult.StatusCode);

        _userManagementServiceMock.Verify(
            x => x.DeactivateUserAsync(25, 100),
            Times.Once);
    }

    [Fact]
    public async Task DeactivateUser_MissingUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUserWithoutIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.DeactivateUser(5));

        Assert.Equal(
            "User identity could not be determined.",
            exception.Message);

        _userManagementServiceMock.Verify(
            x => x.DeactivateUserAsync(
                It.IsAny<int>(),
                It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task DeactivateUser_InvalidUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUserWithInvalidIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.DeactivateUser(5));

        Assert.Equal(
            "User identity could not be determined.",
            exception.Message);

        _userManagementServiceMock.Verify(
            x => x.DeactivateUserAsync(
                It.IsAny<int>(),
                It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // DELETE USER
    // ============================================================

    [Fact]
    public async Task DeleteUser_ValidRequest_ReturnsNoContent()
    {
        // Arrange
        SetAuthenticatedUser(10);

        _userManagementServiceMock
            .Setup(x => x.DeleteUserAsync(5, 10))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.DeleteUser(5);

        // Assert
        Assert.IsType<NoContentResult>(result);

        _userManagementServiceMock.Verify(
            x => x.DeleteUserAsync(5, 10),
            Times.Once);
    }

    [Fact]
    public async Task DeleteUser_AdminDeletingAnotherUser_ReturnsNoContent()
    {
        // Arrange
        SetAuthenticatedUser(100);

        _userManagementServiceMock
            .Setup(x => x.DeleteUserAsync(25, 100))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.DeleteUser(25);

        // Assert
        var noContentResult =
            Assert.IsType<NoContentResult>(result);

        Assert.Equal(
            StatusCodes.Status204NoContent,
            noContentResult.StatusCode);

        _userManagementServiceMock.Verify(
            x => x.DeleteUserAsync(25, 100),
            Times.Once);
    }

    [Fact]
    public async Task DeleteUser_MissingUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUserWithoutIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.DeleteUser(5));

        Assert.Equal(
            "User identity could not be determined.",
            exception.Message);

        _userManagementServiceMock.Verify(
            x => x.DeleteUserAsync(
                It.IsAny<int>(),
                It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteUser_InvalidUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUserWithInvalidIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.DeleteUser(5));

        Assert.Equal(
            "User identity could not be determined.",
            exception.Message);

        _userManagementServiceMock.Verify(
            x => x.DeleteUserAsync(
                It.IsAny<int>(),
                It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // DIFFERENT ADMIN IDS
    // ============================================================

    [Fact]
    public async Task GetAllUsers_UsesAuthenticatedAdminId()
    {
        // Arrange
        SetAuthenticatedUser(42);

        var users =
            new List<AdminUserResponse>
            {
                CreateUser()
            };

        _userManagementServiceMock
            .Setup(x => x.GetAllUsersAsync(42))
            .ReturnsAsync(users);

        // Act
        await _controller.GetAllUsers();

        // Assert
        _userManagementServiceMock.Verify(
            x => x.GetAllUsersAsync(42),
            Times.Once);

        _userManagementServiceMock.Verify(
            x => x.GetAllUsersAsync(
                It.Is<int>(id => id != 42)),
            Times.Never);
    }

    [Fact]
    public async Task ActivateUser_UsesAuthenticatedAdminId()
    {
        // Arrange
        SetAuthenticatedUser(42);

        _userManagementServiceMock
            .Setup(x => x.ActivateUserAsync(15, 42))
            .Returns(Task.CompletedTask);

        // Act
        await _controller.ActivateUser(15);

        // Assert
        _userManagementServiceMock.Verify(
            x => x.ActivateUserAsync(15, 42),
            Times.Once);
    }

    [Fact]
    public async Task DeactivateUser_UsesAuthenticatedAdminId()
    {
        // Arrange
        SetAuthenticatedUser(42);

        _userManagementServiceMock
            .Setup(x => x.DeactivateUserAsync(15, 42))
            .Returns(Task.CompletedTask);

        // Act
        await _controller.DeactivateUser(15);

        // Assert
        _userManagementServiceMock.Verify(
            x => x.DeactivateUserAsync(15, 42),
            Times.Once);
    }

    [Fact]
    public async Task DeleteUser_UsesAuthenticatedAdminId()
    {
        // Arrange
        SetAuthenticatedUser(42);

        _userManagementServiceMock
            .Setup(x => x.DeleteUserAsync(15, 42))
            .Returns(Task.CompletedTask);

        // Act
        await _controller.DeleteUser(15);

        // Assert
        _userManagementServiceMock.Verify(
            x => x.DeleteUserAsync(15, 42),
            Times.Once);
    }
}