using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Taskify.API.Controllers;
using Taskify.Business.DTOs.Tasks;
using Taskify.Business.Interfaces;
using Xunit;

namespace Taskify.Tests.Controllers;

public class DashboardControllerTests
{
    private readonly Mock<ITaskService> _taskServiceMock;
    private readonly DashboardController _controller;

    public DashboardControllerTests()
    {
        _taskServiceMock = new Mock<ITaskService>();

        _controller = new DashboardController(
            _taskServiceMock.Object);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private void SetAuthenticatedUser(
        int userId = 1,
        string role = "Admin")
    {
        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                userId.ToString()),

            new Claim(
                ClaimTypes.Role,
                role)
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

    private void SetUserWithoutIdClaim(string role = "Admin")
    {
        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.Role,
                role)
        };

        var identity = new ClaimsIdentity(
            claims,
            authenticationType: "TestAuthentication");

        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(identity)
                }
            };
    }

    private void SetUserWithInvalidIdClaim(string role = "Admin")
    {
        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                "invalid-id"),

            new Claim(
                ClaimTypes.Role,
                role)
        };

        var identity = new ClaimsIdentity(
            claims,
            authenticationType: "TestAuthentication");

        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(identity)
                }
            };
    }

    private void SetUserWithoutRoleClaim()
    {
        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                "1")
        };

        var identity = new ClaimsIdentity(
            claims,
            authenticationType: "TestAuthentication");

        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(identity)
                }
            };
    }

    // ============================================================
    // GET OVERVIEW
    // ============================================================

    [Fact]
    public async Task GetOverview_AuthenticatedAdmin_ReturnsOk()
    {
        // Arrange
        SetAuthenticatedUser(
            userId: 1,
            role: "Admin");

        var statistics = new AdminTaskStatisticsResponse();

        _taskServiceMock
            .Setup(x => x.GetAdminTaskStatisticsAsync(
                1,
                "Admin"))
            .ReturnsAsync(statistics);

        // Act
        var result =
            await _controller.GetOverview();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.NotNull(okResult.Value);

        _taskServiceMock.Verify(
            x => x.GetAdminTaskStatisticsAsync(
                1,
                "Admin"),
            Times.Once);
    }

    [Fact]
    public async Task GetOverview_UsesCurrentAdminUserIdAndRole()
    {
        // Arrange
        SetAuthenticatedUser(
            userId: 25,
            role: "Admin");

        var statistics = new AdminTaskStatisticsResponse();

        _taskServiceMock
            .Setup(x => x.GetAdminTaskStatisticsAsync(
                25,
                "Admin"))
            .ReturnsAsync(statistics);

        // Act
        await _controller.GetOverview();

        // Assert
        _taskServiceMock.Verify(
            x => x.GetAdminTaskStatisticsAsync(
                25,
                "Admin"),
            Times.Once);
    }

    [Fact]
    public async Task GetOverview_MissingUserIdClaim_ThrowsAuthenticationException()
    {
        // Arrange
        SetUserWithoutIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.AuthenticationException>(
                () => _controller.GetOverview());

        Assert.Equal(
            "Invalid authentication session.",
            exception.Message);

        _taskServiceMock.Verify(
            x => x.GetAdminTaskStatisticsAsync(
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetOverview_InvalidUserIdClaim_ThrowsAuthenticationException()
    {
        // Arrange
        SetUserWithInvalidIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.AuthenticationException>(
                () => _controller.GetOverview());

        Assert.Equal(
            "Invalid authentication session.",
            exception.Message);

        _taskServiceMock.Verify(
            x => x.GetAdminTaskStatisticsAsync(
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetOverview_MissingRoleClaim_ThrowsAuthenticationException()
    {
        // Arrange
        SetUserWithoutRoleClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.AuthenticationException>(
                () => _controller.GetOverview());

        Assert.Equal(
            "User role not found in authentication session.",
            exception.Message);

        _taskServiceMock.Verify(
            x => x.GetAdminTaskStatisticsAsync(
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    // ============================================================
    // GET RECENT TASKS
    // ============================================================

    [Fact]
    public async Task GetRecentTasks_DefaultPageSize_ReturnsOk()
    {
        // Arrange
        SetAuthenticatedUser(
            userId: 1,
            role: "Admin");

        var resultData =
            new AdminTaskPagedResponse();

        _taskServiceMock
            .Setup(x => x.GetAdminTasksAsync(
                1,
                5,
                1,
                "Admin"))
            .ReturnsAsync(resultData);

        // Act
        var result =
            await _controller.GetRecentTasks();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.NotNull(okResult.Value);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                1,
                5,
                1,
                "Admin"),
            Times.Once);
    }

    [Fact]
    public async Task GetRecentTasks_CustomPageSize_ReturnsOk()
    {
        // Arrange
        SetAuthenticatedUser(
            userId: 10,
            role: "Admin");

        var resultData =
            new AdminTaskPagedResponse();

        _taskServiceMock
            .Setup(x => x.GetAdminTasksAsync(
                1,
                10,
                10,
                "Admin"))
            .ReturnsAsync(resultData);

        // Act
        var result =
            await _controller.GetRecentTasks(10);

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                1,
                10,
                10,
                "Admin"),
            Times.Once);
    }

    [Fact]
    public async Task GetRecentTasks_PageSizeOne_ReturnsOk()
    {
        // Arrange
        SetAuthenticatedUser();

        var resultData =
            new AdminTaskPagedResponse();

        _taskServiceMock
            .Setup(x => x.GetAdminTasksAsync(
                1,
                1,
                1,
                "Admin"))
            .ReturnsAsync(resultData);

        // Act
        var result =
            await _controller.GetRecentTasks(1);

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                1,
                1,
                1,
                "Admin"),
            Times.Once);
    }

    [Fact]
    public async Task GetRecentTasks_PageSizeTwenty_ReturnsOk()
    {
        // Arrange
        SetAuthenticatedUser();

        var resultData =
            new AdminTaskPagedResponse();

        _taskServiceMock
            .Setup(x => x.GetAdminTasksAsync(
                1,
                20,
                1,
                "Admin"))
            .ReturnsAsync(resultData);

        // Act
        var result =
            await _controller.GetRecentTasks(20);

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                1,
                20,
                1,
                "Admin"),
            Times.Once);
    }

    // ============================================================
    // RECENT TASKS VALIDATION
    // ============================================================

    [Fact]
    public async Task GetRecentTasks_PageSizeZero_ReturnsBadRequest()
    {
        // Arrange
        SetAuthenticatedUser();

        // Act
        var result =
            await _controller.GetRecentTasks(0);

        // Assert
        var badRequestResult =
            Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status400BadRequest,
            badRequestResult.StatusCode);

        Assert.NotNull(badRequestResult.Value);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetRecentTasks_NegativePageSize_ReturnsBadRequest()
    {
        // Arrange
        SetAuthenticatedUser();

        // Act
        var result =
            await _controller.GetRecentTasks(-1);

        // Assert
        var badRequestResult =
            Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status400BadRequest,
            badRequestResult.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetRecentTasks_PageSizeGreaterThanTwenty_ReturnsBadRequest()
    {
        // Arrange
        SetAuthenticatedUser();

        // Act
        var result =
            await _controller.GetRecentTasks(21);

        // Assert
        var badRequestResult =
            Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status400BadRequest,
            badRequestResult.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetRecentTasks_PageSizeLargeValue_ReturnsBadRequest()
    {
        // Arrange
        SetAuthenticatedUser();

        // Act
        var result =
            await _controller.GetRecentTasks(100);

        // Assert
        var badRequestResult =
            Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status400BadRequest,
            badRequestResult.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    // ============================================================
    // RECENT TASKS AUTHENTICATION
    // ============================================================

    [Fact]
    public async Task GetRecentTasks_MissingUserIdClaim_ThrowsAuthenticationException()
    {
        // Arrange
        SetUserWithoutIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.AuthenticationException>(
                () => _controller.GetRecentTasks(5));

        Assert.Equal(
            "Invalid authentication session.",
            exception.Message);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetRecentTasks_InvalidUserIdClaim_ThrowsAuthenticationException()
    {
        // Arrange
        SetUserWithInvalidIdClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.AuthenticationException>(
                () => _controller.GetRecentTasks(5));

        Assert.Equal(
            "Invalid authentication session.",
            exception.Message);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetRecentTasks_MissingRoleClaim_ThrowsAuthenticationException()
    {
        // Arrange
        SetUserWithoutRoleClaim();

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.AuthenticationException>(
                () => _controller.GetRecentTasks(5));

        Assert.Equal(
            "User role not found in authentication session.",
            exception.Message);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    // ============================================================
    // PAGE SIZE BOUNDARY TESTS
    // ============================================================

    [Fact]
    public async Task GetRecentTasks_PageSizeFive_PassesCorrectPageNumber()
    {
        // Arrange
        SetAuthenticatedUser(
            userId: 15,
            role: "Admin");

        var resultData =
            new AdminTaskPagedResponse();

        _taskServiceMock
            .Setup(x => x.GetAdminTasksAsync(
                1,
                5,
                15,
                "Admin"))
            .ReturnsAsync(resultData);

        // Act
        await _controller.GetRecentTasks(5);

        // Assert
        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                1,
                5,
                15,
                "Admin"),
            Times.Once);
    }
}