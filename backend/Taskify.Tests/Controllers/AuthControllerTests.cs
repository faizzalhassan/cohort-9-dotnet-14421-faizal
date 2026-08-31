using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Taskify.API.Controllers;
using Taskify.Business.DTOs.Auth;
using Taskify.Business.Interfaces;
using Xunit;

namespace Taskify.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();

        _controller = new AuthController(
            _authServiceMock.Object);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private void SetUser(params Claim[] claims)
    {
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

    private static RegisterRequest CreateRegisterRequest()
    {
        return new RegisterRequest
        {
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "faizal@gmail.com",
            Password = "Password123",
            ConfirmPassword = "Password123"
        };
    }

    private static LoginRequest CreateLoginRequest()
    {
        return new LoginRequest
        {
            Email = "faizal@gmail.com",
            Password = "Password123"
        };
    }

    private static AuthResponse CreateAuthResponse()
    {
        return new AuthResponse
        {
            Token = "test-jwt-token",
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            User = new UserResponse
            {
                Id = 1,
                FirstName = "Faizal",
                LastName = "Hassan",
                Email = "faizal@gmail.com",
                Role = "User"
            }
        };
    }

    // ============================================================
    // REGISTER
    // ============================================================

    [Fact]
    public async Task Register_ValidRequest_ReturnsCreatedResult()
    {
        // Arrange
        var request = CreateRegisterRequest();
        var response = CreateAuthResponse();

        _authServiceMock
            .Setup(x => x.RegisterAsync(request))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Register(request);

        // Assert
        var createdResult =
            Assert.IsType<ObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status201Created,
            createdResult.StatusCode);

        Assert.NotNull(createdResult.Value);

        _authServiceMock.Verify(
            x => x.RegisterAsync(request),
            Times.Once);
    }

    [Fact]
    public async Task Register_ValidRequest_ReturnsSuccessResponse()
    {
        // Arrange
        var request = CreateRegisterRequest();
        var response = CreateAuthResponse();

        _authServiceMock
            .Setup(x => x.RegisterAsync(request))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Register(request);

        // Assert
        var createdResult =
            Assert.IsType<ObjectResult>(result);

        var value = createdResult.Value;

        Assert.NotNull(value);

        var successProperty =
            value.GetType().GetProperty("success");

        var messageProperty =
            value.GetType().GetProperty("message");

        var dataProperty =
            value.GetType().GetProperty("data");

        Assert.NotNull(successProperty);
        Assert.NotNull(messageProperty);
        Assert.NotNull(dataProperty);

        Assert.True(
            (bool)successProperty!.GetValue(value)!);

        Assert.Equal(
            "Registration successful.",
            messageProperty!.GetValue(value));

        Assert.Same(
            response,
            dataProperty!.GetValue(value));
    }

    [Fact]
    public async Task Register_ValidRequest_PassesSameRequestToService()
    {
        // Arrange
        var request = CreateRegisterRequest();

        _authServiceMock
            .Setup(x => x.RegisterAsync(It.IsAny<RegisterRequest>()))
            .ReturnsAsync(CreateAuthResponse());

        // Act
        await _controller.Register(request);

        // Assert
        _authServiceMock.Verify(
            x => x.RegisterAsync(
                It.Is<RegisterRequest>(r =>
                    r.FirstName == "Faizal" &&
                    r.LastName == "Hassan" &&
                    r.Email == "faizal@gmail.com" &&
                    r.Password == "Password123" &&
                    r.ConfirmPassword == "Password123")),
            Times.Once);
    }

    // ============================================================
    // LOGIN
    // ============================================================

    [Fact]
    public async Task Login_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var request = CreateLoginRequest();
        var response = CreateAuthResponse();

        _authServiceMock
            .Setup(x => x.LoginAsync(request))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Login(request);

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.NotNull(okResult.Value);

        _authServiceMock.Verify(
            x => x.LoginAsync(request),
            Times.Once);
    }

    [Fact]
    public async Task Login_ValidRequest_ReturnsSuccessResponse()
    {
        // Arrange
        var request = CreateLoginRequest();
        var response = CreateAuthResponse();

        _authServiceMock
            .Setup(x => x.LoginAsync(request))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Login(request);

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        var value = okResult.Value;

        Assert.NotNull(value);

        var successProperty =
            value.GetType().GetProperty("success");

        var messageProperty =
            value.GetType().GetProperty("message");

        var dataProperty =
            value.GetType().GetProperty("data");

        Assert.NotNull(successProperty);
        Assert.NotNull(messageProperty);
        Assert.NotNull(dataProperty);

        Assert.True(
            (bool)successProperty!.GetValue(value)!);

        Assert.Equal(
            "Login successful.",
            messageProperty!.GetValue(value));

        Assert.Same(
            response,
            dataProperty!.GetValue(value));
    }

    [Fact]
    public async Task Login_ValidRequest_PassesSameRequestToService()
    {
        // Arrange
        var request = CreateLoginRequest();

        _authServiceMock
            .Setup(x => x.LoginAsync(It.IsAny<LoginRequest>()))
            .ReturnsAsync(CreateAuthResponse());

        // Act
        await _controller.Login(request);

        // Assert
        _authServiceMock.Verify(
            x => x.LoginAsync(
                It.Is<LoginRequest>(r =>
                    r.Email == "faizal@gmail.com" &&
                    r.Password == "Password123")),
            Times.Once);
    }

    // ============================================================
    // LOGOUT
    // ============================================================

    [Fact]
    public async Task Logout_ValidJtiClaim_ReturnsOkResult()
    {
        // Arrange
        var tokenId = Guid.NewGuid();

        SetUser(
            new Claim(
                JwtRegisteredClaimNames.Jti,
                tokenId.ToString()));

        _authServiceMock
            .Setup(x => x.LogoutAsync(tokenId))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Logout();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        _authServiceMock.Verify(
            x => x.LogoutAsync(tokenId),
            Times.Once);
    }

    [Fact]
    public async Task Logout_ValidJtiClaim_ReturnsSuccessMessage()
    {
        // Arrange
        var tokenId = Guid.NewGuid();

        SetUser(
            new Claim(
                JwtRegisteredClaimNames.Jti,
                tokenId.ToString()));

        _authServiceMock
            .Setup(x => x.LogoutAsync(tokenId))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Logout();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        var value = okResult.Value;

        Assert.NotNull(value);

        var successProperty =
            value.GetType().GetProperty("success");

        var messageProperty =
            value.GetType().GetProperty("message");

        Assert.NotNull(successProperty);
        Assert.NotNull(messageProperty);

        Assert.True(
            (bool)successProperty!.GetValue(value)!);

        Assert.Equal(
            "Logout successful.",
            messageProperty!.GetValue(value));
    }

    [Fact]
    public async Task Logout_MissingJtiClaim_ReturnsUnauthorized()
    {
        // Arrange
        SetUser(
            new Claim(
                ClaimTypes.NameIdentifier,
                "1"));

        // Act
        var result = await _controller.Logout();

        // Assert
        var unauthorizedResult =
            Assert.IsType<UnauthorizedObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status401Unauthorized,
            unauthorizedResult.StatusCode);

        _authServiceMock.Verify(
            x => x.LogoutAsync(It.IsAny<Guid>()),
            Times.Never);
    }

    [Fact]
    public async Task Logout_InvalidJtiClaim_ReturnsUnauthorized()
    {
        // Arrange
        SetUser(
            new Claim(
                JwtRegisteredClaimNames.Jti,
                "invalid-guid"));

        // Act
        var result = await _controller.Logout();

        // Assert
        var unauthorizedResult =
            Assert.IsType<UnauthorizedObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status401Unauthorized,
            unauthorizedResult.StatusCode);

        _authServiceMock.Verify(
            x => x.LogoutAsync(It.IsAny<Guid>()),
            Times.Never);
    }

    [Fact]
    public async Task Logout_InvalidJtiClaim_ReturnsCorrectMessage()
    {
        // Arrange
        SetUser(
            new Claim(
                JwtRegisteredClaimNames.Jti,
                "invalid-guid"));

        // Act
        var result = await _controller.Logout();

        // Assert
        var unauthorizedResult =
            Assert.IsType<UnauthorizedObjectResult>(result);

        var value = unauthorizedResult.Value;

        Assert.NotNull(value);

        var successProperty =
            value.GetType().GetProperty("success");

        var messageProperty =
            value.GetType().GetProperty("message");

        Assert.NotNull(successProperty);
        Assert.NotNull(messageProperty);

        Assert.False(
            (bool)successProperty!.GetValue(value)!);

        Assert.Equal(
            "Invalid authentication session.",
            messageProperty!.GetValue(value));
    }

    // ============================================================
    // ME
    // ============================================================

    [Fact]
    public async Task Me_WithValidClaims_ReturnsOkResult()
    {
        // Arrange
        SetUser(
            new Claim(
                ClaimTypes.NameIdentifier,
                "1"),
            new Claim(
                ClaimTypes.Email,
                "faizal@gmail.com"),
            new Claim(
                ClaimTypes.Role,
                "User"));

        // Act
        var result = await _controller.Me();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task Me_WithValidClaims_ReturnsCorrectUserData()
    {
        // Arrange
        SetUser(
            new Claim(
                ClaimTypes.NameIdentifier,
                "1"),
            new Claim(
                ClaimTypes.Email,
                "faizal@gmail.com"),
            new Claim(
                ClaimTypes.Role,
                "User"));

        // Act
        var result = await _controller.Me();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        var value = okResult.Value;

        Assert.NotNull(value);

        var successProperty =
            value.GetType().GetProperty("success");

        var dataProperty =
            value.GetType().GetProperty("data");

        Assert.NotNull(successProperty);
        Assert.NotNull(dataProperty);

        Assert.True(
            (bool)successProperty!.GetValue(value)!);

        var data =
            dataProperty!.GetValue(value);

        Assert.NotNull(data);

        var userIdProperty =
            data.GetType().GetProperty("userId");

        var emailProperty =
            data.GetType().GetProperty("email");

        var roleProperty =
            data.GetType().GetProperty("role");

        Assert.NotNull(userIdProperty);
        Assert.NotNull(emailProperty);
        Assert.NotNull(roleProperty);

        Assert.Equal(
            "1",
            userIdProperty!.GetValue(data));

        Assert.Equal(
            "faizal@gmail.com",
            emailProperty!.GetValue(data));

        Assert.Equal(
            "User",
            roleProperty!.GetValue(data));
    }

    [Fact]
    public async Task Me_WithoutClaims_ReturnsOkWithNullValues()
    {
        // Arrange
        SetUser();

        // Act
        var result = await _controller.Me();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);

        var value = okResult.Value;

        Assert.NotNull(value);

        var dataProperty =
            value.GetType().GetProperty("data");

        Assert.NotNull(dataProperty);

        var data =
            dataProperty!.GetValue(value);

        Assert.NotNull(data);

        var userIdProperty =
            data.GetType().GetProperty("userId");

        var emailProperty =
            data.GetType().GetProperty("email");

        var roleProperty =
            data.GetType().GetProperty("role");

        Assert.Null(
            userIdProperty!.GetValue(data));

        Assert.Null(
            emailProperty!.GetValue(data));

        Assert.Null(
            roleProperty!.GetValue(data));
    }

    [Fact]
    public async Task Me_WithAdminClaims_ReturnsAdminRole()
    {
        // Arrange
        SetUser(
            new Claim(
                ClaimTypes.NameIdentifier,
                "10"),
            new Claim(
                ClaimTypes.Email,
                "admin@gmail.com"),
            new Claim(
                ClaimTypes.Role,
                "Admin"));

        // Act
        var result = await _controller.Me();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        var value = okResult.Value;

        Assert.NotNull(value);

        var dataProperty =
            value.GetType().GetProperty("data");

        var data =
            dataProperty!.GetValue(value);

        var roleProperty =
            data!.GetType().GetProperty("role");

        Assert.Equal(
            "Admin",
            roleProperty!.GetValue(data));
    }

    // ============================================================
    // ADMIN TEST
    // ============================================================

    [Fact]
    public void AdminTest_ReturnsOkResult()
    {
        // Act
        var result = _controller.AdminTest();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        Assert.Equal(
            StatusCodes.Status200OK,
            okResult.StatusCode);
    }

    [Fact]
    public void AdminTest_ReturnsSuccessMessage()
    {
        // Act
        var result = _controller.AdminTest();

        // Assert
        var okResult =
            Assert.IsType<OkObjectResult>(result);

        var value = okResult.Value;

        Assert.NotNull(value);

        var successProperty =
            value.GetType().GetProperty("success");

        var messageProperty =
            value.GetType().GetProperty("message");

        Assert.NotNull(successProperty);
        Assert.NotNull(messageProperty);

        Assert.True(
            (bool)successProperty!.GetValue(value)!);

        Assert.Equal(
            "Admin authorization successful.",
            messageProperty!.GetValue(value));
    }

    // ============================================================
    // AUTHORIZATION ATTRIBUTES
    // ============================================================

    [Fact]
    public void Register_HasAllowAnonymousAttribute()
    {
        // Arrange
        var method = typeof(AuthController)
            .GetMethod(nameof(AuthController.Register));

        // Act
        var attribute =
            method?.GetCustomAttributes(
                typeof(Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute),
                true)
            .FirstOrDefault();

        // Assert
        Assert.NotNull(attribute);
    }

    [Fact]
    public void Login_HasAllowAnonymousAttribute()
    {
        // Arrange
        var method = typeof(AuthController)
            .GetMethod(nameof(AuthController.Login));

        // Act
        var attribute =
            method?.GetCustomAttributes(
                typeof(Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute),
                true)
            .FirstOrDefault();

        // Assert
        Assert.NotNull(attribute);
    }

    [Fact]
    public void Logout_HasAuthorizeAttribute()
    {
        // Arrange
        var method = typeof(AuthController)
            .GetMethod(nameof(AuthController.Logout));

        // Act
        var attribute =
            method?.GetCustomAttributes(
                typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute),
                true)
            .FirstOrDefault();

        // Assert
        Assert.NotNull(attribute);
    }

    [Fact]
    public void Me_HasAuthorizeAttribute()
    {
        // Arrange
        var method = typeof(AuthController)
            .GetMethod(nameof(AuthController.Me));

        // Act
        var attribute =
            method?.GetCustomAttributes(
                typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute),
                true)
            .FirstOrDefault();

        // Assert
        Assert.NotNull(attribute);
    }

    [Fact]
    public void AdminTest_HasAdminAuthorizeAttribute()
    {
        // Arrange
        var method = typeof(AuthController)
            .GetMethod(nameof(AuthController.AdminTest));

        // Act
        var attributes =
            method?.GetCustomAttributes(
                typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute),
                true);

        // Assert
        var authorizeAttribute =
            Assert.Single(
                attributes!
                    .Cast<Microsoft.AspNetCore.Authorization.AuthorizeAttribute>());

        Assert.Equal(
            "Admin",
            authorizeAttribute.Roles);
    }
}