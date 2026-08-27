using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Taskify.API.Controllers;
using Taskify.Business.DTOs.Profile;
using Taskify.Business.Interfaces;
using Xunit;

namespace Taskify.Tests.Controllers;

public class ProfileControllerTests
{
    private readonly Mock<IProfileService> _profileServiceMock;
    private readonly ProfileController _controller;

    public ProfileControllerTests()
    {
        _profileServiceMock = new Mock<IProfileService>();

        _controller = new ProfileController(
            _profileServiceMock.Object);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private void SetAuthenticatedUser(int userId)
    {
        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                userId.ToString())
        };

        var identity = new ClaimsIdentity(
            claims,
            authenticationType: "TestAuthentication");

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

    private void SetUnauthenticatedUser()
    {
        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(
                        new ClaimsIdentity())
                }
            };
    }

    // ============================================================
    // GET PROFILE
    // ============================================================

    [Fact]
    public async Task GetProfile_AuthenticatedUser_ReturnsOk()
    {
        // Arrange
        SetAuthenticatedUser(1);

        var response = new ProfileResponse
        {
            Id = 1,
            FullName = "Faizal Hassan",
            Email = "faizal@gmail.com",
            Role = "User",
            AccountCreatedOn = DateTime.UtcNow.AddDays(-30),
            IsActive = true
        };

        _profileServiceMock
            .Setup(x => x.GetProfileAsync(1))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetProfile();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.NotNull(okResult.Value);

        _profileServiceMock.Verify(
            x => x.GetProfileAsync(1),
            Times.Once);
    }

    [Fact]
    public async Task GetProfile_InvalidUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUnauthenticatedUser();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.GetProfile());

        Assert.Equal(
            "Invalid authenticated user.",
            exception.Message);

        _profileServiceMock.Verify(
            x => x.GetProfileAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task GetProfile_InvalidUserIdClaimValue_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                "invalid-id")
        };

        var identity = new ClaimsIdentity(
            claims,
            "TestAuthentication");

        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(identity)
                }
            };

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.GetProfile());

        Assert.Equal(
            "Invalid authenticated user.",
            exception.Message);

        _profileServiceMock.Verify(
            x => x.GetProfileAsync(It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // UPDATE FULL NAME
    // ============================================================

    [Fact]
    public async Task UpdateFullName_AuthenticatedUser_ReturnsOk()
    {
        // Arrange
        SetAuthenticatedUser(1);

        var request = new UpdateFullNameRequest
        {
            FullName = "Ali Khan"
        };

        _profileServiceMock
            .Setup(x => x.UpdateFullNameAsync(
                1,
                request))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.UpdateFullName(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.NotNull(okResult.Value);

        _profileServiceMock.Verify(
            x => x.UpdateFullNameAsync(
                1,
                request),
            Times.Once);
    }

    [Fact]
    public async Task UpdateFullName_InvalidUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUnauthenticatedUser();

        var request = new UpdateFullNameRequest
        {
            FullName = "Ali Khan"
        };

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.UpdateFullName(request));

        Assert.Equal(
            "Invalid authenticated user.",
            exception.Message);

        _profileServiceMock.Verify(
            x => x.UpdateFullNameAsync(
                It.IsAny<int>(),
                It.IsAny<UpdateFullNameRequest>()),
            Times.Never);
    }

    // ============================================================
    // CHANGE PASSWORD
    // ============================================================

    [Fact]
    public async Task ChangePassword_AuthenticatedUser_ReturnsOk()
    {
        // Arrange
        SetAuthenticatedUser(1);

        var request = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123",
            NewPassword = "NewPassword123"
        };

        _profileServiceMock
            .Setup(x => x.ChangePasswordAsync(
                1,
                request))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.ChangePassword(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.NotNull(okResult.Value);

        _profileServiceMock.Verify(
            x => x.ChangePasswordAsync(
                1,
                request),
            Times.Once);
    }

    [Fact]
    public async Task ChangePassword_InvalidUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUnauthenticatedUser();

        var request = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123",
            NewPassword = "NewPassword123"
        };

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.ChangePassword(request));

        Assert.Equal(
            "Invalid authenticated user.",
            exception.Message);

        _profileServiceMock.Verify(
            x => x.ChangePasswordAsync(
                It.IsAny<int>(),
                It.IsAny<ChangePasswordRequest>()),
            Times.Never);
    }

    // ============================================================
    // DEACTIVATE ACCOUNT
    // ============================================================

    [Fact]
    public async Task DeactivateAccount_AuthenticatedUser_ReturnsOk()
    {
        // Arrange
        SetAuthenticatedUser(1);

        _profileServiceMock
            .Setup(x => x.DeactivateAccountAsync(1))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.DeactivateAccount();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.NotNull(okResult.Value);

        _profileServiceMock.Verify(
            x => x.DeactivateAccountAsync(1),
            Times.Once);
    }

    [Fact]
    public async Task DeactivateAccount_InvalidUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUnauthenticatedUser();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.DeactivateAccount());

        Assert.Equal(
            "Invalid authenticated user.",
            exception.Message);

        _profileServiceMock.Verify(
            x => x.DeactivateAccountAsync(
                It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // DELETE ACCOUNT
    // ============================================================

    [Fact]
    public async Task DeleteAccount_AuthenticatedUser_ReturnsOk()
    {
        // Arrange
        SetAuthenticatedUser(1);

        _profileServiceMock
            .Setup(x => x.DeleteAccountAsync(1))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.DeleteAccount();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.NotNull(okResult.Value);

        _profileServiceMock.Verify(
            x => x.DeleteAccountAsync(1),
            Times.Once);
    }

    [Fact]
    public async Task DeleteAccount_InvalidUserIdClaim_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetUnauthenticatedUser();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _controller.DeleteAccount());

        Assert.Equal(
            "Invalid authenticated user.",
            exception.Message);

        _profileServiceMock.Verify(
            x => x.DeleteAccountAsync(
                It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // USER ID CLAIM HANDLING
    // ============================================================

    [Fact]
    public async Task GetProfile_UsesUserIdFromNameIdentifierClaim()
    {
        // Arrange
        SetAuthenticatedUser(25);

        var response = new ProfileResponse
        {
            Id = 25,
            FullName = "Test User",
            Email = "test@gmail.com",
            Role = "User",
            AccountCreatedOn = DateTime.UtcNow,
            IsActive = true
        };

        _profileServiceMock
            .Setup(x => x.GetProfileAsync(25))
            .ReturnsAsync(response);

        // Act
        await _controller.GetProfile();

        // Assert
        _profileServiceMock.Verify(
            x => x.GetProfileAsync(25),
            Times.Once);
    }

    [Fact]
    public async Task UpdateFullName_UsesUserIdFromNameIdentifierClaim()
    {
        // Arrange
        SetAuthenticatedUser(25);

        var request = new UpdateFullNameRequest
        {
            FullName = "Test User"
        };

        _profileServiceMock
            .Setup(x => x.UpdateFullNameAsync(
                25,
                request))
            .Returns(Task.CompletedTask);

        // Act
        await _controller.UpdateFullName(request);

        // Assert
        _profileServiceMock.Verify(
            x => x.UpdateFullNameAsync(
                25,
                request),
            Times.Once);
    }

    [Fact]
    public async Task ChangePassword_UsesUserIdFromNameIdentifierClaim()
    {
        // Arrange
        SetAuthenticatedUser(25);

        var request = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123",
            NewPassword = "NewPassword123"
        };

        _profileServiceMock
            .Setup(x => x.ChangePasswordAsync(
                25,
                request))
            .Returns(Task.CompletedTask);

        // Act
        await _controller.ChangePassword(request);

        // Assert
        _profileServiceMock.Verify(
            x => x.ChangePasswordAsync(
                25,
                request),
            Times.Once);
    }

    [Fact]
    public async Task DeactivateAccount_UsesUserIdFromNameIdentifierClaim()
    {
        // Arrange
        SetAuthenticatedUser(25);

        _profileServiceMock
            .Setup(x => x.DeactivateAccountAsync(25))
            .Returns(Task.CompletedTask);

        // Act
        await _controller.DeactivateAccount();

        // Assert
        _profileServiceMock.Verify(
            x => x.DeactivateAccountAsync(25),
            Times.Once);
    }

    [Fact]
    public async Task DeleteAccount_UsesUserIdFromNameIdentifierClaim()
    {
        // Arrange
        SetAuthenticatedUser(25);

        _profileServiceMock
            .Setup(x => x.DeleteAccountAsync(25))
            .Returns(Task.CompletedTask);

        // Act
        await _controller.DeleteAccount();

        // Assert
        _profileServiceMock.Verify(
            x => x.DeleteAccountAsync(25),
            Times.Once);
    }
}