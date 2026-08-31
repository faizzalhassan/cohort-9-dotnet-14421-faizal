using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Taskify.API.Controllers;
using Taskify.Business.DTOs.Tasks;
using Taskify.Business.Interfaces;
using Xunit;

namespace Taskify.Tests.Controllers;

public class TasksControllerTests
{
    private readonly Mock<ITaskService> _taskServiceMock;
    private readonly TasksController _controller;

    public TasksControllerTests()
    {
        _taskServiceMock = new Mock<ITaskService>();
        _controller = new TasksController(
            _taskServiceMock.Object);

        SetUser(1, "User");
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private void SetUser(
        int userId,
        string role)
    {
        var claims = new[]
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
            "TestAuthentication");

        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(identity)
                }
            };
    }

    private static TaskResponse CreateTaskResponse(
        int id = 1)
    {
        return new TaskResponse
        {
            Id = id
        };
    }

    private static CreateTaskRequest CreateTaskRequest()
    {
        return new CreateTaskRequest();
    }

    private static UpdateTaskRequest CreateUpdateTaskRequest()
    {
        return new UpdateTaskRequest();
    }

    private static UpdateTaskStatusRequest
        CreateStatusRequest()
    {
        return new UpdateTaskStatusRequest();
    }

    private static UpdateTaskDueDateRequest
        CreateDueDateRequest()
    {
        return new UpdateTaskDueDateRequest();
    }

    private static UpdateTaskPriorityRequest
        CreatePriorityRequest()
    {
        return new UpdateTaskPriorityRequest();
    }

    // ============================================================
    // USER TASKS
    // ============================================================

    [Fact]
    public async Task GetMyTasks_ReturnsOkWithTasks()
    {
        // Arrange
        var tasks = new List<TaskResponse>
        {
            CreateTaskResponse(1),
            CreateTaskResponse(2)
        };

        _taskServiceMock
            .Setup(x => x.GetMyTasksAsync(1, "User"))
            .ReturnsAsync(tasks);

        // Act
        var result =
            await _controller.GetMyTasks();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.NotNull(okResult.Value);

        _taskServiceMock.Verify(
            x => x.GetMyTasksAsync(1, "User"),
            Times.Once);
    }

    [Fact]
    public async Task GetAssignedTasks_ReturnsOkWithTasks()
    {
        // Arrange
        var tasks = new List<TaskResponse>
        {
            CreateTaskResponse(1)
        };

        _taskServiceMock
            .Setup(x => x.GetAssignedTasksAsync(1, "User"))
            .ReturnsAsync(tasks);

        // Act
        var result =
            await _controller.GetAssignedTasks();

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetAssignedTasksAsync(1, "User"),
            Times.Once);
    }

    [Fact]
    public async Task GetPendingTasks_ReturnsOkWithTasks()
    {
        // Arrange
        var tasks = new List<TaskResponse>
        {
            CreateTaskResponse(1)
        };

        _taskServiceMock
            .Setup(x => x.GetPendingTasksAsync(1, "User"))
            .ReturnsAsync(tasks);

        // Act
        var result =
            await _controller.GetPendingTasks();

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetPendingTasksAsync(1, "User"),
            Times.Once);
    }

    [Fact]
    public async Task GetInProgressTasks_ReturnsOkWithTasks()
    {
        // Arrange
        var tasks = new List<TaskResponse>
        {
            CreateTaskResponse(1)
        };

        _taskServiceMock
            .Setup(x => x.GetInProgressTasksAsync(1, "User"))
            .ReturnsAsync(tasks);

        // Act
        var result =
            await _controller.GetInProgressTasks();

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetInProgressTasksAsync(1, "User"),
            Times.Once);
    }

    [Fact]
    public async Task GetCompletedTasks_ReturnsOkWithTasks()
    {
        // Arrange
        var tasks = new List<TaskResponse>
        {
            CreateTaskResponse(1)
        };

        _taskServiceMock
            .Setup(x => x.GetCompletedTasksAsync(1, "User"))
            .ReturnsAsync(tasks);

        // Act
        var result =
            await _controller.GetCompletedTasks();

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetCompletedTasksAsync(1, "User"),
            Times.Once);
    }

    [Fact]
    public async Task GetCancelledTasks_ReturnsOkWithTasks()
    {
        // Arrange
        var tasks = new List<TaskResponse>
        {
            CreateTaskResponse(1)
        };

        _taskServiceMock
            .Setup(x => x.GetCancelledTasksAsync(1, "User"))
            .ReturnsAsync(tasks);

        // Act
        var result =
            await _controller.GetCancelledTasks();

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetCancelledTasksAsync(1, "User"),
            Times.Once);
    }

    [Fact]
    public async Task GetOverdueTasks_ReturnsOkWithTasks()
    {
        // Arrange
        var tasks = new List<TaskResponse>
        {
            CreateTaskResponse(1)
        };

        _taskServiceMock
            .Setup(x => x.GetOverdueTasksAsync(1, "User"))
            .ReturnsAsync(tasks);

        // Act
        var result =
            await _controller.GetOverdueTasks();

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetOverdueTasksAsync(1, "User"),
            Times.Once);
    }

    // ============================================================
    // GET SINGLE TASK
    // ============================================================

    [Fact]
    public async Task GetTask_ReturnsOkWithTask()
    {
        // Arrange
        var task = CreateTaskResponse(10);

        _taskServiceMock
            .Setup(x => x.GetTaskByIdAsync(
                10,
                1,
                "User"))
            .ReturnsAsync(task);

        // Act
        var result =
            await _controller.GetTask(10);

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.NotNull(okResult.Value);

        _taskServiceMock.Verify(
            x => x.GetTaskByIdAsync(
                10,
                1,
                "User"),
            Times.Once);
    }

    // ============================================================
    // CREATE TASK
    // ============================================================

    [Fact]
    public async Task CreateTask_ReturnsCreatedResult()
    {
        // Arrange
        var request = CreateTaskRequest();
        var response = CreateTaskResponse(1);

        _taskServiceMock
            .Setup(x => x.CreateTaskAsync(
                request,
                1,
                "User"))
            .ReturnsAsync(response);

        // Act
        var result =
            await _controller.CreateTask(request);

        // Assert
        var createdResult =
            Assert.IsType<ObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status201Created,
            createdResult.StatusCode);

        Assert.NotNull(createdResult.Value);

        _taskServiceMock.Verify(
            x => x.CreateTaskAsync(
                request,
                1,
                "User"),
            Times.Once);
    }

    // ============================================================
    // UPDATE TASK
    // ============================================================

    [Fact]
    public async Task UpdateTask_ReturnsOkResult()
    {
        // Arrange
        var request = CreateUpdateTaskRequest();
        var response = CreateTaskResponse(10);

        _taskServiceMock
            .Setup(x => x.UpdateTaskAsync(
                10,
                request,
                1,
                "User"))
            .ReturnsAsync(response);

        // Act
        var result =
            await _controller.UpdateTask(
                10,
                request);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.UpdateTaskAsync(
                10,
                request,
                1,
                "User"),
            Times.Once);
    }

    // ============================================================
    // CHANGE TASK STATUS
    // ============================================================

    [Fact]
    public async Task ChangeTaskStatus_ReturnsOkResult()
    {
        // Arrange
        var request = CreateStatusRequest();
        var response = CreateTaskResponse(10);

        _taskServiceMock
            .Setup(x => x.ChangeStatusAsync(
                10,
                request,
                1,
                "User"))
            .ReturnsAsync(response);

        // Act
        var result =
            await _controller.ChangeTaskStatus(
                10,
                request);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.ChangeStatusAsync(
                10,
                request,
                1,
                "User"),
            Times.Once);
    }

    // ============================================================
    // DELETE TASK
    // ============================================================

    [Fact]
    public async Task DeleteTask_ReturnsOkResult()
    {
        // Arrange
        _taskServiceMock
            .Setup(x => x.DeleteTaskAsync(
                10,
                1,
                "User"))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.DeleteTask(10);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.DeleteTaskAsync(
                10,
                1,
                "User"),
            Times.Once);
    }

    // ============================================================
    // ADMIN TASKS
    // ============================================================

    [Fact]
    public async Task GetAdminTasks_ReturnsOkResult()
    {
        // Arrange
        SetUser(5, "Admin");

        var response =
            new AdminTaskPagedResponse();

        _taskServiceMock
            .Setup(x => x.GetAdminTasksAsync(
                1,
                20,
                5,
                "Admin"))
            .ReturnsAsync(response);

        // Act
        var result =
            await _controller.GetAdminTasks();

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                1,
                20,
                5,
                "Admin"),
            Times.Once);
    }

    [Fact]
    public async Task GetAdminTasks_CustomPagination_PassesValuesToService()
    {
        // Arrange
        SetUser(5, "Admin");

        var response =
            new AdminTaskPagedResponse();

        _taskServiceMock
            .Setup(x => x.GetAdminTasksAsync(
                3,
                50,
                5,
                "Admin"))
            .ReturnsAsync(response);

        // Act
        var result =
            await _controller.GetAdminTasks(
                3,
                50);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                3,
                50,
                5,
                "Admin"),
            Times.Once);
    }

    [Fact]
    public async Task GetAdminTasks_PageLessThanOne_ReturnsBadRequest()
    {
        // Act
        var result =
            await _controller.GetAdminTasks(0, 20);

        // Assert
        var badRequest =
            Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status400BadRequest,
            badRequest.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetAdminTasks_PageSizeLessThanOne_ReturnsBadRequest()
    {
        // Act
        var result =
            await _controller.GetAdminTasks(1, 0);

        // Assert
        var badRequest =
            Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status400BadRequest,
            badRequest.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetAdminTasks_PageSizeGreaterThan100_ReturnsBadRequest()
    {
        // Act
        var result =
            await _controller.GetAdminTasks(1, 101);

        // Assert
        var badRequest =
            Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status400BadRequest,
            badRequest.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetAdminTasksAsync(
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    // ============================================================
    // ADMIN STATISTICS
    // ============================================================

    [Fact]
    public async Task GetAdminTaskStatistics_ReturnsOkResult()
    {
        // Arrange
        SetUser(5, "Admin");

        var statistics =
            new AdminTaskStatisticsResponse();

        _taskServiceMock
            .Setup(x => x.GetAdminTaskStatisticsAsync(
                5,
                "Admin"))
            .ReturnsAsync(statistics);

        // Act
        var result =
            await _controller.GetAdminTaskStatistics();

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetAdminTaskStatisticsAsync(
                5,
                "Admin"),
            Times.Once);
    }

    // ============================================================
    // ADMIN GET TASK
    // ============================================================

    [Fact]
    public async Task GetAdminTask_ReturnsOkResult()
    {
        // Arrange
        SetUser(5, "Admin");

        var task =
            CreateTaskResponse(10);

        _taskServiceMock
            .Setup(x => x.GetAdminTaskByIdAsync(
                10,
                5,
                "Admin"))
            .ReturnsAsync(task);

        // Act
        var result =
            await _controller.GetAdminTask(10);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetAdminTaskByIdAsync(
                10,
                5,
                "Admin"),
            Times.Once);
    }

    // ============================================================
    // ADMIN CREATE TASK
    // ============================================================

    [Fact]
    public async Task CreateAdminTask_ReturnsCreatedResult()
    {
        // Arrange
        SetUser(5, "Admin");

        var request =
            CreateTaskRequest();

        var response =
            CreateTaskResponse(10);

        _taskServiceMock
            .Setup(x => x.CreateAdminTaskAsync(
                request,
                5,
                "Admin"))
            .ReturnsAsync(response);

        // Act
        var result =
            await _controller.CreateAdminTask(request);

        // Assert
        var createdResult =
            Assert.IsType<ObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status201Created,
            createdResult.StatusCode);

        _taskServiceMock.Verify(
            x => x.CreateAdminTaskAsync(
                request,
                5,
                "Admin"),
            Times.Once);
    }

    // ============================================================
    // ADMIN UPDATE STATUS
    // ============================================================

    [Fact]
    public async Task UpdateAdminTaskStatus_ReturnsOkResult()
    {
        // Arrange
        SetUser(5, "Admin");

        var request =
            CreateStatusRequest();

        var response =
            CreateTaskResponse(10);

        _taskServiceMock
            .Setup(x => x.ChangeAdminTaskStatusAsync(
                10,
                request,
                5,
                "Admin"))
            .ReturnsAsync(response);

        // Act
        var result =
            await _controller.UpdateAdminTaskStatus(
                10,
                request);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.ChangeAdminTaskStatusAsync(
                10,
                request,
                5,
                "Admin"),
            Times.Once);
    }

    // ============================================================
    // ADMIN UPDATE DUE DATE
    // ============================================================

    [Fact]
    public async Task UpdateAdminTaskDueDate_ReturnsOkResult()
    {
        // Arrange
        SetUser(5, "Admin");

        var request =
            CreateDueDateRequest();

        var response =
            CreateTaskResponse(10);

        _taskServiceMock
            .Setup(x => x.ChangeAdminTaskDueDateAsync(
                10,
                request,
                5,
                "Admin"))
            .ReturnsAsync(response);

        // Act
        var result =
            await _controller.UpdateAdminTaskDueDate(
                10,
                request);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.ChangeAdminTaskDueDateAsync(
                10,
                request,
                5,
                "Admin"),
            Times.Once);
    }

    // ============================================================
    // ADMIN UPDATE PRIORITY
    // ============================================================

    [Fact]
    public async Task UpdateAdminTaskPriority_ReturnsOkResult()
    {
        // Arrange
        SetUser(5, "Admin");

        var request =
            CreatePriorityRequest();

        var response =
            CreateTaskResponse(10);

        _taskServiceMock
            .Setup(x => x.ChangeAdminTaskPriorityAsync(
                10,
                request,
                5,
                "Admin"))
            .ReturnsAsync(response);

        // Act
        var result =
            await _controller.UpdateAdminTaskPriority(
                10,
                request);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.ChangeAdminTaskPriorityAsync(
                10,
                request,
                5,
                "Admin"),
            Times.Once);
    }

    // ============================================================
    // ADMIN UPDATE TASK
    // ============================================================

    [Fact]
    public async Task UpdateAdminTask_ReturnsOkResult()
    {
        // Arrange
        SetUser(5, "Admin");

        var request =
            CreateUpdateTaskRequest();

        var response =
            CreateTaskResponse(10);

        _taskServiceMock
            .Setup(x => x.UpdateAdminTaskAsync(
                10,
                request,
                5,
                "Admin"))
            .ReturnsAsync(response);

        // Act
        var result =
            await _controller.UpdateAdminTask(
                10,
                request);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.UpdateAdminTaskAsync(
                10,
                request,
                5,
                "Admin"),
            Times.Once);
    }

    // ============================================================
    // ADMIN DELETE TASK
    // ============================================================

    [Fact]
    public async Task DeleteAdminTask_ReturnsOkResult()
    {
        // Arrange
        SetUser(5, "Admin");

        _taskServiceMock
            .Setup(x => x.DeleteAdminTaskAsync(
                10,
                5,
                "Admin"))
            .Returns(Task.CompletedTask);

        // Act
        var result =
            await _controller.DeleteAdminTask(10);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.DeleteAdminTaskAsync(
                10,
                5,
                "Admin"),
            Times.Once);
    }

    // ============================================================
    // USERS FOR ASSIGNMENT
    // ============================================================

    [Fact]
    public async Task GetUsersForAssignment_ReturnsOkResult()
    {
        // Arrange
        SetUser(5, "Admin");

        var users =
            new List<UserAssignmentDto>();

        _taskServiceMock
            .Setup(x => x.GetUsersForAssignmentAsync())
            .ReturnsAsync(users);

        // Act
        var result =
            await _controller.GetUsersForAssignment();

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetUsersForAssignmentAsync(),
            Times.Once);
    }

    [Fact]
    public async Task GetUsersForAssignment_PageSizeLessThanOne_ReturnsBadRequest()
    {
        // Act
        var result =
            await _controller.GetUsersForAssignment(0);

        // Assert
        var badRequest =
            Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status400BadRequest,
            badRequest.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetUsersForAssignmentAsync(),
            Times.Never);
    }

    [Fact]
    public async Task GetUsersForAssignment_PageSizeGreaterThan500_ReturnsBadRequest()
    {
        // Act
        var result =
            await _controller.GetUsersForAssignment(501);

        // Assert
        var badRequest =
            Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status400BadRequest,
            badRequest.StatusCode);

        _taskServiceMock.Verify(
            x => x.GetUsersForAssignmentAsync(),
            Times.Never);
    }

    [Fact]
    public async Task GetUsersForAssignment_ValidCustomPageSize_ReturnsOkResult()
    {
        // Arrange
        SetUser(5, "Admin");

        var users =
            new List<UserAssignmentDto>();

        _taskServiceMock
            .Setup(x => x.GetUsersForAssignmentAsync())
            .ReturnsAsync(users);

        // Act
        var result =
            await _controller.GetUsersForAssignment(250);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        _taskServiceMock.Verify(
            x => x.GetUsersForAssignmentAsync(),
            Times.Once);
    }

    // ============================================================
    // AUTHENTICATION CLAIMS
    // ============================================================

    [Fact]
    public async Task GetMyTasks_UsesCurrentUserIdAndRoleFromClaims()
    {
        // Arrange
        SetUser(42, "User");

        var tasks =
            new List<TaskResponse>();

        _taskServiceMock
            .Setup(x => x.GetMyTasksAsync(42, "User"))
            .ReturnsAsync(tasks);

        // Act
        await _controller.GetMyTasks();

        // Assert
        _taskServiceMock.Verify(
            x => x.GetMyTasksAsync(42, "User"),
            Times.Once);
    }

    [Fact]
    public async Task GetMyTasks_MissingUserIdClaim_ThrowsAuthenticationException()
    {
        // Arrange
        var claims = new[]
        {
            new Claim(
                ClaimTypes.Role,
                "User")
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
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.AuthenticationException>(
            () => _controller.GetMyTasks());

        _taskServiceMock.Verify(
            x => x.GetMyTasksAsync(
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetMyTasks_InvalidUserIdClaim_ThrowsAuthenticationException()
    {
        // Arrange
        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                "invalid"),

            new Claim(
                ClaimTypes.Role,
                "User")
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
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.AuthenticationException>(
            () => _controller.GetMyTasks());

        _taskServiceMock.Verify(
            x => x.GetMyTasksAsync(
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetMyTasks_MissingRoleClaim_ThrowsAuthenticationException()
    {
        // Arrange
        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                "1")
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
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.AuthenticationException>(
            () => _controller.GetMyTasks());

        _taskServiceMock.Verify(
            x => x.GetMyTasksAsync(
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task GetMyTasks_EmptyRoleClaim_ThrowsAuthenticationException()
    {
        // Arrange
        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                "1"),

            new Claim(
                ClaimTypes.Role,
                "")
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
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.AuthenticationException>(
            () => _controller.GetMyTasks());

        _taskServiceMock.Verify(
            x => x.GetMyTasksAsync(
                It.IsAny<int>(),
                It.IsAny<string>()),
            Times.Never);
    }

    // ============================================================
    // AUTHORIZATION ATTRIBUTES
    // ============================================================

    [Fact]
    public void Controller_HasAuthorizeAttribute()
    {
        // Arrange
        var attributes =
            typeof(TasksController)
                .GetCustomAttributes(
                    typeof(AuthorizeAttribute),
                    true);

        // Assert
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void AdminEndpoints_HaveAdminAuthorization()
    {
        // Arrange
        var adminMethods = new[]
        {
            nameof(TasksController.GetAdminTasks),
            nameof(TasksController.GetAdminTaskStatistics),
            nameof(TasksController.GetAdminTask),
            nameof(TasksController.CreateAdminTask),
            nameof(TasksController.UpdateAdminTaskStatus),
            nameof(TasksController.UpdateAdminTaskDueDate),
            nameof(TasksController.UpdateAdminTaskPriority),
            nameof(TasksController.UpdateAdminTask),
            nameof(TasksController.DeleteAdminTask),
            nameof(TasksController.GetUsersForAssignment)
        };

        // Assert
        foreach (var methodName in adminMethods)
        {
            var method =
                typeof(TasksController)
                    .GetMethod(methodName);

            Assert.NotNull(method);

            var attributes =
                method!.GetCustomAttributes(
                    typeof(AuthorizeAttribute),
                    true);

            var authorizeAttribute =
                Assert.Single(
                    attributes
                        .OfType<AuthorizeAttribute>());

            Assert.Equal(
                "Admin",
                authorizeAttribute.Roles);
        }
    }
}